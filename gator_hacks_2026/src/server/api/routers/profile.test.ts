import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("~/server/db", () => ({ db: {} }));
vi.mock("~/lib/supabase-server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import { profileRouter } from "./profile";
import { createTRPCContext } from "../trpc";
import { createServerSupabaseClient } from "~/lib/supabase-server";

const userId = "7a09c177-6c7c-48ab-bb1f-441dd73c72c1";
const saved = {
  id: userId,
  tags: ["Housing"],
  age: 27,
  location: "Gainesville",
  location_id: "us:32601:0",
  gender: "Woman",
  created_at: "2026-10-24",
  updated_at: "2026-10-24",
};

function setup(user: boolean) {
  const result = { data: saved, error: null };
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue(result),
    upsert: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
  };
  const context = {
    db: {},
    headers: new Headers(),
    user: user ? { id: userId } : null,
    supabase: { from: vi.fn().mockReturnValue(chain) },
  };
  const caller = profileRouter.createCaller(
    context as unknown as Awaited<ReturnType<typeof createTRPCContext>>,
  );
  return { caller, chain, context };
}

describe("profile authorization", () => {
  it("rejects unsigned profile reads and writes", async () => {
    const { caller, context } = setup(false);
    await expect(caller.me()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      caller.save({
        tags: [],
        age: null,
        location: null,
        locationId: null,
        gender: null,
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    expect(context.supabase.from).not.toHaveBeenCalled();
  });

  it("uses the verified account for reads", async () => {
    const { caller, chain } = setup(true);
    await expect(caller.me()).resolves.toEqual(saved);
    expect(chain.eq).toHaveBeenCalledWith("id", userId);
  });

  it("uses the verified account for saves and normalizes duplicate tags", async () => {
    const { caller, chain } = setup(true);
    await caller.save({
      tags: ["Housing", "Housing"],
      lifeCircumstances: ["Renter", "Student", "Renter"],
      age: 27,
      location: "Gainesville",
      locationId: "us:32601:0",
      gender: "Woman",
    });
    expect(chain.upsert).toHaveBeenCalledWith(
      {
        id: userId,
        tags: ["Housing"],
        life_circumstances: ["Renter", "Student"],
        age: 27,
        location: "Gainesville",
        location_id: "us:32601:0",
        gender: "Woman",
      },
      { onConflict: "id" },
    );
  });

  it("rejects injected ownership fields", async () => {
    const { caller, chain } = setup(true);
    await expect(
      caller.save({
        id: "another-account",
        tags: [],
        age: null,
        location: null,
        locationId: null,
        gender: null,
      } as never),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(chain.upsert).not.toHaveBeenCalled();
  });

  it("allows clearing circumstances and rejects unsupported values", async () => {
    const { caller, chain } = setup(true);
    const input = {
      tags: [],
      age: null,
      location: null,
      locationId: null,
      gender: null,
    };
    await caller.save({ ...input, lifeCircumstances: [] });
    expect(chain.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ id: userId, life_circumstances: [] }),
      { onConflict: "id" },
    );
    chain.upsert.mockClear();
    await expect(
      caller.save({ ...input, lifeCircumstances: ["Invented"] } as never),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(chain.upsert).not.toHaveBeenCalled();
  });

  it("rejects unsupported tags and invalid ages", async () => {
    const { caller, chain } = setup(true);
    await expect(
      caller.save({
        tags: ["Unknown"],
        age: 121,
        location: null,
        locationId: null,
        gender: null,
      } as never),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(chain.upsert).not.toHaveBeenCalled();
  });

  it("does not reveal database error details", async () => {
    const { caller, chain } = setup(true);
    chain.maybeSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "secret database detail" },
    });
    await expect(caller.me()).rejects.toThrow(
      "Your preferences could not be loaded. Please try again.",
    );
  });
});

describe("server authentication", () => {
  beforeEach(() => vi.clearAllMocks());

  it("verifies the user with Supabase before attaching identity", async () => {
    const getUser = vi
      .fn()
      .mockResolvedValue({ data: { user: { id: userId } }, error: null });
    vi.mocked(createServerSupabaseClient).mockResolvedValue({
      auth: { getUser },
    } as never);
    const context = await createTRPCContext({ headers: new Headers() });
    expect(getUser).toHaveBeenCalledOnce();
    expect(context.user?.id).toBe(userId);
  });

  it("does not authenticate an invalid or expired session", async () => {
    const getUser = vi.fn().mockResolvedValue({
      data: { user: null },
      error: { message: "expired" },
    });
    vi.mocked(createServerSupabaseClient).mockResolvedValue({
      auth: { getUser },
    } as never);
    const context = await createTRPCContext({ headers: new Headers() });
    expect(context.user).toBeNull();
  });
});
