import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("~/server/db", () => ({ db: {} }));
vi.mock("~/lib/supabase-server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import { ordinancesRouter } from "./ordinances";
import { type createTRPCContext } from "../trpc";

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
    maybeSingle: vi
      .fn()
      .mockResolvedValue({
        data: { location, location_id: "123" },
        error: null,
      }),
  };
  const db = {
    municipality: { findUnique: vi.fn().mockResolvedValue({ id: cityId }) },
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
