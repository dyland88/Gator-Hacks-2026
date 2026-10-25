import "server-only";

import { type PrismaClient } from "../../../generated/prisma";
import { db } from "~/server/db";

export type LifeCircumstanceOption = {
  key: string;
  label: string;
  description: string;
};

export async function loadLifeCircumstances(
  database: Pick<PrismaClient, "lifeCircumstance"> = db,
): Promise<LifeCircumstanceOption[]> {
  return database.lifeCircumstance.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { key: "asc" }],
    select: { key: true, label: true, description: true },
  });
}
