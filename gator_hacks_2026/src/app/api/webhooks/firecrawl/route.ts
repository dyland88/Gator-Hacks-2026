import { completeIngestion } from "~/server/ordinances/ingestion";
import {
  jsonResponse,
  verifyWebhook,
  webhookSchema,
} from "~/server/ordinances/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length")) > 4_000_000)
    return jsonResponse({ error: "Payload too large" }, 413);
  const body = await request.text();
  if (Buffer.byteLength(body) > 4_000_000)
    return jsonResponse({ error: "Payload too large" }, 413);
  if (!verifyWebhook(body, request.headers.get("x-firecrawl-signature")))
    return jsonResponse({ error: "Unauthorized" }, 401);
  let raw: unknown;
  try {
    raw = JSON.parse(body) as unknown;
  } catch {
    return jsonResponse({ error: "Invalid webhook" }, 400);
  }
  const parsed = webhookSchema.safeParse(raw);
  if (!parsed.success) return jsonResponse({ error: "Invalid webhook" }, 400);
  const event = parsed.data;
  if (event.type === "agent.action" || event.type === "agent.started")
    return jsonResponse({ status: "ignored" });
  try {
    const result = await completeIngestion({
      jobId: event.id,
      runId: event.metadata?.runId,
      status:
        event.type === "agent.completed" && event.success
          ? "completed"
          : "failed",
      data: event.data[0]?.data,
      creditsUsed: event.data[0]?.creditsUsed,
    });
    return jsonResponse(
      { status: result },
      result === "unknown_job" ? 409 : 200,
    );
  } catch {
    return jsonResponse({ error: "Webhook processing could not finish." }, 503);
  }
}
