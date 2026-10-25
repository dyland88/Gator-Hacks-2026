import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("~/server/db", () => ({ db: {} }));
vi.mock("~/lib/supabase-server", () => ({
  createServerSupabaseClient: vi.fn(),
}));
vi.mock("~/server/ordinances/ingestion", () => ({
  submitCityIngestion: vi.fn(),
}));

import { ordinancesRouter } from "./ordinances";
import { type createTRPCContext } from "../trpc";
import { submitCityIngestion } from "~/server/ordinances/ingestion";

const cityId = "ccf48957-3c42-462b-9ecf-95ad836e5da1";
const userId = "7a09c177-6c7c-48ab-bb1f-441dd73c72c1";
const cursor = "33b34dd6-c790-4f01-950d-e05892d113e5";

function setup(
  user = true,
  location: string | null = "Gainesville, Florida, United States",
) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({
      data: { location, location_id: "123" },
      error: null,
    }),
  };
  const db = {
    municipality: {
      findUnique: vi.fn().mockResolvedValue({ id: cityId }),
      findMany: vi.fn().mockResolvedValue([
        {
          id: cityId,
          key: "us:fl:gainesville",
          city: "Gainesville",
          state: "FL",
          label: "Gainesville, FL, United States",
        },
      ]),
    },
    ordinance: {
      findMany: vi.fn().mockResolvedValue([{ id: cursor }, { id: userId }]),
    },
    ordinanceChange: {
      findMany: vi.fn().mockResolvedValue([{ id: cursor }, { id: userId }]),
    },
  };
  const ctx = {
    db,
    headers: new Headers(),
    user: user ? { id: userId } : null,
    supabase: { from: vi.fn().mockReturnValue(chain) },
  };
  const caller = ordinancesRouter.createCaller(
    ctx as unknown as Awaited<ReturnType<typeof createTRPCContext>>,
  );
  return { caller, chain, db };
}

describe("local ordinance read authorization", () => {
  it("rejects anonymous queries and injected ownership fields", async () => {
    await expect(setup(false).caller.list({})).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(setup(false).caller.changes({})).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    await expect(
      setup().caller.list({ municipalityId: cityId } as never),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
  it("reads only the verified profile and uses its municipality for queries", async () => {
    const { caller, chain, db } = setup();
    const response = await caller.list({
      limit: 1,
      from: "2026-10-01",
      to: "2026-10-24",
      stage: "adopted",
      topic: "Housing",
    });
    expect(chain.eq).toHaveBeenCalledWith("id", userId);
    expect(db.municipality.findUnique).toHaveBeenCalledWith({
      where: { key: "us:fl:gainesville" },
    });
    expect(db.ordinance.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          municipalityId: cityId,
          stage: "adopted",
          topics: { has: "Housing" },
          latestActivity: { gte: "2026-10-01", lte: "2026-10-24" },
        },
        take: 2,
      }),
    );
    expect(response.items).toHaveLength(1);
    expect(response.nextCursor).toBe(cursor);
  });
  it("paginates change history and keeps the city restriction", async () => {
    const { caller, db } = setup();
    const response = await caller.changes({
      limit: 1,
      cursor,
      from: "2026-10-01",
      to: "2026-10-24",
    });
    expect(response.nextCursor).toBe(cursor);
    expect(db.ordinanceChange.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          ordinance: {
            municipalityId: { in: [cityId] },
            stage: undefined,
            topics: undefined,
          },
          activityDate: { gte: "2026-10-01", lte: "2026-10-24" },
        },
        cursor: { id: cursor },
        skip: 1,
        take: 2,
      }),
    );
  });
  it("returns empty results for missing or ineligible locations", async () => {
    for (const location of [null, "Paris, France", "Gainesville"]) {
      const { caller, db } = setup(true, location);
      expect((await caller.list({})).items).toEqual([]);
      expect((await caller.changes({})).items).toEqual([]);
      expect(db.ordinance.findMany).not.toHaveBeenCalled();
    }
  });
  it("rejects invalid ranges and hides database details", async () => {
    const { caller, db } = setup();
    await expect(
      caller.list({ from: "2026-10-24", to: "2026-10-01" }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    db.ordinance.findMany.mockRejectedValueOnce(new Error("database password"));
    await expect(caller.list({})).rejects.toThrow(
      "Local ordinances could not be loaded.",
    );
  });
});

describe("public legislative feed", () => {
  it("queries the selected municipality and any selected topics without reading a user profile", async () => {
    const { caller, db, chain } = setup(false);
    const response = await caller.feed({
      municipalityId: cityId,
      topics: ["Housing", "Public safety"],
      direction: "forward",
      limit: 1,
    });
    expect(response.items).toHaveLength(1);
    expect(response.nextCursor).toBe(cursor);
    expect(chain.eq).not.toHaveBeenCalled();
    expect(db.ordinance.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          municipalityId: cityId,
          topics: { hasSome: ["Housing", "Public safety"] },
          changes: undefined,
        },
        take: 2,
      }),
    );
  });

  it("filters amendments using stored amendment activity and supports pagination", async () => {
    const { caller, db } = setup(false);
    await caller.feed({
      municipalityId: cityId,
      topics: [],
      section: "amendments",
      cursor,
      limit: 1,
    });
    expect(db.ordinance.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          municipalityId: cityId,
          topics: undefined,
          changes: { some: { activityType: "amendment" } },
        },
        cursor: { id: cursor },
        skip: 1,
      }),
    );
  });

  it("offers only public municipality fields for locations with stored ordinances", async () => {
    const { caller, db, chain } = setup(false);
    expect(await caller.locations()).toHaveLength(1);
    expect(db.municipality.findMany).toHaveBeenCalledWith({
      where: { ordinances: { some: {} } },
      select: { id: true, key: true, city: true, state: true, label: true },
      orderBy: [{ city: "asc" }, { state: "asc" }],
    });
    expect(chain.eq).not.toHaveBeenCalled();
  });

  it("rejects unknown topics, malformed locations, and ownership fields", async () => {
    const { caller, db } = setup(false);
    await expect(
      caller.feed({ municipalityId: "Gainesville" }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(
      caller.feed({
        municipalityId: cityId,
        topics: ["Invented tag"],
      } as never),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(
      caller.feed({ municipalityId: cityId, userId } as never),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(db.ordinance.findMany).not.toHaveBeenCalled();
  });
});

describe("DBA city ingestion authorization", () => {
  function dbaCaller(role: string | undefined) {
    const db = {};
    const ctx = {
      db,
      headers: new Headers(),
      user: { id: userId, app_metadata: { role } },
      supabase: {},
    };
    return ordinancesRouter.createCaller(
      ctx as unknown as Awaited<ReturnType<typeof createTRPCContext>>,
    );
  }

  it("rejects callers without the dba role before submitting an Agent run", async () => {
    await expect(
      dbaCaller("member").startCityIngestion({ city: "Austin", state: "TX" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      dbaCaller(undefined).startCityIngestion({ city: "Austin", state: "TX" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(submitCityIngestion).not.toHaveBeenCalled();
  });

  it("normalizes a valid city and submits with the bounded lookback", async () => {
    vi.mocked(submitCityIngestion).mockResolvedValueOnce({
      runId: cursor,
      status: "processing",
      providerJobId: userId,
    });
    const response = await dbaCaller("dba").startCityIngestion({
      city: " Austin ",
      state: "tx",
      lookbackDays: 90,
    });
    expect(response).toEqual({
      runId: cursor,
      status: "processing",
      providerJobId: userId,
    });
    expect(submitCityIngestion).toHaveBeenCalledWith(
      {
        city: {
          key: "us:tx:austin",
          city: "Austin",
          state: "TX",
          label: "Austin, TX, United States",
        },
        lookbackDays: 90,
      },
      expect.any(Date),
      expect.anything(),
    );
  });

  it("rejects malformed locations and out-of-range lookbacks without spending credits", async () => {
    const caller = dbaCaller("dba");
    await expect(
      caller.startCityIngestion({ city: "Austin, Texas", state: "TX" }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(
      caller.startCityIngestion({ city: "Austin", state: "Atlantis" }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(
      caller.startCityIngestion({
        city: "Austin",
        state: "TX",
        lookbackDays: 366,
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(submitCityIngestion).not.toHaveBeenCalled();
  });
});

describe("personalized feed ordering", () => {
  const renterRule = {
    ageMin: null,
    ageMax: null,
    lifeCircumstances: ["Renter"],
    evidenceExcerpt: "Protects renters.",
  };
  const studentRule = { ...renterRule, lifeCircumstances: ["Student"] };
  const rows = [
    {
      id: "11111111-1111-4111-8111-111111111111",
      latestActivity: "2026-10-24",
      relevanceRules: [],
    },
    {
      id: "22222222-2222-4222-8222-222222222222",
      latestActivity: "2026-10-20",
      relevanceRules: [renterRule],
    },
    {
      id: "33333333-3333-4333-8333-333333333333",
      latestActivity: "2026-10-23",
      relevanceRules: [studentRule],
    },
  ];

  function feedCaller(findMany: ReturnType<typeof vi.fn>) {
    const ctx = {
      db: { ordinance: { findMany } },
      headers: new Headers(),
      user: null,
      supabase: null,
    };
    return ordinancesRouter.createCaller(
      ctx as unknown as Awaited<ReturnType<typeof createTRPCContext>>,
    );
  }

  it("moves bills that explicitly affect the saved circumstances to the top across pages", async () => {
    const caller = feedCaller(vi.fn().mockResolvedValue(rows));
    const first = await caller.feed({
      municipalityId: cityId,
      lifeCircumstances: ["Renter"],
      limit: 2,
    });
    expect(first.items.map((item) => item.id)).toEqual([
      rows[1]!.id,
      rows[0]!.id,
    ]);
    expect(first.nextCursor).toBe(rows[0]!.id);
    expect(first.items[0]).not.toHaveProperty("relevanceRules");
    const second = await caller.feed({
      municipalityId: cityId,
      lifeCircumstances: ["Renter"],
      limit: 2,
      cursor: first.nextCursor,
    });
    expect(second.items.map((item) => item.id)).toEqual([rows[2]!.id]);
    expect(second.nextCursor).toBeUndefined();
  });

  it("keeps recency order and database pagination without a relevance profile", async () => {
    const findMany = vi.fn().mockResolvedValue(rows.slice(0, 2));
    const caller = feedCaller(findMany);
    const page = await caller.feed({ municipalityId: cityId, limit: 1 });
    expect(page.items.map((item) => item.id)).toEqual([rows[0]!.id]);
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 2,
        orderBy: [{ latestActivity: "desc" }, { id: "desc" }],
      }),
    );
    expect(findMany.mock.calls[0]![0]).not.toHaveProperty(
      "select.relevanceRules",
    );
  });

  it("returns nothing for a cursor that is not in the ranked feed", async () => {
    const caller = feedCaller(vi.fn().mockResolvedValue(rows));
    await expect(
      caller.feed({
        municipalityId: cityId,
        lifeCircumstances: ["Renter"],
        cursor: "44444444-4444-4444-8444-444444444444",
      }),
    ).resolves.toEqual({ items: [], nextCursor: undefined });
  });
});
