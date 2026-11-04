/**
 * JSON-LD builders shared by the React pages and the build-time prerender
 * (scripts/prerender-static.mjs). Keep this file free of React and browser
 * APIs so it can run in Node.
 *
 * Entity graph:
 *   WebSite (#website) ── publisher ──> Person (#author)
 *   BookSeries (/books#<lane>) ── hasPart ──> Book (/books/<slug>#book)
 *   Book ── author ──> Person (#author), isPartOf ──> BookSeries
 */
import {
  AUTHOR_ID,
  AUTHOR_SAME_AS,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
  absoluteUrl,
} from "../../../shared/site";
import { BOOKS, LANE_META, getBooksInLane, type Book, type Lane } from "./books";
import { editionAmazonUrl, getLiveBookEditions, type EditionFormat } from "./book-editions";

const ROMANCE_LANES: Lane[] = ["hudson_dynasty", "manhattan_money_kings"];

export const AUTHOR_DESCRIPTION =
  "Reese Astor writes steamy billionaire romance set in Manhattan: the Hudson Dynasty and the " +
  "Manhattan Money Kings. Every book stands alone and ends happily.";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": AUTHOR_ID,
    name: SITE_NAME,
    url: SITE_URL,
    description: AUTHOR_DESCRIPTION,
    jobTitle: "Romance author",
    knowsAbout: ["billionaire romance", "contemporary romance", "steamy romance", "Manhattan"],
    sameAs: AUTHOR_SAME_AS,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "en-US",
    publisher: { "@id": AUTHOR_ID },
  };
}

export function seriesId(lane: Lane) {
  return `${SITE_URL}/books#${lane.replace(/_/g, "-")}`;
}

export function bookId(book: Book) {
  return `${SITE_URL}/books/${book.slug}#book`;
}

export function bookUrl(book: Book) {
  return `${SITE_URL}/books/${book.slug}`;
}

export function bookSchema(book: Book) {
  const isAudio = book.format === "audiobook";
  const offerUrl = book.retailers.bookfunnel ?? book.retailers.amazon_kindle ?? undefined;
  const offerPrice = book.retailers.bookfunnel ? 0 : book.price_usd;
  const editions = getLiveBookEditions(book.slug);
  const formats: Record<EditionFormat, string> = {
    ebook: "EBook",
    audiobook: "AudiobookFormat",
    paperback: "Paperback",
    hardcover: "Hardcover",
  };
  return {
    "@context": "https://schema.org",
    "@type": isAudio ? "Audiobook" : "Book",
    "@id": bookId(book),
    name: book.title,
    url: bookUrl(book),
    description: book.blurb,
    image: absoluteUrl(book.cover_image_square ?? book.cover_image),
    author: { "@id": AUTHOR_ID, "@type": "Person", name: SITE_NAME },
    inLanguage: "en",
    genre: ROMANCE_LANES.includes(book.lane) ? "Contemporary romance" : "Nonfiction audio",
    ...(book.tropes?.length ? { keywords: book.tropes.join(", ") } : {}),
    ...(book.characters?.length
      ? { character: book.characters.map((name) => ({ "@type": "Person", name })) }
      : {}),
    ...(isAudio ? {} : { bookFormat: "https://schema.org/EBook" }),
    ...(book.publication_date ? { datePublished: book.publication_date } : {}),
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.series_position != null && ROMANCE_LANES.includes(book.lane)
      ? {
          isPartOf: {
            "@type": "BookSeries",
            "@id": seriesId(book.lane),
            name: LANE_META[book.lane].title,
          },
          position: book.series_position,
        }
      : {}),
    ...(book.asin ? { sameAs: [`https://www.amazon.com/dp/${book.asin}`] } : {}),
    ...(editions.length
      ? {
          workExample: editions.map(edition => ({
            "@type": edition.format === "audiobook" ? "Audiobook" : "Book",
            "@id": `${bookUrl(book)}#edition-${edition.format}`,
            name: book.title,
            bookFormat: `https://schema.org/${formats[edition.format]}`,
            author: { "@id": AUTHOR_ID, "@type": "Person", name: SITE_NAME },
            exampleOfWork: { "@id": bookId(book) },
            sameAs: [`https://www.amazon.com/dp/${edition.asin}`],
            url: editionAmazonUrl(edition),
            ...(edition.price_usd != null
              ? {
                  offers: {
                    "@type": "Offer",
                    price: edition.price_usd.toFixed(2),
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                    url: editionAmazonUrl(edition),
                  },
                }
              : {}),
          })),
        }
      : {}),
    ...(offerPrice != null && offerUrl
      ? {
          offers: {
            "@type": "Offer",
            price: offerPrice.toFixed(2),
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: offerUrl,
          },
        }
      : {}),
  };
}

export function seriesSchema(lane: Lane) {
  const books = getBooksInLane(lane);
  return {
    "@context": "https://schema.org",
    "@type": "BookSeries",
    "@id": seriesId(lane),
    name: LANE_META[lane].title,
    description: LANE_META[lane].subtitle,
    url: `${SITE_URL}/books`,
    author: { "@id": AUTHOR_ID },
    hasPart: books.map((b) => ({ "@id": bookId(b), "@type": "Book", name: b.title })),
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function romanceSeriesSchemas() {
  return ROMANCE_LANES.map(seriesSchema);
}

/** Plain-language reading order, for llms.txt and page copy. */
export function readingOrder(lane: Lane): string[] {
  return getBooksInLane(lane).map(
    (b) => `${b.position_label ?? ""}${b.position_label ? ": " : ""}${b.title}`,
  );
}

export { BOOKS, LANE_META, ROMANCE_LANES };
export { getLiveBookEditions, EDITION_LABELS } from "./book-editions";
export { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "../../../shared/site";
