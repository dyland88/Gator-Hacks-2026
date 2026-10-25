export const legislativeSteps = [
  { stage: "introduced", label: "Introduced" },
  { stage: "under_review", label: "Review" },
  { stage: "hearing", label: "Hearing" },
  { stage: "adopted", label: "Adopted" },
  { stage: "effective", label: "Effective" },
] as const;

export function ordinanceStage(stage: string) {
  const index = legislativeSteps.findIndex((step) => step.stage === stage);
  if (index >= 0)
    return { label: legislativeSteps[index]!.label, index, ended: false };
  const ended = {
    rejected: "Rejected",
    withdrawn: "Withdrawn",
    repealed: "Repealed",
  };
  if (stage === "rejected" || stage === "withdrawn" || stage === "repealed")
    return { label: ended[stage], index: -1, ended: true };
  return { label: "Status unavailable", index: -1, ended: false };
}

export function ordinanceDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }).format(date)
    : value;
}

function significantWords(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

export function summaryRepeatsTitle(title: string, summary: string) {
  const titleWords = new Set(significantWords(title));
  const summaryWords = significantWords(summary);
  if (summaryWords.length === 0) return true;
  const shared = summaryWords.filter((word) => titleWords.has(word)).length;
  return shared / summaryWords.length >= 0.85;
}

export function ordinanceSummary(ordinance: {
  name: string;
  description: string;
  changes: { description: string }[];
}) {
  if (!summaryRepeatsTitle(ordinance.name, ordinance.description)) {
    return ordinance.description;
  }
  const update = ordinance.changes.find(
    (change) => !summaryRepeatsTitle(ordinance.name, change.description),
  );
  return update?.description ?? ordinance.description;
}
