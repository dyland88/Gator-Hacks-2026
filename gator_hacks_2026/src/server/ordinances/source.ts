import "server-only";

import { env } from "~/env";

const MAX_SOURCE_CHARACTERS = 14_000;
const CACHE_MS = 60 * 60 * 1_000;

export type OrdinanceSource = { url: string; text: string };

export class SourceUnavailableError extends Error {
  constructor() {
    super("The original source could not be read.");
    this.name = "SourceUnavailableError";
  }
}

const cache = new Map<string, { expires: number; markdown: Promise<string> }>();

export function cleanSourceMarkdown(markdown: string) {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function relevantExcerpt(
  markdown: string,
  identifier: string | null,
  limit = MAX_SOURCE_CHARACTERS,
) {
  const number = identifier?.match(/\d{4}-\d+/)?.[0];
  if (!number || markdown.length <= limit) return markdown.slice(0, limit);
  const radius = 1_500;
  const ranges: [number, number][] = [];
  let from = markdown.indexOf(number);
  while (from !== -1) {
    const start = Math.max(0, from - radius);
    const end = Math.min(markdown.length, from + number.length + radius);
    const last = ranges.at(-1);
    if (last && start <= last[1]) last[1] = end;
    else ranges.push([start, end]);
    from = markdown.indexOf(number, from + number.length);
  }
  if (ranges.length === 0) return markdown.slice(0, limit);
  const joined = ranges
    .map(([start, end]) => markdown.slice(start, end))
    .join("\n[…]\n");
  return joined.slice(0, limit);
}

async function fetchMarkdown(url: string) {
  if (!env.FIRECRAWL_API_KEY) throw new SourceUnavailableError();
  try {
    const response = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
        onlyMainContent: true,
      }),
      signal: AbortSignal.timeout(45_000),
      cache: "no-store",
    });
    if (!response.ok) throw new SourceUnavailableError();
    const body = (await response.json()) as {
      data?: { markdown?: unknown };
    };
    if (typeof body.data?.markdown !== "string") {
      throw new SourceUnavailableError();
    }
    const markdown = cleanSourceMarkdown(body.data.markdown);
    if (!markdown) throw new SourceUnavailableError();
    return markdown;
  } catch {
    throw new SourceUnavailableError();
  }
}

function scrape(url: string) {
  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) return cached.markdown;
  const markdown = fetchMarkdown(url);
  cache.set(url, { expires: Date.now() + CACHE_MS, markdown });
  markdown.catch(() => cache.delete(url));
  return markdown;
}

export async function readOrdinanceSources(
  urls: string[],
  identifier: string | null,
): Promise<OrdinanceSource[]> {
  const unique = [...new Set(urls)]
    .filter((url) => url.startsWith("https://"))
    .slice(0, 2);
  const results = await Promise.allSettled(unique.map(scrape));
  const sources = results.flatMap((result, index) =>
    result.status === "fulfilled"
      ? [
          {
            url: unique[index]!,
            text: relevantExcerpt(result.value, identifier),
          },
        ]
      : [],
  );
  if (sources.length === 0) throw new SourceUnavailableError();
  return sources;
}
