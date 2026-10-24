"use client";

import { useState, type FormEvent, type RefObject } from "react";

import { supabase } from "~/lib/supabase-client";

type SignupDialogProps = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  signedInEmail: string | null;
};

export function SignupDialog({ dialogRef, signedInEmail }: SignupDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "check-email">(
    "idle",
  );
  const [error, setError] = useState("");

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setStatus("submitting");
    try {
      const result = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (result.error) {
        setError(result.error.message);
        setStatus("idle");
        return;
      }
      setPassword("");
      setConfirmation("");
      setStatus("check-email");
    } catch {
      setError("Could not reach signup. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="signup-title"
      className="bg-surface-cream text-primary font-body border-primary/20 m-auto max-h-[90vh] w-[min(92vw,440px)] overflow-y-auto rounded-[24px] border p-7 shadow-2xl backdrop:bg-gray-500/65 sm:p-9"
    >
      <p className="font-mono-ui text-[11px] tracking-[0.14em] uppercase">
        Optional account
      </p>
      {signedInEmail ? (
        <>
          <h2
            id="signup-title"
            className="font-display mt-3 text-[32px] leading-tight"
          >
            You&apos;re signed in.
          </h2>
          <p className="text-primary/70 mt-3 text-sm leading-6">
            {signedInEmail}
          </p>
        </>
      ) : status === "check-email" ? (
        <>
          <h2
            id="signup-title"
            className="font-display mt-3 text-[32px] leading-tight"
          >
            Check your email.
          </h2>
          <p className="text-primary/70 mt-3 text-sm leading-6">
            If confirmation is required, follow the link sent to {email}. You
            can keep browsing as a guest in the meantime.
          </p>
        </>
      ) : (
        <>
          <h2
            id="signup-title"
            className="font-display mt-3 text-[32px] leading-tight"
          >
            Create a free account.
          </h2>
          <p className="text-primary/70 mt-3 text-sm leading-6">
            An account is optional. You can keep browsing and choosing topics
            without one.
          </p>
          <form onSubmit={submitSignup} className="mt-7 grid gap-4">
            <label className="flex flex-col gap-2 text-[13px] font-semibold">
              Email
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                className="border-primary/25 bg-surface-tan/50 rounded-lg border px-4 py-3 text-[14px] font-normal focus-visible:outline-2 focus-visible:outline-offset-2"
              />
            </label>
            <label className="flex flex-col gap-2 text-[13px] font-semibold">
              Password
              <input
                required
                type="password"
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="At least 6 characters"
                className="border-primary/25 bg-surface-tan/50 rounded-lg border px-4 py-3 text-[14px] font-normal focus-visible:outline-2 focus-visible:outline-offset-2"
              />
            </label>
            <label className="flex flex-col gap-2 text-[13px] font-semibold">
              Confirm password
              <input
                required
                type="password"
                minLength={6}
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => {
                  setConfirmation(event.target.value);
                  setError("");
                }}
                className="border-primary/25 bg-surface-tan/50 rounded-lg border px-4 py-3 text-[14px] font-normal focus-visible:outline-2 focus-visible:outline-offset-2"
              />
            </label>
            {!supabase && (
              <p className="text-primary/70 text-[12px] leading-5">
                Signup will be available when this site is connected to its
                Supabase project. No account details are sent or saved yet.
              </p>
            )}
            {error && (
              <p role="alert" className="text-[12px] leading-5">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={!supabase || status === "submitting"}
              className="bg-primary text-surface-cream font-mono-ui mt-2 rounded-full px-6 py-3 text-[11px] tracking-[0.08em] uppercase enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "submitting" ? "Creating account…" : "Create account"}
            </button>
          </form>
        </>
      )}
      <button
        type="button"
        onClick={() => dialogRef.current?.close()}
        className="font-mono-ui mt-5 w-full cursor-pointer py-2 text-[11px] tracking-[0.08em] uppercase"
      >
        {signedInEmail ? "Close" : "Continue as guest"}
      </button>
    </dialog>
  );
}
