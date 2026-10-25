"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { SignupDialog } from "~/app/_components/signup-dialog";
import { OrdinanceFeed } from "~/app/_components/ordinance-feed";
import {
  guestProfileSchema,
  storedProfileInputSchema,
  interestOptions,
  lifeCircumstanceOptions,
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
type ChatRequest = { messages: ChatPayloadMessage[]; ordinanceId?: string };
type Chat = {
  title: string | null;
  messages: ChatMessage[];
  updatedAt?: number;
};

const GENERAL_CHAT = "general";
const NO_MESSAGES: ChatMessage[] = [];
const CHAT_STORAGE_KEY = "legal-seagull-chats";

function locationLabel(place: LocationResult) {
  const placeName = [place.name, place.admin1, place.country]
    .filter(Boolean)
    .join(", ");
  return place.postcode ? `${place.postcode} — ${placeName}` : placeName;
}

const sections = ["Bills", "Amendments"] as const;

export function BillsDashboard() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const signupDialogRef = useRef<HTMLDialogElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const lastChatRequestRef = useRef<{
    request: ChatRequest;
    key: string;
  } | null>(null);
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
  const utils = api.useUtils();
  const saveProfileMutation = api.profile.save.useMutation();
  const [currentSection, setCurrentSection] =
    useState<(typeof sections)[number]>("Bills");
  const [locations, setLocations] = useState<LocationResult[]>([]);
  const [lookupStatus, setLookupStatus] = useState<
    "idle" | "loading" | "empty" | "error"
  >("idle");
  const [chats, setChats] = useState<Record<string, Chat>>({});
  const [activeKey, setActiveKey] = useState(GENERAL_CHAT);
  const [chatDraft, setChatDraft] = useState("");
  const [chatError, setChatError] = useState<{
    key: string;
    message: string;
  } | null>(null);
  const chatsLoaded = useRef(false);
  const activeChat = chats[activeKey];
  const chatMessages = activeChat?.messages ?? NO_MESSAGES;
  const historyEntries = Object.entries(chats)
    .filter(([, chat]) => chat.messages.length > 0)
    .sort(([, a], [, b]) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  const chatErrorMessage =
    chatError?.key === activeKey ? chatError.message : null;
  const selectedOrdinance =
    activeKey === GENERAL_CHAT
      ? null
      : { id: activeKey, name: activeChat?.title ?? "this ordinance" };

  function updateChat(
    key: string,
    update: (messages: ChatMessage[]) => ChatMessage[],
  ) {
    setChats((current) => ({
      ...current,
      [key]: {
        title: current[key]?.title ?? null,
        messages: update(current[key]?.messages ?? []),
        updatedAt: Date.now(),
      },
    }));
  }
  const [chatOpen, setChatOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          chats?: Record<string, Chat>;
          activeKey?: string;
        };
        if (parsed.chats) setChats(parsed.chats);
        if (parsed.activeKey) setActiveKey(parsed.activeKey);
      }
    } catch {}
    chatsLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!chatsLoaded.current) return;
    try {
      window.sessionStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify({ chats, activeKey }),
      );
    } catch {}
  }, [chats, activeKey]);
  const [chatBusy, setChatBusy] = useState(false);
  const chatMutation = api.chat.send.useMutation();

  useEffect(() => {
    if (!chatOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setChatOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [chatOpen]);

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
        setChats({});
        setActiveKey(GENERAL_CHAT);
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
  }, [chatMessages, chatBusy, chatErrorMessage]);

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
      lifeCircumstances: draft.lifeCircumstances,
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

  async function runChat(request: ChatRequest, key: string) {
    const payload = { ...request, messages: trimChatHistory(request.messages) };
    lastChatRequestRef.current = { request: payload, key };
    setChatError(null);
    setChatBusy(true);
    const replyId = crypto.randomUUID();
    let started = false;
    try {
      const stream = await chatMutation.mutateAsync(payload);
      for await (const text of stream) {
        if (!started) {
          started = true;
          updateChat(key, (current) => [
            ...current,
            { id: replyId, role: "model", content: text },
          ]);
        } else {
          updateChat(key, (current) =>
            current.map((message) =>
              message.id === replyId
                ? { ...message, content: message.content + text }
                : message,
            ),
          );
        }
      }
    } catch (error) {
      if (started) {
        updateChat(key, (current) =>
          current.filter((message) => message.id !== replyId),
        );
      }
      setChatError({
        key,
        message:
          error instanceof Error && error.message
            ? error.message
            : "Legal Seagull could not answer right now. Please try again.",
      });
    } finally {
      setChatBusy(false);
    }
  }

  function sendChatMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = chatDraft.trim();
    if (!content || chatBusy) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    const nextMessages = [...chatMessages, userMessage];
    updateChat(activeKey, () => nextMessages);
    setChatDraft("");
    void runChat(
      {
        messages: nextMessages,
        ordinanceId: activeKey === GENERAL_CHAT ? undefined : activeKey,
      },
      activeKey,
    );
  }

  function explainOrdinance(ordinance: { id: string; name: string }) {
    setChatOpen(true);
    setHistoryOpen(false);
    if (chats[ordinance.id]) {
      setActiveKey(ordinance.id);
      return;
    }
    if (chatBusy) return;
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: `Explain ${ordinance.name} in plain language. What would it change, who could it affect, and what is its reported status?`,
    };
    setChats((current) => ({
      ...current,
      [ordinance.id]: {
        title: ordinance.name,
        messages: [message],
        updatedAt: Date.now(),
      },
    }));
    setActiveKey(ordinance.id);
    void runChat(
      { messages: [message], ordinanceId: ordinance.id },
      ordinance.id,
    );
  }

  function retryChat() {
    if (lastChatRequestRef.current && !chatBusy) {
      void runChat(
        lastChatRequestRef.current.request,
        lastChatRequestRef.current.key,
      );
    }
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
      <header className="bg-primary text-surface-cream fixed inset-x-0 top-0 z-[60] flex h-16 items-center justify-between px-6 sm:px-10">
        <div className="flex items-center gap-4">
          <Image
            src="/images/seagull.png"
            alt=""
            width={28}
            height={28}
            className="shrink-0 object-contain brightness-0 invert"
            aria-hidden="true"
          />
          <span className="font-mono-ui text-[13px] tracking-[0.18em] uppercase">
            Legal Seagull
          </span>
        </div>
        <button
          type="button"
          onClick={() => signupDialogRef.current?.showModal()}
          className="font-mono-ui border-surface-cream/50 hover:bg-surface-cream hover:text-primary cursor-pointer rounded-full border px-4 py-2 text-[11px] tracking-[0.12em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {signedInEmail ? "Account" : "Sign in"}
        </button>
      </header>
      <div className="h-16 flex-none" aria-hidden="true" />

      <div
        className={`mx-auto w-full max-w-[1440px] flex-1 px-6 py-10 transition-[padding] duration-500 ease-out sm:px-10 lg:pl-12 ${chatOpen ? "lg:pr-[432px]" : "lg:pr-12"}`}
      >
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
            <div>
              <p className="font-mono-ui text-[11px] tracking-[0.14em] uppercase">
                Your legislative feed
              </p>
              <div className="relative mt-3 inline-flex items-center gap-3 rounded-lg focus-within:outline-2 focus-within:outline-offset-4">
                <h1 className="font-display text-primary text-[42px] leading-none font-semibold tracking-[-0.02em]">
                  <span
                    key={currentSection}
                    className="section-switch-blink inline-block"
                  >
                    {currentSection} for you
                  </span>
                </h1>
                <svg
                  width="20"
                  height="14"
                  viewBox="0 0 20 14"
                  fill="none"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <path
                    d="m4 4 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <select
                  aria-label="Choose feed type"
                  value={currentSection}
                  onChange={(event) =>
                    setCurrentSection(
                      event.target.value === "Amendments"
                        ? "Amendments"
                        : "Bills",
                    )
                  }
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                >
                  {sections.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
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

          {(profile.location || profile.age) && (
            <p className="font-mono-ui text-primary/65 mb-6 text-[11px] tracking-[0.08em]">
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

          <OrdinanceFeed
            key={`${signedInId ?? "guest"}:${profile.location}:${profile.interests.join("|")}`}
            profileLocation={profile.location}
            interests={profile.interests}
            age={profile.age ? Number(profile.age) : null}
            lifeCircumstances={profile.lifeCircumstances}
            section={currentSection}
            onExplain={explainOrdinance}
            chatPending={chatBusy}
          />
        </main>

        <button
          type="button"
          onClick={() => setChatOpen((open) => !open)}
          aria-expanded={chatOpen}
          aria-controls="chat-panel"
          className={`bg-primary text-surface-cream font-mono-ui fixed top-1/2 z-50 -translate-y-1/2 cursor-pointer rounded-l-2xl px-3 py-5 text-[11px] tracking-[0.12em] uppercase shadow-lg transition-[right,opacity] duration-500 ease-out [writing-mode:vertical-rl] focus-visible:outline-2 focus-visible:outline-offset-2 ${chatOpen ? "right-[min(400px,100vw)] max-lg:pointer-events-none max-lg:opacity-0" : "right-0 hover:pr-4"}`}
        >
          {chatOpen ? "Close chat" : "Ask Legal Seagull"}
        </button>

        <div
          aria-hidden="true"
          onClick={() => setChatOpen(false)}
          className={`bg-primary/30 fixed inset-x-0 top-16 bottom-0 z-30 transition-opacity duration-300 lg:hidden ${chatOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        />

        <aside
          id="chat-panel"
          inert={!chatOpen}
          className={`border-primary/25 bg-surface-tan fixed top-16 right-0 bottom-0 z-40 flex w-full max-w-[400px] flex-col overflow-hidden border-l shadow-2xl transition-transform duration-500 ease-out ${chatOpen ? "translate-x-0" : "translate-x-full"}`}
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
              <p
                title={selectedOrdinance?.name}
                className="font-mono-ui text-primary/60 truncate text-[10px] tracking-[0.1em] uppercase"
              >
                {selectedOrdinance
                  ? `Explaining ${selectedOrdinance.name}`
                  : "AI chat workspace"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHistoryOpen((open) => !open)}
              aria-expanded={historyOpen}
              aria-controls="chat-history"
              className="font-mono-ui text-primary/65 hover:text-primary cursor-pointer text-[10px] tracking-[0.1em] uppercase focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {historyOpen ? "Back" : "History"}
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 flex-col">
            {historyOpen && (
              <div
                id="chat-history"
                className="bg-surface-tan absolute inset-0 z-10 flex flex-col overflow-y-auto px-5 py-5"
              >
                <p className="font-mono-ui text-primary/60 mb-3 text-[10px] tracking-[0.1em] uppercase">
                  Chat history
                </p>
                {historyEntries.length === 0 ? (
                  <p className="text-primary/65 text-[13px] leading-6">
                    Your chats will appear here. Each ordinance keeps its own
                    conversation.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2.5">
                    {historyEntries.map(([key, chat]) => (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveKey(key);
                            setHistoryOpen(false);
                          }}
                          aria-current={key === activeKey ? "true" : undefined}
                          className={`w-full cursor-pointer rounded-[14px] border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${key === activeKey ? "border-primary bg-surface-cream" : "border-primary/20 hover:border-primary/50 hover:bg-surface-cream/60"}`}
                        >
                          <span className="font-display line-clamp-2 text-[15px] leading-tight">
                            {chat.title ?? "General questions"}
                          </span>
                          <span className="text-primary/65 mt-1 line-clamp-2 text-[12px] leading-5">
                            {chat.messages.at(-1)?.content}
                          </span>
                          <span className="font-mono-ui text-primary/50 mt-1.5 block text-[9px] tracking-[0.1em] uppercase">
                            {chat.messages.length}{" "}
                            {chat.messages.length === 1
                              ? "message"
                              : "messages"}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {chatMessages.length === 0 && !chatBusy ? (
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
                aria-label="Conversation with Legal Seagull"
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
                      <LinkedText text={message.content} />
                    </div>
                  </div>
                ))}
                {chatBusy && chatMessages.at(-1)?.role === "user" && (
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
              {chatErrorMessage && (
                <div
                  role="alert"
                  className="border-primary/20 bg-surface-cream mb-3 rounded-xl border px-3 py-2.5 text-[11px] leading-4"
                >
                  <p>{chatErrorMessage}</p>
                  <button
                    type="button"
                    onClick={retryChat}
                    disabled={chatBusy}
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
                  disabled={chatBusy}
                  placeholder="Ask Legal Seagull…"
                  aria-label="Message Legal Seagull"
                  className="font-body placeholder:text-primary/50 min-w-0 flex-1 bg-transparent px-2 text-[13px] outline-none disabled:cursor-wait"
                />
                <button
                  type="submit"
                  disabled={!chatDraft.trim() || chatBusy}
                  aria-label="Send message"
                  className="bg-primary text-surface-cream flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-opacity disabled:cursor-not-allowed disabled:opacity-45"
                >
                  ↗
                </button>
              </form>
            </div>
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
            Choose what matters to you.{" "}
            {signedInId
              ? "Your choices are saved to your account."
              : "Your choices are saved on this device. Sign in to save them to your account."}{" "}
            Your location and topics filter the feed. Optional age and life
            circumstances highlight source-supported relevance.
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
            <legend className="text-[13px] font-semibold">
              Life circumstances (optional)
            </legend>
            <p
              id="circumstances-help"
              className="text-primary/70 mt-2 text-[12px] leading-5"
            >
              Choose any that apply. Your age and these choices highlight bills
              that explicitly affect people in your situation. They do not
              determine eligibility or hide other bills. Clear any choice to
              stop using it. These details are not sent to AI services.
            </p>
            <div
              className="mt-3 flex flex-wrap gap-2"
              aria-describedby="circumstances-help"
            >
              {lifeCircumstanceOptions.map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={draft.lifeCircumstances.includes(value)}
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      lifeCircumstances: current.lifeCircumstances.includes(
                        value,
                      )
                        ? current.lifeCircumstances.filter(
                            (item) => item !== value,
                          )
                        : [...current.lifeCircumstances, value],
                    }))
                  }
                  className={`cursor-pointer rounded-full border px-3 py-2 text-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 ${draft.lifeCircumstances.includes(value) ? "border-primary bg-primary text-surface-cream" : "border-primary/25 bg-surface-tan/50 text-primary"}`}
                >
                  {value}
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
              className="font-mono-ui cursor-pointer px-4 py-3 text-[11px] tracking-[0.08em] uppercase"
            >
              Not now
            </button>
            <button
              type="submit"
              disabled={saveProfileMutation.isPending || profileLoading}
              className="bg-primary text-surface-cream font-mono-ui cursor-pointer rounded-full px-6 py-3 text-[11px] tracking-[0.08em] uppercase"
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

function LinkedText({ text }: { text: string }) {
  return text.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
    if (index % 2 === 0) return part;
    const url = part.replace(/[.,;:!?)]+$/, "");
    return (
      <span key={index}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {url}
        </a>
        {part.slice(url.length)}
      </span>
    );
  });
}
