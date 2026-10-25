import { z } from "zod";

import { verifyUnsubscribeSignature } from "~/server/ordinances/digest-email";
import { db } from "~/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const inputSchema = z.object({
  u: z.string().uuid(),
  t: z.string().regex(/^[a-f0-9]{64}$/i),
});

function html(body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Ledgerline email preferences</title><body style="margin:0;background:#f3efe5;color:#19372d;font-family:Georgia,serif"><main style="max-width:560px;margin:12vh auto;padding:32px;background:#fffdf7;border-radius:14px"><p style="font:11px monospace;letter-spacing:2px;text-transform:uppercase">Ledgerline</p>${body}</main></body></html>`,
    {
      status,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

function readInput(url: URL, body?: URLSearchParams) {
  return inputSchema.safeParse({
    u: body?.get("u") ?? url.searchParams.get("u"),
    t: body?.get("t") ?? url.searchParams.get("t"),
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const input = readInput(url);
  if (!input.success || !verifyUnsubscribeSignature(input.data.u, input.data.t))
    return html(
      "<h1>Link unavailable</h1><p>This email preference link is invalid or expired.</p>",
      400,
    );
  return html(
    `<h1>Unsubscribe from weekly ordinance emails?</h1><p>You can turn this email off for your Ledgerline account.</p><form method="post" action="/api/digest/unsubscribe"><input type="hidden" name="u" value="${input.data.u}"><input type="hidden" name="t" value="${input.data.t}"><button style="border:0;border-radius:999px;background:#19372d;color:#fffdf7;padding:12px 20px;font:inherit;cursor:pointer">Unsubscribe</button></form>`,
  );
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const form = new URLSearchParams(await request.text());
  const input = readInput(url, form);
  if (!input.success || !verifyUnsubscribeSignature(input.data.u, input.data.t))
    return html(
      "<h1>Link unavailable</h1><p>This email preference link is invalid or expired.</p>",
      400,
    );
  await db.$executeRaw`
    UPDATE public.user_profiles
    SET weekly_digest_enabled = false, updated_at = now()
    WHERE id = ${input.data.u}::uuid
  `;
  return html(
    "<h1>You’re unsubscribed</h1><p>You will no longer receive weekly ordinance emails. You can opt in again from your profile preferences.</p>",
  );
}
