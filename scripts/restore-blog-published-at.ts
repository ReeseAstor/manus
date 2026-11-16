import { pathToFileURL } from "node:url";
import path from "node:path";
import { Client } from "pg";

/**
 * Restores blog_posts.publishedAt to the values from the 2026-11-15
 * 11:45:31 PM America/New_York pg_dump
 * (/workspace/backups/reeseastor-blog_posts-20261115-234531.sql).
 *
 * The dump column is `timestamp without time zone`. Values below are the
 * literals as stored, treated as true UTC instants (e.g. 2026-08-17 01:35:41.98
 * is 2026-08-17T01:35:41.980Z). Cross-checked against the QA #81 card table.
 *
 * Keyed by slug, not id. Default is dry-run. Pass --apply to write.
 * Idempotent: UPDATE only when the current value IS DISTINCT FROM the target.
 *
 * Differences vs /workspace/backups/restore-publishedAt-20261115.sql:
 * that file keys by id and sets publishedAt to the content MD5 hashes from
 * reeseastor-blog_posts-20261115-234531.pre-md5.txt (for example id 4 gets
 * a4c269e71d2ce709c0822aadeceafc47) instead of the dump timestamps. It also
 * covers only the 11 seedable ids and omits retired slugs. This script uses
 * the actual dump timestamps, keys by slug, and includes every dump row.
 */

/** Dump literals, as stored, with no timezone conversion. */
export const ORIGINAL_PUBLISHED_AT_BY_SLUG: Readonly<Record<string, string>> = {
  "ai-assisted-romance-writing-workflow": "2026-08-17 01:35:41.912",
  "romance-author-writing-tools-setup": "2026-08-10 01:35:43.44",
  "quality-control-workflows-romance-authors": "2026-08-11 01:35:43.359",
  "best-billionaire-romance-series-2024": "2026-08-17 01:35:41.98",
  "best-kindle-setup-romance-readers": "2026-08-16 01:35:42.044",
  "booktok-made-me-buy-it-honest-reviews": "2026-08-15 01:35:42.1",
  "dark-romance-books-beginners-guide": "2026-08-14 01:35:42.145",
  "enemies-to-lovers-books-that-ruined-me": "2026-08-13 01:35:42.197",
  "nyc-romance-books-manhattan-guide": "2026-08-12 01:35:42.258",
  "reading-self-care-routine-book-lovers": "2026-08-11 01:35:43.395",
  "romance-reader-gift-guide": "2026-08-10 01:35:43.597",
  "secret-baby-romance-books-guide": "2026-08-09 01:35:43.655",
  "storyorigin-email-list-building-guide": "2026-08-08 01:35:43.74",
  "ultimate-cozy-reading-night-setup": "2026-08-07 01:35:43.779",
  "what-i-burn-while-i-write": "2026-08-06 01:35:43.836",
};

export const RESTORE_PUBLISHED_AT_SQL = `UPDATE blog_posts
   SET "publishedAt" = $2::timestamp
 WHERE slug = $1
   AND "publishedAt" IS DISTINCT FROM $2::timestamp`;

export interface RestoreArgs {
  apply: boolean;
}

export function parseRestoreArgs(argv: string[]): RestoreArgs {
  const flags = argv.filter((arg) => arg.startsWith("--"));
  const unknown = flags.filter((flag) => flag !== "--apply" && flag !== "--dry-run");
  if (unknown.length > 0) {
    throw new Error(`Unknown flag(s): ${unknown.join(", ")}. Use --dry-run (default) or --apply.`);
  }
  return { apply: flags.includes("--apply") };
}

/** Interpret a dump `timestamp without time zone` literal as a UTC instant. */
export function timestampLiteralToUtcDate(literal: string): Date {
  const match = literal.trim().match(
    /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(?:\.(\d+))?$/,
  );
  if (!match) {
    throw new Error(`Invalid timestamp literal: ${literal}`);
  }
  const fraction = (match[3] ?? "0").padEnd(3, "0").slice(0, 3);
  return new Date(`${match[1]}T${match[2]}.${fraction}Z`);
}

export function timestampLiteralToUtcIso(literal: string): string {
  return timestampLiteralToUtcDate(literal).toISOString();
}

export type RestoreAction = "would-update" | "already-matches" | "missing";

export interface RestorePlanRow {
  slug: string;
  targetLiteral: string;
  targetUtcIso: string;
  currentLiteral: string | null;
  currentUtcIso: string | null;
  action: RestoreAction;
}

export function currentToLiteral(value: Date | string | null | undefined): string | null {
  if (value == null) return null;
  if (typeof value === "string") {
    // Already a bare timestamp; normalize whitespace only.
    if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}/.test(value) && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(value)) {
      return value.replace("T", " ").trim();
    }
    const asDate = new Date(value.endsWith("Z") || /[+-]\d{2}:?\d{2}$/.test(value) ? value : `${value}Z`);
    if (Number.isNaN(asDate.getTime())) return value;
    return utcDateToLiteral(asDate);
  }
  return utcDateToLiteral(value);
}

function utcDateToLiteral(date: Date): string {
  const iso = date.toISOString(); // 2026-08-17T01:35:41.980Z
  const [day, rest] = iso.slice(0, -1).split("T");
  const [time, fraction = ""] = rest.split(".");
  const trimmed = fraction.replace(/0+$/, "");
  return trimmed ? `${day} ${time}.${trimmed}` : `${day} ${time}`;
}

function literalsMatch(a: string, b: string): boolean {
  return timestampLiteralToUtcIso(a) === timestampLiteralToUtcIso(b);
}

export function planRestore(
  currentBySlug: Readonly<Record<string, Date | string | null | undefined>>,
  targets: Readonly<Record<string, string>> = ORIGINAL_PUBLISHED_AT_BY_SLUG,
): RestorePlanRow[] {
  return Object.entries(targets).map(([slug, targetLiteral]) => {
    const raw = Object.prototype.hasOwnProperty.call(currentBySlug, slug)
      ? currentBySlug[slug]
      : undefined;
    const missing = !Object.prototype.hasOwnProperty.call(currentBySlug, slug);
    const currentLiteral = missing ? null : currentToLiteral(raw);
    const currentUtcIso = currentLiteral ? timestampLiteralToUtcIso(currentLiteral) : null;
    let action: RestoreAction;
    if (missing) action = "missing";
    else if (currentLiteral && literalsMatch(currentLiteral, targetLiteral)) action = "already-matches";
    else action = "would-update";
    return {
      slug,
      targetLiteral,
      targetUtcIso: timestampLiteralToUtcIso(targetLiteral),
      currentLiteral,
      currentUtcIso,
      action,
    };
  });
}

export function formatRestorePlan(rows: RestorePlanRow[], apply: boolean): string {
  const mode = apply ? "APPLY" : "DRY-RUN (no writes)";
  const lines = [
    `blog publishedAt restore: ${mode}`,
    "Values are dump literals treated as UTC instants.",
    "",
    "slug\taction\tcurrent (UTC)\ttarget (UTC)",
  ];
  for (const row of rows) {
    const current = row.currentUtcIso ?? "(missing)";
    lines.push(`${row.slug}\t${row.action}\t${current}\t${row.targetUtcIso}`);
  }
  const counts = {
    "would-update": rows.filter((r) => r.action === "would-update").length,
    "already-matches": rows.filter((r) => r.action === "already-matches").length,
    missing: rows.filter((r) => r.action === "missing").length,
  };
  lines.push("");
  lines.push(
    `would-update=${counts["would-update"]} already-matches=${counts["already-matches"]} missing=${counts.missing}`,
  );
  if (!apply) {
    lines.push("Re-run with --apply to write. This command did not change the database.");
  }
  return lines.join("\n");
}

export async function restorePublishedAt(
  env: NodeJS.ProcessEnv,
  args: RestoreArgs,
  log: (message: string) => void = console.log,
): Promise<RestorePlanRow[]> {
  const DATABASE_URL = env.DATABASE_URL;
  if (!DATABASE_URL) {
    const plan = planRestore({});
    log(formatRestorePlan(plan, false));
    log("DATABASE_URL is not set; current publishedAt values were not read and nothing was written.");
    if (args.apply) {
      throw new Error("Refusing --apply without DATABASE_URL. Nothing was written.");
    }
    return plan;
  }

  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query("SET TIME ZONE 'UTC'");
    const slugs = Object.keys(ORIGINAL_PUBLISHED_AT_BY_SLUG);
    const result = await client.query<{ slug: string; publishedAt: Date | string | null }>(
      `SELECT slug, "publishedAt" FROM blog_posts WHERE slug = ANY($1::text[])`,
      [slugs],
    );
    const currentBySlug: Record<string, Date | string | null> = {};
    for (const row of result.rows) currentBySlug[row.slug] = row.publishedAt;
    const plan = planRestore(currentBySlug);
    log(formatRestorePlan(plan, args.apply));
    if (!args.apply) return plan;

    let updated = 0;
    for (const row of plan) {
      if (row.action !== "would-update") continue;
      const written = await client.query(RESTORE_PUBLISHED_AT_SQL, [row.slug, row.targetLiteral]);
      updated += written.rowCount ?? 0;
    }
    log(`Applied. Rows updated: ${updated}.`);
    return plan;
  } finally {
    await client.end();
  }
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(path.resolve(entry)).href) {
  const args = parseRestoreArgs(process.argv.slice(2));
  restorePublishedAt(process.env, args).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
