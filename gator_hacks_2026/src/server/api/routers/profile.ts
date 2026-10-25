import { TRPCError } from "@trpc/server";

import { profileInputSchema } from "~/lib/profile";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const profileFields =
  "id,tags,age,life_circumstances,location,location_id,created_at,updated_at";

export const profileRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await ctx.supabase
      .from("user_profiles")
      .select(profileFields)
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
            life_circumstances: input.lifeCircumstances,
            location: input.location === "" ? null : input.location,
            location_id: input.locationId === "" ? null : input.locationId,
          },
          { onConflict: "id" },
        )
        .select(profileFields)
        .single();
      if (error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Your preferences could not be saved. Please try again.",
        });
      return data;
    }),
});
