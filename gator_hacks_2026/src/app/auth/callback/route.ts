import { NextResponse } from "next/server";

import { createServerSupabaseClient } from "~/lib/supabase-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const supabase = await createServerSupabaseClient();
  const destination =
    url.searchParams.get("next") === "/auth/reset-password"
      ? "/auth/reset-password"
      : "/";
  const failure = NextResponse.redirect(new URL("/?auth=error", url.origin));
  failure.headers.set("Cache-Control", "private, no-store");
  if (!supabase) return failure;

  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return failure;
  } else if (
    tokenHash &&
    (type === "email" || type === "signup" || type === "recovery")
  ) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error) return failure;
  } else {
    return failure;
  }

  const response = NextResponse.redirect(
    new URL(
      type === "recovery" ? "/auth/reset-password" : destination,
      url.origin,
    ),
  );
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
