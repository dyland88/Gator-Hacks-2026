BEGIN;

CREATE TABLE IF NOT EXISTS public.municipalities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  city text NOT NULL,
  state text NOT NULL,
  label text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ingestion_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "windowStart" timestamptz NOT NULL,
  "windowEnd" timestamptz NOT NULL UNIQUE,
  cities jsonb NOT NULL,
  "skippedCount" integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'submitting',
  "providerJobId" text UNIQUE,
  coverage jsonb,
  "creditsUsed" double precision,
  "rejectedCount" integer NOT NULL DEFAULT 0,
  "failureCode" text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "completedAt" timestamptz,
  CHECK ("windowStart" < "windowEnd"),
  CHECK ("skippedCount" >= 0 AND "rejectedCount" >= 0),
  CHECK ("creditsUsed" IS NULL OR "creditsUsed" >= 0)
);

CREATE TABLE IF NOT EXISTS public.ordinances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "municipalityId" uuid NOT NULL REFERENCES public.municipalities(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  "identityKey" text NOT NULL,
  "sourceIdentifier" text,
  name text NOT NULL,
  description text NOT NULL,
  stage text NOT NULL,
  "originalStage" text NOT NULL,
  topics text[] NOT NULL DEFAULT '{}',
  "sourceUrl" text NOT NULL,
  "adoptedDate" varchar(10),
  "effectiveDate" varchar(10),
  "latestActivity" varchar(10) NOT NULL,
  "firstObservedAt" timestamptz NOT NULL DEFAULT now(),
  "lastObservedAt" timestamptz NOT NULL DEFAULT now(),
  UNIQUE ("municipalityId", "identityKey")
);

CREATE TABLE IF NOT EXISTS public.ordinance_changes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "ordinanceId" uuid NOT NULL REFERENCES public.ordinances(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  "ingestionRunId" uuid NOT NULL REFERENCES public.ingestion_runs(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  "dedupeKey" text NOT NULL UNIQUE,
  "activityType" text NOT NULL,
  "activityDate" varchar(10) NOT NULL,
  "activityAt" timestamptz,
  description text NOT NULL,
  "evidenceUrl" text NOT NULL,
  "evidenceExcerpt" text NOT NULL,
  "discoveredAt" timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ingestion_runs_status_createdAt_idx ON public.ingestion_runs (status, "createdAt");
CREATE INDEX IF NOT EXISTS ordinances_municipalityId_stage_lastObservedAt_idx ON public.ordinances ("municipalityId", stage, "lastObservedAt");
CREATE INDEX IF NOT EXISTS ordinance_changes_ordinanceId_activityDate_idx ON public.ordinance_changes ("ordinanceId", "activityDate");
CREATE INDEX IF NOT EXISTS ordinance_changes_activityDate_id_idx ON public.ordinance_changes ("activityDate", id);

ALTER TABLE public.municipalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingestion_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordinances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordinance_changes ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.municipalities, public.ingestion_runs, public.ordinances, public.ordinance_changes FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.municipalities, public.ingestion_runs, public.ordinances, public.ordinance_changes TO service_role;

COMMIT;
