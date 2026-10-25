"use client";

import { useState } from "react";

import { normalizeMunicipality } from "~/lib/municipality";
import {
  legislativeSteps,
  ordinanceDate,
  ordinanceStage,
} from "~/lib/ordinance-display";
import { interestDescriptions, interestOptions } from "~/lib/profile";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/react";

type Topic = (typeof interestOptions)[number];
type Ordinance = RouterOutputs["ordinances"]["feed"]["items"][number];

export function OrdinanceProgress({
  stage,
  originalStage,
}: {
  stage: string;
  originalStage: string;
}) {
  const current = ordinanceStage(stage);
  return (
    <div className="border-primary/15 mt-6 border-t pt-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono-ui text-[10px] tracking-[0.12em] uppercase">
          Legislative stage
        </p>
        <span
          title={originalStage}
          className={`rounded-full border px-2.5 py-1 text-[11px] ${current.ended ? "border-primary/35 bg-primary/10 text-primary" : "border-primary/20 text-primary/80"}`}
        >
          {current.label}
        </span>
      </div>
      <ol
        className="grid grid-cols-5 gap-1.5"
        aria-label={`Legislative progress: ${current.label}`}
      >
        {legislativeSteps.map((step, index) => (
          <li
            key={step.stage}
            aria-current={index === current.index ? "step" : undefined}
          >
            <span
              aria-hidden="true"
              className={`mb-2 block h-1.5 rounded-sm ${index === current.index ? "bg-primary ring-primary/25 ring-offset-surface-cream ring-1 ring-offset-2" : current.index > index ? "bg-primary/45" : "bg-primary/10"}`}
            />
            <span
              className={`block text-[10px] sm:text-[11px] ${index === current.index ? "text-primary font-semibold" : "text-primary/60"}`}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
      {current.ended && (
        <p className="text-primary/70 mt-2 text-[11px]">
          This ordinance was {current.label.toLowerCase()}.
        </p>
      )}
      {current.index < 0 && !current.ended && (
        <p className="text-primary/65 mt-2 text-[11px]">
          An exact stage has not been confirmed by the source.
        </p>
      )}
    </div>
  );
}

function OrdinanceCard({
  ordinance,
  index,
  amendments,
}: {
  ordinance: Ordinance;
  index: number;
  amendments: boolean;
}) {
  const latest = ordinance.changes[0];
  return (
    <article
      className="ordinance-card border-primary/20 rounded-[20px] border p-5 sm:p-6"
      style={{ animationDelay: `${Math.min(index, 7) * 55}ms` }}
    >
      <div className="text-primary/65 mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] tracking-[0.1em] uppercase">
        <p>
          {ordinance.sourceIdentifier
            ? `Ordinance ${ordinance.sourceIdentifier}`
            : "Local ordinance"}
        </p>
        <p>
          {ordinance.municipality.city}, {ordinance.municipality.state}
        </p>
      </div>
      <h2 className="font-display text-[25px] leading-[1.15] tracking-[-0.015em] sm:text-[29px]">
        {ordinance.name}
      </h2>
      <p className="text-primary/80 mt-3 text-[14px] leading-6 whitespace-pre-line">
        {ordinance.description}
      </p>
      {amendments && latest && (
        <p className="border-primary/30 text-primary/75 mt-3 border-l-2 pl-3 text-[13px] leading-5">
          <span className="font-semibold">Latest amendment: </span>
          {latest.description}
        </p>
      )}
      {ordinance.topics.length > 0 && (
        <ul
          className="mt-4 flex flex-wrap gap-1.5"
          aria-label="Ordinance topics"
        >
          {ordinance.topics.map((topic) => (
            <li
              key={topic}
              className="border-primary/15 text-primary/75 rounded-full border px-2.5 py-1 text-[11px]"
            >
              {topic}
            </li>
          ))}
        </ul>
      )}
      <OrdinanceProgress
        stage={ordinance.stage}
        originalStage={ordinance.originalStage}
      />
      <div className="text-primary/65 mt-4 flex flex-wrap items-center justify-between gap-3 text-[11px]">
        <p>
          Updated{" "}
          <time dateTime={latest?.activityDate ?? ordinance.latestActivity}>
            {ordinanceDate(latest?.activityDate ?? ordinance.latestActivity)}
          </time>
          {ordinance.effectiveDate && (
            <>
              {" "}
              · Listed effective date {ordinanceDate(ordinance.effectiveDate)}
            </>
          )}
        </p>
        <a
          href={latest?.evidenceUrl ?? ordinance.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary decoration-primary/30 hover:decoration-primary rounded-sm font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
          aria-label={`Read the official source for ${ordinance.name}`}
        >
          Official source ↗
        </a>
      </div>
    </article>
  );
}

export function OrdinanceFeed({
  profileLocation,
  interests,
  section,
}: {
  profileLocation: string;
  interests: string[];
  section: "Bills" | "Amendments";
}) {
  const [chosenLocation, setChosenLocation] = useState<string | null>(null);
  const [chosenTopics, setChosenTopics] = useState<Topic[] | null>(null);
  const locations = api.ordinances.locations.useQuery(undefined, {
    staleTime: 60_000,
  });
  const profileIdentity = normalizeMunicipality(profileLocation);
  const municipalityId =
    chosenLocation ??
    (profileLocation.trim()
      ? (locations.data?.find(
          (location) => location.key === profileIdentity?.key,
        )?.id ?? "")
      : (locations.data?.[0]?.id ?? ""));
  const topics =
    chosenTopics ??
    interestOptions.filter((topic) => interests.includes(topic));
  const feed = api.ordinances.feed.useInfiniteQuery(
    {
      municipalityId: municipalityId || "00000000-0000-0000-0000-000000000000",
      topics,
      section: section === "Amendments" ? "amendments" : "bills",
      limit: 12,
    },
    {
      enabled: Boolean(municipalityId),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 30_000,
    },
  );
  const items = feed.data?.pages.flatMap((page) => page.items) ?? [];

  function toggleTopic(topic: Topic) {
    setChosenTopics(
      topics.includes(topic)
        ? topics.filter((value) => value !== topic)
        : interestOptions.filter(
            (value) => value === topic || topics.includes(value),
          ),
    );
  }

  return (
    <section aria-label={`${section} results`}>
      <div className="border-primary/20 bg-surface-tan/35 mb-6 rounded-[18px] border p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0 flex-1 sm:max-w-[360px]">
            <label
              htmlFor="feed-location"
              className="text-primary/70 mb-2 block text-[10px] tracking-[0.12em] uppercase"
            >
              Location
            </label>
            <select
              id="feed-location"
              value={municipalityId}
              disabled={
                locations.isPending ||
                locations.isError ||
                !locations.data?.length
              }
              onChange={(event) => setChosenLocation(event.target.value)}
              className="border-primary/25 bg-surface-cream text-primary w-full cursor-pointer rounded-lg border px-3 py-2.5 text-[14px] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-60"
            >
              <option value="">
                {locations.isPending
                  ? "Loading locations…"
                  : "Choose a location"}
              </option>
              {locations.data?.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.city}, {location.state}, United States
                </option>
              ))}
            </select>
          </div>
          {municipalityId && !feed.isPending && !feed.isError && (
            <p role="status" className="text-primary/65 pb-2 text-[12px]">
              {items.length} {items.length === 1 ? "ordinance" : "ordinances"}{" "}
              shown
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-primary/70 text-[10px] tracking-[0.12em] uppercase">
            Topics{" "}
            <span className="tracking-normal normal-case">
              · matches any selected
            </span>
          </p>
          {topics.length > 0 && (
            <button
              type="button"
              onClick={() => setChosenTopics([])}
              className="cursor-pointer text-[11px] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Show all topics
            </button>
          )}
        </div>
        <div
          className="mt-2.5 flex flex-wrap gap-2"
          aria-label="Filter by topic"
        >
          {interestOptions.map((topic) => (
            <button
              key={topic}
              type="button"
              aria-pressed={topics.includes(topic)}
              title={interestDescriptions[topic]}
              onClick={() => toggleTopic(topic)}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-[12px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${topics.includes(topic) ? "border-primary bg-primary text-surface-cream" : "border-primary/25 bg-surface-cream/60 text-primary/80 hover:border-primary/60"}`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {locations.isError ? (
        <FeedMessage
          title="Locations could not be loaded."
          action={() => void locations.refetch()}
        />
      ) : locations.isPending || (municipalityId && feed.isPending) ? (
        <div
          className="grid gap-5"
          role="status"
          aria-label="Loading local ordinances"
        >
          {[1, 2, 3].map((slot) => (
            <div
              key={slot}
              className="bill-loading-slot border-primary/20 bg-surface-tan/75 h-[270px] rounded-[20px] border"
            />
          ))}
        </div>
      ) : !locations.data?.length ? (
        <FeedMessage
          title="Your local feed is taking shape."
          description="No ordinances have been collected yet. Available cities will appear here once their first updates are saved."
        />
      ) : !municipalityId ? (
        <FeedMessage
          title="Choose a city to explore."
          description={
            profileIdentity
              ? "There are no stored ordinances for your saved location yet. Choose another available city above."
              : "Select a location above to see its local ordinances."
          }
        />
      ) : feed.isError ? (
        <FeedMessage
          title="Ordinances could not be loaded."
          action={() => void feed.refetch()}
        />
      ) : !items.length ? (
        <FeedMessage
          title={
            section === "Amendments"
              ? "No matching amendments yet."
              : "No ordinances match these topics."
          }
          description={
            topics.length
              ? "Try showing all topics or selecting another city."
              : "There are no stored updates in this view for the selected city yet."
          }
        />
      ) : (
        <>
          <div className="grid gap-5">
            {items.map((ordinance, index) => (
              <OrdinanceCard
                key={ordinance.id}
                ordinance={ordinance}
                index={index}
                amendments={section === "Amendments"}
              />
            ))}
          </div>
          <p className="text-primary/60 mt-4 text-[11px] leading-5">
            Stages reflect the latest reported status. Local legislative
            procedures may vary.
          </p>
        </>
      )}
      {feed.hasNextPage && municipalityId && (
        <button
          type="button"
          onClick={() => void feed.fetchNextPage()}
          disabled={feed.isFetchingNextPage}
          className="border-primary/30 hover:bg-primary/5 mt-5 w-full cursor-pointer rounded-full border py-3 text-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60"
        >
          {feed.isFetchingNextPage ? "Loading more…" : "Load more ordinances"}
        </button>
      )}
    </section>
  );
}

function FeedMessage({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: () => void;
}) {
  return (
    <div
      className="border-primary/25 bg-surface-tan/25 rounded-[20px] border border-dashed px-6 py-10"
      role={action ? "alert" : "status"}
    >
      <h2 className="font-display text-[26px]">{title}</h2>
      <p className="text-primary/70 mt-2 max-w-[450px] text-[14px] leading-6">
        {description ?? "Please try again in a moment."}
      </p>
      {action && (
        <button
          type="button"
          onClick={action}
          className="border-primary/30 hover:bg-primary/5 mt-4 cursor-pointer rounded-full border px-4 py-2 text-[12px] focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}
