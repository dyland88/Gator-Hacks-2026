import { describe, expect, it } from "vitest";

import { normalizeOrdinanceName, normalizeOrdinanceNumber } from "./identity";

describe("ordinance identity normalization", () => {
  it("matches typography and whitespace without erasing meaningful title numbers", () => {
    expect(normalizeOrdinanceName("  City’s   Housing—Policy 2026 ")).toBe(
      normalizeOrdinanceName("city's housing-policy 2026"),
    );
    expect(normalizeOrdinanceName("Annual Budget 2025")).not.toBe(
      normalizeOrdinanceName("Annual Budget 2026"),
    );
  });
  it("recognizes official number prefixes while keeping different numbers distinct", () => {
    expect(normalizeOrdinanceNumber("Ordinance No. 2026-01")).toBe("2026-01");
    expect(normalizeOrdinanceNumber("Ordinance #2026-01")).toBe(
      normalizeOrdinanceNumber("2026-01"),
    );
    expect(normalizeOrdinanceNumber("2026-01")).not.toBe(
      normalizeOrdinanceNumber("2026-02"),
    );
  });
});
