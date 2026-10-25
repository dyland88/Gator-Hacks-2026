BEGIN;

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tags text[] NOT NULL DEFAULT '{}',
  age integer CHECK (age BETWEEN 1 AND 120),
  location text CHECK (char_length(location) <= 300),
  location_id text CHECK (char_length(location_id) <= 100),
  gender text CHECK (gender IN ('Woman', 'Man', 'Non-binary', 'Prefer not to say')),
  weekly_digest_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_profiles_tags_check CHECK (
    cardinality(tags) <= 8 AND
    tags <@ ARRAY['Nature', 'Health', 'Education', 'Housing', 'Jobs', 'Transportation', 'Public safety', 'Civil rights']::text[]
  )
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.user_profiles FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' AND policyname = 'profiles_select_own') THEN
    CREATE POLICY profiles_select_own ON public.user_profiles FOR SELECT TO authenticated USING ((SELECT auth.uid()) = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' AND policyname = 'profiles_insert_own') THEN
    CREATE POLICY profiles_insert_own ON public.user_profiles FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' AND policyname = 'profiles_update_own') THEN
    CREATE POLICY profiles_update_own ON public.user_profiles FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);
  END IF;
END;
$$;

CREATE SCHEMA IF NOT EXISTS ledgerline_private;
REVOKE ALL ON SCHEMA ledgerline_private FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION ledgerline_private.create_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (id) VALUES (NEW.id) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION ledgerline_private.create_user_profile() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION ledgerline_private.touch_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.created_at = OLD.created_at;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION ledgerline_private.touch_user_profile() FROM PUBLIC, anon, authenticated;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass AND tgname = 'ledgerline_create_user_profile') THEN
    CREATE TRIGGER ledgerline_create_user_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION ledgerline_private.create_user_profile();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgrelid = 'public.user_profiles'::regclass AND tgname = 'ledgerline_touch_user_profile') THEN
    CREATE TRIGGER ledgerline_touch_user_profile BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION ledgerline_private.touch_user_profile();
  END IF;
END;
$$;

INSERT INTO public.user_profiles (id) SELECT id FROM auth.users ON CONFLICT (id) DO NOTHING;

COMMIT;
