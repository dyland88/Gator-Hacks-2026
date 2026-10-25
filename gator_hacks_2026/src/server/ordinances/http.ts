import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

import { env } from "~/env";

export function cronAuthorized(request: Request) {
  const actual = request.headers.get("authorization") ?? "";
  const expected = env.CRON_SECRET ? `Bearer ${env.CRON_SECRET}` : "";
  return (
    Boolean(expected) &&
    Buffer.byteLength(actual) === Buffer.byteLength(expected) &&
    timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
  );
}

export function verifyWebhook(
  body: string,
  signature: string | null,
  secret = env.FIRECRAWL_WEBHOOK_SECRET,
) {
  if (!secret || !signature || !/^sha256=[a-f0-9]{64}$/i.test(signature))
    return false;
  const actual = Buffer.from(signature.slice(7), "hex");
  const expected = createHmac("sha256", secret).update(body).digest();
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export const webhookSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    "agent.started",
    "agent.action",
    "agent.completed",
    "agent.failed",
    "agent.cancelled",
  ]),
  success: z.boolean(),
  metadata: z.object({ runId: z.string().uuid().optional() }).optional(),
  data: z
    .array(
      z.object({
        data: z.unknown().optional(),
        creditsUsed: z.number().finite().nonnegative().optional(),
      }),
    )
    .max(1),
});

export function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
