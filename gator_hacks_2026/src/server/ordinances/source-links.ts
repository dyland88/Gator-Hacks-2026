import { checkedSourceOrigin } from "./schema";

const documentExtensions = new Set([
  "txt",
  "rtf",
  "pdf",
  "doc",
  "docx",
  "odt",
  "xls",
  "xlsx",
  "csv",
  "ppt",
  "pptx",
  "zip",
  "mp3",
  "wav",
  "m4a",
  "aac",
  "ogg",
  "flac",
  "mp4",
  "mov",
  "avi",
  "webm",
  "mkv",
  "m4v",
  "m3u8",
  "ts",
]);
const documentPath = /FileStream|VideoStream|\/stream\/|download|GetFile/i;

export function isDocumentUrl(value: string) {
  const url = new URL(value);
  const name = url.pathname.split("/").pop() ?? "";
  const dot = name.lastIndexOf(".");
  const extension = dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
  return documentExtensions.has(extension) || documentPath.test(url.pathname);
}

function directories(value: string) {
  return new URL(value).pathname.split("/").filter(Boolean).slice(0, -1);
}

function sharedPrefix(a: string[], b: string[]) {
  let count = 0;
  while (count < a.length && count < b.length && a[count] === b[count]) count++;
  return count;
}

export function pageLinkFor(
  documentUrl: string,
  pools: { preferred: string[]; checked: string[] },
): { url: string; crawled: boolean } | null {
  const origin = checkedSourceOrigin(documentUrl);
  const preferred = new Set(pools.preferred);
  const candidates = [...new Set([...pools.preferred, ...pools.checked])]
    .filter((url) => checkedSourceOrigin(url) === origin && !isDocumentUrl(url))
    .map((url) => ({
      url,
      preferred: preferred.has(url) ? 1 : 0,
      shared: sharedPrefix(directories(url), directories(documentUrl)),
    }))
    .sort(
      (a, b) =>
        b.preferred - a.preferred ||
        b.shared - a.shared ||
        a.url.length - b.url.length ||
        a.url.localeCompare(b.url),
    );
  const best = candidates[0];
  return best ? { url: best.url, crawled: true } : null;
}

export function presentableLink(
  url: string,
  pools: { preferred: string[]; checked: string[] },
) {
  if (!isDocumentUrl(url)) return { url, crawled: true };
  return (
    pageLinkFor(url, pools) ?? {
      url: checkedSourceOrigin(url) + "/",
      crawled: false,
    }
  );
}
