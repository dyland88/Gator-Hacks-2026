import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("~/lib/supabase-server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import { createServerSupabaseClient } from "~/lib/supabase-server";
import { GET } from "./route";

describe("auth callback", () => {
  const exchange = vi.fn();
  const verify = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    exchange.mockResolvedValue({ error: null });
    verify.mockResolvedValue({ error: null });
    vi.mocked(createServerSupabaseClient).mockResolvedValue({
      auth: { exchangeCodeForSession: exchange, verifyOtp: verify },
    } as never);
  });

  it("exchanges the code and blocks external redirects", async () => {
    const response = await GET(
      new Request(
        "http://localhost/auth/callback?code=valid&next=https://evil.example",
      ),
    );
    expect(exchange).toHaveBeenCalledWith("valid");
    expect(response.headers.get("location")).toBe("http://localhost/");
  });

  it("supports password recovery destinations", async () => {
    const response = await GET(
      new Request(
        "http://localhost/auth/callback?code=valid&next=/auth/reset-password",
      ),
    );
    expect(response.headers.get("location")).toBe(
      "http://localhost/auth/reset-password",
    );
  });

  it("rejects invalid and missing verification codes", async () => {
    exchange.mockResolvedValueOnce({ error: new Error("Provider detail") });
    const response = await GET(
      new Request("http://localhost/auth/callback?code=invalid"),
    );
    expect(response.headers.get("location")).toBe(
      "http://localhost/?auth=error",
    );
    const missing = await GET(new Request("http://localhost/auth/callback"));
    expect(missing.headers.get("location")).toBe(
      "http://localhost/?auth=error",
    );
  });
});
