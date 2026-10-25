"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { SignupDialog } from "~/app/_components/signup-dialog";
import { OrdinanceFeed } from "~/app/_components/ordinance-feed";
import {
  guestProfileSchema,
  storedProfileInputSchema,
  interestOptions,
  profileInputSchema,
} from "~/lib/profile";
import { supabase } from "~/lib/supabase-client";
import { api } from "~/trpc/react";

type Profile = {
  location: string;
  locationId: number | string | null;
  age: string;
  interests: string[];
  lifeCircumstances: string[];
};

type LocationResult = {
  id: number | string;
  name: string;
  admin1?: string;
  country?: string;
  postcode?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "model";
  content: string;
};

type ChatPayloadMessage = Pick<ChatMessage, "role" | "content">;

function locationLabel(place: LocationResult) {
  const placeName = [place.name, place.admin1, place.country]
    .filter(Boolean)
    .join(", ");
  return place.postcode ? `${place.postcode} — ${placeName}` : placeName;
}

export function BillsDashboard() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const signupDialogRef = useRef<HTMLDialogElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastChatRequestRef = useRef<ChatPayloadMessage[] | null>(null);
  const [profile, setProfile] = useState<Profile>({
    location: "",
    locationId: null,
    age: "",
    interests: [],
    lifeCircumstances: [],
  });
  const [draft, setDraft] = useState<Profile>(profile);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [signedInId, setSignedInId] = useState<string | null>(null);
  const activeUserRef = useRef<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const lifeCircumstanceQuery = api.ordinances.lifeCircumstances.useQuery(
    undefined,
    { staleTime: 300_000 },
  );
  const lifeCircumstanceOptions = lifeCircumstanceQuery.data ?? [];
  const knownLifeCircumstances = new Set(
    lifeCircumstanceOptions.map((option) => option.key),
  );
  const utils = api.useUtils();
  const saveProfileMutation = api.profile.save.useMutation();
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "loading" | "empty" | "error"
  >("idle");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const chatMutation = api.chat.send.useMutation();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("auth") === "error") {
      setAuthError(
        "That email link has expired or could not be verified. Sign in or request another password reset link.",
      );
    }
    try {
      for (let index = window.localStorage.length - 1; index >= 0; index--) {
        const key = window.localStorage.key(index);
        if (!key?.startsWith("ledgerline-signup-profile:")) continue;
        try {
          const pending = storedProfileInputSchema.safeParse(
            JSON.parse(window.localStorage.getItem(key) ?? "null"),
          );
          if (pending.success)
            window.localStorage.setItem(key, JSON.stringify(pending.data));
          else window.localStorage.removeItem(key);
        } catch {
          window.localStorage.removeItem(key);
        }
      }
      const saved = window.localStorage.getItem("ledgerline-guest-onboarding");
      if (saved) {
        const stored = JSON.parse(saved) as {
          profile?: Profile;
          skipped?: boolean;
        };
        if (stored.profile) {
          const restored = guestProfileSchema.parse(stored.profile);
          window.localStorage.setItem(
            "ledgerline-guest-onboarding",
            JSON.stringify({ profile: restored }),
          );
          setProfile(restored);
          setDraft(restored);
          return;
        }
        if (stored.skipped) {
          window.localStorage.setItem(
            "ledgerline-guest-onboarding",
            JSON.stringify({ skipped: true }),
          );
          return;
        }
      }
    } catch {
      dialogRef.current?.showModal();
      return;
    }
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user.id ?? null;
      activeUserRef.current = userId;
      setSignedInId(userId);
      setSignedInEmail(session?.user.email ?? null);
      if (_event === "SIGNED_OUT") {
        const empty = {
          location: "",
          locationId: null,
          age: "",
          interests: [],
          lifeCircumstances: [],
        };
        setProfile(empty);
        setDraft(empty);
        setProfileError(null);
        setProfileLoading(false);
        setChatMessages([]);
        setChatError(null);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!signedInId) return;
    let cancelled = false;
    setProfileLoading(true);
    setProfileError(null);
    void utils.profile.me
      .fetch(undefined, { staleTime: 0 })
      .then(async (stored) => {
        if (cancelled || activeUserRef.current !== signedInId) return;
        if (stored && stored.id !== signedInId)
          throw new Error("Account changed. Please reload your preferences.");
        const pendingKey = `ledgerline-signup-profile:${signedInId}`;
        const pending = window.localStorage.getItem(pendingKey);
        if (pending) {
          const parsed = storedProfileInputSchema.safeParse(
            JSON.parse(pending),
          );
          const isEmpty =
            !stored ||
            (!stored.tags.length &&
              stored.age === null &&
              !stored.location &&
              !stored.life_circumstances?.length);
          if (parsed.success && isEmpty) {
            stored = await utils.client.profile.save.mutate(parsed.data);
          }
          window.localStorage.removeItem(pendingKey);
          if (cancelled || activeUserRef.current !== signedInId) return;
        }
        const restored: Profile = {
          location: stored?.location ?? "",
          locationId: stored?.location_id ?? null,
          age: stored?.age?.toString() ?? "",
          interests: stored?.tags ?? [],
          lifeCircumstances: stored?.life_circumstances ?? [],
        };
        setProfile(restored);
        setDraft(restored);
      })
      .catch(() => {
        if (!cancelled)
          setProfileError(
            "Your account preferences could not be loaded. Reload the page to try again.",
          );
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [signedInId, utils]);

  useEffect(() => {
    const query = draft.location.trim();
    if (
      draft.locationId !== null ||
      query.length < 3 ||
      (/^\d+$/.test(query) && query.length !== 5)
    ) {
      setLocations([]);
      setLookupStatus("idle");
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => {
      void searchLocations();
    }, 300);

    async function searchLocations() {
      setLookupStatus("loading");
      try {
        let results: LocationResult[];
        if (/^\d{5}$/.test(query)) {
          const response = await fetch(
            `https://api.zippopotam.us/us/${query}`,
            { signal: controller.signal },
          );
          if (response.status === 404) {
            results = [];
          } else {
            if (!response.ok) throw new Error("ZIP lookup failed");
            const data = (await response.json()) as {
              country: string;
              places: { "place name": string; state: string }[];
            };
            results = data.places.map((place, index) => ({
              id: `us:${query}:${index}`,
              name: place["place name"],
              admin1: place.state,
              country: data.country,
              postcode: query,
            }));
          }
        } else {
          const params = new URLSearchParams({
            name: query,
            count: "6",
            language: "en",
            format: "json",
          });
          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?${params}`,
            { signal: controller.signal },
          );
          if (!response.ok) throw new Error("Location lookup failed");
          const data = (await response.json()) as {
            results?: LocationResult[];
          };
          results = data.results ?? [];
        }
        setLocations(results);
        setLookupStatus(results.length ? "idle" : "empty");
      } catch {
        if (!controller.signal.aborted) {
          setLocations([]);
          setLookupStatus("error");
        }
      }
    }

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [draft.location, draft.locationId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatMutation.isPending, chatError]);

  function openDetails() {
    setDraft(profile);
    setLocations([]);
    setLookupStatus("idle");
    dialogRef.current?.showModal();
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saveProfileMutation.isPending || profileLoading) return;
    if (draft.location.trim() && draft.locationId === null) {
      setLookupStatus("empty");
      locationInputRef.current?.focus();
      return;
    }
    setProfileError(null);
    const result = profileInputSchema.safeParse({
      tags: draft.interests,
      lifeCircumstances: draft.lifeCircumstances.filter((value) =>
        knownLifeCircumstances.has(value),
      ),
      age: draft.age ? Number(draft.age) : null,
      location: draft.location || null,
      locationId: draft.locationId === null ? null : String(draft.locationId),
    });
    if (!result.success) {
      setProfileError(
        "Check your preferences. Age must be a whole number from 1 to 120.",
      );
      return;
    }
    const userId = activeUserRef.current;
    try {
      if (userId) {
        await saveProfileMutation.mutateAsync(result.data);
        if (activeUserRef.current !== userId) return;
      } else {
        window.localStorage.setItem(
          "ledgerline-guest-onboarding",
          JSON.stringify({ profile: draft }),
        );
      }
      setProfile(draft);
      dialogRef.current?.close();
    } catch {
      setProfileError("Your preferences could not be saved. Please try again.");
    }
  }

  function skipOnboarding() {
    if (!window.localStorage.getItem("ledgerline-guest-onboarding")) {
      window.localStorage.setItem(
        "ledgerline-guest-onboarding",
        JSON.stringify({ skipped: true }),
      );
    }
    dialogRef.current?.close();
  }

  function runChat(messages: ChatPayloadMessage[]) {
    const payload = trimChatHistory(messages);
    lastChatRequestRef.current = payload;
    setChatError(null);
    chatMutation.mutate(
      { messages: payload },
      {
        onSuccess(data) {
          setChatMessages((current) => [
            ...current,
            {
              id: crypto.randomUUID(),
              role: data.message.role,
              content: data.message.content,
            },
          ]);
        },
        onError(error) {
          setChatError(
            error.message ||
            "Legal Seagull could not answer right now. Please try again.",
          );
        },
      },
    );
  }

  function sendChatMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = chatDraft.trim();
    if (!content || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const nextMessages = [...chatMessages, userMessage];
    setChatMessages(nextMessages);
    setChatDraft("");
    runChat(nextMessages);
  }

  function retryChat() {
    if (lastChatRequestRef.current && !chatMutation.isPending) {
      runChat(lastChatRequestRef.current);
    }
  }

  function clearChat() {
    setChatMessages([]);
    setChatDraft("");
    setChatError(null);
    lastChatRequestRef.current = null;
  }

  return (
    <div
      className="text-primary font-body flex min-h-screen w-full flex-col"
      style={{
        backgroundColor: "var(--color-surface-cream)",
        backgroundImage:
          "radial-gradient(circle, rgb(118 32 40 / 0.09) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <header className="bg-primary text-surface-cream flex h-16 flex-none items-center justify-between px-6 sm:px-10">
        <div className="flex items-center gap-4">
          <Image
            src="/images/seagull.png"
            alt=""
            width={28}
            height={28}
            className="shrink-0 object-contain brightness-0 invert"
            aria-hidden="true"
          />
          <span className="font-mono-ui text-[14px] tracking-[0.18em] uppercase">
            Legal Seagull
          </span>
        </div>
        <button
          type="button"
          onClick={() => signupDialogRef.current?.showModal()}
          className="font-mono-ui border-surface-cream/50 hover:bg-surface-cream hover:text-primary cursor-pointer rounded-full border px-4 py-2 text-[14px] tracking-[0.12em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {signedInEmail ? "Account" : "Sign in"}
        </button>
      </header>

      <div className="mx-auto grid w-full max-w-[1440px] flex-1 gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_350px] lg:px-12">
        <main className="min-w-0">
          {authError && (
            <p
              role="alert"
              className="border-primary/25 bg-surface-tan mb-4 rounded-lg border p-3 text-sm"
            >
              {authError}
            </p>
          )}
          {profileError && (
            <p
              role="alert"
              className="border-primary/25 bg-surface-tan mb-4 rounded-lg border p-3 text-sm"
            >
              {profileError}
            </p>
          )}
          {profileLoading && (
            <p role="status" className="mb-4 text-sm">
              Loading your preferences…
            </p>
          )}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-display text-primary text-[42px] leading-none font-semibold tracking-[-0.02em]">
              Legislation for you
            </h1>
            <button
              type="button"
              onClick={openDetails}
              className="border-primary/30 hover:bg-primary hover:text-surface-cream font-mono-ui cursor-pointer rounded-full border px-4 py-2.5 text-[14px] tracking-[0.1em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {profile.location || profile.interests.length
                ? "Edit preferences"
                : "Set up feed"}
            </button>
          </div>

          {(profile.location || profile.age) && (
            <p className="font-mono-ui text-primary/65 mb-6 text-[14px] tracking-[0.08em]">
              {profile.location}
              {profile.age && (
                <>
                  {profile.location && " · "}Age {profile.age}
                </>
              )}
            </p>
          )}

          {profile.interests.length > 0 && (
            <div
              className="mb-6 flex flex-wrap items-center gap-2"
              aria-label="Your interests"
            >
              <span className="font-mono-ui text-primary/65 mr-1 text-[14px] tracking-[0.08em] uppercase">
                Following
              </span>
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="border-primary/30 bg-surface-cream rounded-full border px-3 py-1 text-[14px]"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}

          <OrdinanceFeed
            key={`${signedInId ?? "guest"}:${profile.location}:${profile.interests.join("|")}`}
            profileLocation={profile.location}
            interests={profile.interests}
            age={profile.age ? Number(profile.age) : null}
            lifeCircumstances={profile.lifeCircumstances}
            section="Bills"
          />
        </main>

        <aside
          className="border-primary/25 bg-surface-tan flex min-h-[500px] flex-col overflow-hidden rounded-[22px] border lg:sticky lg:top-8 lg:h-[calc(100vh-128px)]"
          aria-label="AI chat workspace"
        >
          <div className="border-primary/20 flex items-center gap-3 border-b px-6 py-5">
            <div
              className="bg-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              aria-hidden="true"
            >
              <Image
                src="/images/seagull.png"
                alt=""
                width={25}
                height={25}
                className="object-contain brightness-0 invert"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-[22px] leading-tight">
                Ask Legal Seagull
              </h2>
              <p className="font-mono-ui text-primary/60 text-[14px] tracking-[0.1em] uppercase">
                AI chat workspace
              </p>
            </div>
            {chatMessages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                disabled={chatMutation.isPending}
                className="font-mono-ui text-primary/65 hover:text-primary cursor-pointer text-[14px] tracking-[0.1em] uppercase disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>
            )}
          </div>
          {chatMessages.length === 0 && !chatMutation.isPending ? (
            <div className="flex flex-1 flex-col justify-center px-7 py-10 text-center">
              <div
                className="border-primary/20 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <path
                    d="M5 6.5h15v11H10l-5 3v-14Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 11h7M9 14h5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="font-display text-[25px]">
                Make sense of what matters.
              </h3>
              <p className="text-primary/65 mx-auto mt-3 max-w-[250px] text-[14px] leading-6">
                Ask about legislation, civic processes, and what a bill could
                mean in plain language.
              </p>
            </div>
          ) : (
            <div
              role="log"
              aria-live="polite"
              aria-label="Conversation with Legal Seagull"
              className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5"
            >
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-[16px] px-4 py-3 text-left text-[14px] leading-5 whitespace-pre-wrap ${
                      message.role === "user"
                        ? "bg-primary text-surface-cream rounded-br-sm"
                        : "bg-surface-cream border-primary/15 rounded-bl-sm border"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div
                  className="flex justify-start"
                  aria-label="Legal Seagull is thinking"
                >
                  <div className="bg-surface-cream border-primary/15 flex gap-1 rounded-[16px] rounded-bl-sm border px-4 py-4">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="bg-primary/55 chat-thinking-dot h-1.5 w-1.5 rounded-full"
                        style={{ animationDelay: `${dot * 160}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
          <div className="border-primary/20 border-t p-4">
            {chatError && (
              <div
                role="alert"
                className="border-primary/20 bg-surface-cream mb-3 rounded-xl border px-3 py-2.5 text-[14px] leading-4"
              >
                <p>{chatError}</p>
                <button
                  type="button"
                  onClick={retryChat}
                  disabled={chatMutation.isPending}
                  className="font-mono-ui mt-2 cursor-pointer text-[14px] tracking-[0.1em] uppercase underline underline-offset-2 disabled:cursor-not-allowed"
                >
                  Try again
                </button>
              </div>
            )}
            <form
              onSubmit={sendChatMessage}
              className="border-primary/25 bg-surface-cream flex items-center gap-2 rounded-[14px] border p-2"
            >
              <input
                type="text"
                value={chatDraft}
                maxLength={2_000}
                onChange={(event) => setChatDraft(event.target.value)}
                disabled={chatMutation.isPending}
                placeholder="Ask Legal Seagull…"
                aria-label="Message Legal Seagull"
                className="font-body placeholder:text-primary/50 min-w-0 flex-1 bg-transparent px-2 text-[14px] outline-none disabled:cursor-wait"
              />
              <button
                type="submit"
                disabled={!chatDraft.trim() || chatMutation.isPending}
                aria-label="Send message"
                className="bg-primary text-surface-cream flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
              >
                ↗
              </button>
            </form>
          </div>
        </aside>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="profile-title"
        className="bg-surface-cream text-primary font-body border-primary/20 m-auto max-h-[90vh] w-[min(92vw,560px)] overflow-y-auto rounded-[24px] border p-0 shadow-2xl backdrop:bg-gray-500/65"
      >
        <form onSubmit={saveProfile} className="p-7 sm:p-9">
          <p className="font-mono-ui text-[14px] tracking-[0.14em] uppercase">
            Set up your feed
          </p>
          <h2
            id="profile-title"
            className="font-display mt-3 text-[36px] leading-tight"
          >
            Make this feed yours.
          </h2>
          <p className="text-primary/70 mt-3 text-sm leading-6">
            Choose what matters to you.{" "}
            {signedInId
              ? "Your choices are saved to your account."
              : "Your choices are saved on this device. Sign in to save them to your account."}{" "}
            Your location and topics filter the feed. Optional age and life
            circumstances move bills that explicitly affect you to the top.
          </p>
          <div className="mt-7 grid gap-5">
            <fieldset>
              <legend className="text-[14px] font-semibold">
                Topics you care about
              </legend>
              <p className="text-primary/65 mt-1 text-[14px]">
                Pick any number of topics. You can change them later.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {interestOptions.map((interest) => {
                  const selected = draft.interests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          interests: current.interests.includes(interest)
                            ? current.interests.filter(
                              (item) => item !== interest,
                            )
                            : [...current.interests, interest],
                        }))
                      }
                      className={`cursor-pointer rounded-full border px-4 py-2 text-[14px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${selected ? "border-primary bg-primary text-surface-cream" : "border-primary/30 bg-surface-tan/40 hover:bg-surface-tan"}`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="flex flex-col gap-2 text-[14px] font-semibold">
              <label htmlFor="location-search">Location (optional)</label>
              <div className="relative">
                <input
                  ref={locationInputRef}
                  id="location-search"
                  autoFocus
                  type="text"
                  autoComplete="off"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={locations.length > 0}
                  aria-controls="location-suggestions"
                  aria-describedby="location-help"
                  value={draft.location}
                  onChange={(event) => {
                    setDraft((current) => ({
                      ...current,
                      location: event.target.value,
                      locationId: null,
                    }));
                    setLookupStatus("idle");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown" && locations.length) {
                      event.preventDefault();
                      document.getElementById("location-option-0")?.focus();
                    }
                  }}
                  placeholder="Search city or 5-digit ZIP"
                  className="border-primary/25 bg-surface-tan/50 w-full rounded-lg border px-4 py-3 text-[14px] font-normal focus-visible:outline-2 focus-visible:outline-offset-2"
                />
                {locations.length > 0 && (
                  <ul
                    id="location-suggestions"
                    role="listbox"
                    aria-label="Matching locations"
                    className="bg-surface-cream border-primary/25 absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border p-1 shadow-lg"
                  >
                    {locations.map((place, index) => (
                      <li key={place.id}>
                        <button
                          id={`location-option-${index}`}
                          type="button"
                          role="option"
                          aria-selected={false}
                          onClick={() => {
                            setDraft((current) => ({
                              ...current,
                              location: locationLabel(place),
                              locationId: place.id,
                            }));
                            setLocations([]);
                            setLookupStatus("idle");
                            locationInputRef.current?.focus();
                          }}
                          className="hover:bg-surface-tan focus:bg-surface-tan w-full cursor-pointer rounded-md px-3 py-2 text-left text-[14px] font-normal focus-visible:outline-none"
                        >
                          {locationLabel(place)}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p
                id="location-help"
                className="text-primary/65 text-[14px] font-normal"
              >
                {lookupStatus === "loading"
                  ? "Searching locations…"
                  : lookupStatus === "error"
                    ? "Location search is unavailable. Try again."
                    : lookupStatus === "empty"
                      ? /^\d{5}$/.test(draft.location.trim())
                        ? "No matching ZIP found. Check the five digits."
                        : "Choose a location from the suggestions."
                      : draft.locationId !== null
                        ? "Location selected"
                        : /^\d{5}$/.test(draft.location.trim())
                          ? "Choose the matching ZIP below."
                          : /^\d+$/.test(draft.location.trim())
                            ? "Enter all 5 digits of a US ZIP code."
                            : "Type at least 3 characters, then choose a match."}
              </p>
              <p className="text-primary/55 text-[14px] font-normal">
                Location data: GeoNames via{" "}
                <a
                  href="https://open-meteo.com/en/docs/geocoding-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  Open-Meteo
                </a>{" "}
                and{" "}
                <a
                  href="https://docs.zippopotam.us/docs/getting-started/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  Zippopotam.us
                </a>
              </p>
            </div>
            <label className="flex flex-col gap-2 text-[14px] font-semibold">
              Age for relevance (optional)
              <input
                type="number"
                min="1"
                step="1"
                max="120"
                value={draft.age}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    age: event.target.value,
                  }))
                }
                placeholder="Your age in years"
                className="border-primary/25 bg-surface-tan/50 rounded-lg border px-4 py-3 text-[14px] font-normal focus-visible:outline-2 focus-visible:outline-offset-2"
              />
            </label>
          </div>
          <fieldset className="border-primary/20 mt-6 border-t pt-5">
            <legend className="text-[14px] font-semibold">
              Life circumstances (optional)
            </legend>
            <p
              id="circumstances-help"
              className="text-primary/70 mt-2 text-[14px] leading-5"
            >
              This information is used to improve the relevance
              of the legislation presented to you. This will not exclude results from
              your feed.
            </p>
            {lifeCircumstanceQuery.isError ? (
              <p role="alert" className="mt-3 text-[14px]">
                Life circumstances could not be loaded. Refresh the page to try
                again.
              </p>
            ) : lifeCircumstanceQuery.isPending ? (
              <p role="status" className="mt-3 text-[14px]">
                Loading life circumstances…
              </p>
            ) : lifeCircumstanceOptions.length === 0 ? (
              <p role="status" className="mt-3 text-[14px]">
                No life circumstances are available yet.
              </p>
            ) : null}
            <div
              className="mt-3 flex flex-wrap gap-2"
              aria-describedby="circumstances-help"
            >
              {lifeCircumstanceOptions.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={draft.lifeCircumstances.includes(key)}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      lifeCircumstances: current.lifeCircumstances.includes(key)
                        ? current.lifeCircumstances.filter(
                            (item) => item !== key,
                          )
                        : [...current.lifeCircumstances, key],
                    }))
                  }
                  className={`cursor-pointer rounded-full border px-3 py-2 text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 ${draft.lifeCircumstances.includes(key) ? "border-primary bg-primary text-surface-cream" : "border-primary/25 bg-surface-tan/50 text-primary"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>
          {profileError && (
            <p role="alert" className="mt-4 text-sm">
              {profileError}
            </p>
          )}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={skipOnboarding}
              className="font-mono-ui cursor-pointer px-4 py-3 text-[14px] tracking-[0.08em] uppercase"
            >
              Not now
            </button>
            <button
              type="submit"
              disabled={saveProfileMutation.isPending || profileLoading}
              className="bg-primary text-surface-cream font-mono-ui cursor-pointer rounded-full px-6 py-3 text-[14px] tracking-[0.08em] uppercase"
            >
              {saveProfileMutation.isPending ? "Saving…" : "Save preferences"}
            </button>
          </div>
        </form>
      </dialog>
      <SignupDialog
        dialogRef={signupDialogRef}
        signedInEmail={signedInEmail}
        onAccountCreated={(userId) => {
          const parsed = profileInputSchema.safeParse({
            tags: profile.interests,
            lifeCircumstances: profile.lifeCircumstances,
            age: profile.age ? Number(profile.age) : null,
            location: profile.location || null,
            locationId:
              profile.locationId === null ? null : String(profile.locationId),
          });
          if (parsed.success) {
            try {
              window.localStorage.setItem(
                `ledgerline-signup-profile:${userId}`,
                JSON.stringify(parsed.data),
              );
            } catch {
              setProfileError(
                "Your account was created. Save your preferences again after signing in.",
              );
            }
          }
        }}
      />
    </div>
  );
}

function trimChatHistory(messages: ChatPayloadMessage[]) {
  const payload = messages.slice(-12);
  let totalCharacters = payload.reduce(
    (total, message) => total + message.content.length,
    0,
  );

  while (payload.length > 1 && totalCharacters > 12_000) {
    const removed = payload.shift();
    totalCharacters -= removed?.content.length ?? 0;
  }

  return payload;
}
