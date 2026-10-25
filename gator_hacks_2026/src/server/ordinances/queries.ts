import "server-only";

import { z } from "zod";

import { db } from "~/server/db";
import { dateSchema, queryInput } from "./schema";

export async function queryOrdinanceChanges(
  municipalityIds: string[],
  input: z.infer<typeof queryInput>,
  database = db,
) {
  const rows = await database.ordinanceChange.findMany({
    where: {
      ordinance: {
        municipalityId: { in: municipalityIds },
        stage: input.stage,
        topics: input.topic ? { has: input.topic } : undefined,
      },
      activityDate: { gte: input.from, lte: input.to },
    },
    include: { ordinance: { include: { municipality: true } } },
    orderBy: [{ activityDate: "desc" }, { id: "desc" }],
    take: input.limit + 1,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    skip: input.cursor ? 1 : undefined,
  });
  const hasMore = rows.length > input.limit;
  const items = rows.slice(0, input.limit);
  return { items, nextCursor: hasMore ? items.at(-1)?.id : undefined };
}

export async function getDigestChanges(input: {
  municipalityIds: string[];
  from: string;
  to: string;
  cursor?: string;
  limit?: number;
}) {
  const municipalityIds = z
    .array(z.string().uuid())
    .max(1000)
    .parse(input.municipalityIds);
  const range = queryInput.parse({
    from: dateSchema.parse(input.from),
    to: dateSchema.parse(input.to),
    cursor: input.cursor,
    limit: input.limit ?? 100,
  });
  return queryOrdinanceChanges(municipalityIds, range);
}
