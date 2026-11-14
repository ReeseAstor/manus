import { withAmazonTag } from "../lib/amazon-tag";

export type EditionFormat = "ebook" | "audiobook" | "paperback" | "hardcover";
export type EditionStatus = "live" | "draft" | "not_created" | "unconfirmed";
export type BookEdition = {
  format: EditionFormat;
  status: EditionStatus;
  asin: string | null;
  /** Observed Amazon US price, never a proposed target. */
  price_usd: number | null;
  /** Source reference only; existing self-hosted site covers remain primary. */
  cover_source_url: string | null;
};

export const EDITION_LABELS: Record<EditionFormat, string> = {
  ebook: "Kindle eBook",
  audiobook: "Audiobook",
  paperback: "Paperback",
  hardcover: "Hardcover",
};

const image = (id: string) =>
  `https://m.media-amazon.com/images/I/${id}._SL1500_.jpg`;
const live = (
  format: EditionFormat,
  asin: string,
  price: number | null,
  cover: string | null
): BookEdition => ({
  format,
  status: "live",
  asin,
  price_usd: price,
  cover_source_url: cover ? image(cover) : null,
});
const pending = (
  format: EditionFormat,
  status: Exclude<EditionStatus, "live">
): BookEdition => ({
  format,
  status,
  asin: null,
  price_usd: null,
  cover_source_url: null,
});

/**
 * Owner-supplied KDP master, pasted November 4, 2026. Not a live Amazon feed.
 * Listings with unpublished changes remain live. Targets and internal launch
 * decisions are intentionally not published. KU applies to the Kindle record,
 * not audiobook/print editions. Other pen names stay outside this catalog.
 * Audiobook rows whose Amazon pages 404 are not_created, not in-stock offers.
 * The Fake Wife audiobook stays: listing B0GWK27PX7 is live at $13.99.
 */
export const BOOK_EDITIONS: Record<string, readonly BookEdition[]> = {
  "the-billionaires-one-night-stand": [
    live("ebook", "B0DSG7NKGP", 0.99, "815-iFRAlpL"),
    pending("audiobook", "not_created"),
    live("paperback", "B0DVH8RNK1", 9.99, "71b1pqSQ4NL"),
    pending("hardcover", "draft"),
  ],
  "the-billionaire-s-executive-assistant": [
    live("ebook", "B0F2W8QL7S", 3.99, "81n7gqi8zAL"),
    pending("audiobook", "not_created"),
    live("paperback", "B0F32RT9V8", 13.99, "71EEwrtJzwL"),
    pending("hardcover", "draft"),
  ],
  "the-billionaire-s-fake-wife": [
    live("ebook", "B0FCCBNF8X", 3.99, "81t+nGB-cNL"),
    live("audiobook", "B0GWK27PX7", 13.99, "81Dqh0HnykL"),
    live("paperback", "B0FD33W6H6", 13.99, "61rli7w55tL"),
    pending("hardcover", "draft"),
  ],
  "the-billionaire-s-baby-secret": [
    live("ebook", "B0G12LBZ24", 3.99, "81hYkwGuvqL"),
    pending("audiobook", "not_created"),
    live("paperback", "B0G4N8ZVL3", 13.99, "61KQwHzuCNL"),
    pending("hardcover", "draft"),
  ],
  "the-billionaires-forbidden-nanny": [
    live("ebook", "B0GDZ4T164", 3.99, "81Cdj2AkyyL"),
    pending("audiobook", "not_created"),
    live("paperback", "B0GMHN9PK2", 16.99, "612EJijg48L"),
    pending("hardcover", "not_created"),
  ],
  "the-first-acquisition": [
    live("ebook", "B0D82GWFD9", 0.99, "81VwCSpuUkL"),
    pending("audiobook", "not_created"),
    live("paperback", "B0GWL7GC98", 9.99, "71ZEkAKeqSL"),
    pending("hardcover", "not_created"),
  ],
  "hostile-tender": [
    live("ebook", "B0H1F9PV97", 4.99, "81iGQzEnacL"),
    pending("audiobook", "not_created"),
    live("paperback", "B0H1MFF5XG", 15.99, "71PVMbLOGgL"),
    pending("hardcover", "not_created"),
  ],
  "poison-pill": [
    live("ebook", "B0H53BP5S1", 4.99, "818PdEVWgOL"),
    pending("audiobook", "not_created"),
    live("paperback", "B0H67479F1", 15.99, "71eW05DRmJL"),
    pending("hardcover", "not_created"),
  ],
  "golden-parachute": [
    live("ebook", "B0HDKNP9F6", null, "81sk9fx+I6L"),
    pending("audiobook", "unconfirmed"),
    live("paperback", "B0HDNLYXR9", null, null),
    pending("hardcover", "unconfirmed"),
  ],
};

export function getBookEditions(slug: string): readonly BookEdition[] {
  return Object.hasOwn(BOOK_EDITIONS, slug) ? BOOK_EDITIONS[slug] : [];
}

export function getLiveBookEditions(slug: string): BookEdition[] {
  return getBookEditions(slug).filter(
    edition =>
      edition.status === "live" &&
      !!edition.asin &&
      /^[A-Z0-9]{10}$/.test(edition.asin)
  );
}

export function editionAmazonUrl(edition: BookEdition): string | null {
  if (
    edition.status !== "live" ||
    !edition.asin ||
    !/^[A-Z0-9]{10}$/.test(edition.asin)
  )
    return null;
  return withAmazonTag(`https://www.amazon.com/dp/${edition.asin}`);
}
