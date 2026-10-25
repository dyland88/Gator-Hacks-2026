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
    await pg.exec(
      await readFile("prisma/sql/user-profiles.verify.sql", "utf8"),
    );
    const rows = await pg.query("SELECT * FROM public.user_profiles");
    expect(rows.rows).toEqual([]);
  } finally {
    await pg.close();
  }
});
