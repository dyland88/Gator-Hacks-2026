import { afterEach, describe, expect, it, vi } from "vitest";

import { locationLabel, searchUsPlaces } from "./location-search";

function stubFetch(body: unknown, status = 200) {
  const fetch = vi
    .fn()
    .mockResolvedValue(new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", fetch);
  return fetch;
}

describe("U.S. location search", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps only U.S. places from name searches", async () => {
    stubFetch({
      results: [
        { id: 1, name: "Gainesville", admin1: "Florida", country_code: "US" },
        { id: 2, name: "Gainesville", admin1: "Georgia", country_code: "US" },
        { id: 3, name: "Gainesville", admin1: "England", country_code: "GB" },
      ],
    });
    const results = await searchUsPlaces(
      "Gainesville",
      new AbortController().signal,
    );
    expect(results.map((place) => place.id)).toEqual([1, 2]);
    expect(locationLabel(results[0]!)).toBe("Gainesville, Florida");
  });

  it("maps ZIP lookups to U.S. places and treats unknown ZIP codes as empty", async () => {
    stubFetch({
      country: "United States",
      places: [{ "place name": "Gainesville", state: "FL" }],
    });
    const results = await searchUsPlaces("32601", new AbortController().signal);
    expect(results).toEqual([
      {
        id: "us:32601:0",
        name: "Gainesville",
        admin1: "FL",
        country: "United States",
        postcode: "32601",
      },
    ]);
    stubFetch({}, 404);
    expect(await searchUsPlaces("00000", new AbortController().signal)).toEqual(
      [],
    );
  });
});
