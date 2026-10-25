import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "~/env";
import { createGemmaClient } from "~/server/ai/gemma";
import {
  chatInputSchema,
  ChatServiceError,
  streamChatReply,
} from "~/server/chat";
import {
  readOrdinanceSources,
  SourceUnavailableError,
} from "~/server/ordinances/source";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type db } from "~/server/db";

const gemma = createGemmaClient({
  apiKey: env.GEMINI_API_KEY,
  model: env.GEMMA_MODEL,
});

async function loadOrdinanceContext(database: typeof db, id: string) {
  const ordinance = await database.ordinance.findUnique({
    where: { id },
    select: {
      name: true,
      sourceIdentifier: true,
      sourceUrl: true,
      municipality: { select: { city: true, state: true } },
      changes: {
        select: { evidenceUrl: true },
        orderBy: [{ activityDate: "desc" }, { id: "desc" }],
        take: 1,
      },
    },
  });
  if (!ordinance) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message:
        "This ordinance is no longer available. Refresh the feed and try again.",
    });
  }
  return {
    name: ordinance.name,
    sourceIdentifier: ordinance.sourceIdentifier,
    municipality: ordinance.municipality,
    sources: await readOrdinanceSources(
      [
        ordinance.changes[0]?.evidenceUrl ?? ordinance.sourceUrl,
        ordinance.sourceUrl,
      ],
      ordinance.sourceIdentifier,
    ),
  };
}

function toTRPCError(error: unknown) {
  if (error instanceof TRPCError) return error;
  if (error instanceof SourceUnavailableError) {
    return new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message:
        "Legal Seagull could not read the original source right now. Please try again.",
    });
  }
  if (error instanceof ChatServiceError) {
    return new TRPCError({
      code:
        error.code === "rate_limited"
          ? "TOO_MANY_REQUESTS"
          : "INTERNAL_SERVER_ERROR",
      message: error.message,
    });
  }
  return new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "Legal Seagull could not answer right now. Please try again.",
  });
}

export const chatRouter = createTRPCRouter({
  send: publicProcedure.input(chatInputSchema).mutation(async function* ({
    ctx,
    input,
  }) {
    try {
      const context = input.ordinanceId
        ? await loadOrdinanceContext(ctx.db, input.ordinanceId)
        : undefined;
      for await (const text of streamChatReply(
        input,
        (request) => gemma.streamText(request),
        context,
      )) {
        yield text;
      }
    } catch (error) {
      throw toTRPCError(error);
    }
  }),
  prefetchSource: publicProcedure
    .input(z.object({ ordinanceId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await loadOrdinanceContext(ctx.db, input.ordinanceId);
        return { ready: true };
      } catch {
        return { ready: false };
      }
    }),
});
