"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cityResearchLookbackDays } from "~/lib/city-research";
import {
  isZipQuery,
  locationLabel,
  searchUsPlaces,
  type LocationResult,
} from "~/lib/location-search";
import { api } from "~/trpc/react";

export type ResearchRun = { runId: string; label: string };

const storageKey = "city-research-run";
const doneStatuses = ["completed", "partial"];
const serviceUnavailable = "This service is temporarily unavailable.";

function readStoredRun(): ResearchRun | null {
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as ResearchRun) : null;
  } catch {
    return null;
  }
}

function writeStoredRun(run: ResearchRun | null) {
  try {
    if (run) window.sessionStorage.setItem(storageKey, JSON.stringify(run));
    else window.sessionStorage.removeItem(storageKey);
  } catch {
    return;
  }
}

export function useResearchRun() {
  const [run, setRunState] = useState<ResearchRun | null>(null);
  useEffect(() => {
    setRunState(readStoredRun());
  }, []);
  const setRun = useCallback((next: ResearchRun | null) => {
    writeStoredRun(next);
    setRunState(next);
  }, []);
  return [run, setRun] as const;
}

function researchLabel(place: LocationResult) {
  return [place.name, place.admin1].filter(Boolean).join(", ");
}

export function CityResearchStatus({
  run,
  onDismiss,
}: {
  run: ResearchRun;
  onDismiss: () => void;
}) {
  const utils = api.useUtils();
  const status = api.ordinances.cityResearchStatus.useQuery(
    { runId: run.runId },
    {
      refetchInterval: (query) => {
        const current = query.state.data?.status;
        if (query.state.error) return false;
        return current && [...doneStatuses, "failed"].includes(current)
          ? false
          : 5000;
      },
      refetchOnWindowFocus: false,
    },
  );
  const checkNow = api.ordinances.checkResearchNow.useMutation({
    onSuccess: () => void status.refetch(),
  });
  const current = status.data?.status;
  const done = current !== undefined && doneStatuses.includes(current);

  useEffect(() => {
    if (done) void utils.ordinances.locations.invalidate();
  }, [done, utils]);

  if (status.isError)
    return (
      <Card role="alert">
        <h2 className="font-display text-[26px]">
          We couldn&apos;t check on {run.label}.
        </h2>
        <p className="text-primary/70 mt-2 max-w-[480px] text-[14px] leading-6">
          Please try again later.
        </p>
        <DismissButton onClick={onDismiss} />
      </Card>
    );

  if (current === "failed")
    return (
      <Card role="alert">
        <h2 className="font-display text-[26px]">
          {status.data?.failureCode === "credit_limit_reached"
            ? serviceUnavailable
            : `We couldn't finish researching ${run.label}.`}
        </h2>
        <p className="text-primary/70 mt-2 max-w-[480px] text-[14px] leading-6">
          {status.data?.failureCode === "credit_limit_reached"
            ? "Research for new cities is paused right now. Please check back later."
            : "Please try again later."}
        </p>
        <DismissButton onClick={onDismiss} />
      </Card>
    );

  if (done)
    return (
      <Card>
        <h2 className="font-display text-[26px]">
          Thank you for adding {run.label}!
        </h2>
        <p className="text-primary/70 mt-2 max-w-[480px] text-[14px] leading-6">
          Its ordinances will appear in the Location menu as soon as they are
          saved.
        </p>
        <DismissButton onClick={onDismiss} />
      </Card>
    );

  return (
    <Card>
      <h2 className="font-display text-[26px]">Researching {run.label}</h2>
      <p className="text-primary/70 mt-2 max-w-[480px] text-[14px] leading-6">
        This can take several minutes. You can leave this page. The city will
        appear in the Location menu when its ordinances are saved.
      </p>
      <div
        aria-hidden="true"
        className="bg-primary/10 relative mt-5 h-1.5 overflow-hidden rounded-full"
      >
        <div className="research-sweep bg-primary absolute inset-y-0 left-0 w-1/3 rounded-full" />
      </div>
      {process.env.NODE_ENV !== "production" && (
        <button
          type="button"
          onClick={() => checkNow.mutate()}
          disabled={checkNow.isPending}
          className="border-primary/30 hover:bg-primary/5 mt-5 cursor-pointer rounded-full border px-4 py-2 text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60"
        >
          {checkNow.isPending ? "Checking…" : "Check status now (local)"}
        </button>
      )}
    </Card>
  );
}

export function CityResearchButton({
  onStarted,
  onSelectMunicipality,
}: {
  onStarted: (run: ResearchRun) => void;
  onSelectMunicipality: (municipalityId: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [step, setStep] = useState<"search" | "confirm">("search");
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<LocationResult[]>([]);
  const [lookup, setLookup] = useState<"idle" | "loading" | "empty" | "error">(
    "idle",
  );
  const [chosen, setChosen] = useState<LocationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const request = api.ordinances.requestCity.useMutation();

  useEffect(() => {
    const trimmed = query.trim();
    if (
      step !== "search" ||
      trimmed.length < 3 ||
      (/^\d+$/.test(trimmed) && trimmed.length !== 5)
    ) {
      setPlaces([]);
      setLookup("idle");
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLookup("loading");
      searchUsPlaces(trimmed, controller.signal)
        .then((results) => {
          setPlaces(results);
          setLookup(results.length ? "idle" : "empty");
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setPlaces([]);
          setLookup("error");
        });
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, step]);

  function closeDialog() {
    dialogRef.current?.close();
  }

  function resetDialog() {
    setStep("search");
    setQuery("");
    setPlaces([]);
    setLookup("idle");
    setChosen(null);
    setError(null);
  }

  async function startResearch() {
    if (!chosen) return;
    if (!chosen.admin1) {
      setError("Choose a city from the suggestions.");
      return;
    }
    setError(null);
    try {
      const result = await request.mutateAsync({
        city: chosen.name,
        state: chosen.admin1,
      });
      closeDialog();
      if (result.status === "exists") {
        if (result.municipalityId) onSelectMunicipality(result.municipalityId);
        return;
      }
      onStarted({ runId: result.runId, label: researchLabel(chosen) });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : serviceUnavailable);
    }
  }

  const lookupHelp =
    lookup === "loading"
      ? "Searching U.S. locations…"
      : lookup === "error"
        ? "Location search is unavailable. Try again."
        : lookup === "empty"
          ? isZipQuery(query.trim())
            ? "No matching U.S. ZIP code found. Check the five digits."
            : "No matching U.S. city found."
          : "Type at least 3 characters or a 5-digit ZIP, then choose a match.";

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className="bg-primary text-surface-cream font-mono-ui shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-[14px] tracking-[0.08em] whitespace-nowrap uppercase focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Research city ordinances
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="city-research-title"
        onClose={resetDialog}
        className="border-primary/25 bg-surface-cream text-primary backdrop:bg-primary/35 m-auto w-[min(92vw,480px)] rounded-[20px] border p-6 shadow-xl"
      >
        {step === "search" ? (
          <div className="flex flex-col gap-4">
            <h2 id="city-research-title" className="font-display text-[26px]">
              Research city ordinances
            </h2>
            <p className="text-primary/70 text-[14px] leading-6">
              Only U.S. cities can be researched right now.
            </p>
            <label htmlFor="city-research-search" className="sr-only">
              City or ZIP code
            </label>
            <div className="relative">
              <input
                id="city-research-search"
                type="text"
                autoFocus
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={places.length > 0}
                aria-controls="city-research-suggestions"
                aria-describedby="city-research-help"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search city or 5-digit ZIP"
                className="border-primary/25 bg-surface-tan/50 w-full rounded-lg border px-4 py-3 text-[14px] font-normal focus-visible:outline-2 focus-visible:outline-offset-2"
              />
              {places.length > 0 && (
                <ul
                  id="city-research-suggestions"
                  role="listbox"
                  aria-label="Matching U.S. locations"
                  className="bg-surface-cream border-primary/25 absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border p-1 shadow-lg"
                >
                  {places.map((place) => (
                    <li key={place.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={false}
                        onClick={() => {
                          setChosen(place);
                          setStep("confirm");
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
              id="city-research-help"
              role="status"
              className="text-primary/65 text-[14px]"
            >
              {lookupHelp}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeDialog}
                className="border-primary/30 cursor-pointer rounded-full border px-4 py-2 text-[14px]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <h2 id="city-research-title" className="font-display text-[26px]">
              Research {chosen ? researchLabel(chosen) : "this city"}?
            </h2>
            <p className="text-primary/70 text-[14px] leading-6">
              We will search official sources for ordinances from the last{" "}
              {cityResearchLookbackDays} days. This usually takes several
              minutes, and everyone can see the results once they are saved.
            </p>
            {error && (
              <p role="alert" className="text-[14px] text-red-800">
                {error}
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep("search");
                  setError(null);
                }}
                disabled={request.isPending}
                className="border-primary/30 cursor-pointer rounded-full border px-4 py-2 text-[14px] disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => void startResearch()}
                disabled={request.isPending}
                className="bg-primary text-surface-cream font-mono-ui cursor-pointer rounded-full px-5 py-2 text-[14px] tracking-[0.08em] uppercase disabled:cursor-wait disabled:opacity-60"
              >
                {request.isPending ? "Starting…" : "Start research"}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function Card({
  children,
  role = "status",
}: {
  children: ReactNode;
  role?: "status" | "alert";
}) {
  return (
    <section
      role={role}
      className="border-primary/25 bg-surface-cream mb-6 rounded-[20px] border px-6 py-6"
    >
      {children}
    </section>
  );
}

function DismissButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-primary/30 hover:bg-primary/5 mt-5 cursor-pointer rounded-full border px-4 py-2 text-[14px] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      Continue
    </button>
  );
}
