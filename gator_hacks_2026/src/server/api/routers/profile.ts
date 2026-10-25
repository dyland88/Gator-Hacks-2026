import { TRPCError } from "@trpc/server";

import { profileInputSchema } from "~/lib/profile";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { loadLifeCircumstances } from "~/server/ordinances/life-circumstances";
import {
  sendPreferenceOrdinanceDigest,
  sendSignupOrdinanceDigest,
} from "~/server/ordinances/digest-email";

const profileFields =
  "id,tags,age,life_circumstances,weekly_digest_enabled,location,location_id,created_at,updated_at";

function sameValues(left: string[] | null | undefined, right: string[]) {
  return (
    left !== null &&
    left !== undefined &&
    left.length === right.length &&
    right.every((value) => left.includes(value))
  );
}

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
      const known = new Set(
        (await loadLifeCircumstances(ctx.db)).map((option) => option.key),
      );
      if (input.lifeCircumstances.some((value) => !known.has(value)))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Choose life circumstances from the current list.",
        });
      const { data: previous, error: previousError } = await ctx.supabase
        .from("user_profiles")
        .select(
          "weekly_digest_enabled,tags,age,life_circumstances,location,location_id",
        )
        .eq("id", ctx.user.id)
        .maybeSingle();
      if (previousError)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Your preferences could not be saved. Please try again.",
        });
      const location = input.location === "" ? null : input.location;
      const locationId = input.locationId === "" ? null : input.locationId;
      const preferencesChanged =
        !previous ||
        previous.age !== input.age ||
        !sameValues(previous.tags, input.tags) ||
        !sameValues(previous.life_circumstances, input.lifeCircumstances) ||
        previous.location !== location ||
        previous.location_id !== locationId;
      const { data, error } = await ctx.supabase
        .from("user_profiles")
        .upsert(
          {
            id: ctx.user.id,
            tags: input.tags,
            age: input.age,
            life_circumstances: input.lifeCircumstances,
            weekly_digest_enabled: input.weeklyDigestEnabled,
            location,
            location_id: locationId,
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
      let signupDigestStatus:
        | "sent"
        | "failed"
        | "unknown"
        | "skipped"
        | "already-processed"
        | "unconfirmed"
        | null = null;
      if (input.weeklyDigestEnabled) {
        if (!ctx.user.email || !ctx.user.email_confirmed_at) {
          signupDigestStatus = "unconfirmed";
        } else {
          try {
            const recipient = {
              userId: ctx.user.id,
              email: ctx.user.email,
              location: data.location,
              tags: data.tags,
            };
            if (!previous?.weekly_digest_enabled) {
              signupDigestStatus = await sendSignupOrdinanceDigest(
                recipient,
                new Date(),
                true,
              );
            } else if (preferencesChanged) {
              signupDigestStatus = await sendPreferenceOrdinanceDigest(
                recipient,
                data.updated_at,
              );
            } else {
              signupDigestStatus = await sendSignupOrdinanceDigest(
                recipient,
              );
            }
          } catch {
            signupDigestStatus = "failed";
          }
        }
      }
      return { ...data, signupDigestStatus };
    }),
});
