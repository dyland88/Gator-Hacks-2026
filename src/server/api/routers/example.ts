import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => ({ greeting: `Hello, ${input.text}` })),

  getSecretMessage: protectedProcedure.query(() => {
    return "You are logged in and can see this.";
  }),
});
