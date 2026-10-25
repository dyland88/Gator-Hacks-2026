export type StoredOrdinanceIdentity = {
  id: string;
  identityKey: string;
  name: string;
  sourceIdentifier: string | null;
  sourceUrl: string;
};

export function normalizeOrdinanceName(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐‑–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeOrdinanceNumber(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .trim()
    .replace(/^ordinance\s*(?:(?:no\.?|number|#)\s*)?/, "")
    .replace(/\s+/g, "");
}

export function matchOrdinance(
  existing: StoredOrdinanceIdentity[],
  incoming: { name: string; sourceIdentifier: string | null },
) {
  const number = incoming.sourceIdentifier
    ? normalizeOrdinanceNumber(incoming.sourceIdentifier)
    : null;
  if (number) {
    const exact = existing.filter(
      (row) =>
        row.sourceIdentifier &&
        normalizeOrdinanceNumber(row.sourceIdentifier) === number,
    );
    if (exact.length)
      return {
        ordinance: exact.length === 1 ? exact[0] : undefined,
        ambiguous: exact.length > 1,
      };
  }
  const name = normalizeOrdinanceName(incoming.name);
  const matches = existing.filter(
    (row) =>
      normalizeOrdinanceName(row.name) === name &&
      (!number ||
        !row.sourceIdentifier ||
        normalizeOrdinanceNumber(row.sourceIdentifier) === number),
  );
  return {
    ordinance: matches.length === 1 ? matches[0] : undefined,
    ambiguous: matches.length > 1,
  };
}
