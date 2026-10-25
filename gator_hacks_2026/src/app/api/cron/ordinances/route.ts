import { submitDailyIngestion } from "~/server/ordinances/ingestion";
import { cronAuthorized, jsonResponse } from "~/server/ordinances/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  if (!cronAuthorized(request))
    return jsonResponse({ error: "Unauthorized" }, 401);
  try {
    const result = await submitDailyIngestion();
    return jsonResponse(
      result,
      ["failed", "submission_unknown"].includes(result.status) ? 502 : 200,
    );
  } catch {
    return jsonResponse({ error: "Ordinance ingestion could not start." }, 503);
  }
}
