/**
 * Retailer channel definitions + env-var resolution for the catalog.
 *
 * For each retailer we know:
 *   - the user-facing label
 *   - the order it should appear in a buy-button matrix
 *   - the env var that overrides per-channel URLs at deploy time
 *
 * If a URL is null/undefined after resolving (env var missing AND no per-book
 * override), the consuming component MUST hide the button rather than render
 * a dead link. See <RetailerButtons /> in components/RetailerButtons.tsx.
 */

import type { Book, RetailerKey } from "./books";

export type RetailerMeta = {
  key: RetailerKey;
  label: string;
  /** Lower number = earlier in the row. */
  order: number;
  /** Vite env var that, if set, overrides the per-book retailer URL. */
  envVar: string;
};

export const RETAILERS: Record<RetailerKey, RetailerMeta> = {
  amazon_kindle: {
    key: "amazon_kindle",
    label: "Buy on Amazon",
    order: 10,
    envVar: "VITE_PERMISSION_AMAZON_URL",
  },
  amazon_paperback: {
    key: "amazon_paperback",
    label: "Paperback on Amazon",
    order: 12,
    envVar: "VITE_PERMISSION_AMAZON_PAPERBACK_URL",
  },
  audible: {
    key: "audible",
    label: "Listen on Audible",
    order: 20,
    envVar: "VITE_PERMISSION_AUDIBLE_URL",
  },
  apple_books: {
    key: "apple_books",
    label: "Listen on Apple Books",
    order: 30,
    envVar: "VITE_PERMISSION_APPLE_URL",
  },
  spotify: {
    key: "spotify",
    label: "Listen on Spotify",
    order: 40,
    envVar: "VITE_PERMISSION_SPOTIFY_URL",
  },
  elevenreader: {
    key: "elevenreader",
    label: "Listen on ElevenReader",
    order: 50,
    envVar: "VITE_PERMISSION_ELEVENREADER_URL",
  },
  google_play: {
    key: "google_play",
    label: "Listen on Google Play",
    order: 60,
    envVar: "VITE_PERMISSION_GOOGLEPLAY_URL",
  },
  gumroad: {
    key: "gumroad",
    label: "Buy direct (Gumroad)",
    order: 5,
    envVar: "VITE_PERMISSION_GUMROAD_URL",
  },
  bookfunnel: {
    key: "bookfunnel",
    label: "Get free copy (BookFunnel)",
    order: 70,
    envVar: "VITE_PERMISSION_BOOKFUNNEL_URL",
  },
};

/**
 * Resolve a book's retailer URLs at render time. Env vars win over per-book
 * data so we can flip channels live without redeploying. Null entries are
 * filtered out so the consumer can map cleanly.
 */
export function resolveRetailers(book: Book): { meta: RetailerMeta; href: string }[] {
  const out: { meta: RetailerMeta; href: string }[] = [];
  for (const meta of Object.values(RETAILERS)) {
    const envHref = (import.meta.env as Record<string, string | undefined>)[meta.envVar];
    const bookHref = book.retailers[meta.key];
    const href = envHref || bookHref;
    if (href && href !== "https://www.amazon.com/dp/PLACEHOLDER") {
      out.push({ meta, href });
    }
  }
  return out.sort((a, b) => a.meta.order - b.meta.order);
}
