"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

import { SignupDialog } from "~/app/_components/signup-dialog";
import { supabase } from "~/lib/supabase-client";
import { api } from "~/trpc/react";

type Profile = {
  location: string;
  locationId: number | string | null;
  age: string;
  gender: string;
  interests: string[];
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
  const placeName = [
    place.name,
    place.admin1 !== place.name ? place.admin1 : undefined,
    place.country,
  ]
    .filter(Boolean)
    .join(", ");
  return place.postcode ? `${place.postcode} — ${placeName}` : placeName;
}

const genderOptions = ["Woman", "Man", "Non-binary", "Prefer not to say"];
const interestOptions = [
  "Nature",
  "Health",
  "Education",
  "Housing",
  "Jobs",
  "Transportation",
  "Public safety",
  "Civil rights",
];
const sections = ["Bills", "Amendments", "Elected officials"] as const;

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
    gender: "",
    interests: [],
  });
  const [draft, setDraft] = useState<Profile>(profile);
  const [signedInEmail, setSignedInEmail] = useState<string | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "loading" | "empty" | "error"
  >("idle");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatDraft, setChatDraft] = useState("");
  const [chatError, setChatError] = useState<string | null>(null);
  const chatMutation = api.chat.send.useMutation();
  const currentSection = sections[sectionIndex] ?? sections[0];
  const previousSection =
    sections[(sectionIndex - 1 + sections.length) % sections.length] ??
    sections[0];
  const nextSection =
    sections[(sectionIndex + 1) % sections.length] ?? sections[0];

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("ledgerline-guest-onboarding");
      if (saved) {
        const stored = JSON.parse(saved) as {
          profile?: Profile;
          skipped?: boolean;
        };
        if (stored.profile) {
          const restored = {
            ...stored.profile,
            interests: stored.profile.interests ?? [],
          };
          setProfile(restored);
          setDraft(restored);
          return;
        }
        if (stored.skipped) return;
      }
    } catch {
      dialogRef.current?.showModal();
      return;
    }
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => {
      setSignedInEmail(data.user?.email ?? null);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedInEmail(session?.user.email ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

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

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.location.trim() && draft.locationId === null) {
      setLookupStatus("empty");
      locationInputRef.current?.focus();
      return;
    }
    setProfile(draft);
    window.localStorage.setItem(
      "ledgerline-guest-onboarding",
      JSON.stringify({ profile: draft }),
    );
    dialogRef.current?.close();
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
              "Ledgerline could not answer right now. Please try again.",
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
        <div className="flex items-center gap-2.5">
          <svg
            width="30"
            height="16"
            viewBox="0 0 30 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 8C4 2 7 2 9 8C11 14 14 14 16 8C18 2 21 2 23 8C25 14 28 14 29 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-mono-ui text-[13px] tracking-[0.18em] uppercase">
            Ledgerline
          </span>
        </div>
        <button
          type="button"
          onClick={() => signupDialogRef.current?.showModal()}
          className="font-mono-ui border-surface-cream/50 hover:bg-surface-cream hover:text-primary cursor-pointer rounded-full border px-4 py-2 text-[11px] tracking-[0.12em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {signedInEmail ? "Account" : "Sign up"}
        </button>
      </header>

      <div className="mx-auto grid w-full max-w-[1440px] flex-1 gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_350px] lg:px-12">
        <main className="min-w-0">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono-ui text-[11px] tracking-[0.14em] uppercase">
                Your legislative feed
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex w-9 flex-col" aria-label="Switch views">
                  <button
                    type="button"
                    onClick={() =>
                      setSectionIndex(
                        (current) =>
                          (current - 1 + sections.length) % sections.length,
                      )
                    }
                    aria-label={`Switch to ${previousSection}`}
                    title={`Switch to ${previousSection}`}
                    className="text-primary hover:bg-surface-tan flex h-5 cursor-pointer items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <svg
                      width="18"
                      height="12"
                      viewBox="0 0 18 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m3 9 6-6 6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSectionIndex(
                        (current) => (current + 1) % sections.length,
                      )
                    }
                    aria-label={`Switch to ${nextSection}`}
                    title={`Switch to ${nextSection}`}
                    className="text-primary hover:bg-surface-tan flex h-5 cursor-pointer items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <svg
                      width="18"
                      height="12"
                      viewBox="0 0 18 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="m3 3 6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <h1 className="font-display text-primary text-[42px] leading-none font-semibold tracking-[-0.02em]">
                  <span
                    key={currentSection}
                    className="section-switch-blink inline-block"
                  >
                    {currentSection} for you
                  </span>
                </h1>
              </div>
              <p className="font-mono-ui text-primary/60 mt-2 pl-12 text-[11px] tracking-[0.08em]">
                {sectionIndex + 1} / {sections.length} · Use the arrows to
                switch views
              </p>
            </div>
            <button
              type="button"
              onClick={openDetails}
              className="border-primary/30 hover:bg-primary hover:text-surface-cream font-mono-ui cursor-pointer rounded-full border px-4 py-2.5 text-[11px] tracking-[0.1em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {profile.location || profile.interests.length
                ? "Edit preferences"
                : "Set up feed"}
            </button>
          </div>

          {(profile.location || profile.age || profile.gender) && (
            <p className="font-mono-ui text-primary/65 mb-6 text-[11px] tracking-[0.08em]">
              {profile.location}
              {profile.age && (
                <>
                  {profile.location && " · "}Age {profile.age}
                </>
              )}
              {profile.gender && (
                <>
                  {(profile.location || profile.age) && " · "}
                  {profile.gender}
                </>
              )}
            </p>
          )}

          {profile.interests.length > 0 && (
            <div
              className="mb-6 flex flex-wrap items-center gap-2"
              aria-label="Your interests"
            >
              <span className="font-mono-ui text-primary/65 mr-1 text-[11px] tracking-[0.08em] uppercase">
                Following
              </span>
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="border-primary/30 bg-surface-cream rounded-full border px-3 py-1 text-[12px]"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}

          <div
            key={currentSection}
            className="section-switch-blink grid gap-5"
            aria-label={`${currentSection} results`}
          >
            {[1, 2, 3].map((slot) => (
              <div
                key={slot}
                aria-label={`Empty ${currentSection.toLowerCase()} slot ${slot}`}
                className="bill-loading-slot border-primary/20 bg-surface-tan/75 h-[190px] rounded-[20px] border"
              />
            ))}
          </div>
        </main>

        <aside
          className="border-primary/25 bg-surface-tan flex min-h-[500px] flex-col overflow-hidden rounded-[22px] border lg:sticky lg:top-8 lg:h-[calc(100vh-128px)]"
          aria-label="AI chat workspace"
        >
          <div className="border-primary/20 flex items-center gap-3 border-b px-6 py-5">
            <div
              className="bg-primary text-surface-cream font-display flex h-10 w-10 items-center justify-center rounded-full text-xl italic"
              aria-hidden="true"
            >
              L
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-[22px] leading-tight">
                Ask Ledgerline
              </h2>
              <p className="font-mono-ui text-primary/60 text-[10px] tracking-[0.1em] uppercase">
                AI chat workspace
              </p>
            </div>
            {chatMessages.length > 0 && (
              <button
                type="button"
                onClick={clearChat}
                disabled={chatMutation.isPending}
                className="font-mono-ui text-primary/65 hover:text-primary cursor-pointer text-[9px] tracking-[0.1em] uppercase disabled:cursor-not-allowed disabled:opacity-40"
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
              <p className="text-primary/65 mx-auto mt-3 max-w-[250px] text-[13px] leading-6">
                Ask about legislation, civic processes, and what a bill could
                mean in plain language.
              </p>
            </div>
          ) : (
            <div
              role="log"
              aria-live="polite"
              aria-label="Conversation with Ledgerline"
              className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5"
            >
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-[16px] px-4 py-3 text-left text-[13px] leading-5 whitespace-pre-wrap ${
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
                  aria-label="Ledgerline is thinking"
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
                className="border-primary/20 bg-surface-cream mb-3 rounded-xl border px-3 py-2.5 text-[11px] leading-4"
              >
                <p>{chatError}</p>
                <button
                  type="button"
                  onClick={retryChat}
                  disabled={chatMutation.isPending}
                  className="font-mono-ui mt-2 cursor-pointer text-[9px] tracking-[0.1em] uppercase underline underline-offset-2 disabled:cursor-not-allowed"
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
                placeholder="Ask Ledgerline…"
                aria-label="Message Ledgerline"
                className="font-body placeholder:text-primary/50 min-w-0 flex-1 bg-transparent px-2 text-[13px] outline-none disabled:cursor-wait"
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
          <p className="font-mono-ui text-[11px] tracking-[0.14em] uppercase">
            Set up your feed
          </p>
          <h2
            id="profile-title"
            className="font-display mt-3 text-[36px] leading-tight"
          >
            Make this feed yours.
          </h2>
          <p className="text-primary/70 mt-3 text-sm leading-6">
            Choose what matters to you. Browsing is free and does not require an
            account. Your choices are saved on this device. Bill recommendations
            are not connected yet.
          </p>
          <div className="mt-7 grid gap-5">
            <fieldset>
              <legend className="text-[13px] font-semibold">
                Topics you care about
              </legend>
              <p className="text-primary/65 mt-1 text-[11px]">
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
                      className={`cursor-pointer rounded-full border px-4 py-2 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${selected ? "border-primary bg-primary text-surface-cream" : "border-primary/30 bg-surface-tan/40 hover:bg-surface-tan"}`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="flex flex-col gap-2 text-[13px] font-semibold">
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
                          className="hover:bg-surface-tan focus:bg-surface-tan w-full cursor-pointer rounded-md px-3 py-2 text-left text-[13px] font-normal focus-visible:outline-none"
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
                className="text-primary/65 text-[11px] font-normal"
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
              <p className="text-primary/55 text-[10px] font-normal">
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
            <label className="flex flex-col gap-2 text-[13px] font-semibold">
              Age (optional)
              <input
                type="number"
                min="1"
                max="120"
                value={draft.age}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    age: event.target.value,
                  }))
                }
                placeholder="Your age"
                className="border-primary/25 bg-surface-tan/50 rounded-lg border px-4 py-3 text-[14px] font-normal focus-visible:outline-2 focus-visible:outline-offset-2"
              />
            </label>
            <label className="flex flex-col gap-2 text-[13px] font-semibold">
              Gender (optional)
              <select
                value={draft.gender}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    gender: event.target.value,
                  }))
                }
                className="border-primary/25 bg-surface-tan/50 rounded-lg border px-4 py-3 text-[14px] font-normal focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <option value="">Select</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={skipOnboarding}
              className="font-mono-ui cursor-pointer px-4 py-3 text-[11px] tracking-[0.08em] uppercase"
            >
              Not now
            </button>
            <button
              type="submit"
              className="bg-primary text-surface-cream font-mono-ui cursor-pointer rounded-full px-6 py-3 text-[11px] tracking-[0.08em] uppercase"
            >
              Save preferences
            </button>
          </div>
        </form>
      </dialog>
      <SignupDialog dialogRef={signupDialogRef} signedInEmail={signedInEmail} />
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
