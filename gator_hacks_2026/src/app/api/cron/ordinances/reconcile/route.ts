import { reconcileIngestion } from "~/server/ordinances/ingestion";
import { cronAuthorized, jsonResponse } from "~/server/ordinances/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!cronAuthorized(request))
    return jsonResponse({ error: "Unauthorized" }, 401);
  try {
    return jsonResponse({ runs: await reconcileIngestion() });
  } catch {
    return jsonResponse(
      { error: "Ordinance reconciliation could not finish." },
      503,
    );
  }
}
