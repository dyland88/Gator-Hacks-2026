import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("~/env", () => ({
  env: {
    CRON_SECRET: "long-test-cron-secret",
    FIRECRAWL_WEBHOOK_SECRET: "test-secret",
  },
}));
vi.mock("./ingestion", () => ({
  completeIngestion: vi.fn(),
  submitDailyIngestion: vi.fn(),
  reconcileIngestion: vi.fn(),
}));

import { cronAuthorized, verifyWebhook } from "./http";
import {
  completeIngestion,
  reconcileIngestion,
  submitDailyIngestion,
} from "./ingestion";
import { POST } from "~/app/api/webhooks/firecrawl/route";
import { GET as submit } from "~/app/api/cron/ordinances/route";
import { GET as reconcile } from "~/app/api/cron/ordinances/reconcile/route";

const event = {
  id: "7a09c177-6c7c-48ab-bb1f-441dd73c72c1",
  type: "agent.completed",
  success: true,
  metadata: { runId: "ccf48957-3c42-462b-9ecf-95ad836e5da1" },
  data: [{ data: { cities: [] }, creditsUsed: 10 }],
};

function webhook(body: string, signature?: string) {
  return new Request("https://example.com/api/webhooks/firecrawl", {
    method: "POST",
    body,
    headers: {
      "x-firecrawl-signature":
        signature ??
        `sha256=${createHmac("sha256", "test-secret").update(body).digest("hex")}`,
    },
  });
}

beforeEach(() => vi.clearAllMocks());

describe("machine endpoint authorization", () => {
  it("rejects missing and malformed signatures", () => {
    for (const signature of [
      null,
      "sha256=00",
      "sha512=" + "0".repeat(64),
      "sha256=" + "z".repeat(64),
    ])
      expect(verifyWebhook("{}", signature)).toBe(false);
  });
  it("verifies the exact raw body before parsing", async () => {
    const body = JSON.stringify(event);
    vi.mocked(completeIngestion).mockResolvedValue("completed");
    const response = await POST(webhook(body));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(completeIngestion).toHaveBeenCalledWith({
      jobId: event.id,
      runId: event.metadata.runId,
      status: "completed",
      data: { cities: [] },
      creditsUsed: 10,
    });
    expect((await POST(webhook(body, "sha256=" + "0".repeat(64)))).status).toBe(
      401,
    );
  });
  it("rejects malformed JSON and malformed signed events", async () => {
    expect((await POST(webhook("{"))).status).toBe(400);
    expect((await POST(webhook("{}"))).status).toBe(400);
    expect(completeIngestion).not.toHaveBeenCalled();
  });
  it("returns retryable failure on persistence errors", async () => {
    vi.mocked(completeIngestion).mockRejectedValueOnce(
      new Error("private detail"),
    );
    const response = await POST(webhook(JSON.stringify(event)));
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("private detail");
  });
  it("requires the cron bearer for submission and reconciliation", async () => {
    const missing = new Request("https://example.com/api/cron/ordinances");
    expect(cronAuthorized(missing)).toBe(false);
    expect((await submit(missing)).status).toBe(401);
    expect((await reconcile(missing)).status).toBe(401);
    expect(submitDailyIngestion).not.toHaveBeenCalled();
    expect(reconcileIngestion).not.toHaveBeenCalled();
    vi.mocked(reconcileIngestion).mockResolvedValue([]);
    expect(
      (
        await reconcile(
          new Request(missing, {
            headers: { authorization: "Bearer long-test-cron-secret" },
          }),
        )
      ).status,
    ).toBe(200);
  });
});
