import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { isDocumentUrl, pageLinkFor, presentableLink } from "./source-links";

const eventPage = "https://gainesvillefl.portal.civicclerk.com/event/128/files";
const otherEventPage =
  "https://gainesvillefl.portal.civicclerk.com/event/140/files";
const portalRoot = "https://gainesvillefl.portal.civicclerk.com/";
const civicApiFile =
  "https://gainesvillefl.api.civicclerk.com/v1/Meetings/GetMeetingFileStream(fileId=98,plainText=true)";

describe("document link detection", () => {
  it("flags text, media, office and streamed file links", () => {
    for (const url of [
      "https://example.gov/minutes/2026-10-23.txt",
      "https://example.gov/audio/council.MP3",
      "https://example.gov/video/meeting.mp4",
      "https://example.gov/agenda.pdf",
      civicApiFile,
      "https://pub-orlando.escribemeetings.com/FileStream.ashx?DocumentId=61543",
      "https://pub-orlando.escribemeetings.com/VideoStream.aspx?MeetingId=abc",
      "https://civicclerk.blob.core.windows.net/stream/GAINESVILLEFL/x",
    ])
      expect(isDocumentUrl(url), url).toBe(true);
  });

  it("leaves webpages alone", () => {
    for (const url of [
      eventPage,
      "https://pub-orlando.escribemeetings.com/Meeting.aspx?Agenda=Agenda&Id=abc&lang=English",
      "https://www.gainesvillefl.gov/Government-Pages/Government/Public-Meeting-Participation/New-Agendas-Minutes",
    ])
      expect(isDocumentUrl(url), url).toBe(false);
  });
});

describe("neighboring page selection", () => {
  it("prefers the page the ordinance itself cites, then the closest crawled path", () => {
    expect(
      pageLinkFor(civicApiFile, {
        preferred: [eventPage],
        checked: [portalRoot, otherEventPage],
      }),
    ).toEqual({ url: eventPage, crawled: true });
  });

  it("falls back to the closest crawled path on the same domain", () => {
    expect(
      pageLinkFor(
        "https://gainesvillefl.portal.civicclerk.com/event/9/files/x.pdf",
        {
          preferred: [],
          checked: [
            portalRoot,
            otherEventPage,
            "https://www.gainesvillefl.gov/minutes",
          ],
        },
      ),
    ).toEqual({ url: otherEventPage, crawled: true });
  });

  it("never selects a document or a different domain", () => {
    expect(
      pageLinkFor(civicApiFile, {
        preferred: [civicApiFile],
        checked: [
          "https://www.gainesvillefl.gov/agenda",
          "https://example.com/",
        ],
      }),
    ).toBeNull();
  });
});

describe("presentable links", () => {
  it("keeps webpage links unchanged", () => {
    expect(presentableLink(eventPage, { preferred: [], checked: [] })).toEqual({
      url: eventPage,
      crawled: true,
    });
  });

  it("replaces a document with the closest crawled page", () => {
    expect(
      presentableLink(civicApiFile, { preferred: [eventPage], checked: [] })
        .url,
    ).toBe(eventPage);
  });

  it("uses the domain root only when no crawled page exists", () => {
    expect(
      presentableLink(civicApiFile, { preferred: [], checked: [] }),
    ).toEqual({
      url: portalRoot,
      crawled: false,
    });
  });
});
