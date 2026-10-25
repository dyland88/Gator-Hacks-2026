To run the website, run:
`pnpm i`
`pnpm dev`

We are using postgresql with supabase

## Daily municipal ordinance ingestion

Ledgerline uses Firecrawl **Agent** (`POST /v2/agent`), not `/scrape` or `/extract`, to research ordinance activity across saved users' U.S. cities. Firecrawl announced Agent on [December 18, 2025](https://www.firecrawl.dev/blog/introducing-agent), within the past year for the October 2026 hackathon. See the [Agent API](https://docs.firecrawl.dev/features/agent) and [webhook signature documentation](https://docs.firecrawl.dev/webhooks/security).

The backend stores current ordinance snapshots and dated change history. The dashboard displays those records with descriptions, source links, topic tags, and segmented legislative-stage indicators. Chat retrieval and email delivery remain deferred. Guest preferences remain browser-only and do not determine monitored cities.

### Configuration and deployment

Set these **server-only** variables locally and in the Vercel production environment:

| Variable | Purpose |
| --- | --- |
| `FIRECRAWL_API_KEY` | Firecrawl API key with Agent access |
| `FIRECRAWL_WEBHOOK_SECRET` | Account webhook signing secret from Firecrawl settings, Advanced tab |
| `CRON_SECRET` | Random bearer secret, at least 16 characters |
| `APP_URL` | Public HTTPS production origin reachable by Firecrawl |
| `FIRECRAWL_AGENT_MAX_CREDITS` | Maximum credits for the single daily Agent job; defaults to 100 |

The new credentials are optional for ordinary app development, but ingestion fails closed when configuration is missing. Use a database owner or dedicated server role that can read `user_profiles` and bypass RLS on the ingestion tables. Never expose that credential to the browser. Authenticated profile reads in the website continue using the user's Supabase session and RLS.

Apply the additive SQL to the intended database, then regenerate the client:

```text
pnpm db:ordinances
pnpm exec prisma generate
```

Do not substitute `prisma db push` for the SQL: the SQL also enables RLS and revokes browser access. It does not alter existing profile tables, policies, triggers, or credentials. Provisioning is repeatable. `pnpm test` applies it twice to a disposable in-memory Postgres instance and verifies role restrictions and uniqueness without connecting to Supabase.

Set the Vercel project Root Directory to `gator_hacks_2026` so its `vercel.json` is used. Deploy after setting the environment variables and provisioning the database. Two daily Vercel jobs are configured:

| Route | Schedule (UTC) | Behavior |
| --- | --- | --- |
| `GET /api/cron/ordinances` | 06:00 daily | Claims the reporting window and submits at most one Agent job containing all eligible cities |
| `GET /api/cron/ordinances/reconcile` | 18:00 daily | Retrieves unfinished jobs; never submits another Agent job |

Vercel sends `Authorization: Bearer <CRON_SECRET>`. Both routes reject unauthenticated requests and disable caching. Hobby schedules can arrive within the scheduled hour, so the reporting window is fixed at 06:00 UTC rather than invocation time. [Vercel cron behavior](https://vercel.com/docs/cron-jobs/manage-cron-jobs).

For example, the October 24 run asks about `[2026-10-23T06:00:00Z, 2026-10-24T06:00:00Z)`. The first deployment does not backfill earlier history. The profile's city/state/country label is normalized, removing ZIP prefixes and combining ZIP/city search IDs. Only recognized U.S. states and Washington, DC are eligible; missing IDs, ambiguous labels, territories, and non-U.S. labels are skipped and counted. No age, gender, interests, account IDs, or email addresses are sent to Firecrawl.

### Completion and recovery

Firecrawl sends events to `POST /api/webhooks/firecrawl`. The handler verifies `X-Firecrawl-Signature` over the raw request body with HMAC-SHA256 and a timing-safe comparison before parsing. Terminal callbacks include the local run ID in webhook metadata. Duplicate callbacks are harmless; a completion arriving before the submission response can still be correlated. Database errors return 503 so delivery can be retried.

Inspect `ingestion_runs` through trusted database tooling. Useful fields include `windowStart`, `windowEnd`, `status`, `providerJobId`, `skippedCount`, `coverage`, `rejectedCount`, `creditsUsed`, and `failureCode`. Per-city coverage records checked sources and accepted/rejected counts. `completed` means all requested cities returned complete coverage with no rejected records; `partial` means some coverage or validation was incomplete. Empty findings are only successful when sources were actually checked.

| Status | Meaning/action |
| --- | --- |
| `skipped` | No eligible saved-profile cities; no paid job submitted |
| `submitting` / `processing` | Submission or research in progress |
| `submission_unknown` | Acceptance could not be confirmed; never automatically resubmit |
| `completed` / `partial` | Results persisted, with coverage retained per city |
| `reconciliation_failed` | Status read unavailable; reconciliation can be invoked again |
| `failed` | Provider rejected/failed, invalid result, or results no longer retrievable; inspect sanitized `failureCode` |

Invoke reconciliation manually with the same bearer header to recover a missed webhook. It checks at most ten outstanding runs per request. Firecrawl retains API results for 24 hours after completion, so the 18:00 job normally recovers the 06:00 run before expiry. Run reconciliation promptly after deployment/database outages. Failed status reads older than 48 hours become terminal `results_unavailable` failures so old runs cannot block newer recovery.

If submission acceptance is unknown, inspect Firecrawl's activity logs for the matching time and city list. After confirming the correct remote job, attach its ID to that run using trusted database tooling and set the run status to `processing`, then invoke reconciliation. Do not clear the window's claim or start a replacement job. There is deliberately no user-facing ingestion mutation or automatic retry of paid submissions. A missed schedule or failed job leaves a visible gap; there is no automatic historical backfill.

For local testing, expose the dev server through an HTTPS tunnel and set `APP_URL` to that tunnel's origin before starting a job. Invoke cron routes with the bearer secret from a local HTTP client; never place secrets in query strings. A real manual submission consumes the daily claim and may use credits. Automated tests mock all Firecrawl calls and sign fixture webhooks locally, so they consume no credits.

### Query interfaces and coverage limits

The website uses public `ordinances.locations` and `ordinances.feed` queries to browse public legislation. Locations list cities with stored ordinances; feed queries require an explicit municipality UUID, optionally filter by the shared eight-topic taxonomy, and paginate with a cursor. Multiple selected topics match any of them. The amendments view includes ordinances with recorded amendment activity. Saved profile location and interests initialize the controls; visitors without a saved location see the first available city. Account profiles and their ownership checks remain private.

Cards show the stored name, description, location, topics, latest activity date, and official evidence link. The five general progress segments are Introduced, Review, Hearing, Adopted, and Effective. Only the stored stage determines the current position; effective dates do not promote an ordinance to a later stage. Rejected, withdrawn, repealed, and unknown statuses use neutral segments with explicit status labels. Each municipality may follow a different legal procedure.

To test the live request-to-database pipeline for Gainesville over the last 30 days, provision the tables and run:

```text
pnpm db:ordinances
pnpm test:pipeline:gainesville
```

This command writes to the database in `DATABASE_URL` and makes one real Agent request using `FIRECRAWL_API_KEY` and the configured credit ceiling. It checks the four ingestion tables before spending credits, records the run, polls Firecrawl, then calls the same transactional validation and persistence function used by production webhooks and reconciliation. It reads the stored run and newly inserted change rows back from the database and saves that readback as `.local/ordinance-tests/gainesville-<jobId>-database.json`. Valid partial findings are persisted, while incomplete coverage still produces exit code 1. Zero new rows means empty findings or deduplication; it does not prove an ordinance insert occurred.

Use `pnpm test:pipeline:gainesville --resume` after an interruption. Pipeline state is stored separately from preview state, and resuming a completed run only reads its database results. `pnpm test:pipeline:gainesville --dry-run` prints the request without API calls or database writes. Polling requires no `CRON_SECRET`, `APP_URL`, webhook configuration, running web server, or saved account profile. This tests submission through database persistence; it does not exercise HTTP webhook signature verification. The monthly manual run does not change the scheduled daily reporting window.

After fixing a validation issue, `pnpm test:pipeline:gainesville --retry-validation` explicitly reopens the saved partial run (or a run that failed with `invalid_result`), retrieves the same provider job, and reprocesses it without a new Agent submission. Fully completed runs remain read-only on resume. Evidence-origin checks recognize the matching tenant's `portal.civicclerk.com` and `api.civicclerk.com` hosts as one publishing source; different tenants and lookalike domains remain rejected.

To test a real past-month fetch for Gainesville, Florida, set `FIRECRAWL_API_KEY` in `.env` and run from the application root:

```text
pnpm test:agent:gainesville --dry-run
pnpm test:agent:gainesville
```

The live command submits one `/agent` job covering the 30 days immediately before execution, using the production prompt and extraction schema. It polls for up to ten minutes, prints returned updates and evidence URLs, and saves JSON under `.local/ordinance-tests/` (gitignored). It uses the configured credit ceiling, defaulting to 100. This preview does not require a running web server, webhook secret, public tunnel, saved profile, or database provisioning; it does not persist findings into the database or consume the scheduled daily claim. Run it with Node.js 22 or later.

If polling stops or the terminal closes after a job ID was returned, use `pnpm test:agent:gainesville --resume` to retrieve the saved job without creating another paid job. Starting the command without `--resume` explicitly submits a new job. Inspect the source links and coverage even when the result is empty; no findings are not proof that nothing happened. To test database persistence and signed callbacks, use the daily ingestion flow above instead.

Authenticated tRPC methods `ordinances.list` and `ordinances.changes` accept `{ limit?, cursor?, from?, to?, stage?, topic? }`. Pass `{}` for defaults. `limit` defaults to 25 and is capped at 100; `cursor` is the last returned UUID. Responses contain `{ items, nextCursor }`. The server derives the municipality from the verified account's profile. The client cannot choose an owner or municipality. Missing/unrecognized locations return empty results.

Dates are inclusive `YYYY-MM-DD` filters. List dates filter the latest known ordinance activity; history dates filter individual activity dates. Stage and topic filters use the ordinance's current snapshot. Ordering is descending activity date, then descending UUID. To build a weekly digest, call the server-only `getDigestChanges({ municipalityIds, from, to, cursor?, limit? })` and page until `nextCursor` is absent. This helper defaults to 100 records per page and performs no email delivery.

Ordinances are reconciled within each municipality by official number first, then by normalized official name. Name comparison ignores capitalization, extra whitespace, and typographic quote/dash differences while preserving title years and numbers. A changed URL or a newly discovered identifier therefore does not create a second bill when the name uniquely matches an existing record. Different known ordinance numbers remain separate even when their titles match; ambiguous name-only matches are rejected and counted. Firecrawl is instructed to preserve official titles rather than generate new titles.

New records without official numbers use a municipality-scoped name key. Existing URL-based records continue matching by name without changing their stored identity keys or history hashes. Municipality rows are locked during matching to serialize concurrent ingestion for the same city. Existing duplicates are not automatically merged. Change identity combines the resolved record's stable identity key, activity date/type, and normalized evidence URL. Tracking parameters and fragments are removed. Identical rediscoveries do not create digest events; multiple votes of the same type on the same day with the same evidence URL are combined. Same-day event ordering and corrected metadata on otherwise identical events still require further reconciliation work.

Evidence must come from sources the agent identifies as municipal or officially linked legislative platforms. The backend rejects malformed fields, unrequested cities, invalid dates, unsupported topics, unsafe URLs, unchecked evidence origins, and activity outside the reporting window. Source authority and excerpt accuracy remain agent-reported, not independently audited. Web search and inaccessible municipal records cannot guarantee exhaustive coverage.

Exact source timestamps are retained when supplied. Date-only evidence stays a calendar date with `activityAt: null`; dates overlapping the UTC window are accepted without inventing a time. Adjacent windows can therefore rediscover the same date-only activity, which is deduplicated. Future effective dates are stored as ordinance metadata, while activity must be dated within the reporting window. No finding is a guarantee that no ordinance activity occurred.

## Authentication and profiles

Copy `.env.example` to `.env` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from the Supabase Connect dialog. These are separate from the server-only Postgres credentials. Legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also supported.

In Supabase Authentication > URL Configuration, set the production Site URL and allow these redirect URLs for each environment:

```text
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/auth/reset-password
https://YOUR_DOMAIN/auth/callback
https://YOUR_DOMAIN/auth/callback?next=/auth/reset-password
```

If you run another local port, allow its callback URLs too. Signup uses the default confirmation email. The verification link should be opened in the same browser used for signup because the PKCE verifier is stored there.

Apply the additive profile SQL and generate the Prisma client:

```text
pnpm db:profiles
pnpm exec prisma generate
```

The SQL is safe to rerun. It creates `public.user_profiles`, an `auth.users` foreign key with cascading deletion, validation checks, owner-only RLS policies, timestamps, and a signup trigger. Existing auth users receive an empty profile. Supabase Auth owns emails and passwords; `user_profiles` stores tags, age, location, location ID, and gender. Use `db:profiles` to provision these database objects; `prisma db push` alone does not preserve the complete auth integration.

Accounts support email/password signup, sign-in, sign-out, email confirmation, password recovery, and cookie-based sessions. Signed-in preferences are loaded and saved through authenticated tRPC procedures using the user's Supabase session and RLS. Guest preferences stay on the device. Preferences selected before signup are transferred on the first sign-in on that device, without overwriting an existing populated account profile.

Verify database ownership rules with:

```text
pnpm exec prisma db execute --file prisma/sql/user-profiles.verify.sql --schema prisma/schema.prisma
pnpm test
pnpm typecheck
pnpm build
```

The SQL verification creates temporary test accounts and rolls the transaction back. Application tests mock authentication and do not send emails.

# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
