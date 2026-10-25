import { z } from "zod";

import { type PrismaClient } from "../../../generated/prisma";
import { cityResearchLookbackDays } from "~/lib/city-research";
import { type MunicipalityIdentity } from "~/lib/municipality";
import { activeStatuses, submitCityIngestion } from "./ingestion";

const researchedStatuses = ["completed", "partial"];
const citiesSchema = z.array(z.object({ key: z.string() }));

function keysOf(cities: unknown) {
  const parsed = citiesSchema.safeParse(cities);
  return parsed.success ? parsed.data.map((city) => city.key) : [];
}

export async function researchedMunicipalityKeys(database: PrismaClient) {
  const runs = await database.ingestionRun.findMany({
    where: { status: { in: researchedStatuses } },
    select: { cities: true },
  });
  return [...new Set(runs.flatMap((run) => keysOf(run.cities)))];
}

export type CityResearchRequest =
  { status: "exists"; key: string } | { status: "started"; runId: string };

export async function requestCityResearch(
  city: MunicipalityIdentity,
  database: PrismaClient,
  now = new Date(),
): Promise<CityResearchRequest> {
  const runs = await database.ingestionRun.findMany({
    where: { status: { in: [...researchedStatuses, ...activeStatuses] } },
    select: { id: true, status: true, cities: true },
    orderBy: { createdAt: "desc" },
  });
  const matches = runs.filter((run) => keysOf(run.cities).includes(city.key));
  const active = matches.find((run) => activeStatuses.includes(run.status));
  if (active) return { status: "started", runId: active.id };
  if (matches.some((run) => researchedStatuses.includes(run.status)))
    return { status: "exists", key: city.key };
  const run = await submitCityIngestion(
    { city, lookbackDays: cityResearchLookbackDays },
    now,
    database,
  );
  return { status: "started", runId: run.runId };
}

export async function findCityResearchRun(
  runId: string,
  database: PrismaClient,
) {
  return database.ingestionRun.findUnique({
    where: { id: runId },
    select: { status: true, failureCode: true },
  });
}
