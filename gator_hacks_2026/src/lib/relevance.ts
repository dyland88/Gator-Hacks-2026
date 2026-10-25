import { z } from "zod";

import { lifeCircumstancesSchema } from "~/lib/profile";

export const relevanceRuleSchema = z
  .object({
    ageMin: z.number().int().min(0).max(120).nullable(),
    ageMax: z.number().int().min(0).max(120).nullable(),
    lifeCircumstances: lifeCircumstancesSchema,
    evidenceExcerpt: z.string().trim().min(1).max(2000),
    evidenceUrl: z.string().url().startsWith("https://").optional(),
  })
  .strict()
  .refine(
    (rule) =>
      rule.ageMin === null ||
      rule.ageMax === null ||
      rule.ageMin <= rule.ageMax,
    "Minimum age must not exceed maximum age",
  )
  .refine(
    (rule) =>
      rule.ageMin !== null ||
      rule.ageMax !== null ||
      rule.lifeCircumstances.length > 0,
    "An affected group is required",
  );

export const relevanceRulesSchema = z.array(relevanceRuleSchema).max(20);

export function matchRelevance(
  rules: unknown,
  profile: { age: number | null; lifeCircumstances: string[] },
) {
  const parsed = relevanceRulesSchema.safeParse(rules);
  if (!parsed.success) return [];
  return parsed.data.flatMap((rule) => {
    const hasAge = rule.ageMin !== null || rule.ageMax !== null;
    if (
      hasAge &&
      (profile.age === null ||
        profile.age < (rule.ageMin ?? 0) ||
        profile.age > (rule.ageMax ?? 120))
    )
      return [];
    if (
      !rule.lifeCircumstances.every((value) =>
        profile.lifeCircumstances.includes(value),
      )
    )
      return [];
    const ageLabel = hasAge
      ? rule.ageMin === null
        ? `Ages ${rule.ageMax} and under`
        : rule.ageMax === null
          ? `Ages ${rule.ageMin}+`
          : `Ages ${rule.ageMin}–${rule.ageMax}`
      : null;
    return [
      {
        label: [ageLabel, ...rule.lifeCircumstances]
          .filter(Boolean)
          .join(" · "),
        evidenceExcerpt: rule.evidenceExcerpt,
        evidenceUrl: rule.evidenceUrl,
      },
    ];
  });
}
