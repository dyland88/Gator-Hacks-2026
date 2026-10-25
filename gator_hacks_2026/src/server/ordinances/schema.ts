import { z } from "zod";

import { interestOptions } from "~/lib/profile";

export const stages = [
  "introduced",
  "under_review",
  "hearing",
  "adopted",
  "rejected",
  "withdrawn",
  "effective",
  "repealed",
  "unknown",
] as const;
export const activities = [
  "introduction",
  "amendment",
  "hearing",
  "vote",
  "adoption",
  "rejection",
  "withdrawal",
  "repeal",
  "effective_date_change",
  "effective",
] as const;

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      Number.isFinite(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
    );
  }, "Invalid calendar date");

export function normalizeSourceUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" || url.username || url.password || url.port)
    throw new Error("Invalid evidence URL");
  const host = url.hostname.toLowerCase();
  if (
    !host.includes(".") ||
    host === "localhost" ||
    host.endsWith(".local") ||
    /^[\d.]+$/.test(host) ||
    host.includes(":")
  )
    throw new Error("Invalid evidence host");
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  url.pathname = url.pathname.replace(/\/$/, "") || "/";
  return url.toString();
}

export function checkedSourceOrigin(value: string) {
  const url = new URL(value);
  const civicClerk = /^([a-z0-9-]+)\.(?:portal|api)\.civicclerk\.com$/.exec(
    url.hostname,
  );
  return civicClerk
    ? `https://${civicClerk[1]}.portal.civicclerk.com`
    : url.origin;
}

const sourceUrl = z
  .string()
  .url()
  .max(2000)
  .transform((value, ctx) => {
    try {
      return normalizeSourceUrl(value);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid evidence URL",
      });
      return z.NEVER;
    }
  });

export const changeSchema = z.object({
  sourceIdentifier: z.string().trim().min(1).max(200).nullable(),
  name: z.string().trim().min(1).max(500),
  description: z.string().trim().min(1).max(6000),
  stage: z.enum(stages),
  originalStage: z.string().trim().min(1).max(300),
  topics: z.array(z.enum(interestOptions)).max(8),
  sourceUrl,
  adoptedDate: dateSchema.nullable(),
  effectiveDate: dateSchema.nullable(),
  activityType: z.enum(activities),
  activityDate: dateSchema,
  activityAt: z.string().datetime({ offset: true }).nullable(),
  changeDescription: z.string().trim().min(1).max(6000),
  evidenceUrl: sourceUrl,
  evidenceExcerpt: z.string().trim().min(1).max(4000),
});

export const cityResultSchema = z.object({
  municipalityKey: z.string().max(300),
  coverage: z.enum(["complete", "partial", "unavailable"]),
  sourcesChecked: z
    .array(
      z.object({
        url: sourceUrl,
        publisher: z.enum(["municipality", "official_legislative_platform"]),
      }),
    )
    .max(100),
  changes: z.array(z.unknown()).max(1000),
});

export const resultSchema = z.object({
  cities: z.array(z.unknown()).max(1000),
});

export const agentJsonSchema = {
  type: "object",
  required: ["cities"],
  properties: {
    cities: {
      type: "array",
      items: {
        type: "object",
        required: ["municipalityKey", "coverage", "sourcesChecked", "changes"],
        properties: {
          municipalityKey: { type: "string" },
          coverage: {
            type: "string",
            enum: ["complete", "partial", "unavailable"],
          },
          sourcesChecked: {
            type: "array",
            items: {
              type: "object",
              required: ["url", "publisher"],
              properties: {
                url: { type: "string" },
                publisher: {
                  type: "string",
                  enum: ["municipality", "official_legislative_platform"],
                },
              },
            },
          },
          changes: {
            type: "array",
            items: {
              type: "object",
              required: [
                "sourceIdentifier",
                "name",
                "description",
                "stage",
                "originalStage",
                "topics",
                "sourceUrl",
                "adoptedDate",
                "effectiveDate",
                "activityType",
                "activityDate",
                "activityAt",
                "changeDescription",
                "evidenceUrl",
                "evidenceExcerpt",
              ],
              properties: {
                sourceIdentifier: { type: ["string", "null"] },
                name: { type: "string" },
                description: { type: "string" },
                stage: { type: "string", enum: stages },
                originalStage: { type: "string" },
                topics: {
                  type: "array",
                  items: { type: "string", enum: interestOptions },
                },
                sourceUrl: { type: "string" },
                adoptedDate: {
                  type: ["string", "null"],
                  description: "YYYY-MM-DD or null",
                },
                effectiveDate: {
                  type: ["string", "null"],
                  description: "YYYY-MM-DD or null",
                },
                activityType: { type: "string", enum: activities },
                activityDate: {
                  type: "string",
                  description: "Source-supported YYYY-MM-DD activity date",
                },
                activityAt: {
                  type: ["string", "null"],
                  description:
                    "ISO timestamp with offset ONLY if source gives exact time, otherwise null",
                },
                changeDescription: { type: "string" },
                evidenceUrl: { type: "string" },
                evidenceExcerpt: {
                  type: "string",
                  description:
                    "Short source excerpt supporting the dated activity and stage",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const queryInput = z
  .object({
    limit: z.number().int().min(1).max(100).default(25),
    cursor: z.string().uuid().optional(),
    from: dateSchema.optional(),
    to: dateSchema.optional(),
    stage: z.enum(stages).optional(),
    topic: z.enum(interestOptions).optional(),
  })
  .strict()
  .refine(
    (input) => !input.from || !input.to || input.from <= input.to,
    "Invalid date range",
  );

export type ExtractedChange = z.infer<typeof changeSchema>;

export function withinWindow(change: ExtractedChange, start: Date, end: Date) {
  if (change.activityAt) {
    const time = new Date(change.activityAt).getTime();
    return (
      change.activityAt.slice(0, 10) === change.activityDate &&
      time >= start.getTime() &&
      time < end.getTime()
    );
  }
  const day = new Date(`${change.activityDate}T00:00:00.000Z`).getTime();
  return day < end.getTime() && day + 86_400_000 > start.getTime();
}
