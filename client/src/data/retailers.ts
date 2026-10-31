/**
 * Retailer channel definitions for the catalog.
 *
 * For each retailer we know:
 *   - the user-facing label
 *   - the order it should appear in a buy-button matrix
 *
 * URLs come from the book's catalog entry, and a VITE_PERMISSION_* variable
 * (RETAILER_ENV below) can override one at build time. If a URL is missing,
 * the consuming component hides the button rather than render a dead link.
 * See <RetailerButtons /> in components/author-kit/RetailerButtons.tsx.
 */

import type { Book, RetailerKey } from "./books";
import { withAmazonTag } from "@/lib/amazon-tag";

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
    label: "Free with my newsletter",
    order: 70,
  },
};

/**
 * Resolve a book's retailer URLs. A set env var wins over the catalog entry.
 * Null entries are filtered out so the consumer can map cleanly.
 */
// Each variable is read by name. Indexing import.meta.env with a computed key
// makes Vite inline the whole env object into the public bundle, including the
// build host's VITE_* system variables such as the commit message.
const RETAILER_ENV: Record<RetailerKey, string | undefined> = {
  amazon_kindle: import.meta.env.VITE_PERMISSION_AMAZON_URL,
  audible: import.meta.env.VITE_PERMISSION_AUDIBLE_URL,
  apple_books: import.meta.env.VITE_PERMISSION_APPLE_URL,
  spotify: import.meta.env.VITE_PERMISSION_SPOTIFY_URL,
  elevenreader: import.meta.env.VITE_PERMISSION_ELEVENREADER_URL,
  google_play: import.meta.env.VITE_PERMISSION_GOOGLEPLAY_URL,
  gumroad: import.meta.env.VITE_PERMISSION_GUMROAD_URL,
  bookfunnel: import.meta.env.VITE_PERMISSION_BOOKFUNNEL_URL,
};

export function resolveRetailers(book: Book): { meta: RetailerMeta; href: string }[] {
  const out: { meta: RetailerMeta; href: string }[] = [];
  for (const meta of Object.values(RETAILERS)) {
    const envHref = RETAILER_ENV[meta.key];
    const bookHref = book.retailers[meta.key];
    const href = envHref || bookHref;
    if (href && href !== "https://www.amazon.com/dp/PLACEHOLDER") {
      out.push({ meta, href: withAmazonTag(href) });
    }
  }
  return out.sort((a, b) => a.meta.order - b.meta.order);
}
