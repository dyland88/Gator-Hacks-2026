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
  const ordinances = new Map<string, { id: string; latestActivity: string }>();
  const changes = new Set<string>();
  const tx = {
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
      upsert: vi
        .fn()
        .mockImplementation(
          ({
            create,
          }: {
            create: { identityKey: string; latestActivity: string };
          }) => {
            const current = ordinances.get(create.identityKey) ?? {
              id: "ordinance-1",
              ...create,
            };
            ordinances.set(create.identityKey, current);
            return Promise.resolve(current);
          },
        ),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
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
