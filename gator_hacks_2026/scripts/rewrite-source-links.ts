import { PrismaClient } from "../generated/prisma";
import {
  isDocumentUrl,
  presentableLink,
} from "~/server/ordinances/source-links";

type Coverage = {
  municipalityKey: string;
  sourcesChecked: { url: string }[];
}[];

async function main() {
  const apply = process.argv.includes("--apply");
  const database = new PrismaClient({ log: ["error", "warn"] });
  try {
    const runs = await database.ingestionRun.findMany({
      select: { coverage: true },
    });
    const checkedByMunicipality = new Map<string, Set<string>>();
    for (const run of runs) {
      for (const entry of (run.coverage ?? []) as Coverage) {
        const set =
          checkedByMunicipality.get(entry.municipalityKey) ?? new Set();
        for (const source of entry.sourcesChecked) set.add(source.url);
        checkedByMunicipality.set(entry.municipalityKey, set);
      }
    }

    const ordinances = await database.ordinance.findMany({
      include: {
        municipality: { select: { key: true } },
        changes: { select: { id: true, evidenceUrl: true } },
      },
    });

    const updates: {
      table: "ordinance" | "change";
      id: string;
      url: string;
    }[] = [];
    const report: string[] = [];
    let documentLinks = 0;
    let fallbacks = 0;

    for (const ordinance of ordinances) {
      const checked = [
        ...(checkedByMunicipality.get(ordinance.municipality.key) ?? []),
      ];
      const evidencePages = ordinance.changes
        .map((change) => change.evidenceUrl)
        .filter((url) => !isDocumentUrl(url));
      const pools = {
        preferred: [ordinance.sourceUrl, ...evidencePages],
        checked,
      };

      if (isDocumentUrl(ordinance.sourceUrl)) {
        documentLinks++;
        const link = presentableLink(ordinance.sourceUrl, {
          preferred: evidencePages,
          checked,
        });
        if (!link.crawled) fallbacks++;
        updates.push({ table: "ordinance", id: ordinance.id, url: link.url });
        report.push(
          `ordinance  ${ordinance.name.slice(0, 60)}\n  ${ordinance.sourceUrl}\n  -> ${link.url}${link.crawled ? "" : " (origin root, no crawled page)"}`,
        );
      }

      for (const change of ordinance.changes) {
        if (!isDocumentUrl(change.evidenceUrl)) continue;
        documentLinks++;
        const link = presentableLink(change.evidenceUrl, pools);
        if (!link.crawled) fallbacks++;
        updates.push({ table: "change", id: change.id, url: link.url });
        report.push(
          `change     ${ordinance.name.slice(0, 60)}\n  ${change.evidenceUrl}\n  -> ${link.url}${link.crawled ? "" : " (origin root, no crawled page)"}`,
        );
      }
    }

    console.log(report.join("\n"));
    console.log(
      `\nDocument links found: ${documentLinks}. Rewrites: ${updates.length}. Origin-root fallbacks: ${fallbacks}. Page links left unchanged: ${ordinances.length + ordinances.reduce((n, o) => n + o.changes.length, 0) - documentLinks}.`,
    );

    if (!apply) {
      console.log(
        "Dry run. Nothing written. Rerun with --apply to save these rewrites.",
      );
      return;
    }
    await database.$transaction(
      updates.map((update) =>
        update.table === "ordinance"
          ? database.ordinance.update({
              where: { id: update.id },
              data: { sourceUrl: update.url },
            })
          : database.ordinanceChange.update({
              where: { id: update.id },
              data: { evidenceUrl: update.url },
            }),
      ),
    );
    console.log(`Saved ${updates.length} rewrites.`);
  } finally {
    await database.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(
    "Source link rewrite failed:",
    error instanceof Error ? error.message.slice(-300) : error,
  );
  process.exitCode = 1;
});
