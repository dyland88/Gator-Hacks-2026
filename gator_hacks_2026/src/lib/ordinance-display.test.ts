import { describe, expect, it } from "vitest";

import {
  ordinanceDate,
  ordinanceStage,
  ordinanceSummary,
  summaryRepeatsTitle,
} from "./ordinance-display";

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

describe("ordinance summaries", () => {
  const title =
    "Ordinance No. 2026-27 Granting Incident Management Solutions, Inc., a Non-Exclusive Franchise to Provide Roll-Off Container Collection and Disposal of Solid Waste Within the City of Orlando";

  it("detects a summary that restates the title", () => {
    expect(
      summaryRepeatsTitle(
        title,
        "Grants Incident Management Solutions, Inc. a non-exclusive franchise to provide roll-off container collection and disposal of solid waste within Orlando.",
      ),
    ).toBe(true);
    expect(
      summaryRepeatsTitle(
        "Real Property Policy",
        "Adopts the City of Gainesville Real Property Policy, with severability, repealing, and immediate-effective-date provisions.",
      ),
    ).toBe(false);
  });

  it("falls back to a distinct change description", () => {
    expect(
      ordinanceSummary({
        name: title,
        description:
          "Grants Incident Management Solutions, Inc. a non-exclusive franchise to provide roll-off container collection and disposal of solid waste within Orlando.",
        changes: [
          {
            description:
              "The City Council adopted the ordinance on second reading.",
          },
        ],
      }),
    ).toBe("The City Council adopted the ordinance on second reading.");
  });
});
