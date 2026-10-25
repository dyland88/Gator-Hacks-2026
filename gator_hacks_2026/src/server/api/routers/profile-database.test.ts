import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { expect, it } from "vitest";

it("provisions profile circumstances repeatedly and preserves ownership checks", async () => {
  const pg = new PGlite();
  try {
    await pg.exec(`
      CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
      CREATE SCHEMA auth;
      CREATE TABLE auth.users (id uuid PRIMARY KEY, email text);
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql AS
      $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      GRANT USAGE ON SCHEMA auth TO authenticated;
      GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated;
    `);
    const sql = await readFile("prisma/sql/user-profiles.sql", "utf8");
    await pg.exec(sql);
    await pg.exec(sql);
    await pg.exec(`ALTER TABLE public.user_profiles ADD COLUMN gender text;
      INSERT INTO auth.users (id, email) VALUES ('2b09c177-6c7c-48ab-bb1f-441dd73c72c1', 'retained-profile@example.invalid');
      UPDATE public.user_profiles SET gender = 'retired test field', age = 27, tags = ARRAY['Housing'];`);
    await pg.exec(sql);
    const columns = await pg.query(
      "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'gender';",
    );
    expect(columns.rows).toEqual([]);
    await pg.exec(
      await readFile("prisma/sql/user-profiles.verify.sql", "utf8"),
    );
    const rows = await pg.query("SELECT age, tags FROM public.user_profiles");
    expect(rows.rows).toEqual([{ age: 27, tags: ["Housing"] }]);
  } finally {
    await pg.close();
  }
});
