import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BOOKS } from "../client/src/data/books";
import { withAmazonTag } from "../client/src/lib/amazon-tag";
// @ts-expect-error plain .mjs module without type declarations
import * as fallback from "../scripts/lib/book-fallback.mjs";
// @ts-expect-error plain .mjs module without type declarations
import * as guard from "../scripts/lib/book-fallback-guard.mjs";

const { KINDLE_PLUS_LINE, RETIRED_KU_LINE, bookFallbackFactsHtml, bookFallbackBuyHtml } = fallback as {
  KINDLE_PLUS_LINE: string;
  RETIRED_KU_LINE: string;
  bookFallbackFactsHtml: (book: unknown, deps: unknown) => string;
  bookFallbackBuyHtml: (book: unknown, deps: unknown) => string;
};
const { EXPECTED_KINDLE_PLUS_LINE, RETIRED_KU_TEXT, KU_TITLE_SLUGS, NON_KU_TITLE_SLUGS, fallbackProblems, normalizeForScan } = guard as {
  normalizeForScan: (s: string) => string;
  EXPECTED_KINDLE_PLUS_LINE: string;
  RETIRED_KU_TEXT: string;
  KU_TITLE_SLUGS: readonly string[];
  NON_KU_TITLE_SLUGS: readonly string[];
  fallbackProblems: (html: string, slug?: string) => string[];
};

const APPROVED_LINE = "Read free with Kindle+ (formerly Kindle Unlimited).";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const deps = { esc, withAmazonTag };

const KU_SLUGS = [
  "the-billionaire-s-executive-assistant",
  "the-billionaire-s-fake-wife",
  "the-billionaire-s-baby-secret",
  "the-billionaires-forbidden-nanny",
  "hostile-tender",
  "poison-pill",
  "golden-parachute",
];
const NON_KU_SLUGS = ["the-billionaires-one-night-stand", "the-first-acquisition"];

describe("/books no-JS fallback", () => {
  it("uses the approved subscription wording", () => {
    expect(KINDLE_PLUS_LINE).toBe(APPROVED_LINE);
    expect(EXPECTED_KINDLE_PLUS_LINE).toBe(APPROVED_LINE);
    expect(RETIRED_KU_TEXT).toBe("Available in Kindle Unlimited");
  });

  it("keeps the guard's own canonical KU list (not the catalog flag) in step with the expected list", () => {
    expect([...KU_TITLE_SLUGS].sort()).toEqual([...KU_SLUGS].sort());
    expect([...NON_KU_TITLE_SLUGS].sort()).toEqual([...NON_KU_SLUGS].sort());
  });

  it("covers every catalog title with the expected subscription status", () => {
    expect(BOOKS.map((b) => b.slug).sort()).toEqual([...KU_SLUGS, ...NON_KU_SLUGS].sort());
    for (const slug of KU_SLUGS) expect(BOOKS.find((b) => b.slug === slug)?.kindle_unlimited, slug).toBe(true);
    for (const slug of NON_KU_SLUGS) expect(BOOKS.find((b) => b.slug === slug)?.kindle_unlimited, slug).toBe(false);
  });

  it("shows the Kindle+ line on subscription titles only", () => {
    for (const book of BOOKS) {
      const html = bookFallbackFactsHtml(book, deps);
      if (KU_SLUGS.includes(book.slug)) expect(html, book.slug).toBe(`<li>${KINDLE_PLUS_LINE}</li>`);
      else expect(html, book.slug).toBe("");
      expect(html).not.toContain(RETIRED_KU_LINE);
    }
  });

  it("tags every Amazon book link in the buy line", () => {
    for (const book of BOOKS) {
      const html = bookFallbackBuyHtml(book, deps);
      expect(fallbackProblems(html), book.slug).toEqual([]);
      if (book.retailers.amazon_kindle) expect(html, book.slug).toContain("tag=reeseastor-20");
    }
  });

  it("keeps existing query parameters when it adds the tag", () => {
    const book = { retailers: { amazon_kindle: "https://www.amazon.com/dp/B0FCCBNF8X?ref_=ast_author_dp&th=1" } };
    expect(bookFallbackBuyHtml(book, deps)).toBe(
      '<a href="https://www.amazon.com/dp/B0FCCBNF8X?ref_=ast_author_dp&amp;th=1&amp;tag=reeseastor-20">Read on Amazon</a>',
    );
  });

  it("flags untagged or wrongly tagged Amazon links and the retired line (self-test)", () => {
    expect(fallbackProblems('<a href="https://www.amazon.com/dp/B0FCCBNF8X">Read on Amazon</a>')).toHaveLength(1);
    expect(fallbackProblems('<a href="https://www.amazon.com/dp/B0FCCBNF8X?tag=other-20">x</a>')).toHaveLength(1);
    expect(fallbackProblems("<li>Available in Kindle Unlimited</li>")).toContain(`retired line "${RETIRED_KU_LINE}"`);
    expect(fallbackProblems('<a href="https://www.amazon.com/dp/B0FCCBNF8X?th=1&amp;tag=reeseastor-20">x</a>')).toEqual([]);
    expect(fallbackProblems('<a href="https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX">author</a>')).toEqual([]);
  });

  it("page guard accepts the real fallback of every title", () => {
    for (const book of BOOKS) {
      const body = `<ul>${bookFallbackFactsHtml(book, deps)}</ul><p>${bookFallbackBuyHtml(book, deps)}</p>`;
      expect(fallbackProblems(body, book.slug), book.slug).toEqual([]);
    }
  });

  it("page guard rejects wrong, missing, doubled or misplaced Kindle lines (QA F1 mutations)", () => {
    const ok = `<li>${APPROVED_LINE}</li>`;
    const ku = "the-billionaire-s-fake-wife";
    const nonKu = "the-first-acquisition";
    expect(fallbackProblems(ok, ku)).toEqual([]);
    expect(fallbackProblems("<li></li>", nonKu)).toEqual([]);
    // line without its final period
    expect(fallbackProblems("<li>Read free with Kindle+ (formerly Kindle Unlimited)</li>", ku).length).toBeGreaterThan(0);
    // "Kindle Unlimited" wording instead of the line
    expect(fallbackProblems("<li>Read free with Kindle Unlimited.</li>", ku).length).toBeGreaterThan(0);
    // line on a non-KU title (line on every title / FA flagged KU)
    expect(fallbackProblems(ok, nonKu).length).toBeGreaterThan(0);
    expect(fallbackProblems(ok, "the-billionaires-one-night-stand").length).toBeGreaterThan(0);
    // KU title missing the line (e.g. GP flag flipped to false), or showing it twice
    expect(fallbackProblems("<li></li>", "golden-parachute").length).toBeGreaterThan(0);
    expect(fallbackProblems(ok + ok, ku).length).toBeGreaterThan(0);
    // any other Kindle Unlimited / Kindle+ text, even next to the exact line
    expect(fallbackProblems(`${ok}<p>Also in kindle unlimited</p>`, ku).length).toBeGreaterThan(0);
    expect(fallbackProblems(`${ok}<p>Kindle+ members read free</p>`, ku).length).toBeGreaterThan(0);
    // a title the guard does not know
    expect(fallbackProblems("<li></li>", "a-new-title").length).toBeGreaterThan(0);
  });

  it("G1: checks JSON-LD in the full page: Amazon identifiers must be clean, untagged /dp/ URLs", () => {
    const ok = `<li>${APPROVED_LINE}</li>`;
    const ku = "the-billionaire-s-fake-wife";
    const ld = (url: string) => `<script type="application/ld+json" data-pre="1">{"sameAs":["${url}"]}</script>`;
    expect(fallbackProblems(ld("https://www.amazon.com/dp/B0FCCBNF8X") + ok, ku)).toEqual([]);
    expect(fallbackProblems(ld("https://www.amazon.com/dp/B0FCCBNF8X?tag=reeseastor-20") + ok, ku).length).toBeGreaterThan(0);
    expect(fallbackProblems(ld("https://www.amazon.com/dp/B0FCCBNF8X?ref_=x") + ok, ku).length).toBeGreaterThan(0);
    expect(fallbackProblems(ld("http://amazon.com/dp/B0FCCBNF8X") + ok, ku).length).toBeGreaterThan(0);
    // stray wording in the head (meta / JSON-LD) is caught too
    expect(fallbackProblems(`<meta name="description" content="In Kindle Unlimited">${ok}`, ku).length).toBeGreaterThan(0);
  });

  it("G2: lookalike characters, entities and odd spaces cannot hide Kindle Unlimited / Kindle+", () => {
    const ok = `<li>${APPROVED_LINE}</li>`;
    const ku = "the-billionaire-s-fake-wife";
    const sneaky = [
      "K\u0456ndle Unlimited", // Cyrillic i
      "Kindle Unl\u0456m\u0456ted",
      "\u039Aindle Unlimited", // Greek capital Kappa
      "Kin\u200Bdle Unlimited", // zero-width space
      "Kindle\u00A0Unlimited", // no-break space
      "Kindle&nbsp;Unlimited",
      "Kindle&#160;Unlimited",
      "Kindle\u2009Unlimited", // thin space
      "\uFF2Bindle Unlimited", // fullwidth K
      "Kindle-Unlimited",
      "Kindle\uFF0B", // fullwidth plus
      "Kindle&#43; members",
      "Kindle&#x2B; members",
      "Kin\u00ADdle Unlimited", // soft hyphen
    ];
    for (const s of sneaky) expect(fallbackProblems(`${ok}<p>${s}</p>`, ku), JSON.stringify(s)).not.toEqual([]);
    expect(normalizeForScan("K\u0456n\u200Bdle&nbsp;\uFF35nlimited")).toBe("Kindle Unlimited");
    // the exact approved line itself stays allowed
    expect(fallbackProblems(ok, ku)).toEqual([]);
  });

  it("G3: the guard's KU lists carry a dated amazon.com verification note", () => {
    const guardSrc = fs.readFileSync(path.join(__dirname, "../scripts/lib/book-fallback-guard.mjs"), "utf8");
    expect(guardSrc).toMatch(/KU verified on amazon\.com \d{4}-\d{2}-\d{2}/);
  });

  it("runs this test file in the Vercel build and npm build, before the prerender", () => {
    const vercel = JSON.parse(fs.readFileSync(path.join(__dirname, "../vercel.json"), "utf8"));
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"));
    expect(pkg.scripts["test:books-fallback"]).toBe("vitest run server/books-fallback.test.ts");
    for (const cmd of [vercel.buildCommand as string, pkg.scripts.build as string]) {
      expect(cmd.startsWith("npm run test:books-fallback && ")).toBe(true);
    }
  });

  it("is wired into the prerender script, which fails the build on a problem", () => {
    const src = fs.readFileSync(path.join(__dirname, "../scripts/prerender-static.mjs"), "utf8");
    expect(src).not.toContain(RETIRED_KU_LINE);
    expect(src).toContain("bookFallbackFactsHtml(book");
    expect(src).toContain("bookFallbackBuyHtml(book");
    expect(src).toContain('scripts/lib/book-fallback-guard.mjs');
    const guardSrc = fs.readFileSync(path.join(__dirname, "../scripts/lib/book-fallback-guard.mjs"), "utf8");
    expect(guardSrc).not.toMatch(/from\s+["'][^"']*(book-fallback\.mjs|books)["']|import\(/);
    expect(src).toMatch(/fallbackProblems\(bookPage, book\.slug\)[\s\S]{0,80}throw new Error/);
    expect(src).toMatch(/const bookPage = renderPage\(/);
    expect(src).toContain("write(`/books/${book.slug}`, bookPage)");
    expect(src).not.toMatch(/href="\$\{esc\(book\.retailers\.amazon_kindle\)\}"/);
  });
});
