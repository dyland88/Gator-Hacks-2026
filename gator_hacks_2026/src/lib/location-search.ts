export type LocationResult = {
  id: number | string;
  name: string;
  admin1?: string;
  country?: string;
  postcode?: string;
};

export function locationLabel(place: LocationResult) {
  const placeName = [place.name, place.admin1, place.country]
    .filter(Boolean)
    .join(", ");
  return place.postcode ? `${place.postcode} — ${placeName}` : placeName;
}

export function isZipQuery(query: string) {
  return /^\d{5}$/.test(query);
}

export async function searchUsPlaces(
  query: string,
  signal: AbortSignal,
): Promise<LocationResult[]> {
  if (isZipQuery(query)) {
    const response = await fetch(`https://api.zippopotam.us/us/${query}`, {
      signal,
    });
    if (response.status === 404) return [];
    if (!response.ok) throw new Error("ZIP lookup failed");
    const data = (await response.json()) as {
      country: string;
      places: { "place name": string; state: string }[];
    };
    return data.places.map((place, index) => ({
      id: `us:${query}:${index}`,
      name: place["place name"],
      admin1: place.state,
      country: data.country,
      postcode: query,
    }));
  }
  const params = new URLSearchParams({
    name: query,
    count: "10",
    language: "en",
    format: "json",
  });
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?${params}`,
    { signal },
  );
  if (!response.ok) throw new Error("Location lookup failed");
  const data = (await response.json()) as {
    results?: (LocationResult & { country_code?: string })[];
  };
  return (data.results ?? [])
    .filter((place) => place.country_code === "US")
    .slice(0, 6);
}
