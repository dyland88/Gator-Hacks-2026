const stateNames =
  "Alabama:AL|Alaska:AK|Arizona:AZ|Arkansas:AR|California:CA|Colorado:CO|Connecticut:CT|Delaware:DE|District of Columbia:DC|Florida:FL|Georgia:GA|Hawaii:HI|Idaho:ID|Illinois:IL|Indiana:IN|Iowa:IA|Kansas:KS|Kentucky:KY|Louisiana:LA|Maine:ME|Maryland:MD|Massachusetts:MA|Michigan:MI|Minnesota:MN|Mississippi:MS|Missouri:MO|Montana:MT|Nebraska:NE|Nevada:NV|New Hampshire:NH|New Jersey:NJ|New Mexico:NM|New York:NY|North Carolina:NC|North Dakota:ND|Ohio:OH|Oklahoma:OK|Oregon:OR|Pennsylvania:PA|Rhode Island:RI|South Carolina:SC|South Dakota:SD|Tennessee:TN|Texas:TX|Utah:UT|Vermont:VT|Virginia:VA|Washington:WA|West Virginia:WV|Wisconsin:WI|Wyoming:WY";

const states = new Map(
  stateNames.split("|").flatMap((entry) => {
    const [name, code] = entry.split(":") as [string, string];
    return [
      [name.toLowerCase(), code],
      [code.toLowerCase(), code],
    ];
  }),
);

export type MunicipalityIdentity = {
  key: string;
  city: string;
  state: string;
  label: string;
};

export function normalizeMunicipality(
  location: string | null | undefined,
): MunicipalityIdentity | null {
  if (!location || location.length > 300) return null;
  const parts = location
    .replace(/^\d{5}(?:-\d{4})?\s*[—–-]\s*/, "")
    .split(",")
    .map((part) => part.trim().replace(/\s+/g, " "));
  if (parts.length !== 3) return null;
  const [city, region, country] = parts as [string, string, string];
  if (!/^(United States(?: of America)?|USA|US|U\.S\.A\.?)$/i.test(country))
    return null;
  const state = states.get(region.toLowerCase());
  if (!state || !city || !/[a-z]/i.test(city) || /[\n\r<>]/.test(city))
    return null;
  const normalizedCity = city.normalize("NFKC").toLowerCase();
  return {
    key: `us:${state.toLowerCase()}:${normalizedCity}`,
    city,
    state,
    label: `${city}, ${state}, United States`,
  };
}
