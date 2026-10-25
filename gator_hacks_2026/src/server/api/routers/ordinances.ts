import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { normalizeMunicipality } from "~/lib/municipality";
import { interestOptions } from "~/lib/profile";
import {
  createTRPCRouter,
  dbaProcedure,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { submitCityIngestion } from "~/server/ordinances/ingestion";
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
  locations: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.municipality.findMany({
        where: { ordinances: { some: {} } },
        select: { id: true, key: true, city: true, state: true, label: true },
        orderBy: [{ city: "asc" }, { state: "asc" }],
      });
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Available locations could not be loaded.",
      });
    }
  }),
  feed: publicProcedure
    .input(
      z
        .object({
          municipalityId: z.string().uuid(),
          topics: z
            .array(z.enum(interestOptions))
            .max(interestOptions.length)
            .default([]),
          section: z.enum(["bills", "amendments"]).default("bills"),
          limit: z.number().int().min(1).max(50).default(12),
          cursor: z.string().uuid().optional(),
          direction: z.literal("forward").optional(),
        })
        .strict(),
    )
    .query(async ({ ctx, input }) => {
      try {
        const rows = await ctx.db.ordinance.findMany({
          where: {
            municipalityId: input.municipalityId,
            topics: input.topics.length
              ? { hasSome: [...new Set(input.topics)] }
              : undefined,
            changes:
              input.section === "amendments"
                ? { some: { activityType: "amendment" } }
                : undefined,
          },
          select: {
            id: true,
            sourceIdentifier: true,
            name: true,
            description: true,
            stage: true,
            originalStage: true,
            topics: true,
            relevanceRules: true,
            sourceUrl: true,
            latestActivity: true,
            adoptedDate: true,
            effectiveDate: true,
            municipality: {
              select: { id: true, city: true, state: true, label: true },
            },
            changes: {
              where:
                input.section === "amendments"
                  ? { activityType: "amendment" }
                  : undefined,
              select: {
                activityDate: true,
                activityType: true,
                description: true,
                evidenceUrl: true,
              },
              orderBy: [{ activityDate: "desc" }, { id: "desc" }],
              take: 1,
            },
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
          message: "The legislative feed could not be loaded.",
        });
      }
    }),
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
  startCityIngestion: dbaProcedure
    .input(
      z
        .object({
          city: z.string().trim().min(1).max(100),
          state: z.string().trim().min(2).max(40),
          lookbackDays: z.number().int().min(1).max(365).default(30),
        })
        .strict(),
    )
    .mutation(async ({ ctx, input }) => {
      const city = normalizeMunicipality(
        `${input.city}, ${input.state}, United States`,
      );
      if (!city)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Enter a city and a U.S. state or state code.",
        });
      try {
        return await submitCityIngestion(
          { city, lookbackDays: input.lookbackDays },
          new Date(),
          ctx.db,
        );
      } catch {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "City ingestion could not be started.",
        });
      }
    }),
});
