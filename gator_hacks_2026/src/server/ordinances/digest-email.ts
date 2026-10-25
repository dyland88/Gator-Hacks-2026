import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { env } from "~/env";
import { normalizeMunicipality } from "~/lib/municipality";
import { db } from "~/server/db";
import { getDigestChanges } from "./queries";

type Recipient = {
  userId: string;
  email: string;
  location: string | null;
  tags: string[];
};

type DigestChange = Awaited<
  ReturnType<typeof getDigestChanges>
>["items"][number];

function completedWeek(reference: Date) {
  const thisMonday = new Date(
    Date.UTC(
      reference.getUTCFullYear(),
      reference.getUTCMonth(),
      reference.getUTCDate(),
    ),
  );
  thisMonday.setUTCDate(
    thisMonday.getUTCDate() - ((thisMonday.getUTCDay() + 6) % 7),
  );
  const weekStart = new Date(thisMonday);
  weekStart.setUTCDate(weekStart.getUTCDate() - 7);
  const weekEnd = new Date(thisMonday);
  weekEnd.setUTCDate(weekEnd.getUTCDate() - 1);
  return {
    from: weekStart.toISOString().slice(0, 10),
    to: weekEnd.toISOString().slice(0, 10),
    weekStart: weekStart.toISOString().slice(0, 10),
  };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return replacements[character] ?? character;
  });
}

function safeUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function createUnsubscribeSignature(userId: string) {
  if (!env.CRON_SECRET) throw new Error("Digest signing is not configured.");
  return createHmac("sha256", env.CRON_SECRET).update(userId).digest("hex");
}

export function verifyUnsubscribeSignature(userId: string, signature: string) {
  if (!env.CRON_SECRET || !/^[a-f0-9]{64}$/i.test(signature)) return false;
  const expected = Buffer.from(createUnsubscribeSignature(userId), "hex");
  const actual = Buffer.from(signature, "hex");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

async function changesForMunicipality(
  municipalityId: string,
  range: ReturnType<typeof completedWeek>,
) {
  const changes: DigestChange[] = [];
  let cursor: string | undefined;
  while (changes.length < 500) {
    const page = await getDigestChanges({
      municipalityIds: [municipalityId],
      from: range.from,
      to: range.to,
      cursor,
      limit: Math.min(100, 500 - changes.length),
    });
    changes.push(...page.items);
    cursor = page.nextCursor;
    if (!cursor) break;
  }
  return changes;
}

function emailMarkup(
  recipient: Recipient,
  changes: DigestChange[],
  range: ReturnType<typeof completedWeek>,
  unsubscribeUrl: string,
) {
  const municipality = changes[0]?.ordinance.municipality.label ?? "your area";
  const entries = changes
    .map((change) => {
      const title = escapeHtml(change.ordinance.name);
      const date = escapeHtml(change.activityDate);
      const type = escapeHtml(change.activityType);
      const description = escapeHtml(change.description);
      const url = safeUrl(change.evidenceUrl);
      const link = url
        ? `<a href="${escapeHtml(url)}">View official source</a>`
        : "Official source link unavailable";
      return `<li style="margin:0 0 22px"><p style="margin:0 0 5px;color:#56645c;font-size:13px">${date} · ${type}</p><h2 style="margin:0 0 8px;font-size:18px">${title}</h2><p style="margin:0 0 8px;line-height:1.55">${description}</p><p style="margin:0">${link}</p></li>`;
    })
    .join("");
  const text = changes
    .map((change) => {
      const url = safeUrl(change.evidenceUrl);
      return `${change.activityDate} · ${change.activityType}\n${change.ordinance.name}\n${change.description}${url ? `\nOfficial source: ${url}` : ""}`;
    })
    .join("\n\n");
  return {
    subject: `Your weekly ordinance update for ${municipality}`,
    html: `<div style="margin:0;background:#f3efe5;padding:28px 12px;color:#19372d;font-family:Georgia,serif"><div style="max-width:620px;margin:auto;background:#fffdf7;padding:32px;border-radius:14px"><p style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase">Ledgerline · Local government</p><h1 style="font-size:30px;line-height:1.15">This week in ${escapeHtml(municipality)}</h1><p style="color:#56645c;line-height:1.6">${range.from} through ${range.to}: ${changes.length} ordinance ${changes.length === 1 ? "update" : "updates"} matching your saved location${recipient.tags.length ? " and topics" : ""}.</p><ol style="padding-left:20px">${entries}</ol><hr style="border:0;border-top:1px solid #dedbd1;margin:28px 0"><p style="font-size:12px;line-height:1.6;color:#56645c">You received this because you opted in to Ledgerline's weekly ordinance email. <a href="${escapeHtml(unsubscribeUrl)}">Manage this email preference</a>.</p></div></div>`,
    text: `This week in ${municipality}\n${range.from} through ${range.to}\n\n${text}\n\nUnsubscribe: ${unsubscribeUrl}`,
  };
}

async function sendEmail(input: {
  recipient: Recipient;
  changes: DigestChange[];
  range: ReturnType<typeof completedWeek>;
}) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.APP_URL)
    throw new Error("Weekly email delivery is not configured.");
  const unsubscribe = new URL("/api/digest/unsubscribe", env.APP_URL);
  unsubscribe.searchParams.set("u", input.recipient.userId);
  unsubscribe.searchParams.set(
    "t",
    createUnsubscribeSignature(input.recipient.userId),
  );
  const message = emailMarkup(
    input.recipient,
    input.changes,
    input.range,
    unsubscribe.href,
  );
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `weekly-ordinance-digest/${input.recipient.userId}/${input.range.weekStart}`,
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [input.recipient.email],
      subject: message.subject,
      html: message.html,
      text: message.text,
      headers: {
        "List-Unsubscribe": `<${unsubscribe.href}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`resend_http_${response.status}`);
  const result = (await response.json()) as { id?: string };
  return result.id ?? null;
}

async function claimDelivery(userId: string, weekStart: string) {
  const rows = await db.$queryRaw<{ user_id: string }[]>`
    INSERT INTO public.weekly_digest_deliveries (user_id, week_start, status)
    VALUES (${userId}::uuid, ${weekStart}::date, 'sending')
    ON CONFLICT (user_id, week_start) DO UPDATE
      SET status = 'sending', failure_code = NULL, updated_at = now()
      WHERE public.weekly_digest_deliveries.status = 'failed'
    RETURNING user_id
  `;
  return rows.length > 0;
}

async function setDeliveryStatus(
  userId: string,
  weekStart: string,
  status: "sent" | "failed" | "unknown",
  providerEmailId?: string | null,
  failureCode?: string,
) {
  await db.$executeRaw`
    UPDATE public.weekly_digest_deliveries
    SET status = ${status},
        provider_email_id = ${providerEmailId ?? null},
        failure_code = ${failureCode ?? null},
        updated_at = now(),
        sent_at = CASE WHEN ${status} = 'sent' THEN now() ELSE NULL END
    WHERE user_id = ${userId}::uuid AND week_start = ${weekStart}::date
  `;
}

export async function sendWeeklyOrdinanceDigests(reference = new Date()) {
  if (
    !env.RESEND_API_KEY ||
    !env.EMAIL_FROM ||
    !env.APP_URL ||
    !env.CRON_SECRET
  )
    throw new Error("Weekly email delivery is not configured.");
  const range = completedWeek(reference);
  await db.$executeRaw`
    UPDATE public.weekly_digest_deliveries
    SET status = 'unknown', failure_code = 'stale_sending_state', updated_at = now()
    WHERE status = 'sending' AND updated_at < now() - interval '30 minutes'
  `;
  const recipients = await db.$queryRaw<Recipient[]>`
    SELECT p.id AS "userId", u.email, p.location, p.tags
    FROM public.user_profiles AS p
    JOIN auth.users AS u ON u.id = p.id
    WHERE p.weekly_digest_enabled = true
      AND u.email IS NOT NULL
      AND u.email_confirmed_at IS NOT NULL
    ORDER BY p.id
    LIMIT 1000
  `;
  const municipalityChanges = new Map<string, Promise<DigestChange[]>>();
  const sendToRecipient = async (recipient: Recipient) => {
    const identity = normalizeMunicipality(recipient.location);
    if (!identity) return "skipped" as const;
    let changesPromise = municipalityChanges.get(identity.key);
    if (!changesPromise) {
      changesPromise = (async () => {
        const municipality = await db.municipality.findUnique({
          where: { key: identity.key },
          select: { id: true },
        });
        return municipality
          ? changesForMunicipality(municipality.id, range)
          : [];
      })();
      municipalityChanges.set(identity.key, changesPromise);
    }
    const cityChanges = await changesPromise;
    const changes = recipient.tags.length
      ? cityChanges.filter((change) =>
          change.ordinance.topics.some((topic) =>
            recipient.tags.includes(topic),
          ),
        )
      : cityChanges;
    if (!changes.length) return "empty" as const;
    if (!(await claimDelivery(recipient.userId, range.weekStart)))
      return "already-processed" as const;
    try {
      const emailId = await sendEmail({ recipient, changes, range });
      await setDeliveryStatus(
        recipient.userId,
        range.weekStart,
        "sent",
        emailId,
      );
      return "sent" as const;
    } catch (error) {
      const statusCode =
        error instanceof Error
          ? Number(error.message.match(/^resend_http_(\d+)$/)?.[1])
          : undefined;
      const deliveryStatus =
        statusCode !== undefined && statusCode >= 400 && statusCode < 500
          ? "failed"
          : "unknown";
      const failureCode = statusCode
        ? `resend_http_${statusCode}`
        : "delivery_outcome_unknown";
      await setDeliveryStatus(
        recipient.userId,
        range.weekStart,
        deliveryStatus,
        null,
        failureCode,
      );
      return deliveryStatus;
    }
  };
  const results: PromiseSettledResult<
    "skipped" | "empty" | "already-processed" | "sent" | "failed" | "unknown"
  >[] = [];
  let nextRecipient = 0;
  const workers = Array.from(
    { length: Math.min(5, recipients.length) },
    async () => {
      while (nextRecipient < recipients.length) {
        const recipient = recipients[nextRecipient++];
        if (!recipient) continue;
        results.push(
          await Promise.resolve()
            .then(() => sendToRecipient(recipient))
            .then(
              (value) => ({ status: "fulfilled", value }) as const,
              (reason: unknown) => ({ status: "rejected", reason }) as const,
            ),
        );
      }
    },
  );
  await Promise.all(workers);
  const summary = {
    weekStart: range.weekStart,
    scanned: recipients.length,
    sent: 0,
    failed: 0,
    unknown: 0,
    skipped: 0,
  };
  for (const result of results) {
    if (result.status === "rejected") summary.failed += 1;
    else if (result.value === "sent") summary.sent += 1;
    else if (result.value === "failed") summary.failed += 1;
    else if (result.value === "unknown") summary.unknown += 1;
    else if (result.value === "skipped") summary.skipped += 1;
  }
  return summary;
}
