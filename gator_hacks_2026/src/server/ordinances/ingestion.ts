import "server-only";

import { createHash } from "node:crypto";
import { z } from "zod";

import { type PrismaClient, type Prisma } from "../../../generated/prisma";
import {
  normalizeMunicipality,
  type MunicipalityIdentity,
} from "~/lib/municipality";
import { db } from "~/server/db";
import {
  matchOrdinance,
  normalizeOrdinanceName,
  normalizeOrdinanceNumber,
  type StoredOrdinanceIdentity,
} from "./identity";
import {
  FirecrawlError,
  getAgentStatus,
  requireIngestionConfig,
  startAgent,
  startPreviewAgent,
} from "./firecrawl";
import {
  changeSchema,
  checkedSourceOrigin,
  cityResultSchema,
  resultSchema,
  withinWindow,
  type ExtractedChange,
} from "./schema";
import { presentableLink } from "./source-links";

export { withinWindow } from "./schema";

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
  return submitRun(
    {
      ...window,
      identities: [...identities.values()],
      skippedCount,
      webhook: true,
    },
    database,
  );
}

export async function submitPollingIngestion(
  input: { cities: MunicipalityIdentity[]; windowStart: Date; windowEnd: Date },
  database: PrismaClient = db,
) {
  if (
    !Number.isFinite(input.windowStart.getTime()) ||
    !Number.isFinite(input.windowEnd.getTime()) ||
    input.windowStart >= input.windowEnd
  )
    throw new Error("Invalid ingestion reporting window");
  if (!input.cities.length)
    throw new Error("At least one municipality is required");
  const identities = [
    ...new Map(input.cities.map((city) => [city.key, city])).values(),
  ];
  return submitRun(
    { ...input, identities, skippedCount: 0, webhook: false },
    database,
  );
}

export async function submitCityIngestion(
  input: { city: MunicipalityIdentity; lookbackDays: number },
  now = new Date(),
  database: PrismaClient = db,
) {
  requireIngestionConfig();
  const windowEnd = new Date(now);
  const windowStart = new Date(
    windowEnd.getTime() - input.lookbackDays * 86_400_000,
  );
  return submitRun(
    {
      identities: [input.city],
      windowStart,
      windowEnd,
      skippedCount: 0,
      webhook: true,
    },
    database,
  );
}

async function submitRun(
  input: {
    identities: MunicipalityIdentity[];
    windowStart: Date;
    windowEnd: Date;
    skippedCount: number;
    webhook: boolean;
  },
  database: PrismaClient,
) {
  const window = { windowStart: input.windowStart, windowEnd: input.windowEnd };
  const cities = [];
  for (const city of input.identities.sort((a, b) =>
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
        skippedCount: input.skippedCount,
        status: cities.length ? "submitting" : "skipped",
        completedAt: cities.length ? null : new Date(),
      },
    ],
    skipDuplicates: true,
  });
  const run = await database.ingestionRun.findUniqueOrThrow({
    where: { windowEnd: window.windowEnd },
  });
  if (run.windowStart.getTime() !== input.windowStart.getTime())
    throw new Error("Reporting window is already claimed by another ingestion");
  if (!claimed.count || !cities.length)
    return {
      runId: run.id,
      status: run.status,
      providerJobId: run.providerJobId,
    };
  try {
    const jobId = input.webhook
      ? await startAgent({ ...window, runId: run.id, cities })
      : await startPreviewAgent({ ...window, cities });
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
        completedAt: rejected ? new Date() : null,
      },
    });
  }
  const updated = await database.ingestionRun.findUniqueOrThrow({
    where: { id: run.id },
  });
  return {
    runId: updated.id,
    status: updated.status,
    providerJobId: updated.providerJobId,
  };
}

export function ordinanceIdentity(change: ExtractedChange) {
  return change.sourceIdentifier
    ? `number:${normalizeOrdinanceNumber(change.sourceIdentifier)}`
    : `name:${normalizeOrdinanceName(change.name)}`;
}

export function changeIdentity(
  municipalityKey: string,
  change: ExtractedChange,
  identityKey = ordinanceIdentity(change),
) {
  return createHash("sha256")
    .update(
      JSON.stringify([
        municipalityKey,
        identityKey,
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
  existing: StoredOrdinanceIdentity[],
  checked: string[],
) {
  const match = matchOrdinance(existing, change);
  if (match.ambiguous) return false;
  const identityKey = ordinanceIdentity(change);
  const sourceLink = presentableLink(change.sourceUrl, {
    preferred: [],
    checked,
  }).url;
  const evidenceLink = presentableLink(change.evidenceUrl, {
    preferred: [change.sourceUrl],
    checked,
  }).url;
  const snapshot = {
    sourceIdentifier: change.sourceIdentifier,
    name: change.name,
    description: change.description,
    stage: change.stage,
    originalStage: change.originalStage,
    topics: [...new Set(change.topics)],
    sourceUrl: sourceLink,
    adoptedDate: change.adoptedDate,
    effectiveDate: change.effectiveDate,
    latestActivity: change.activityDate,
  };
  const ordinance =
    match.ordinance ??
    (await tx.ordinance.upsert({
      where: { municipalityId_identityKey: { municipalityId, identityKey } },
      create: { municipalityId, identityKey, ...snapshot },
      update: {},
    }));
  const inserted = await tx.ordinanceChange.createMany({
    data: [
      {
        ordinanceId: ordinance.id,
        ingestionRunId: runId,
        dedupeKey: changeIdentity(
          municipalityKey,
          change,
          ordinance.identityKey,
        ),
        activityType: change.activityType,
        activityDate: change.activityDate,
        activityAt: change.activityAt ? new Date(change.activityAt) : null,
        description: change.changeDescription,
        evidenceUrl: evidenceLink,
        evidenceExcerpt: change.evidenceExcerpt,
      },
    ],
    skipDuplicates: true,
  });
  if (!existing.some((row) => row.id === ordinance.id))
    existing.push(ordinance);
  if (!ordinance.sourceIdentifier && change.sourceIdentifier) {
    await tx.ordinance.updateMany({
      where: { id: ordinance.id, sourceIdentifier: null },
      data: { sourceIdentifier: change.sourceIdentifier },
    });
    ordinance.sourceIdentifier = change.sourceIdentifier;
  }
  if (inserted.count) {
    const updated = await tx.ordinance.updateMany({
      where: { id: ordinance.id, latestActivity: { lte: change.activityDate } },
      data: {
        ...snapshot,
        sourceIdentifier: change.sourceIdentifier ?? ordinance.sourceIdentifier,
        lastObservedAt: new Date(),
      },
    });
    if (updated.count) {
      ordinance.name = change.name;
      ordinance.sourceUrl = change.sourceUrl;
    }
  }
  return true;
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
      for (const city of cities.sort((a, b) => a.id.localeCompare(b.id))) {
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
          result.sourcesChecked.map((source) =>
            checkedSourceOrigin(source.url),
          ),
        );
        let rejected = 0;
        const accepted: ExtractedChange[] = [];
        for (const raw of result.changes) {
          const change = changeSchema.safeParse(raw);
          if (
            result.coverage === "unavailable" ||
            !change.success ||
            !withinWindow(change.data, run.windowStart, run.windowEnd) ||
            !origins.has(checkedSourceOrigin(change.data.evidenceUrl)) ||
            !origins.has(checkedSourceOrigin(change.data.sourceUrl))
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
        let persisted = 0;
        if (accepted.length) {
          await tx.$queryRaw`SELECT id FROM public.municipalities WHERE id = ${city.id}::uuid FOR UPDATE`;
          const existing = await tx.ordinance.findMany({
            where: { municipalityId: city.id },
            select: {
              id: true,
              identityKey: true,
              name: true,
              sourceIdentifier: true,
              sourceUrl: true,
            },
          });
          const checked = result.sourcesChecked.map((source) => source.url);
          for (const change of accepted) {
            if (
              await persistChange(
                tx,
                run.id,
                city.id,
                city.key,
                change,
                existing,
                checked,
              )
            )
              persisted++;
            else rejected++;
          }
        }
        rejectedCount += rejected;
        coverage.push({
          municipalityKey: city.key,
          status: !origins.size
            ? "unavailable"
            : rejected
              ? "partial"
              : result.coverage,
          sourcesChecked: result.sourcesChecked,
          accepted: persisted,
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
