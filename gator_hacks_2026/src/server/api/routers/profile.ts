import { TRPCError } from "@trpc/server";

import { profileInputSchema } from "~/lib/profile";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("user_profiles")
      .select("*")
      .eq("id", ctx.user.id)
      .maybeSingle();
    if (error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Your preferences could not be loaded. Please try again.",
      });
    return data;
  }),
  save: protectedProcedure
    .input(profileInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from("user_profiles")
        .upsert(
          {
            id: ctx.user.id,
            tags: input.tags,
            age: input.age,
            location: input.location === "" ? null : input.location,
            location_id: input.locationId === "" ? null : input.locationId,
            gender: input.gender,
          },
          { onConflict: "id" },
        )
        .select("*")
        .single();
      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Your preferences could not be saved. Please try again.",
        });
      return data;
    }),
});
