import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BOOKS, getBook } from "../client/src/data/books";
import {
  BOOK_EDITIONS,
  EDITION_LABELS,
  editionAmazonUrl,
  getBookEditions,
  getLiveBookEditions,
} from "../client/src/data/book-editions";
import { BookEditions } from "../client/src/components/BookEditions";
import { bookSchema } from "../client/src/data/structured-data";
import { withAmazonTag } from "../client/src/lib/amazon-tag";
// @ts-expect-error plain .mjs module without declarations
import { bookFallbackEditionsHtml } from "../scripts/lib/book-fallback.mjs";

// Independent transcription of the owner's live rows: ebook, audio, paperback.
const confirmed: Record<string, [string, string, number | null][]> = {
  "the-billionaires-one-night-stand": [
    ["ebook", "B0DSG7NKGP", 0.99],
    ["paperback", "B0DVH8RNK1", 9.99],
  ],
  "the-billionaire-s-executive-assistant": [
    ["ebook", "B0F2W8QL7S", 3.99],
    ["paperback", "B0F32RT9V8", 13.99],
  ],
  "the-billionaire-s-fake-wife": [
    ["ebook", "B0FCCBNF8X", 3.99],
    ["audiobook", "B0GWK27PX7", 13.99],
    ["paperback", "B0FD33W6H6", 13.99],
  ],
  "the-billionaire-s-baby-secret": [
    ["ebook", "B0G12LBZ24", 3.99],
    ["paperback", "B0G4N8ZVL3", 13.99],
  ],
  "the-billionaires-forbidden-nanny": [
    ["ebook", "B0GDZ4T164", 3.99],
    ["paperback", "B0GMHN9PK2", 16.99],
  ],
  "the-first-acquisition": [
    ["ebook", "B0D82GWFD9", 0.99],
    ["paperback", "B0GWL7GC98", 9.99],
  ],
  "hostile-tender": [
    ["ebook", "B0H1F9PV97", 4.99],
    ["paperback", "B0H1MFF5XG", 15.99],
  ],
  "poison-pill": [
    ["ebook", "B0H53BP5S1", 4.99],
    ["paperback", "B0H67479F1", 15.99],
  ],
  "golden-parachute": [
    ["ebook", "B0HDKNP9F6", null],
    ["paperback", "B0HDNLYXR9", null],
  ],
};
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

describe("owner-confirmed KDP editions", () => {
  it("covers exactly the nine Reese Astor titles without mixing pen names", () => {
    expect(Object.keys(BOOK_EDITIONS).sort()).toEqual(
      BOOKS.map(book => book.slug).sort()
    );
    expect(Object.values(BOOK_EDITIONS).flat()).toHaveLength(36);
    expect(
      Object.keys(BOOK_EDITIONS).some(slug => /blood|calm-down/.test(slug))
    ).toBe(false);
  });
  for (const [slug, expected] of Object.entries(confirmed)) {
    it(`matches confirmed live formats, ASINs and observed prices for ${slug}`, () => {
      expect(
        getLiveBookEditions(slug).map(edition => [
          edition.format,
          edition.asin,
          edition.price_usd,
        ])
      ).toEqual(expected);
    });
  }
  it("keeps the parent Kindle price, ASIN, format and audio flags consistent", () => {
    for (const book of BOOKS) {
      const editions = getLiveBookEditions(book.slug);
      const ebook = editions.find(edition => edition.format === "ebook")!;
      const audio = editions.some(edition => edition.format === "audiobook");
      expect(book.asin).toBe(ebook.asin);
      expect(book.price_usd).toBe(ebook.price_usd);
      expect(book.audiobook_available).toBe(audio);
      expect(book.format).toBe(audio ? "ebook_and_audiobook" : "ebook");
    }
  });
  it("does not turn drafts, not-created editions or VERIFY cells into links", () => {
    const unavailable = Object.values(BOOK_EDITIONS)
      .flat()
      .filter(edition => edition.status !== "live");
    expect(unavailable).toHaveLength(17);
    for (const edition of unavailable) {
      expect(edition.asin).toBeNull();
      expect(edition.price_usd).toBeNull();
      expect(editionAmazonUrl(edition)).toBeNull();
    }
    expect(
      getBookEditions("golden-parachute").find(e => e.format === "audiobook")
        ?.status
    ).toBe("unconfirmed");
    expect(
      getBookEditions("golden-parachute").find(e => e.format === "hardcover")
        ?.status
    ).toBe("unconfirmed");
    expect(
      getBookEditions("the-billionaires-one-night-stand").find(
        e => e.format === "hardcover"
      )?.status
    ).toBe("draft");
    expect(
      getBookEditions("the-billionaires-forbidden-nanny").find(
        e => e.format === "hardcover"
      )?.status
    ).toBe("not_created");
  });
  it("never substitutes proposed target prices for observed prices", () => {
    expect(
      getLiveBookEditions("the-billionaires-forbidden-nanny").find(
        e => e.format === "paperback"
      )?.price_usd
    ).toBe(16.99);
    expect(
      getLiveBookEditions("the-first-acquisition").find(
        e => e.format === "audiobook"
      )
    ).toBeUndefined();
    expect(
      getLiveBookEditions("the-billionaire-s-fake-wife").find(
        e => e.format === "audiobook"
      )?.price_usd
    ).toBe(13.99);
    expect(
      getLiveBookEditions("golden-parachute").every(e => e.price_usd === null)
    ).toBe(true);
  });
  it("keeps supplied format covers as references and preserves missing covers", () => {
    for (const edition of Object.values(BOOK_EDITIONS).flat()) {
      if (edition.cover_source_url)
        expect(edition.cover_source_url).toMatch(
          /^https:\/\/m\.media-amazon\.com\/images\/I\/.+\._SL1500_\.jpg$/
        );
    }
    expect(
      getLiveBookEditions("golden-parachute").find(e => e.format === "ebook")
        ?.cover_source_url
    ).toContain("81sk9fx+I6L");
    expect(
      getLiveBookEditions("golden-parachute").find(
        e => e.format === "paperback"
      )?.cover_source_url
    ).toBeNull();
    expect(BOOKS.every(book => book.cover_image?.startsWith("/"))).toBe(true);
  });
  it("tags all 19 live links and rejects malformed and unknown entries", () => {
    const editions = BOOKS.flatMap(book => getLiveBookEditions(book.slug));
    expect(editions).toHaveLength(19);
    expect(new Set(editions.map(e => e.asin)).size).toBe(19);
    for (const edition of editions) {
      expect(editionAmazonUrl(edition)).toBe(
        `https://www.amazon.com/dp/${edition.asin}?tag=reeseastor-20`
      );
    }
    expect(editionAmazonUrl({ ...editions[0], asin: "VERIFY" })).toBeNull();
    expect(getBookEditions("__proto__")).toEqual([]);
    expect(getBookEditions("other-author-title")).toEqual([]);
  });
  it("does not publish the audiobook ASINs whose Amazon pages 404", () => {
    const removed = [
      "B0GWFWVF3B",
      "B0FXF34B46",
      "B0GWK722LX",
      "B0GWK16XYG",
      "B0GWK1YQZZ",
      "B0H671DP6S",
      "B0H6KSLP1T",
    ];
    const live = BOOKS.flatMap(book => getLiveBookEditions(book.slug));
    for (const asin of removed) {
      expect(live.some(edition => edition.asin === asin), asin).toBe(false);
    }
    const fakeWifeAudio = getLiveBookEditions("the-billionaire-s-fake-wife").find(
      edition => edition.format === "audiobook"
    );
    expect(fakeWifeAudio?.asin).toBe("B0GWK27PX7");
    expect(fakeWifeAudio?.price_usd).toBe(13.99);
    expect(fakeWifeAudio?.status).toBe("live");
    for (const book of BOOKS) {
      const schema = bookSchema(book);
      const audio = schema.workExample?.filter(edition =>
        edition.bookFormat.endsWith("/AudiobookFormat")
      );
      if (book.slug === "the-billionaire-s-fake-wife") {
        expect(audio).toHaveLength(1);
        expect(audio?.[0].offers?.price).toBe("13.99");
        expect(audio?.[0].offers?.availability).toBe("https://schema.org/InStock");
      } else {
        expect(audio ?? []).toEqual([]);
      }
    }
  });
});

describe("edition reading choices and metadata", () => {
  it("discloses before secondary links and never displays stale prices or unavailable formats", () => {
    const html = renderToStaticMarkup(
      createElement(BookEditions, {
        slug: "golden-parachute",
        title: "Golden Parachute",
      })
    );
    expect(html.indexOf("As an Amazon Associate")).toBeLessThan(
      html.indexOf("<a ")
    );
    expect(html).toContain("B0HDNLYXR9?tag=reeseastor-20");
    expect(html).toContain('rel="sponsored noopener noreferrer nofollow"');
    expect(html).not.toContain(">Audiobook");
    expect(html).not.toContain(">Hardcover");
    expect(html).not.toContain("$");
    expect(
      renderToStaticMarkup(
        createElement(BookEditions, { slug: "unknown", title: "Unknown" })
      )
    ).toBe("");
  });
  it("keeps no-JS and React format destinations identical for every title", () => {
    for (const book of BOOKS) {
      const editions = getLiveBookEditions(book.slug);
      const html = bookFallbackEditionsHtml({
        editions: getBookEditions(book.slug),
        labels: EDITION_LABELS,
        esc,
        withAmazonTag,
      });
      const react = renderToStaticMarkup(
        createElement(BookEditions, { slug: book.slug, title: book.title })
      );
      expect(html.indexOf("As an Amazon Associate")).toBeLessThan(
        html.indexOf("<a ")
      );
      expect(html.match(/<a /g)).toHaveLength(editions.length);
      for (const edition of editions) {
        expect(html).toContain(editionAmazonUrl(edition));
        expect(react).toContain(editionAmazonUrl(edition));
      }
      expect(html).not.toContain("VERIFY");
      expect(html).not.toContain("Hardcover");
    }
  });
  it("separates free BookFunnel offers from paid prequel Amazon editions", () => {
    for (const slug of [
      "the-first-acquisition",
      "the-billionaires-one-night-stand",
    ]) {
      const book = getBook(slug)!;
      const schema = bookSchema(book);
      expect(book.retailers.bookfunnel).toMatch(
        /^https:\/\/dl\.bookfunnel\.com\//
      );
      expect(book.retailers.amazon_kindle).toBeUndefined();
      expect(schema.offers?.price).toBe("0.00");
      expect(schema.offers?.url).toBe(book.retailers.bookfunnel);
      expect(
        schema.workExample?.find(edition =>
          edition.bookFormat.endsWith("/EBook")
        )?.offers?.price
      ).toBe("0.99");
    }
  });
  it("includes only live edition metadata and omits unconfirmed prices", () => {
    for (const book of BOOKS) {
      const schema = bookSchema(book);
      expect(schema.workExample).toHaveLength(
        getLiveBookEditions(book.slug).length
      );
    }
    const golden = bookSchema(getBook("golden-parachute")!);
    expect(golden.offers).toBeUndefined();
    expect(golden.workExample?.every(edition => !edition.offers)).toBe(true);
    expect(golden.workExample?.map(edition => edition.sameAs[0])).toEqual([
      "https://www.amazon.com/dp/B0HDKNP9F6",
      "https://www.amazon.com/dp/B0HDNLYXR9",
    ]);
  });
});
