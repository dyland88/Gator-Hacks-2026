import { parseArgs } from "node:util";
import { setTimeout as delay } from "node:timers/promises";
import { z } from "zod";

import { PrismaClient } from "../generated/prisma";
import { env } from "~/env";
import { normalizeMunicipality } from "~/lib/municipality";
import { getAgentStatus } from "~/server/ordinances/firecrawl";
import {
  completeIngestion,
  submitCityIngestion,
} from "~/server/ordinances/ingestion";

class CommandError extends Error {}

const optionsSchema = z.object({
  days: z.coerce.number().int().min(1).max(365).default(30),
});

async function main() {
  const { positionals, values } = parseArgs({
    args: process.argv.slice(2).filter((arg) => arg !== "--"),
    allowPositionals: true,
    options: {
      days: { type: "string" },
      "dry-run": { type: "boolean", default: false },
    },
  });
  const [cityArg, stateArg, ...extra] = positionals;
  if (!cityArg || !stateArg || extra.length)
    throw new CommandError(
      'Usage: pnpm ingest:city -- "<City>" "<State name or code>" [--days 1-365] [--dry-run]',
    );
  const parsedOptions = optionsSchema.safeParse({ days: values.days });
  if (!parsedOptions.success)
    throw new CommandError("--days must be a whole number from 1 to 365.");
  const city = normalizeMunicipality(`${cityArg}, ${stateArg}, United States`);
  if (!city)
    throw new CommandError(
      'Enter a city and a U.S. state name or two-letter code, for example: pnpm ingest:city -- "Austin" "TX"',
    );
  const lookbackDays = parsedOptions.data.days;
  const windowEnd = new Date();
  const windowStart = new Date(windowEnd.getTime() - lookbackDays * 86_400_000);

  if (values["dry-run"]) {
    console.log(`City: ${city.label} (${city.key})`);
    console.log(
      `Window: ${windowStart.toISOString()} inclusive to ${windowEnd.toISOString()} exclusive.`,
    );
    console.log(
      `Credit ceiling: ${env.FIRECRAWL_AGENT_MAX_CREDITS}. No request submitted.`,
    );
    return;
  }

  const database = new PrismaClient({ log: ["error", "warn"] });
  try {
    console.log(
      `Submitting one Agent job for ${city.label} over the last ${lookbackDays} days. Maximum ${env.FIRECRAWL_AGENT_MAX_CREDITS} credits.`,
    );
    const run = await submitCityIngestion(
      { city, lookbackDays },
      windowEnd,
      database,
    );
    console.log(`Run: ${run.runId}`);
    console.log(`Status: ${run.status}`);
    console.log(`Agent job: ${run.providerJobId ?? "not confirmed"}`);
    if (run.status === "submission_unknown") {
      console.log(
        "Submission was not confirmed. Inspect Firecrawl activity for this time and city before resubmitting; do not retry blindly.",
      );
      process.exitCode = 1;
      return;
    }
    if (run.status !== "processing" || !run.providerJobId) {
      if (run.status === "failed") process.exitCode = 1;
      return;
    }
    const jobId = run.providerJobId;
    const deadline = Date.now() + 20 * 60_000;
    while (Date.now() < deadline) {
      const result = await getAgentStatus(jobId);
      if (result.status === "processing") {
        console.log("Agent is researching official sources...");
        await delay(15_000);
        continue;
      }
      const outcome = await completeIngestion(
        {
          jobId,
          runId: run.runId,
          status: result.status,
          data: result.data,
          creditsUsed: result.creditsUsed,
        },
        database,
      );
      console.log(
        `Saved to database: ${outcome}. Credits used: ${result.creditsUsed ?? "unreported"}.`,
      );
      if (outcome === "failed" || outcome === "unknown_job")
        process.exitCode = 1;
      return;
    }
    console.log(
      `Stopped waiting after 20 minutes. Run ${run.runId} is still processing; it will be collected by the reconcile route, or rerun reconciliation manually.`,
    );
    process.exitCode = 1;
  } finally {
    await database.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(
    error instanceof CommandError
      ? error.message
      : "City ingestion could not be started. Check configuration: DATABASE_URL, FIRECRAWL_API_KEY, FIRECRAWL_WEBHOOK_SECRET, and APP_URL.",
  );
  process.exitCode = 1;
});
