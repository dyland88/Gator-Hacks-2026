import { describe, expect, it } from "vitest";

import { ordinanceDate, ordinanceStage } from "./ordinance-display";

describe("ordinance stage presentation", () => {
  it("locates reported active stages without promoting adoption to effectiveness", () => {
    expect(ordinanceStage("under_review")).toEqual({
      label: "Review",
      index: 1,
      ended: false,
    });
    expect(ordinanceStage("adopted")).toEqual({
      label: "Adopted",
      index: 3,
      ended: false,
    });
    expect(ordinanceStage("effective")).toEqual({
      label: "Effective",
      index: 4,
      ended: false,
    });
  });
  it("does not show rejection, withdrawal, or repeal as successful completion", () => {
    for (const stage of ["rejected", "withdrawn", "repealed"])
      expect(ordinanceStage(stage)).toMatchObject({ index: -1, ended: true });
  });
  it("keeps unknown stages neutral and source dates independent of browser timezone", () => {
    expect(ordinanceStage("unknown")).toEqual({
      label: "Status unavailable",
      index: -1,
      ended: false,
    });
    expect(ordinanceDate("2026-10-15")).toBe("Oct 15, 2026");
  });
});
