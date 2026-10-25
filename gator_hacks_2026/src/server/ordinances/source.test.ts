import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("~/env", () => ({ env: {} }));

import {
  cleanSourceMarkdown,
  readOrdinanceSources,
  relevantExcerpt,
  SourceUnavailableError,
} from "./source";

describe("cleanSourceMarkdown", () => {
  it("drops images and link targets", () => {
    expect(
      cleanSourceMarkdown(
        "![seal](data:image/png;base64,AAAA)\n[Agenda](https://x.gov/a)",
      ),
    ).toBe("Agenda");
  });
});

describe("relevantExcerpt", () => {
  it("returns text around the ordinance number from a long source", () => {
    const text = `${"filler ".repeat(5_000)}Ordinance 2026-631 adopts the policy.${" filler".repeat(5_000)}`;
    const excerpt = relevantExcerpt(text, "2026-631", 4_000);
    expect(excerpt).toContain("Ordinance 2026-631 adopts the policy.");
    expect(excerpt.length).toBeLessThanOrEqual(4_000);
  });
});

describe("readOrdinanceSources", () => {
  it("fails closed when Firecrawl is not configured", async () => {
    await expect(
      readOrdinanceSources(["https://example.gov/minutes"], "2026-1"),
    ).rejects.toBeInstanceOf(SourceUnavailableError);
  });
});
