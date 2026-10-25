import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { describe, expect, it } from "vitest";

describe("ordinance SQL provisioning", () => {
  it("is repeatable, enforces uniqueness, and denies browser roles", async () => {
    const pg = new PGlite();
    try {
      await pg.exec(
        "CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;",
      );
      const sql = await readFile("prisma/sql/ordinances.sql", "utf8");
      await pg.exec(sql);
      await pg.exec(sql);
      await pg.exec(
        "INSERT INTO municipalities (key, city, state, label) VALUES ('us:fl:gainesville', 'Gainesville', 'FL', 'Gainesville, FL, United States');",
      );
      await expect(
        pg.exec(
          "INSERT INTO municipalities (key, city, state, label) VALUES ('us:fl:gainesville', 'Gainesville', 'FL', 'Duplicate');",
        ),
      ).rejects.toThrow(/duplicate key/);
      await pg.exec(
        `INSERT INTO ingestion_runs ("windowStart", "windowEnd", cities) VALUES ('2026-10-23T06:00Z', '2026-10-24T06:00Z', '[]');`,
      );
      await expect(
        pg.exec(
          `INSERT INTO ingestion_runs ("windowStart", "windowEnd", cities) VALUES ('2026-10-23T06:00Z', '2026-10-24T06:00Z', '[]');`,
        ),
      ).rejects.toThrow(/duplicate key/);
      for (const role of ["anon", "authenticated"]) {
        await pg.exec(`SET ROLE ${role};`);
        for (const table of [
          "municipalities",
          "ingestion_runs",
          "ordinances",
          "ordinance_changes",
        ]) {
          await expect(pg.exec(`SELECT * FROM ${table};`)).rejects.toThrow(
            /permission denied/,
          );
          await expect(pg.exec(`DELETE FROM ${table};`)).rejects.toThrow(
            /permission denied/,
          );
        }
        await pg.exec("RESET ROLE;");
      }
      const security = await pg.query<{ relrowsecurity: boolean }>(
        "SELECT relrowsecurity FROM pg_class WHERE relname IN ('municipalities', 'ingestion_runs', 'ordinances', 'ordinance_changes');",
      );
      expect(security.rows).toHaveLength(4);
      expect(security.rows.every((row) => row.relrowsecurity)).toBe(true);
      await pg.exec(
        "SET ROLE service_role; SELECT * FROM municipalities; RESET ROLE;",
      );
    } finally {
      await pg.close();
    }
  }, 30_000);
});
