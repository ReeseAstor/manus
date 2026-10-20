/**
 * Retailer channel definitions for the catalog.
 *
 * For each retailer we know:
 *   - the user-facing label
 *   - the order it should appear in a buy-button matrix
 *
 * URLs come only from the book's catalog entry. If a URL is missing, the
 * consuming component hides the button rather than render a dead link.
 * See <RetailerButtons /> in components/author-kit/RetailerButtons.tsx.
 */

import type { Book, RetailerKey } from "./books";

export type RetailerMeta = {
  key: RetailerKey;
  label: string;
  /** Lower number = earlier in the row. */
  order: number;
};

export const RETAILERS: Record<RetailerKey, RetailerMeta> = {
  amazon_kindle: {
    key: "amazon_kindle",
    label: "Buy on Amazon",
    order: 10,
  },
  audible: {
    key: "audible",
    label: "Listen on Audible",
    order: 20,
  },
  apple_books: {
    key: "apple_books",
    label: "Listen on Apple Books",
    order: 30,
  },
  spotify: {
    key: "spotify",
    label: "Listen on Spotify",
    order: 40,
  },
  elevenreader: {
    key: "elevenreader",
    label: "Listen on ElevenReader",
    order: 50,
  },
  google_play: {
    key: "google_play",
    label: "Listen on Google Play",
    order: 60,
  },
  gumroad: {
    key: "gumroad",
    label: "Buy direct (Gumroad)",
    order: 5,
  },
  bookfunnel: {
    key: "bookfunnel",
    label: "Get free copy (BookFunnel)",
    order: 70,
  },
};

/**
 * Resolve a book's retailer URLs from the catalog. Null entries are
 * filtered out so the consumer can map cleanly.
 */
export function resolveRetailers(book: Book): { meta: RetailerMeta; href: string }[] {
  const out: { meta: RetailerMeta; href: string }[] = [];
  for (const meta of Object.values(RETAILERS)) {
    const href = book.retailers[meta.key];
    if (href && href !== "https://www.amazon.com/dp/PLACEHOLDER") {
      out.push({ meta, href });
    }
  }
  return out.sort((a, b) => a.meta.order - b.meta.order);
}
