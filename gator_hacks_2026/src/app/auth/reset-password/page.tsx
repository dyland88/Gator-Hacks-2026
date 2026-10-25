"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { supabase } from "~/lib/supabase-client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || busy) return;
    setError("");
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user)
        throw new Error(
          "Open a valid password reset link from your email first.",
        );
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setConfirmation("");
      setComplete(true);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Your password could not be updated.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="bg-surface-cream text-primary font-body flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#e5d3af,transparent)] p-6">
      <div className="border-primary/20 bg-surface-cream w-full max-w-md rounded-[24px] border p-8">
        <h1 className="font-display text-[32px]">
          {complete ? "Password updated." : "Choose a new password."}
        </h1>
        {!complete && (
          <form onSubmit={submit} className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm">
              New password
              <input
                required
                type="password"
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border-primary/25 rounded-lg border p-3"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Confirm password
              <input
                required
                type="password"
                minLength={8}
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className="border-primary/25 rounded-lg border p-3"
              />
            </label>
            <button
              disabled={!supabase || busy}
              className="bg-primary text-surface-cream cursor-pointer rounded-full p-3 disabled:opacity-50"
            >
              {busy ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm">
            {error}
          </p>
        )}
        <Link
          href="/"
          className="mt-6 inline-block text-sm underline underline-offset-2"
        >
          Back to Ledgerline
        </Link>
      </div>
    </main>
  );
}
