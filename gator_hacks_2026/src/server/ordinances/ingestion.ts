import "server-only";

import { createHash } from "node:crypto";
import { z } from "zod";

import { type PrismaClient, type Prisma } from "../../../generated/prisma";
import { normalizeMunicipality } from "~/lib/municipality";
import { db } from "~/server/db";
import {
  FirecrawlError,
  getAgentStatus,
  requireIngestionConfig,
  startAgent,
} from "./firecrawl";
import {
  changeSchema,
  cityResultSchema,
  resultSchema,
  type ExtractedChange,
} from "./schema";

const snapshotSchema = z.array(
  z.object({
    id: z.string().uuid(),
    key: z.string(),
    city: z.string(),
    state: z.string(),
    label: z.string(),
  }),
);
const activeStatuses = [
  "submitting",
  "processing",
  "submission_unknown",
  "reconciliation_failed",
];

export function reportingWindow(now = new Date()) {
  const end = new Date(now);
  end.setUTCHours(6, 0, 0, 0);
  if (end > now) end.setUTCDate(end.getUTCDate() - 1);
  return { windowStart: new Date(end.getTime() - 86_400_000), windowEnd: end };
}

export async function submitDailyIngestion(
  now = new Date(),
  database: PrismaClient = db,
) {
  requireIngestionConfig();
  const window = reportingWindow(now);
  const profiles = await database.userProfile.findMany({
    select: { location: true, locationId: true },
  });
  const identities = new Map<
    string,
    NonNullable<ReturnType<typeof normalizeMunicipality>>
  >();
  let skippedCount = 0;
  for (const profile of profiles) {
    const city = profile.locationId
      ? normalizeMunicipality(profile.location)
      : null;
    if (city) identities.set(city.key, city);
    else skippedCount++;
  }
  const cities = [];
  for (const city of [...identities.values()].sort((a, b) =>
    a.key.localeCompare(b.key),
  )) {
    cities.push(
      await database.municipality.upsert({
        where: { key: city.key },
        create: city,
        update: {},
      }),
    );
  }
  const claimed = await database.ingestionRun.createMany({
    data: [
      {
        ...window,
        cities,
        skippedCount,
        status: cities.length ? "submitting" : "skipped",
        completedAt: cities.length ? null : now,
      },
    ],
    skipDuplicates: true,
  });
  const run = await database.ingestionRun.findUniqueOrThrow({
    where: { windowEnd: window.windowEnd },
  });
  if (!claimed.count || !cities.length)
    return { runId: run.id, status: run.status };
  try {
    const jobId = await startAgent({ ...window, runId: run.id, cities });
    await database.ingestionRun.updateMany({
      where: { id: run.id, status: "submitting", providerJobId: null },
      data: { providerJobId: jobId, status: "processing" },
    });
  } catch (error) {
    const rejected =
      error instanceof FirecrawlError && error.code === "provider_rejected";
    await database.ingestionRun.updateMany({
      where: { id: run.id, status: "submitting" },
      data: {
        status: rejected ? "failed" : "submission_unknown",
        failureCode: rejected ? "provider_rejected" : "submission_unknown",
        completedAt: rejected ? now : null,
      },
    });
  }
  const updated = await database.ingestionRun.findUniqueOrThrow({
    where: { id: run.id },
  });
  return { runId: updated.id, status: updated.status };
}

export function withinWindow(change: ExtractedChange, start: Date, end: Date) {
  if (change.activityAt) {
    const time = new Date(change.activityAt).getTime();
    return (
      change.activityAt.slice(0, 10) === change.activityDate &&
      time >= start.getTime() &&
      time < end.getTime()
    );
  }
  const day = new Date(`${change.activityDate}T00:00:00.000Z`).getTime();
  return day < end.getTime() && day + 86_400_000 > start.getTime();
}

export function ordinanceIdentity(change: ExtractedChange) {
  return change.sourceIdentifier
    ? `number:${change.sourceIdentifier.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim()}`
    : `url:${change.sourceUrl}`;
}

export function changeIdentity(
  municipalityKey: string,
  change: ExtractedChange,
) {
  return createHash("sha256")
    .update(
      JSON.stringify([
        municipalityKey,
        ordinanceIdentity(change),
        change.activityDate,
        change.activityType,
        change.evidenceUrl,
      ]),
    )
    .digest("hex");
}

async function persistChange(
  tx: Prisma.TransactionClient,
  runId: string,
  municipalityId: string,
  municipalityKey: string,
  change: ExtractedChange,
) {
  const identityKey = ordinanceIdentity(change);
  const snapshot = {
    sourceIdentifier: change.sourceIdentifier,
    name: change.name,
    description: change.description,
    stage: change.stage,
    originalStage: change.originalStage,
    topics: [...new Set(change.topics)],
    sourceUrl: change.sourceUrl,
    adoptedDate: change.adoptedDate,
    effectiveDate: change.effectiveDate,
    latestActivity: change.activityDate,
  };
  const ordinance = await tx.ordinance.upsert({
    where: { municipalityId_identityKey: { municipalityId, identityKey } },
    create: { municipalityId, identityKey, ...snapshot },
    update: {},
  });
  const inserted = await tx.ordinanceChange.createMany({
    data: [
      {
        ordinanceId: ordinance.id,
        ingestionRunId: runId,
        dedupeKey: changeIdentity(municipalityKey, change),
        activityType: change.activityType,
        activityDate: change.activityDate,
        activityAt: change.activityAt ? new Date(change.activityAt) : null,
        description: change.changeDescription,
        evidenceUrl: change.evidenceUrl,
        evidenceExcerpt: change.evidenceExcerpt,
      },
    ],
    skipDuplicates: true,
  });
  if (inserted.count) {
    await tx.ordinance.updateMany({
      where: { id: ordinance.id, latestActivity: { lte: change.activityDate } },
      data: { ...snapshot, lastObservedAt: new Date() },
    });
  }
}

export async function completeIngestion(
  input: {
    jobId: string;
    runId?: string;
    status: "completed" | "failed" | "credit_limit_reached";
    data?: unknown;
    creditsUsed?: number;
  },
  database: PrismaClient = db,
) {
  return database.$transaction(
    async (tx) => {
      const run = input.runId
        ? await tx.ingestionRun.findUnique({ where: { id: input.runId } })
        : await tx.ingestionRun.findUnique({
            where: { providerJobId: input.jobId },
          });
      if (!run || (run.providerJobId && run.providerJobId !== input.jobId))
        return "unknown_job";
      if (!activeStatuses.includes(run.status)) return "already_processed";
      const claimed = await tx.ingestionRun.updateMany({
        where: {
          id: run.id,
          status: run.status,
          providerJobId: run.providerJobId,
        },
        data: { status: "persisting", providerJobId: input.jobId },
      });
      if (!claimed.count) return "already_processed";
      const common = {
        completedAt: new Date(),
        creditsUsed: input.creditsUsed,
      };
      if (input.status !== "completed") {
        await tx.ingestionRun.update({
          where: { id: run.id },
          data: {
            ...common,
            status: "failed",
            failureCode:
              input.status === "credit_limit_reached"
                ? "credit_limit_reached"
                : "provider_failed",
          },
        });
        return "failed";
      }
      const parsed = resultSchema.safeParse(input.data);
      if (!parsed.success) {
        await tx.ingestionRun.update({
          where: { id: run.id },
          data: { ...common, status: "failed", failureCode: "invalid_result" },
        });
        return "failed";
      }
      const cities = snapshotSchema.parse(run.cities);
      const expected = new Set(cities.map((city) => city.key));
      const results = new Map<string, z.infer<typeof cityResultSchema>>();
      const duplicates = new Set<string>();
      let rejectedCount = 0;
      for (const raw of parsed.data.cities) {
        const city = cityResultSchema.safeParse(raw);
        if (!city.success || !expected.has(city.data.municipalityKey)) {
          rejectedCount++;
          continue;
        }
        if (results.has(city.data.municipalityKey))
          duplicates.add(city.data.municipalityKey);
        results.set(city.data.municipalityKey, city.data);
      }
      const coverage = [];
      for (const city of cities) {
        const result = results.get(city.key);
        if (!result || duplicates.has(city.key)) {
          rejectedCount += result?.changes.length ?? 0;
          coverage.push({
            municipalityKey: city.key,
            status: "unavailable",
            sourcesChecked: [],
            accepted: 0,
            rejected: 0,
          });
          continue;
        }
        const origins = new Set(
          result.sourcesChecked.map((source) => new URL(source.url).origin),
        );
        let rejected = 0;
        const accepted: ExtractedChange[] = [];
        for (const raw of result.changes) {
          const change = changeSchema.safeParse(raw);
          if (
            result.coverage === "unavailable" ||
            !change.success ||
            !withinWindow(change.data, run.windowStart, run.windowEnd) ||
            !origins.has(new URL(change.data.evidenceUrl).origin) ||
            !origins.has(new URL(change.data.sourceUrl).origin)
          ) {
            rejected++;
            continue;
          }
          accepted.push(change.data);
        }
        accepted.sort((a, b) =>
          (a.activityAt ?? a.activityDate).localeCompare(
            b.activityAt ?? b.activityDate,
          ),
        );
        for (const change of accepted)
          await persistChange(tx, run.id, city.id, city.key, change);
        rejectedCount += rejected;
        coverage.push({
          municipalityKey: city.key,
          status: !origins.size
            ? "unavailable"
            : rejected
              ? "partial"
              : result.coverage,
          sourcesChecked: result.sourcesChecked,
          accepted: accepted.length,
          rejected,
        });
      }
      const status =
        coverage.every((city) => city.status === "complete") && !rejectedCount
          ? "completed"
          : "partial";
      await tx.ingestionRun.update({
        where: { id: run.id },
        data: { ...common, status, coverage, rejectedCount, failureCode: null },
      });
      return status;
    },
    { timeout: 60_000, maxWait: 10_000 },
  );
}

export async function reconcileIngestion(database: PrismaClient = db) {
  const deadline = Date.now() + 180_000;
  const runs = await database.ingestionRun.findMany({
    where: {
      status: { in: activeStatuses },
      OR: [{ providerJobId: { not: null } }, { status: "submitting" }],
    },
    orderBy: { createdAt: "asc" },
    take: 10,
  });
  const results = [];
  for (const run of runs) {
    if (Date.now() >= deadline) break;
    if (!run.providerJobId) {
      if (Date.now() - run.createdAt.getTime() > 30 * 60_000) {
        await database.ingestionRun.updateMany({
          where: {
            id: run.id,
            status: { in: activeStatuses },
            providerJobId: null,
          },
          data: {
            status: "submission_unknown",
            failureCode: "submission_unknown",
          },
        });
      }
      results.push({ runId: run.id, status: "submission_unknown" });
      continue;
    }
    try {
      const result = await getAgentStatus(run.providerJobId);
      const status =
        result.status === "processing"
          ? "processing"
          : await completeIngestion(
              { jobId: run.providerJobId, ...result, status: result.status },
              database,
            );
      results.push({ runId: run.id, status });
    } catch {
      const expired = Date.now() - run.createdAt.getTime() > 48 * 60 * 60_000;
      const status = expired ? "failed" : "reconciliation_failed";
      await database.ingestionRun.updateMany({
        where: { id: run.id, status: { in: activeStatuses } },
        data: {
          status,
          failureCode: expired
            ? "results_unavailable"
            : "provider_status_unavailable",
          completedAt: expired ? new Date() : null,
        },
      });
      results.push({ runId: run.id, status });
    }
  }
  return results;
}
