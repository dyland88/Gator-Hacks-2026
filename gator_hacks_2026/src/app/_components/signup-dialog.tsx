"use client";

import { useState, type FormEvent, type RefObject } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "~/lib/supabase-client";

type SignupDialogProps = {
  dialogRef: RefObject<HTMLDialogElement | null>;
  signedInEmail: string | null;
  onAccountCreated: (userId: string) => void;
};

export function SignupDialog({
  dialogRef,
  signedInEmail,
  onAccountCreated,
}: SignupDialogProps) {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "signin" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  function changeMode(next: typeof mode) {
    setMode(next);
    setPassword("");
    setConfirmation("");
    setNotice("");
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || busy) return;
    if (mode === "signup" && password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setNotice("");
    setBusy(true);
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
          },
        );
        if (error) throw error;
        setNotice(
          "If that email has an account, a password reset link is on its way.",
        );
      } else if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        if (data.user && data.user.identities?.length !== 0)
          onAccountCreated(data.user.id);
        if (data.session) {
          dialogRef.current?.close();
          router.refresh();
        } else {
          setNotice(
            "Check your email to confirm your account, then sign in. If you already have an account, use Sign in.",
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        dialogRef.current?.close();
        router.refresh();
      }
      setPassword("");
      setConfirmation("");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "We could not complete that request. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    if (!supabase || busy) return;
    setBusy(true);
    setError("");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      changeMode("signin");
      dialogRef.current?.close();
      router.refresh();
    } catch {
      setError("Sign out failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "border-primary/25 bg-surface-tan/50 rounded-lg border px-4 py-3 text-[14px] font-normal focus-visible:outline-2 focus-visible:outline-offset-2";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="signup-title"
      className="bg-surface-cream text-primary font-body border-primary/20 m-auto max-h-[90vh] w-[min(92vw,440px)] overflow-y-auto rounded-[24px] border p-7 shadow-2xl backdrop:bg-gray-500/65 sm:p-9"
    >
      <h2
        id="signup-title"
        className="font-display mt-3 text-[32px] leading-tight"
      >
        {signedInEmail
          ? "Your account"
          : mode === "signup"
            ? "Create a free account."
            : mode === "reset"
              ? "Reset your password."
              : "Welcome back."}
      </h2>
      {signedInEmail ? (
        <>
          <p className="text-primary/70 mt-3 text-sm leading-6">
            {signedInEmail}
          </p>
          <p className="text-primary/70 mt-2 text-sm leading-6">
            Your preferences are saved to your account.
          </p>
          <button
            type="button"
            onClick={signOut}
            disabled={busy}
            className="bg-primary text-surface-cream font-mono-ui mt-6 w-full cursor-pointer rounded-full px-6 py-3 text-center text-[14px] tracking-[0.08em] uppercase disabled:opacity-50"
          >
            {busy ? "Signing out…" : "Sign out"}
          </button>
        </>
      ) : (
        <form onSubmit={submit} className="mt-7 grid gap-4">
          <label className="flex flex-col gap-2 text-[14px] font-semibold">
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
            />
          </label>
          {mode !== "reset" && (
            <label className="flex flex-col gap-2 text-[14px] font-semibold">
              Password
              <input
                required
                type="password"
                minLength={mode === "signup" ? 8 : 1}
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
              />
            </label>
          )}
          {mode === "signup" && (
            <label className="flex flex-col gap-2 text-[14px] font-semibold">
              Confirm password
              <input
                required
                type="password"
                minLength={8}
                autoComplete="new-password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                className={inputClass}
              />
            </label>
          )}
          {notice && (
            <p role="status" className="text-[14px] leading-5">
              {notice}
            </p>
          )}
          {!supabase && (
            <p className="text-[14px] leading-5">
              Account access is temporarily unavailable.
            </p>
          )}
          <button
            type="submit"
            disabled={!supabase || busy}
            className="bg-primary text-surface-cream font-mono-ui mt-2 rounded-full px-6 py-3 text-[14px] tracking-[0.08em] uppercase enabled:cursor-pointer disabled:opacity-50"
          >
            {busy
              ? "Please wait…"
              : mode === "signup"
                ? "Create account"
                : mode === "reset"
                  ? "Send reset link"
                  : "Sign in"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => changeMode(mode === "signup" ? "signin" : "signup")}
            className="text-primary mt-2 cursor-pointer rounded-full border border-neutral-400 bg-transparent px-4 py-2 text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
          >
            {mode === "signup"
              ? "Already have an account? Sign in"
              : "New here? Create an account"}
          </button>
          {mode === "signin" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeMode("reset")}
              className="text-primary mt-2 cursor-pointer rounded-full border border-neutral-400 bg-transparent px-4 py-2 text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
            >
              Forgot your password?
            </button>
          )}
          {mode === "reset" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => changeMode("signin")}
              className="text-primary mt-2 cursor-pointer rounded-full border border-neutral-400 bg-transparent px-4 py-2 text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
            >
              Back to sign in
            </button>
          )}
        </form>
      )}
      {error && (
        <p
          role="alert"
          className="border-primary/25 bg-primary/5 mt-4 rounded-xl border px-4 py-3 text-[16px] leading-6 font-semibold"
        >
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => dialogRef.current?.close()}
        className="font-mono-ui border-primary/35 hover:bg-surface-tan/50 mt-5 w-full cursor-pointer rounded-full border px-6 py-3 text-center text-[14px] tracking-[0.08em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {signedInEmail ? "Close" : "Continue as guest"}
      </button>
    </dialog>
  );
}
