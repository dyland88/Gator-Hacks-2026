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
