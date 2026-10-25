BEGIN;

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS weekly_digest_enabled boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.weekly_digest_deliveries (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  status text NOT NULL CHECK (status IN ('sending', 'sent', 'failed', 'unknown')),
  provider_email_id text,
  failure_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  PRIMARY KEY (user_id, week_start)
);

CREATE INDEX IF NOT EXISTS weekly_digest_deliveries_status_updated_idx
  ON public.weekly_digest_deliveries (status, updated_at);

ALTER TABLE public.weekly_digest_deliveries ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.weekly_digest_deliveries FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.weekly_digest_deliveries TO service_role;

COMMIT;
