import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("~/env", () => ({
  env: {
    FIRECRAWL_API_KEY: "fc-test",
    FIRECRAWL_WEBHOOK_SECRET: "test-webhook-secret",
    APP_URL: "https://ledgerline.example.com",
    FIRECRAWL_AGENT_MAX_CREDITS: 100,
  },
}));

import { getAgentStatus, startAgent } from "./firecrawl";

const jobId = "7a09c177-6c7c-48ab-bb1f-441dd73c72c1";

beforeEach(() => vi.unstubAllGlobals());

describe("Firecrawl Agent transport", () => {
  it("starts /agent asynchronously with schema, credit limit and callback", async () => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(Response.json({ success: true, id: jobId }));
    vi.stubGlobal("fetch", fetch);
    await expect(
      startAgent({
        runId: jobId,
        cities: [
          {
            key: "us:fl:gainesville",
            city: "Gainesville",
            state: "FL",
            label: "Gainesville, FL, United States",
          },
        ],
        windowStart: new Date("2026-10-23T06:00Z"),
        windowEnd: new Date("2026-10-24T06:00Z"),
      }),
    ).resolves.toBe(jobId);
    expect(fetch).toHaveBeenCalledOnce();
    const [url, init] = fetch.mock.calls[0]!;
    expect(url).toBe("https://api.firecrawl.dev/v2/agent");
    expect(new Headers(init?.headers).get("authorization")).toBe(
      "Bearer fc-test",
    );
    if (typeof init?.body !== "string") throw new Error("Expected JSON body");
    const body = JSON.parse(init.body) as {
      maxCredits: number;
      webhook: unknown;
      schema: { properties: { cities: unknown } };
      prompt: string;
    };
    expect(body.maxCredits).toBe(100);
    expect(body.webhook).toEqual({
      url: "https://ledgerline.example.com/api/webhooks/firecrawl",
      metadata: { runId: jobId },
    });
    expect(body.schema.properties.cities).toBeDefined();
    expect(body.prompt).toContain("2026-10-23T06:00:00.000Z");
  });
  it("reads status without creating a job", async () => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        Response.json({ status: "processing", success: true }),
      );
    vi.stubGlobal("fetch", fetch);
    await expect(getAgentStatus(jobId)).resolves.toEqual({
      status: "processing",
    });
    expect(fetch.mock.calls[0]![1]?.method).toBe("GET");
  });
  it("sanitizes rejection details and does not retry", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(
        new Response("secret provider detail", { status: 402 }),
      );
    vi.stubGlobal("fetch", fetch);
    await expect(
      startAgent({
        runId: jobId,
        cities: [],
        windowStart: new Date(),
        windowEnd: new Date(),
      }),
    ).rejects.toThrow("provider_rejected");
    expect(fetch).toHaveBeenCalledOnce();
  });
  it("marks response loss as uncertain acceptance", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network detail")),
    );
    await expect(
      startAgent({
        runId: jobId,
        cities: [],
        windowStart: new Date(),
        windowEnd: new Date(),
      }),
    ).rejects.toThrow("submission_unknown");
  });
});
