BEGIN;

INSERT INTO auth.users (id, email)
VALUES
  ('7a09c177-6c7c-48ab-bb1f-441dd73c72c1', 'ledgerline-rls-one@example.invalid'),
  ('7a09c177-6c7c-48ab-bb1f-441dd73c72c2', 'ledgerline-rls-two@example.invalid');

DO $$
BEGIN
  IF (SELECT count(*) FROM public.user_profiles WHERE id IN ('7a09c177-6c7c-48ab-bb1f-441dd73c72c1', '7a09c177-6c7c-48ab-bb1f-441dd73c72c2')) <> 2 THEN
    RAISE EXCEPTION 'Signup profile trigger failed';
  END IF;
END;
$$;

SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claim.sub = '7a09c177-6c7c-48ab-bb1f-441dd73c72c1';

DO $$
DECLARE affected integer;
BEGIN
  IF (SELECT count(*) FROM public.user_profiles) <> 1 THEN
    RAISE EXCEPTION 'Profile isolation failed';
  END IF;
  UPDATE public.user_profiles SET age = 27, location = 'Gainesville, Florida', location_id = 'us:32601:0', gender = 'Woman', tags = ARRAY['Housing', 'Education'], life_circumstances = ARRAY['Student', 'Renter'] WHERE id = '7a09c177-6c7c-48ab-bb1f-441dd73c72c1';
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 1 THEN RAISE EXCEPTION 'Owner update failed'; END IF;
  UPDATE public.user_profiles SET age = 99 WHERE id = '7a09c177-6c7c-48ab-bb1f-441dd73c72c2';
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Cross-user update allowed'; END IF;
  BEGIN
    UPDATE public.user_profiles SET id = '7a09c177-6c7c-48ab-bb1f-441dd73c72c2';
    RAISE EXCEPTION 'Ownership reassignment allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    INSERT INTO public.user_profiles (id) VALUES ('7a09c177-6c7c-48ab-bb1f-441dd73c72c3');
    RAISE EXCEPTION 'Cross-user insert allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    UPDATE public.user_profiles SET age = 121;
    RAISE EXCEPTION 'Invalid age allowed';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
  BEGIN
    UPDATE public.user_profiles SET tags = ARRAY['Unknown'];
    RAISE EXCEPTION 'Invalid tags allowed';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
  BEGIN
    UPDATE public.user_profiles SET life_circumstances = ARRAY['Unknown'];
    RAISE EXCEPTION 'Invalid life circumstances allowed';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
  BEGIN
    UPDATE public.user_profiles SET life_circumstances = ARRAY[NULL]::text[];
    RAISE EXCEPTION 'Null life circumstance allowed';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
END;
$$;

RESET ROLE;
SET LOCAL ROLE anon;
DO $$
BEGIN
  BEGIN
    PERFORM * FROM public.user_profiles;
    RAISE EXCEPTION 'Anonymous profile access allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;
RESET ROLE;

ROLLBACK;
