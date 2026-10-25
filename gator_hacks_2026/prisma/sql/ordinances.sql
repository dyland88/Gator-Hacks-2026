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

ALTER TABLE public.ordinances ADD COLUMN IF NOT EXISTS "relevanceRules" jsonb NOT NULL DEFAULT '[]';

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

CREATE TABLE IF NOT EXISTS public.life_circumstances (
  key text PRIMARY KEY,
  label text NOT NULL,
  description text NOT NULL,
  "sortOrder" integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true
);

INSERT INTO public.life_circumstances (key, label, description, "sortOrder") VALUES
  ('Student', 'Student', 'Enrolled in or directly affected as a student at a school, college, university, or training program, including student-specific housing, fees, or rules.', 0),
  ('Renter', 'Renter', 'Rents a home or unit, including tenant protections, rent rules, and landlord obligations.', 1),
  ('Homeowner', 'Homeowner', 'Owns a home or residential property, including property taxes, exemptions, and homeowner obligations.', 2),
  ('Parent or guardian', 'Parent or guardian', 'Responsible for a child or dependent, including childcare, school-related, and family-support rules.', 3),
  ('Caregiver', 'Caregiver', 'Provides care for a family member or other person who needs help, paid or unpaid.', 4),
  ('Employed', 'Employed', 'Works for an employer or is directly affected as a worker, including labor, wage, and workplace rules.', 5),
  ('Job seeker', 'Job seeker', 'Looking for work, including workforce programs, job training, and hiring-related rules.', 6),
  ('Small-business owner', 'Small-business owner', 'Owns or operates a business, including licensing, permits, and business taxes or rules.', 7),
  ('Retired', 'Retired', 'Retired from work, including senior-specific programs, benefits, and rules for older residents.', 8),
  ('Veteran', 'Veteran', 'Served in the military, including veteran-specific benefits, preferences, or programs.', 9),
  ('Person with a disability', 'Person with a disability', 'Has a disability, including accessibility, accommodation, and disability-specific benefit rules.', 10)
ON CONFLICT (key) DO NOTHING;

ALTER TABLE public.life_circumstances ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.life_circumstances FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.life_circumstances TO service_role;

COMMIT;
