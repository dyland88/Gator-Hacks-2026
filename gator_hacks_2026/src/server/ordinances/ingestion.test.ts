import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("~/server/db", () => ({ db: {} }));
vi.mock("./firecrawl", () => ({
  requireIngestionConfig: vi.fn(),
  startAgent: vi.fn(),
  startPreviewAgent: vi.fn(),
  getAgentStatus: vi.fn(),
  FirecrawlError: class extends Error {},
}));

import { type PrismaClient } from "../../../generated/prisma";
import { normalizeMunicipality } from "~/lib/municipality";
import { getAgentStatus, startAgent, startPreviewAgent } from "./firecrawl";
import {
  changeIdentity,
  completeIngestion,
  reconcileIngestion,
  reportingWindow,
  submitDailyIngestion,
  submitPollingIngestion,
  withinWindow,
} from "./ingestion";
import { changeSchema, dateSchema } from "./schema";
import { type StoredOrdinanceIdentity } from "./identity";

const city = {
  ...normalizeMunicipality("Gainesville, Florida, United States")!,
  id: "ccf48957-3c42-462b-9ecf-95ad836e5da1",
};
const jobId = "7a09c177-6c7c-48ab-bb1f-441dd73c72c1";
const now = new Date("2026-10-24T06:35:00Z");
const change = {
  sourceIdentifier: "2026-01",
  name: "Housing ordinance",
  description: "Updates housing rules.",
  stage: "adopted",
  originalStage: "Adopted",
  topics: ["Housing"],
  sourceUrl: "https://gainesvillefl.gov/ordinances/2026-01",
  adoptedDate: "2026-10-23",
  effectiveDate: null,
  activityType: "adoption",
  activityDate: "2026-10-23",
  activityAt: null,
  changeDescription: "Council adopted the ordinance.",
  evidenceUrl: "https://gainesvillefl.gov/meetings/2026-10-23",
  evidenceExcerpt: "October 23, 2026: ordinance 2026-01 adopted.",
};

function database() {
  const run = {
    id: "33b34dd6-c790-4f01-950d-e05892d113e5",
    ...reportingWindow(now),
    cities: [city],
    status: "processing",
    providerJobId: jobId,
    createdAt: now,
  };
  type Stored = StoredOrdinanceIdentity & {
    municipalityId: string;
    latestActivity: string;
    stage: string;
  };
  const ordinances = new Map<string, Stored>();
  const changes = new Set<string>();
  const tx = {
    $queryRaw: vi.fn().mockResolvedValue([{ id: city.id }]),
    userProfile: {
      findMany: vi.fn().mockResolvedValue([
        {
          location: "32601 — Gainesville, Florida, United States",
          locationId: "us:32601:0",
        },
        { location: "Gainesville, Florida, United States", locationId: "123" },
        { location: "Orlando, Florida, United States", locationId: "456" },
        { location: "Paris, Île-de-France, France", locationId: "789" },
        { location: null, locationId: null },
      ]),
    },
    municipality: {
      upsert: vi
        .fn()
        .mockImplementation(({ create }: { create: { key: string } }) =>
          Promise.resolve({ ...create, id: city.id }),
        ),
    },
    ingestionRun: {
      createMany: vi
        .fn<
          (args: {
            data: { skippedCount: number; status: string }[];
          }) => Promise<{ count: number }>
        >()
        .mockResolvedValue({ count: 1 }),
      findUniqueOrThrow: vi.fn().mockResolvedValue(run),
      findUnique: vi.fn().mockResolvedValue(run),
      findMany: vi.fn().mockResolvedValue([run]),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      update: vi.fn().mockResolvedValue(run),
    },
    ordinance: {
      findMany: vi
        .fn()
        .mockImplementation(
          ({ where }: { where: { municipalityId: string } }) =>
            Promise.resolve(
              [...ordinances.values()]
                .filter((row) => row.municipalityId === where.municipalityId)
                .map((row) => ({ ...row })),
            ),
        ),
      upsert: vi
        .fn()
        .mockImplementation(({ create }: { create: Omit<Stored, "id"> }) => {
          const key = `${create.municipalityId}:${create.identityKey}`;
          const current = ordinances.get(key) ?? {
            id: `ordinance-${ordinances.size + 1}`,
            ...create,
          };
          ordinances.set(key, current);
          return Promise.resolve({ ...current });
        }),
      updateMany: vi.fn().mockImplementation(
        ({
          where,
          data,
        }: {
          where: {
            id: string;
            latestActivity?: { lte: string };
            sourceIdentifier?: null;
          };
          data: Partial<Stored>;
        }) => {
          const row = [...ordinances.values()].find(
            (value) => value.id === where.id,
          );
          if (
            !row ||
            (where.latestActivity &&
              row.latestActivity > where.latestActivity.lte) ||
            (where.sourceIdentifier === null && row.sourceIdentifier !== null)
          )
            return Promise.resolve({ count: 0 });
          Object.assign(row, data);
          return Promise.resolve({ count: 1 });
        },
      ),
    },
    ordinanceChange: {
      createMany: vi
        .fn()
        .mockImplementation(
          ({
            data,
          }: {
            data: { dedupeKey: string; activityAt: Date | null }[];
          }) => {
            const key = data[0]!.dedupeKey;
            const count = changes.has(key) ? 0 : 1;
            changes.add(key);
            return Promise.resolve({ count });
          },
        ),
    },
  };
  const db = {
    ...tx,
    $transaction: vi
      .fn()
      .mockImplementation((fn: (transaction: typeof tx) => Promise<unknown>) =>
        fn(tx),
      ),
  } as unknown as PrismaClient;
  return { db, tx, run, changes, ordinances };
}

function result(changes: unknown[] = [change]) {
  return {
    cities: [
      {
        municipalityKey: city.key,
        coverage: "complete",
        sourcesChecked: [
          {
            url: "https://gainesvillefl.gov/meetings",
            publisher: "municipality",
          },
        ],
        changes,
      },
    ],
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(startAgent).mockResolvedValue(jobId);
  vi.mocked(startPreviewAgent).mockResolvedValue(jobId);
});

describe("manual database ingestion", () => {
  it("submits a 30-day run and persists validated results through the shared transaction", async () => {
    const { db, tx, run, changes } = database();
    const windowStart = new Date(now.getTime() - 30 * 86_400_000);
    Object.assign(run, { windowStart, windowEnd: now });
    const submitted = await submitPollingIngestion(
      { cities: [city], windowStart, windowEnd: now },
      db,
    );
    expect(submitted.providerJobId).toBe(jobId);
    expect(startPreviewAgent).toHaveBeenCalledWith({
      cities: [city],
      windowStart,
      windowEnd: now,
    });
    expect(startAgent).not.toHaveBeenCalled();
    expect(tx.ingestionRun.createMany.mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(startPreviewAgent).mock.invocationCallOrder[0]!,
    );
    expect(
      await completeIngestion(
        { jobId, runId: run.id, status: "completed", data: result() },
        db,
      ),
    ).toBe("completed");
    expect(changes.size).toBe(1);
    await completeIngestion(
      { jobId, runId: run.id, status: "completed", data: result() },
      db,
    );
    expect(changes.size).toBe(1);
  });

  it("does not spend Agent credits when database run creation fails", async () => {
    const { db, tx } = database();
    tx.ingestionRun.createMany.mockRejectedValueOnce(
      new Error("database unavailable"),
    );
    await expect(
      submitPollingIngestion({ cities: [city], ...reportingWindow(now) }, db),
    ).rejects.toThrow("database unavailable");
    expect(startPreviewAgent).not.toHaveBeenCalled();
  });

  it("rejects a reporting window collision with the daily run", async () => {
    const { db, tx, run } = database();
    tx.ingestionRun.createMany.mockResolvedValueOnce({ count: 0 });
    await expect(
      submitPollingIngestion(
        {
          cities: [city],
          windowStart: new Date(run.windowEnd.getTime() - 30 * 86_400_000),
          windowEnd: run.windowEnd,
        },
        db,
      ),
    ).rejects.toThrow("Reporting window is already claimed");
    expect(startPreviewAgent).not.toHaveBeenCalled();
  });
});

describe("municipalities and reporting dates", () => {
  it("deduplicates ZIP and city labels with full state names or abbreviations", () => {
    expect(
      normalizeMunicipality("32601 — Gainesville, Florida, United States")?.key,
    ).toBe(normalizeMunicipality("Gainesville, FL, USA")?.key);
    expect(
      normalizeMunicipality("Springfield, Illinois, United States")?.key,
    ).not.toBe(
      normalizeMunicipality("Springfield, Missouri, United States")?.key,
    );
  });
  it("skips ambiguous and non-US labels", () => {
    for (const label of [
      null,
      "Gainesville",
      "Paris, Texas, France",
      "Gainesville, Unknown, US",
    ])
      expect(normalizeMunicipality(label)).toBeNull();
  });
  it("uses the fixed preceding 06:00 UTC boundary despite scheduler jitter", () => {
    expect(reportingWindow(now).windowEnd.toISOString()).toBe(
      "2026-10-24T06:00:00.000Z",
    );
    expect(
      reportingWindow(new Date("2026-10-24T05:59Z")).windowEnd.toISOString(),
    ).toBe("2026-10-23T06:00:00.000Z");
  });
  it("preserves date-only precision and filters precise timestamps", () => {
    const parsed = changeSchema.parse(change);
    const { windowStart, windowEnd } = reportingWindow(now);
    expect(withinWindow(parsed, windowStart, windowEnd)).toBe(true);
    expect(
      withinWindow(
        { ...parsed, activityDate: "2026-10-22" },
        windowStart,
        windowEnd,
      ),
    ).toBe(false);
    expect(
      withinWindow(
        {
          ...parsed,
          activityDate: "2026-10-24",
          activityAt: "2026-10-24T06:00:00Z",
        },
        windowStart,
        windowEnd,
      ),
    ).toBe(false);
    expect(dateSchema.safeParse("2026-02-30").success).toBe(false);
  });
});

describe("daily submission", () => {
  it("submits one job for all distinct eligible cities using location fields only", async () => {
    const { db, tx } = database();
    await submitDailyIngestion(now, db);
    expect(tx.userProfile.findMany).toHaveBeenCalledWith({
      select: { location: true, locationId: true },
    });
    expect(startAgent).toHaveBeenCalledOnce();
    expect(vi.mocked(startAgent).mock.calls[0]![0].cities).toHaveLength(2);
    expect(
      tx.ingestionRun.createMany.mock.calls[0]![0].data[0]!.skippedCount,
    ).toBe(2);
  });
  it("does not submit without eligible cities", async () => {
    const { db, tx } = database();
    tx.userProfile.findMany.mockResolvedValue([]);
    await submitDailyIngestion(now, db);
    expect(startAgent).not.toHaveBeenCalled();
    expect(tx.ingestionRun.createMany.mock.calls[0]![0].data[0]!.status).toBe(
      "skipped",
    );
  });
  it("only the atomic claim winner submits during concurrent deliveries", async () => {
    const { db, tx } = database();
    tx.ingestionRun.createMany
      .mockResolvedValueOnce({ count: 1 })
      .mockResolvedValueOnce({ count: 0 });
    await Promise.all([
      submitDailyIngestion(now, db),
      submitDailyIngestion(now, db),
    ]);
    expect(startAgent).toHaveBeenCalledOnce();
  });
  it("records uncertain acceptance without retrying submission", async () => {
    const { db, tx } = database();
    vi.mocked(startAgent).mockRejectedValueOnce(
      new Error("secret provider detail"),
    );
    await submitDailyIngestion(now, db);
    expect(startAgent).toHaveBeenCalledOnce();
    expect(tx.ingestionRun.updateMany.mock.calls[0]![0]).toMatchObject({
      data: {
        status: "submission_unknown",
        failureCode: "submission_unknown",
      },
    });
  });
});

describe("result persistence", () => {
  it("keeps only relevance rules supported by the change excerpt and pins their source", async () => {
    const { db, tx } = database();
    const rule = {
      ageMin: 65,
      ageMax: null,
      lifeCircumstances: ["Renter"],
      evidenceExcerpt: "Renters aged 65 and older.",
    };
    await completeIngestion(
      {
        jobId,
        status: "completed",
        data: result([
          {
            ...change,
            evidenceExcerpt: `${change.evidenceExcerpt} ${rule.evidenceExcerpt}`,
            relevanceRules: [
              rule,
              { ...rule, evidenceExcerpt: "Unsupported claim." },
            ],
          },
        ]),
      },
      db,
    );
    expect(tx.ordinance.upsert.mock.calls[0]?.[0]).toMatchObject({
      create: {
        relevanceRules: [{ ...rule, evidenceUrl: change.evidenceUrl }],
      },
    });
  });

  it("matches a normalized name when the URL changes or a previously missing number appears", async () => {
    const { db, ordinances, changes } = database();
    await completeIngestion(
      {
        jobId,
        status: "completed",
        data: result([{ ...change, sourceIdentifier: null }]),
      },
      db,
    );
    await completeIngestion(
      {
        jobId,
        status: "completed",
        data: result([
          {
            ...change,
            name: "  HOUSING   ORDINANCE ",
            sourceUrl: "https://gainesvillefl.gov/new-link",
            sourceIdentifier: "Ordinance No. 2026-01",
          },
        ]),
      },
      db,
    );
    expect(ordinances.size).toBe(1);
    expect(changes.size).toBe(1);
    expect([...ordinances.values()][0]).toMatchObject({
      sourceIdentifier: "Ordinance No. 2026-01",
    });
  });

  it("updates a name-matched bill for a later stage while preserving its history", async () => {
    const { db, ordinances, changes } = database();
    await completeIngestion(
      {
        jobId,
        status: "completed",
        data: result([
          {
            ...change,
            sourceIdentifier: null,
            stage: "introduced",
            activityType: "introduction",
            adoptedDate: null,
          },
        ]),
      },
      db,
    );
    const originalId = [...ordinances.values()][0]!.id;
    await completeIngestion(
      {
        jobId,
        status: "completed",
        data: result([
          {
            ...change,
            sourceIdentifier: null,
            activityDate: "2026-10-24",
            sourceUrl: "https://gainesvillefl.gov/revised-link",
          },
        ]),
      },
      db,
    );
    expect(ordinances.size).toBe(1);
    expect(changes.size).toBe(2);
    expect([...ordinances.values()][0]).toMatchObject({
      id: originalId,
      stage: "adopted",
      latestActivity: "2026-10-24",
    });
  });

  it("matches legacy URL-based identities without duplicating their existing event hashes", async () => {
    const { db, ordinances, changes } = database();
    const identityKey = `url:${change.sourceUrl}`;
    ordinances.set(`${city.id}:${identityKey}`, {
      id: "legacy-ordinance",
      municipalityId: city.id,
      identityKey,
      name: change.name,
      sourceIdentifier: null,
      sourceUrl: change.sourceUrl,
      latestActivity: change.activityDate,
      stage: change.stage,
    });
    changes.add(
      changeIdentity(city.key, changeSchema.parse(change), identityKey),
    );
    await completeIngestion(
      { jobId, status: "completed", data: result([change]) },
      db,
    );
    expect(ordinances.size).toBe(1);
    expect(changes.size).toBe(1);
  });

  it("uses a stable ordinance number even when the official title changes", async () => {
    const { db, ordinances } = database();
    await completeIngestion({ jobId, status: "completed", data: result() }, db);
    await completeIngestion(
      {
        jobId,
        status: "completed",
        data: result([
          {
            ...change,
            name: "Renamed housing policy",
            sourceIdentifier: "Ordinance No. 2026-01",
            activityType: "amendment",
          },
        ]),
      },
      db,
    );
    expect(ordinances.size).toBe(1);
    expect([...ordinances.values()][0]?.name).toBe("Renamed housing policy");
  });

  it("keeps conflicting official numbers distinct and rejects ambiguous name-only matches", async () => {
    const { db, tx, ordinances } = database();
    await completeIngestion(
      {
        jobId,
        status: "completed",
        data: result([change, { ...change, sourceIdentifier: "2026-02" }]),
      },
      db,
    );
    expect(ordinances.size).toBe(2);
    expect(
      await completeIngestion(
        {
          jobId,
          status: "completed",
          data: result([{ ...change, sourceIdentifier: null }]),
        },
        db,
      ),
    ).toBe("partial");
    expect(ordinances.size).toBe(2);
    expect(tx.ingestionRun.update.mock.calls.at(-1)?.[0]).toMatchObject({
      data: { rejectedCount: 1, coverage: [{ accepted: 0, rejected: 1 }] },
    });
  });

  it("does not merge equal names from different municipalities", async () => {
    const { db, run, ordinances } = database();
    await completeIngestion(
      {
        jobId,
        status: "completed",
        data: result([{ ...change, sourceIdentifier: null }]),
      },
      db,
    );
    const otherCity = {
      ...city,
      ...normalizeMunicipality("Orlando, Florida, United States")!,
      id: "33a62ed5-7538-487d-9e93-a4576b69507c",
    };
    run.cities = [otherCity];
    const otherResult = result([{ ...change, sourceIdentifier: null }]);
    otherResult.cities[0]!.municipalityKey = otherCity.key;
    await completeIngestion(
      { jobId, status: "completed", data: otherResult },
      db,
    );
    expect(ordinances.size).toBe(2);
  });

  it("accepts a checked CivicClerk tenant's document API but rejects other tenants and lookalike hosts", async () => {
    const { db, tx, changes } = database();
    const data = result([
      {
        ...change,
        sourceUrl:
          "https://gainesvillefl.portal.civicclerk.com/event/128/files",
        evidenceUrl:
          "https://gainesvillefl.api.civicclerk.com/v1/Meetings/GetMeetingFileStream(fileId=98,plainText=true)",
      },
      {
        ...change,
        sourceUrl:
          "https://gainesvillefl.portal.civicclerk.com/event/128/files",
        evidenceUrl: "https://anothercity.api.civicclerk.com/file",
      },
      {
        ...change,
        sourceUrl:
          "https://gainesvillefl.portal.civicclerk.com/event/128/files",
        evidenceUrl: "https://gainesvillefl.api.civicclerk.com.evil.test/file",
      },
    ]);
    data.cities[0]!.sourcesChecked = [
      {
        url: "https://gainesvillefl.portal.civicclerk.com/",
        publisher: "official_legislative_platform",
      },
    ];
    expect(
      await completeIngestion({ jobId, status: "completed", data }, db),
    ).toBe("partial");
    expect(changes.size).toBe(1);
    expect(tx.ingestionRun.update.mock.calls[0]![0]).toMatchObject({
      data: { rejectedCount: 2, coverage: [{ accepted: 1, rejected: 2 }] },
    });
  });

  it("upserts ordinance snapshots and deduplicates rediscovered events across runs", async () => {
    const { db, tx, changes, ordinances } = database();
    await completeIngestion({ jobId, status: "completed", data: result() }, db);
    await completeIngestion({ jobId, status: "completed", data: result() }, db);
    expect(ordinances.size).toBe(1);
    expect(changes.size).toBe(1);
    expect(tx.ordinanceChange.createMany.mock.calls[0]![0]).toMatchObject({
      data: [{ activityAt: null }],
    });
    const hearing = { ...change, activityType: "hearing" };
    await completeIngestion(
      { jobId, status: "completed", data: result([hearing]) },
      db,
    );
    expect(changes.size).toBe(2);
  });
  it("makes duplicate callbacks and mismatched jobs harmless", async () => {
    const { db, tx, run } = database();
    run.status = "completed";
    expect(
      await completeIngestion(
        { jobId, status: "completed", data: result() },
        db,
      ),
    ).toBe("already_processed");
    expect(
      await completeIngestion(
        {
          jobId: "different",
          runId: run.id,
          status: "completed",
          data: result(),
        },
        db,
      ),
    ).toBe("unknown_job");
    expect(tx.ordinance.upsert).not.toHaveBeenCalled();
  });
  it("accepts callback-before-submission-response with signed run correlation", async () => {
    const { db, run } = database();
    Object.assign(run, { status: "submitting", providerJobId: null });
    expect(
      await completeIngestion(
        { jobId, runId: run.id, status: "completed", data: result() },
        db,
      ),
    ).toBe("completed");
  });
  it("records malformed output and provider failures without writing ordinances", async () => {
    const { db, tx } = database();
    expect(
      await completeIngestion({ jobId, status: "completed", data: {} }, db),
    ).toBe("failed");
    expect(await completeIngestion({ jobId, status: "failed" }, db)).toBe(
      "failed",
    );
    expect(tx.ordinance.upsert).not.toHaveBeenCalled();
  });
  it("rejects wrong cities, stale activity, unsupported URLs and undated claims", async () => {
    const { db, tx } = database();
    const data = result([
      { ...change, activityDate: "2026-01-01" },
      { ...change, evidenceUrl: "http://localhost/admin" },
      { ...change, activityDate: null },
      { ...change, evidenceUrl: "https://news.example.com/story" },
    ]);
    data.cities.push({
      ...data.cities[0]!,
      municipalityKey: "us:fl:other",
      changes: [change],
    });
    expect(
      await completeIngestion({ jobId, status: "completed", data }, db),
    ).toBe("partial");
    expect(tx.ordinance.upsert).not.toHaveBeenCalled();
    expect(tx.ingestionRun.update.mock.calls.at(-1)?.[0]).toMatchObject({
      data: { rejectedCount: 5 },
    });
  });
  it("does not report missing city coverage as no changes", async () => {
    const { db, tx } = database();
    expect(
      await completeIngestion(
        { jobId, status: "completed", data: { cities: [] } },
        db,
      ),
    ).toBe("partial");
    expect(tx.ingestionRun.update.mock.calls[0]![0]).toMatchObject({
      data: { coverage: [{ status: "unavailable" }] },
    });
  });
  it("normalizes tracking parameters for stable event identities", () => {
    const a = changeSchema.parse(change);
    const b = changeSchema.parse({
      ...change,
      evidenceUrl: `${change.evidenceUrl}?utm_source=agent#vote`,
    });
    expect(changeIdentity(city.key, a)).toBe(changeIdentity(city.key, b));
  });
});

describe("reconciliation", () => {
  it("collects completed jobs without creating another Agent job", async () => {
    const { db } = database();
    vi.mocked(getAgentStatus).mockResolvedValueOnce({
      status: "completed",
      data: result(),
    });
    expect((await reconcileIngestion(db))[0]?.status).toBe("completed");
    expect(startAgent).not.toHaveBeenCalled();
  });
  it("records unavailable results without treating them as empty changes", async () => {
    const { db, run } = database();
    run.createdAt = new Date();
    vi.mocked(getAgentStatus).mockRejectedValueOnce(
      new Error("private detail"),
    );
    expect((await reconcileIngestion(db))[0]?.status).toBe(
      "reconciliation_failed",
    );
    expect(startAgent).not.toHaveBeenCalled();
  });
});
