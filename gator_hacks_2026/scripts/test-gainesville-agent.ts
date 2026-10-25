import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { z } from "zod";

import { PrismaClient } from "../generated/prisma";
import { env } from "~/env";
import { normalizeMunicipality } from "~/lib/municipality";
import {
  buildAgentPrompt,
  getAgentStatus,
  startPreviewAgent,
} from "~/server/ordinances/firecrawl";
import { loadLifeCircumstances } from "~/server/ordinances/life-circumstances";
import {
  completeIngestion,
  submitPollingIngestion,
} from "~/server/ordinances/ingestion";
import {
  changeSchema,
  checkedSourceOrigin,
  cityResultSchema,
  resultSchema,
  withinWindow,
} from "~/server/ordinances/schema";

const directory = resolve(".local/ordinance-tests");
const stateSchema = z.object({
  jobId: z.string().uuid().nullable(),
  runId: z.string().uuid().optional(),
  windowStart: z.string().datetime(),
  windowEnd: z.string().datetime(),
});

class TestCommandError extends Error {}

let database: PrismaClient | undefined;

async function readBackDatabase(runId: string, jobId: string) {
  if (!database) throw new TestCommandError("Database client is unavailable.");
  const run = await database.ingestionRun.findUniqueOrThrow({
    where: { id: runId },
  });
  const rows = await database.ordinanceChange.findMany({
    where: { ingestionRunId: runId },
    select: {
      id: true,
      activityDate: true,
      activityType: true,
      evidenceUrl: true,
      ordinance: { select: { id: true, name: true, stage: true } },
    },
    orderBy: [{ activityDate: "desc" }, { id: "desc" }],
  });
  console.log(
    `Database readback: run ${run.id}, status ${run.status}, new change rows ${rows.length}, rejected items ${run.rejectedCount}.`,
  );
  console.log(`Stored coverage: ${JSON.stringify(run.coverage)}`);
  for (const row of rows)
    console.log(
      `Stored: ${row.id} | ${row.ordinance.name} | ${row.activityDate} | ${row.activityType} | ${row.evidenceUrl}`,
    );
  if (!rows.length)
    console.log(
      "No new ordinance changes were inserted. Coverage and run status were saved; empty findings or previously stored events cannot demonstrate a new ordinance insert.",
    );
  await writeFile(
    resolve(directory, `gainesville-${jobId}-database.json`),
    JSON.stringify(
      {
        runId: run.id,
        status: run.status,
        failureCode: run.failureCode,
        coverage: run.coverage,
        rows,
      },
      null,
      2,
    ),
  );
  if (run.status !== "completed") process.exitCode = 1;
}

async function main() {
  const flags = new Set(process.argv.slice(2));
  if (
    [...flags].some(
      (flag) =>
        !["--persist", "--resume", "--dry-run", "--retry-validation"].includes(
          flag,
        ),
    )
  )
    throw new TestCommandError(
      "Use --persist, --resume, --dry-run, or --retry-validation.",
    );
  const persist = flags.has("--persist");
  const retryValidation = flags.has("--retry-validation");
  if (retryValidation && !persist)
    throw new TestCommandError(
      "Retrying validation requires the pipeline command.",
    );
  const mode = flags.has("--dry-run")
    ? "--dry-run"
    : flags.has("--resume") || retryValidation
      ? "--resume"
      : undefined;
  const command = persist
    ? "pnpm test:pipeline:gainesville"
    : "pnpm test:agent:gainesville";
  const latestPath = resolve(
    directory,
    persist ? "gainesville-pipeline-latest.json" : "gainesville-latest.json",
  );
  const city = normalizeMunicipality("Gainesville, Florida, United States")!;
  const windowEnd = new Date();
  const windowStart = new Date(windowEnd.getTime() - 30 * 86_400_000);
  const lifeCircumstances = await loadLifeCircumstances();
  const input = { cities: [city], windowStart, windowEnd, lifeCircumstances };
  if (mode === "--dry-run") {
    console.log(buildAgentPrompt(input));
    console.log(
      `Credit ceiling: ${env.FIRECRAWL_AGENT_MAX_CREDITS ?? 100}. No request submitted.`,
    );
    if (persist)
      console.log(
        "Pipeline mode: a live run will save validated results to DATABASE_URL. This dry run performs no database writes.",
      );
    return;
  }
  if (
    !env.FIRECRAWL_API_KEY ||
    /YOUR|replace|example/i.test(env.FIRECRAWL_API_KEY)
  )
    throw new TestCommandError(
      `Set FIRECRAWL_API_KEY in .env, then rerun ${command}.`,
    );
  await mkdir(directory, { recursive: true });
  if (persist) {
    database = new PrismaClient({ log: [] });
    try {
      await database.ingestionRun.count();
      await database.municipality.count();
      await database.ordinance.count();
      await database.ordinanceChange.count();
    } catch {
      throw new TestCommandError(
        "Database preflight failed before any Agent submission. Check DATABASE_URL and run pnpm db:ordinances to provision the ingestion tables.",
      );
    }
    console.log(
      "Database preflight passed. This run writes to the database configured by DATABASE_URL.",
    );
  }
  let state: z.infer<typeof stateSchema>;
  if (mode === "--resume") {
    state = stateSchema.parse(
      JSON.parse(await readFile(latestPath, "utf8")) as unknown,
    );
    if (persist && database) {
      if (!state.runId)
        throw new TestCommandError(
          "The saved pipeline state has no database run ID.",
        );
      const run = await database.ingestionRun.findUniqueOrThrow({
        where: { id: state.runId },
      });
      if (
        run.windowStart.toISOString() !== state.windowStart ||
        run.windowEnd.toISOString() !== state.windowEnd ||
        (state.jobId && run.providerJobId !== state.jobId)
      )
        throw new TestCommandError(
          "Saved job does not match the database run. Inspect its IDs before resuming.",
        );
      state.jobId = run.providerJobId;
      const retryable =
        retryValidation &&
        (run.status === "partial" ||
          (run.status === "failed" && run.failureCode === "invalid_result"));
      if (retryable) {
        await database.ingestionRun.updateMany({
          where: {
            id: run.id,
            providerJobId: run.providerJobId,
            status: run.status,
          },
          data: { status: "processing", completedAt: null, failureCode: null },
        });
        console.log(
          "Retrying validation of the existing Agent result; no new Agent job will be submitted.",
        );
      }
      if (
        ["completed", "partial", "failed"].includes(run.status) &&
        state.jobId &&
        !retryable
      ) {
        await readBackDatabase(run.id, state.jobId);
        return;
      }
    }
  } else {
    console.log(
      `Starting one Agent job for Gainesville, FL: ${windowStart.toISOString()} to ${windowEnd.toISOString()}. Maximum ${env.FIRECRAWL_AGENT_MAX_CREDITS ?? 100} credits.`,
    );
    if (persist && database) {
      const run = await submitPollingIngestion(input, database);
      state = {
        jobId: run.providerJobId,
        runId: run.runId,
        windowStart: windowStart.toISOString(),
        windowEnd: windowEnd.toISOString(),
      };
      console.log(`Database run: ${run.runId}. Status: ${run.status}.`);
    } else {
      const jobId = await startPreviewAgent(input);
      state = {
        jobId,
        windowStart: windowStart.toISOString(),
        windowEnd: windowEnd.toISOString(),
      };
    }
    await writeFile(latestPath, JSON.stringify(state, null, 2));
  }
  if (!state.jobId)
    throw new TestCommandError(
      `Database run ${state.runId ?? "unknown"} has no confirmed Agent job ID. Inspect the run's failureCode and Firecrawl logs; do not submit a replacement to recover it.`,
    );
  console.log(
    `Agent job: ${state.jobId}. Resume this job with ${command} --resume.`,
  );
  const deadline = Date.now() + 10 * 60_000;
  while (Date.now() < deadline) {
    const result = await getAgentStatus(state.jobId);
    if (result.status === "processing") {
      console.log("Agent is researching Gainesville's official sources...");
      await delay(15_000);
      continue;
    }
    const outputPath = resolve(directory, `gainesville-${state.jobId}.json`);
    await writeFile(
      outputPath,
      JSON.stringify({ ...state, ...result }, null, 2),
    );
    console.log(
      `Provider status: ${result.status}. Credits used: ${result.creditsUsed ?? "unreported"}.`,
    );
    console.log(`Saved result: ${outputPath}`);
    if (persist && database && state.runId) {
      const completion = await completeIngestion(
        {
          jobId: state.jobId,
          runId: state.runId,
          status: result.status,
          data: result.data,
          creditsUsed: result.creditsUsed,
        },
        database,
      );
      if (completion === "unknown_job")
        throw new TestCommandError(
          "The returned job does not match the database run.",
        );
      await readBackDatabase(state.runId, state.jobId);
    }
    if (result.status !== "completed") {
      process.exitCode = 1;
      return;
    }
    const parsed = resultSchema.parse(result.data);
    const cities = parsed.cities.map((entry) => cityResultSchema.parse(entry));
    if (cities.length !== 1 || cities[0]?.municipalityKey !== city.key)
      throw new TestCommandError(
        "The result did not contain exactly Gainesville, Florida. Inspect the saved JSON.",
      );
    const found = cities[0];
    const changes = found.changes.map((entry) => changeSchema.parse(entry));
    const origins = new Set(
      found.sourcesChecked.map((source) => checkedSourceOrigin(source.url)),
    );
    const accepted = changes.filter(
      (change) =>
        found.coverage !== "unavailable" &&
        withinWindow(
          change,
          new Date(state.windowStart),
          new Date(state.windowEnd),
        ) &&
        origins.has(checkedSourceOrigin(change.sourceUrl)) &&
        origins.has(checkedSourceOrigin(change.evidenceUrl)),
    );
    console.log(
      `Coverage: ${found.coverage}. Sources checked: ${found.sourcesChecked.length}. Updates returned: ${changes.length}.`,
    );
    console.log(
      `Validated updates: ${accepted.length}. Rejected updates: ${changes.length - accepted.length}.`,
    );
    for (const source of found.sourcesChecked)
      console.log(`Source: ${source.url}`);
    for (const change of accepted) {
      console.log(
        `\n${change.activityDate} | ${change.activityType} | ${change.name} | ${change.stage}`,
      );
      console.log(change.changeDescription);
      console.log(change.evidenceUrl);
    }
    if (!changes.length)
      console.log(
        "No updates returned. Inspect coverage and checked sources before concluding there was no activity.",
      );
    if (
      found.coverage !== "complete" ||
      !found.sourcesChecked.length ||
      accepted.length !== changes.length
    )
      process.exitCode = 1;
    return;
  }
  console.log(
    `Stopped waiting after ten minutes. Use ${command} --resume to retrieve the same job without submitting another one.`,
  );
  process.exitCode = 1;
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof TestCommandError
        ? error.message
        : "Agent test could not complete. Check configuration and any saved result in .local/ordinance-tests. If a job ID was printed, use --resume on the same command to recover it.",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await database?.$disconnect();
  });
