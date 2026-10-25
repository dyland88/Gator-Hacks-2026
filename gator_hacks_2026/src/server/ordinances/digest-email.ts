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

type DigestKind = "weekly" | "signup" | "preference";
type DigestRange = { from: string; to: string; weekStart: string };

function mondayOf(reference: Date) {
  const monday = new Date(
    Date.UTC(
      reference.getUTCFullYear(),
      reference.getUTCMonth(),
      reference.getUTCDate(),
    ),
  );
  monday.setUTCDate(monday.getUTCDate() - ((monday.getUTCDay() + 6) % 7));
  return monday;
}

function completedWeek(reference: Date) {
  const thisMonday = mondayOf(reference);
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

function trailingMonth(reference: Date): DigestRange {
  const end = new Date(
    Date.UTC(
      reference.getUTCFullYear(),
      reference.getUTCMonth(),
      reference.getUTCDate(),
    ),
  );
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 29);
  return {
    from: start.toISOString().slice(0, 10),
    to: end.toISOString().slice(0, 10),
    weekStart: mondayOf(reference).toISOString().slice(0, 10),
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
  const activityPriority: Record<DigestChange["activityType"], number> = {
    introduction: 0,
    hearing: 1,
    amendment: 2,
    vote: 3,
    adoption: 4,
    rejection: 4,
    withdrawal: 4,
    repeal: 5,
    effective_date_change: 6,
    effective: 7,
  };
  const compareRecency = (left: DigestChange, right: DigestChange) => {
    const dateComparison = left.activityDate.localeCompare(right.activityDate);
    if (dateComparison !== 0) return dateComparison;
    if (left.activityAt && right.activityAt) {
      const timeComparison =
        left.activityAt.getTime() - right.activityAt.getTime();
      if (timeComparison !== 0) return timeComparison;
    }
    const activityComparison =
      activityPriority[left.activityType] - activityPriority[right.activityType];
    if (activityComparison !== 0) return activityComparison;
    const discoveredComparison =
      left.discoveredAt.getTime() - right.discoveredAt.getTime();
    return discoveredComparison || left.id.localeCompare(right.id);
  };
  const latestByOrdinance = new Map<string, DigestChange>();
  for (const change of changes) {
    const current = latestByOrdinance.get(change.ordinanceId);
    if (!current || compareRecency(change, current) > 0)
      latestByOrdinance.set(change.ordinanceId, change);
  }
  return [...latestByOrdinance.values()].sort((left, right) =>
    compareRecency(right, left),
  );
}

function emailMarkup(
  recipient: Recipient,
  changes: DigestChange[],
  range: DigestRange,
  unsubscribeUrl: string,
  kind: DigestKind,
  municipalityLabel?: string,
) {
  const municipality =
    changes[0]?.ordinance.municipality.label ?? municipalityLabel ?? "your area";
  const periodTitle = kind === "weekly" ? "This week" : "Your past 30 days";
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
    subject: `${kind === "weekly" ? "Your weekly" : kind === "preference" ? "Your updated" : "Your recent"} ordinance update for ${municipality}`,
    html: `<div style="margin:0;background:#f3efe5;padding:28px 12px;color:#19372d;font-family:Georgia,serif"><div style="max-width:620px;margin:auto;background:#fffdf7;padding:32px;border-radius:14px"><p style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase">Legal Seagull · Local government</p><h1 style="font-size:30px;line-height:1.15">${periodTitle} in ${escapeHtml(municipality)}</h1><p style="color:#56645c;line-height:1.6">${range.from} through ${range.to}: ${changes.length} ordinance ${changes.length === 1 ? "update" : "updates"} matching your saved location${recipient.tags.length ? " and topics" : ""}.</p>${changes.length ? `<ol style="padding-left:20px">${entries}</ol>` : "<p>No matching ordinance activity was found in the database for this period.</p>"}<hr style="border:0;border-top:1px solid #dedbd1;margin:28px 0"><p style="font-size:12px;line-height:1.6;color:#56645c">You received this because you opted in to Legal Seagull's weekly ordinance email. <a href="${escapeHtml(unsubscribeUrl)}">Manage this email preference</a>.</p></div></div>`,
    text: `Legal Seagull · Local government\n\n${periodTitle} in ${municipality}\n${range.from} through ${range.to}\n\n${changes.length ? text : "No matching ordinance activity was found in the database for this period."}\n\nUnsubscribe: ${unsubscribeUrl}`,
  };
}

async function sendEmail(input: {
  recipient: Recipient;
  changes: DigestChange[];
  range: DigestRange;
  kind: DigestKind;
  municipalityLabel?: string;
  deliveryKey?: string;
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
    input.kind,
    input.municipalityLabel,
  );
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `${input.kind}-ordinance-digest/${input.recipient.userId}/${input.range.weekStart}${input.deliveryKey ? `/${input.deliveryKey}` : ""}`,
    },
    body: JSON.stringify({
      from: `Legal Seagull <${env.EMAIL_FROM.match(/<([^<>]+)>/)?.[1] ?? env.EMAIL_FROM.trim()}>`,
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

async function claimDelivery(
  userId: string,
  weekStart: string,
  kind: DigestKind,
) {
  const rows = await db.$queryRaw<{ user_id: string }[]>`
    INSERT INTO public.weekly_digest_deliveries (user_id, week_start, digest_type, status)
    VALUES (${userId}::uuid, ${weekStart}::date, ${kind}, 'sending')
    ON CONFLICT (user_id, week_start, digest_type) DO UPDATE
      SET status = 'sending', failure_code = NULL, updated_at = now()
      WHERE public.weekly_digest_deliveries.status = 'failed'
    RETURNING user_id
  `;
  return rows.length > 0;
}

async function hasPriorDelivery(userId: string) {
  const rows = await db.$queryRaw<{ delivered: boolean }[]>`
    SELECT EXISTS (
      SELECT 1
      FROM public.weekly_digest_deliveries
      WHERE user_id = ${userId}::uuid
        AND status IN ('sent', 'unknown', 'sending')
    ) AS delivered
  `;
  return rows[0]?.delivered ?? false;
}

async function setDeliveryStatus(
  userId: string,
  weekStart: string,
  kind: DigestKind,
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
      AND digest_type = ${kind}
  `;
}

async function claimPreferenceDelivery(
  userId: string,
  profileUpdatedAt: string,
) {
  const rows = await db.$queryRaw<{ user_id: string }[]>`
    INSERT INTO public.preference_digest_deliveries (user_id, profile_updated_at, status)
    VALUES (${userId}::uuid, ${profileUpdatedAt}::timestamptz, 'sending')
    ON CONFLICT (user_id, profile_updated_at) DO UPDATE
      SET status = 'sending', failure_code = NULL, updated_at = now()
      WHERE public.preference_digest_deliveries.status = 'failed'
        OR (public.preference_digest_deliveries.status = 'sending'
            AND public.preference_digest_deliveries.updated_at < now() - interval '30 minutes')
    RETURNING user_id
  `;
  return rows.length > 0;
}

async function setPreferenceDeliveryStatus(
  userId: string,
  profileUpdatedAt: string,
  status: "sent" | "failed" | "unknown",
  providerEmailId?: string | null,
  failureCode?: string,
) {
  await db.$executeRaw`
    UPDATE public.preference_digest_deliveries
    SET status = ${status},
        provider_email_id = ${providerEmailId ?? null},
        failure_code = ${failureCode ?? null},
        updated_at = now(),
        sent_at = CASE WHEN ${status} = 'sent' THEN now() ELSE NULL END
    WHERE user_id = ${userId}::uuid
      AND profile_updated_at = ${profileUpdatedAt}::timestamptz
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
  const signupResults: Array<
    "sent" | "failed" | "unknown" | "skipped" | "already-processed"
  > = [];
  const sendToRecipient = async (recipient: Recipient) => {
    const identity = normalizeMunicipality(recipient.location);
    if (!identity) return "skipped" as const;
    try {
      signupResults.push(await sendSignupOrdinanceDigest(recipient, reference));
    } catch {
      signupResults.push("unknown");
    }
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
    if (!(await claimDelivery(recipient.userId, range.weekStart, "weekly")))
      return "already-processed" as const;
    try {
      const emailId = await sendEmail({
        recipient,
        changes,
        range,
        kind: "weekly",
      });
      await setDeliveryStatus(
        recipient.userId,
        range.weekStart,
        "weekly",
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
        "weekly",
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
    initialSent: 0,
    initialFailed: 0,
    initialUnknown: 0,
    initialSkipped: 0,
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
  for (const result of signupResults) {
    if (result === "sent") summary.initialSent += 1;
    else if (result === "failed") summary.initialFailed += 1;
    else if (result === "unknown") summary.initialUnknown += 1;
    else if (result === "skipped") summary.initialSkipped += 1;
  }
  return summary;
}

export async function sendSignupOrdinanceDigest(
  recipient: Recipient,
  reference = new Date(),
  force = false,
) {
  if (
    !env.RESEND_API_KEY ||
    !env.EMAIL_FROM ||
    !env.APP_URL ||
    !env.CRON_SECRET
  )
    throw new Error("Weekly email delivery is not configured.");

  if (!force && (await hasPriorDelivery(recipient.userId)))
    return "already-processed" as const;
  const identity = normalizeMunicipality(recipient.location);
  if (!identity) return "skipped" as const;
  const municipality = await db.municipality.findUnique({
    where: { key: identity.key },
    select: { id: true, label: true },
  });
  if (!municipality) return "skipped" as const;

  const range = trailingMonth(reference);
  if (!(await claimDelivery(recipient.userId, range.weekStart, "signup")))
    return "already-processed" as const;

  try {
    const cityChanges = await changesForMunicipality(municipality.id, range);
    const changes = recipient.tags.length
      ? cityChanges.filter((change) =>
          change.ordinance.topics.some((topic) =>
            recipient.tags.includes(topic),
          ),
        )
      : cityChanges;
    const emailId = await sendEmail({
      recipient,
      changes,
      range,
      kind: "signup",
      municipalityLabel: municipality.label,
    });
    await setDeliveryStatus(
      recipient.userId,
      range.weekStart,
      "signup",
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
      "signup",
      deliveryStatus,
      null,
      failureCode,
    );
    return deliveryStatus;
  }
}

export async function sendPreferenceOrdinanceDigest(
  recipient: Recipient,
  profileUpdatedAt: string,
  reference = new Date(),
) {
  if (
    !env.RESEND_API_KEY ||
    !env.EMAIL_FROM ||
    !env.APP_URL ||
    !env.CRON_SECRET
  )
    throw new Error("Weekly email delivery is not configured.");

  const identity = normalizeMunicipality(recipient.location);
  if (!identity) return "skipped" as const;
  const municipality = await db.municipality.findUnique({
    where: { key: identity.key },
    select: { id: true, label: true },
  });
  if (!municipality) return "skipped" as const;

  if (!(await claimPreferenceDelivery(recipient.userId, profileUpdatedAt)))
    return "already-processed" as const;

  const range = trailingMonth(reference);
  try {
    const cityChanges = await changesForMunicipality(municipality.id, range);
    const changes = recipient.tags.length
      ? cityChanges.filter((change) =>
          change.ordinance.topics.some((topic) =>
            recipient.tags.includes(topic),
          ),
        )
      : cityChanges;
    const emailId = await sendEmail({
      recipient,
      changes,
      range,
      kind: "preference",
      municipalityLabel: municipality.label,
      deliveryKey: profileUpdatedAt,
    });
    await setPreferenceDeliveryStatus(
      recipient.userId,
      profileUpdatedAt,
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
    await setPreferenceDeliveryStatus(
      recipient.userId,
      profileUpdatedAt,
      deliveryStatus,
      null,
      failureCode,
    );
    return deliveryStatus;
  }
}
