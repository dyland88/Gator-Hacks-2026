import { sendWeeklyOrdinanceDigests } from "~/server/ordinances/digest-email";
import { cronAuthorized, jsonResponse } from "~/server/ordinances/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!cronAuthorized(request))
    return jsonResponse({ error: "Unauthorized" }, 401);
  try {
    const result = await sendWeeklyOrdinanceDigests();
    return jsonResponse(result, result.failed || result.unknown ? 502 : 200);
  } catch {
    return jsonResponse(
      { error: "Weekly ordinance emails could not be sent." },
      503,
    );
  }
}
