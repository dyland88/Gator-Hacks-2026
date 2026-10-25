import { TRPCError } from "@trpc/server";
import { type Prisma } from "../../../../generated/prisma";
import { z } from "zod";

import { normalizeMunicipality } from "~/lib/municipality";
import { interestOptions } from "~/lib/profile";
import { matchRelevance } from "~/lib/relevance";
import {
  createTRPCRouter,
  dbaProcedure,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { loadLifeCircumstances } from "~/server/ordinances/life-circumstances";
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
  lifeCircumstances: publicProcedure.query(async ({ ctx }) => {
    try {
      return await loadLifeCircumstances(ctx.db);
    } catch {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Life circumstances could not be loaded.",
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
          age: z.number().int().min(1).max(120).nullable().default(null),
          lifeCircumstances: z
            .array(z.string().trim().min(1).max(100))
            .max(20)
            .default([]),
          limit: z.number().int().min(1).max(50).default(12),
          cursor: z.string().uuid().optional(),
          direction: z.literal("forward").optional(),
        })
        .strict(),
    )
    .query(async ({ ctx, input }) => {
      try {
        const where = {
          municipalityId: input.municipalityId,
          topics: input.topics.length
            ? { hasSome: [...new Set(input.topics)] }
            : undefined,
          changes:
            input.section === "amendments"
              ? { some: { activityType: "amendment" } }
              : undefined,
        };
        const select = {
          id: true,
          sourceIdentifier: true,
          name: true,
          description: true,
          stage: true,
          originalStage: true,
          topics: true,
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
        } satisfies Prisma.OrdinanceSelect;
        const personalized =
          input.age !== null || input.lifeCircumstances.length > 0;
        if (!personalized) {
          const rows = await ctx.db.ordinance.findMany({
            where,
            select,
            orderBy: [{ latestActivity: "desc" }, { id: "desc" }],
            take: input.limit + 1,
            cursor: input.cursor ? { id: input.cursor } : undefined,
            skip: input.cursor ? 1 : undefined,
          });
          const items = rows.slice(0, input.limit);
          return {
            items,
            nextCursor:
              rows.length > input.limit ? items.at(-1)?.id : undefined,
          };
        }
        const rows = await ctx.db.ordinance.findMany({
          where,
          select: { ...select, relevanceRules: true },
          orderBy: [{ latestActivity: "desc" }, { id: "desc" }],
        });
        const ranked = rows
          .map(({ relevanceRules, ...row }) => ({
            row,
            score: matchRelevance(relevanceRules, {
              age: input.age,
              lifeCircumstances: input.lifeCircumstances,
            }).length,
          }))
          .sort((a, b) => b.score - a.score);
        const cursorIndex = input.cursor
          ? ranked.findIndex(({ row }) => row.id === input.cursor)
          : -1;
        if (input.cursor && cursorIndex < 0)
          return { items: [], nextCursor: undefined };
        const page = ranked.slice(
          cursorIndex + 1,
          cursorIndex + 1 + input.limit + 1,
        );
        const items = page.slice(0, input.limit).map(({ row }) => row);
        return {
          items,
          nextCursor: page.length > input.limit ? items.at(-1)?.id : undefined,
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
