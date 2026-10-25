import { TRPCError } from "@trpc/server";

import { env } from "~/env";
import { createGemmaClient } from "~/server/ai/gemma";
import {
  chatInputSchema,
  ChatServiceError,
  createChatReply,
} from "~/server/chat";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const gemma = createGemmaClient({
  apiKey: env.GEMINI_API_KEY,
  model: env.GEMMA_MODEL,
});

export const chatRouter = createTRPCRouter({
  send: publicProcedure.input(chatInputSchema).mutation(async ({ input }) => {
    try {
      return await createChatReply(input, (request) =>
        gemma.generateText(request),
      );
    } catch (error) {
      if (error instanceof ChatServiceError) {
        throw new TRPCError({
          code:
            error.code === "rate_limited"
              ? "TOO_MANY_REQUESTS"
              : "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Legal Seagull could not answer right now. Please try again.",
      });
    }
  }),
});
