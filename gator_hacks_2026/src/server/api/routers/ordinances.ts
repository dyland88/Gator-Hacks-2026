import { TRPCError } from "@trpc/server";

import { normalizeMunicipality } from "~/lib/municipality";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { queryOrdinanceChanges } from "~/server/ordinances/queries";
import { queryInput } from "~/server/ordinances/schema";

const localProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  const { data, error } = await ctx.supabase
    .from("user_profiles")
    .select("location, location_id")
    .eq("id", ctx.user.id)
    .maybeSingle();
  if (error)
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Your location could not be loaded.",
    });
  const identity = data?.location_id
    ? normalizeMunicipality(data.location)
    : null;
  try {
    const municipality = identity
      ? await ctx.db.municipality.findUnique({ where: { key: identity.key } })
      : null;
    return next({ ctx: { ...ctx, municipality } });
  } catch {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Local ordinances could not be loaded.",
    });
  }
});

export const ordinancesRouter = createTRPCRouter({
  list: localProcedure.input(queryInput).query(async ({ ctx, input }) => {
    if (!ctx.municipality) return { items: [], nextCursor: undefined };
    try {
      const rows = await ctx.db.ordinance.findMany({
        where: {
          municipalityId: ctx.municipality.id,
          stage: input.stage,
          topics: input.topic ? { has: input.topic } : undefined,
          latestActivity: { gte: input.from, lte: input.to },
        },
        orderBy: [{ latestActivity: "desc" }, { id: "desc" }],
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        skip: input.cursor ? 1 : undefined,
      });
      const items = rows.slice(0, input.limit);
      return {
        items,
        nextCursor: rows.length > input.limit ? items.at(-1)?.id : undefined,
      };
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Local ordinances could not be loaded.",
      });
    }
  }),
  changes: localProcedure.input(queryInput).query(async ({ ctx, input }) => {
    if (!ctx.municipality) return { items: [], nextCursor: undefined };
    try {
      return await queryOrdinanceChanges([ctx.municipality.id], input, ctx.db);
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Ordinance changes could not be loaded.",
      });
    }
  }),
});
