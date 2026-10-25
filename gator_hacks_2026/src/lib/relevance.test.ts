import { describe, expect, it } from "vitest";

import { matchRelevance, relevanceRulesSchema } from "./relevance";

const ageRule = {
  ageMin: 18,
  ageMax: 25,
  lifeCircumstances: [],
  evidenceExcerpt: "Residents aged 18 through 25.",
};

describe("source-supported relevance", () => {
  it("includes age boundaries and does not match absent or out-of-range ages", () => {
    for (const age of [18, 25]) {
      expect(
        matchRelevance([ageRule], { age, lifeCircumstances: [] }),
      ).toHaveLength(1);
    }
    for (const age of [null, 17, 26]) {
      expect(matchRelevance([ageRule], { age, lifeCircumstances: [] })).toEqual(
        [],
      );
    }
  });

  it("requires all criteria within a group while allowing alternative groups", () => {
    const combined = { ...ageRule, lifeCircumstances: ["Student", "Renter"] };
    const retired = {
      ...ageRule,
      ageMin: null,
      ageMax: null,
      lifeCircumstances: ["Retired"],
    };
    expect(
      matchRelevance([combined], { age: 20, lifeCircumstances: ["Student"] }),
    ).toEqual([]);
    expect(
      matchRelevance([combined], {
        age: 26,
        lifeCircumstances: ["Student", "Renter"],
      }),
    ).toEqual([]);
    expect(
      matchRelevance([combined], {
        age: 20,
        lifeCircumstances: ["Student", "Renter"],
      }),
    ).toHaveLength(1);
    expect(
      matchRelevance([combined, retired], {
        age: null,
        lifeCircumstances: ["Retired"],
      }),
    ).toHaveLength(1);
  });

  it("supports open-ended criteria without inferring circumstances from age", () => {
    const seniors = { ...ageRule, ageMin: 65, ageMax: null };
    expect(
      matchRelevance([seniors], { age: 80, lifeCircumstances: [] })[0]?.label,
    ).toBe("Ages 65+");
    expect(
      matchRelevance([{ ...seniors, lifeCircumstances: ["Retired"] }], {
        age: 80,
        lifeCircumstances: [],
      }),
    ).toEqual([]);
  });

  it("treats missing metadata as unknown and rejects unsupported or contradictory rules", () => {
    for (const rules of [
      null,
      undefined,
      [],
      {},
      [{ ...ageRule, ageMin: 30 }],
      [{ ...ageRule, lifeCircumstances: ["Invented"] }],
    ]) {
      expect(matchRelevance(rules, { age: 20, lifeCircumstances: [] })).toEqual(
        [],
      );
    }
    expect(
      relevanceRulesSchema.safeParse([{ ...ageRule, evidenceExcerpt: "" }])
        .success,
    ).toBe(false);
    expect(
      relevanceRulesSchema.safeParse([
        { ...ageRule, ageMin: null, ageMax: null },
      ]).success,
    ).toBe(false);
  });
});
