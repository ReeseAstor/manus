/**
 * No-JS fallback pieces for /books/<slug> pages, written by scripts/prerender-static.mjs.
 * Crawlers and visitors without JavaScript see this HTML, so it must match the live
 * buttons: Amazon book links carry the associate tag, and the subscription line uses
 * the approved wording on subscription titles only.
 */

/** Exact subscription line for titles in Kindle Unlimited. */
export const KINDLE_PLUS_LINE = "Read free with Kindle+ (formerly Kindle Unlimited).";

/** Wording that must never appear in fallback output. */
export const RETIRED_KU_LINE = "Available in Kindle Unlimited";

/**
 * @param {object} book catalog entry from client/src/data/books.ts
 * @param {{ esc: (s: string) => string, withAmazonTag: (href: string) => string }} deps
 */
export function bookFallbackFactsHtml(book, { esc }) {
  return book.kindle_unlimited ? `<li>${esc(KINDLE_PLUS_LINE)}</li>` : "";
}

/**
 * Buy links for the fallback page. Amazon book links get tag=reeseastor-20 through the
 * same helper the live buttons use (query parameters are kept; legacy tags are normalized).
 */
export function bookFallbackBuyHtml(book, { esc, withAmazonTag }) {
  return [
    book.retailers.amazon_kindle
      ? `<a href="${esc(withAmazonTag(book.retailers.amazon_kindle))}">Read on Amazon</a>`
      : "",
    book.retailers.bookfunnel ? `<a href="${esc(book.retailers.bookfunnel)}">Get it free</a>` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}
