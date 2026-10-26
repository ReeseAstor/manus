import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BOOKS } from "../client/src/data/books";
import { withAmazonTag } from "../client/src/lib/amazon-tag";
// @ts-expect-error plain .mjs module without type declarations
import * as fallback from "../scripts/lib/book-fallback.mjs";

const { KINDLE_PLUS_LINE, RETIRED_KU_LINE, bookFallbackFactsHtml, bookFallbackBuyHtml, fallbackProblems } = fallback as {
  KINDLE_PLUS_LINE: string;
  RETIRED_KU_LINE: string;
  bookFallbackFactsHtml: (book: unknown, deps: unknown) => string;
  bookFallbackBuyHtml: (book: unknown, deps: unknown) => string;
  fallbackProblems: (html: string) => string[];
};

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
    expect(KINDLE_PLUS_LINE).toBe("Read free with Kindle+ (formerly Kindle Unlimited).");
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
    expect(fallbackProblems("<li>Available in Kindle Unlimited</li>")).toHaveLength(1);
    expect(fallbackProblems('<a href="https://www.amazon.com/dp/B0FCCBNF8X?th=1&amp;tag=reeseastor-20">x</a>')).toEqual([]);
    expect(fallbackProblems('<a href="https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX">author</a>')).toEqual([]);
  });

  it("is wired into the prerender script, which fails the build on a problem", () => {
    const src = fs.readFileSync(path.join(__dirname, "../scripts/prerender-static.mjs"), "utf8");
    expect(src).not.toContain(RETIRED_KU_LINE);
    expect(src).toContain("bookFallbackFactsHtml(book");
    expect(src).toContain("bookFallbackBuyHtml(book");
    expect(src).toMatch(/fallbackProblems\(bookBody\)[\s\S]{0,80}throw new Error/);
    expect(src).not.toMatch(/href="\$\{esc\(book\.retailers\.amazon_kindle\)\}"/);
  });
});
