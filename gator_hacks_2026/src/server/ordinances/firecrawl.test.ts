import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const config = vi.hoisted<{
  FIRECRAWL_API_KEY: string;
  FIRECRAWL_WEBHOOK_SECRET: string | undefined;
  APP_URL: string | undefined;
  FIRECRAWL_AGENT_MAX_CREDITS: number;
}>(() => ({
  FIRECRAWL_API_KEY: "fc-test",
  FIRECRAWL_WEBHOOK_SECRET: "test-webhook-secret",
  APP_URL: "https://ledgerline.example.com",
  FIRECRAWL_AGENT_MAX_CREDITS: 100,
}));
vi.mock("~/env", () => ({ env: config }));

import {
  buildAgentPrompt,
  getAgentStatus,
  startAgent,
  startPreviewAgent,
} from "./firecrawl";
import { interestOptions } from "~/lib/profile";
import { buildAgentJsonSchema, changeSchema } from "./schema";

const jobId = "7a09c177-6c7c-48ab-bb1f-441dd73c72c1";
const circumstances = [
  { key: "Renter", label: "Renter", description: "Rents a home." },
];

beforeEach(() => vi.unstubAllGlobals());

describe("Firecrawl Agent transport", () => {
  it("uses the same predetermined topics as onboarding and rejects invented categories", () => {
    const prompt = buildAgentPrompt({
      cities: [],
      windowStart: new Date("2026-10-01T00:00Z"),
      windowEnd: new Date("2026-10-02T00:00Z"),
      lifeCircumstances: circumstances,
    });
    for (const topic of interestOptions) expect(prompt).toContain(`${topic}:`);
    expect(
      buildAgentJsonSchema(["Renter"]).properties.cities.items.properties
        .changes.items.properties.topics.items.enum,
    ).toEqual(interestOptions);
    expect(prompt).toContain("Renter: Rents a home.");
    expect(
      buildAgentJsonSchema(["Renter"]).properties.cities.items.properties
        .changes.items.properties.relevanceRules.items.properties
        .lifeCircumstances.items.enum,
    ).toEqual(["Renter"]);
    expect(changeSchema.shape.topics.safeParse(["Invented tag"]).success).toBe(
      false,
    );
  });
  it("previews a thirty-day Gainesville window without webhook configuration", async () => {
    const fetch = vi
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(Response.json({ success: true, id: jobId }));
    vi.stubGlobal("fetch", fetch);
    const appUrl = config.APP_URL;
    const secret = config.FIRECRAWL_WEBHOOK_SECRET;
    config.APP_URL = undefined;
    config.FIRECRAWL_WEBHOOK_SECRET = undefined;
    const input = {
      cities: [
        {
          key: "us:fl:gainesville",
          city: "Gainesville",
          state: "FL",
          label: "Gainesville, FL, United States",
        },
      ],
      windowStart: new Date("2026-09-24T06:00:00Z"),
      windowEnd: new Date("2026-10-24T06:00:00Z"),
      lifeCircumstances: circumstances,
    };
    try {
      await expect(startPreviewAgent(input)).resolves.toBe(jobId);
      const bodyText = fetch.mock.calls[0]?.[1]?.body;
      if (typeof bodyText !== "string") throw new Error("Expected JSON body");
      const body = JSON.parse(bodyText) as {
        prompt: string;
        webhook?: unknown;
        maxCredits: number;
      };
      expect(body.webhook).toBeUndefined();
      expect(body.prompt).toBe(buildAgentPrompt(input));
      expect(body.prompt).toContain("Gainesville");
      expect(body.prompt).toContain("2026-09-24T06:00:00.000Z");
      expect(body.maxCredits).toBe(100);
      expect(fetch).toHaveBeenCalledOnce();
    } finally {
      config.APP_URL = appUrl;
      config.FIRECRAWL_WEBHOOK_SECRET = secret;
    }
  });
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
        lifeCircumstances: circumstances,
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
        lifeCircumstances: circumstances,
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
        lifeCircumstances: circumstances,
      }),
    ).rejects.toThrow("submission_unknown");
  });
});
