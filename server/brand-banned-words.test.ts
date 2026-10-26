import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { RETIRED_BLOG_SLUGS } from "../shared/const";

/**
 * Brand guard: fails when banned words appear in shipped code, page copy or
 * content sources (blog markdown, seed scripts, content scripts, mockups).
 * Docs, the series bible, todo notes and migrations are out of scope.
 */
const ROOT = path.resolve(__dirname, "..");

/** Copy-only paths: terms that also appear as code identifiers are checked here only. */
const COPY_PATH_RE = /^(?:client\/public\/|blog-posts\/|server\/email-templates\/|ui_kits\/|seed[^/]*\.mjs$)/;

export const BANNED: { name: string; re: RegExp; copyOnly?: boolean; marketingOnly?: boolean }[] = [
  { name: "slow burn", re: /slow[- ]?burn/i },
  { name: "dark romance", re: /dark romance/i },
  { name: "Kindle Unlimited CTA", re: /read (?:on|with) kindle unlimited/i },
  { name: "USA Today", re: /usa today/i },
  { name: "1,700+", re: /1,700\+/ },
  { name: "10,000+", re: /10,000\+/ },
  { name: "threats", re: /\bthreats?\b/i },
  // Hook form only: the bare word is ordinary prose ("claimed mine", "copy mine").
  { name: "mine (hook)", re: /\b(?:you(?:'|’)?re|you are|she(?:'|’)?s|is|all|be|forever|only) mine\b|"mine[.!]?"/i },
  // Plural only, copy paths only. The singular "Amazon sets the price" note on /read is approved wording.
  { name: "prices", re: /\bprices\b/i, copyOnly: true },
  // Canon and pen-name safety on marketing surfaces (copy paths plus client/src, which holds books.ts).
  // Fake Wife's heroine is Elena Volkov; heroes are named by first name only ("James").
  { name: "Lily Chen", re: /\bLily Chen\b/, marketingOnly: true },
  { name: "James Chen", re: /\bJames Chen\b/, marketingOnly: true },
];

/** Marketing surfaces: the copy paths plus client/src (store data, pages, components). */
const MARKETING_PATH_RE = /^(?:client\/src\/|client\/public\/|blog-posts\/|server\/email-templates\/|ui_kits\/|seed[^/]*\.mjs$)/;

const SCAN_DIRS = ["client/src", "client/public", "server", "shared", "blog-posts", "scripts", "ui_kits"];
const ROOT_FILE_RE = /^(seed[^/]*\.(?:mjs|js|ts)|client\/index\.html)$/;
const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".jsx", ".html", ".md", ".json", ".txt", ".xml", ".css", ".sql"]);

/**
 * Lines that legitimately contain a banned string. Each entry needs a reason.
 * `lines` scopes the allowance to lines containing one of these exact snippets;
 * any other line in the same file is still checked.
 */
const ALLOW: Record<string, { terms: string[]; reason: string; lines?: string[] }> = {
  "server/brand-banned-words.test.ts": { terms: BANNED.map((b) => b.name), reason: "this guard" },
  "scripts/seal-admin-chunks.mjs": {
    terms: ["USA Today"],
    reason: "detector list that blocks the claim from public chunks",
    lines: ['"USA Today",', '"USA TODAY",'],
  },
  "client/src/pages/CodeOfConduct.tsx": {
    terms: ["threats"],
    reason: "unrouted; moderation-rule usage, not story copy",
    lines: ["Harassment, threats, stalking, or doxxing", "Egregious behavior — threats, doxxing"],
  },
  "seed-books.ts": {
    terms: ["threats"],
    reason: "manuscript excerpt prose (sampleChapter)",
    lines: ["Her father's threats echoed in her mind", "She thought about her father's threats"],
  },
  "seed-affiliate-blog-posts.mjs": {
    terms: ["dark romance"],
    reason: "seeds the retired dark-romance guide (slug filtered by RETIRED_BLOG_SLUGS)",
    lines: ["title: 'Dark Romance for Beginners: Where to Start Without Losing Sleep'", "dip your toe into dark romance"],
  },
};

function* walk(dir: string): Generator<string> {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    if (name === "node_modules" || name === "dist" || name.startsWith(".")) continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (TEXT_EXT.has(path.extname(name))) yield full;
  }
}

function scanFiles(): string[] {
  const files = new Set<string>();
  for (const d of SCAN_DIRS) for (const f of walk(path.join(ROOT, d))) files.add(path.relative(ROOT, f));
  for (const name of readdirSync(ROOT)) if (ROOT_FILE_RE.test(name)) files.add(name);
  files.add("client/index.html");
  const retired = new Set(RETIRED_BLOG_SLUGS.map((s) => `blog-posts/${s}.md`));
  return [...files].filter((f) => !retired.has(f)).sort();
}

export function findBannedHits(files = scanFiles()) {
  const hits: string[] = [];
  for (const rel of files) {
    let text: string;
    try {
      text = readFileSync(path.join(ROOT, rel), "utf8");
    } catch {
      continue;
    }
    const allow = ALLOW[rel];
    text.split("\n").forEach((line, i) => {
      const lineAllowed = !!allow && (!allow.lines || allow.lines.some((snippet) => line.includes(snippet)));
      for (const b of BANNED) {
        if (b.copyOnly && !COPY_PATH_RE.test(rel)) continue;
        if (b.marketingOnly && !MARKETING_PATH_RE.test(rel)) continue;
        if (b.re.test(line) && !(lineAllowed && allow!.terms.includes(b.name))) hits.push(`${rel}:${i + 1} [${b.name}] ${line.trim().slice(0, 120)}`);
      }
    });
  }
  return hits;
}

describe("brand banned words", () => {
  it("scans a meaningful set of files", () => {
    expect(scanFiles().length).toBeGreaterThan(100);
  });

  it("has no banned words in shipped code or content sources", () => {
    expect(findBannedHits()).toEqual([]);
  });

  it("detects each banned term (self-test)", () => {
    const samples = [
      "a slow-burn read", "Slow burn", "dark romance", "Read on Kindle Unlimited", "Read with Kindle Unlimited",
      "USA Today bestseller", "1,700+ readers", "10,000+ fans",
      "Then the threats start.", "under threat from her father",
      "You're mine.", "you’re mine", "She's mine", "forever mine", "he growled, \"Mine.\"",
      "Low prices every day",
      "Lily Chen breaks into his penthouse", "James Chen agrees to every rule",
    ];
    for (const s of samples) expect(BANNED.some((b) => b.re.test(s)), s).toBe(true);
    const allowed = [
      "Read free with Kindle+ (formerly Kindle Unlimited).",
      "Amazon sets the price shown on each listing.",
      "Three hundred fewer billable hours than mine last quarter.",
      "You don't need to copy mine.",
      "Elena Volkov, a gymnast turned thief", "James agrees to every rule", "Chen Technologies",
    ];
    for (const s of allowed) expect(BANNED.some((b) => b.re.test(s)), s).toBe(false);
  });

  it("checks plural prices in copy paths only", () => {
    const prices = BANNED.find((b) => b.name === "prices")!;
    expect(prices.copyOnly).toBe(true);
    expect(COPY_PATH_RE.test("client/public/read/poison-pill/index.html")).toBe(true);
    expect(COPY_PATH_RE.test("server/email-templates/launch-sequence.ts")).toBe(true);
    expect(COPY_PATH_RE.test("seed-blog-schedule.mjs")).toBe(true);
    expect(COPY_PATH_RE.test("server/routers.ts")).toBe(false);
  });

  it("checks Chen names on marketing surfaces, including books.ts", () => {
    expect(MARKETING_PATH_RE.test("client/src/data/books.ts")).toBe(true);
    expect(MARKETING_PATH_RE.test("client/public/read/the-billionaires-one-night-stand/index.html")).toBe(true);
    expect(MARKETING_PATH_RE.test("server/_core/audioService.ts")).toBe(false);
  });

  it("scopes line allowances to their lines", () => {
    for (const [file, a] of Object.entries(ALLOW)) {
      if (file === "server/brand-banned-words.test.ts") continue;
      expect(a.lines?.length, file).toBeGreaterThan(0);
    }
  });
});
