import type { AffiliateProduct } from "@/components/AffiliateProductCard";
import { AMAZON_ASSOCIATE_TAG } from "../lib/amazon-tag";

export const PRODUCT_ASSOCIATE_TAG = AMAZON_ASSOCIATE_TAG;
export const PRODUCT_LINK_REL = "sponsored noopener noreferrer nofollow";

function product(
  asin: string,
  name: string,
  editorialReason: string,
  tradeoff: string,
  noPurchaseAlternative: string,
  aliases: string[] = [],
  priceRange = "",
  rating?: number,
): AffiliateProduct {
  return {
    name,
    affiliateUrl: `https://www.amazon.com/dp/${asin}?tag=${PRODUCT_ASSOCIATE_TAG}`,
    description: editorialReason,
    whyRecommend: editorialReason,
    editorialReason,
    tradeoff,
    noPurchaseAlternative,
    aliases,
    // Retained for legacy consumers; cards intentionally do not display these.
    priceRange,
    rating,
  };
}

const kindleReason = "A dedicated e-reader may help keep phone notifications out of a reading session.";
const kindleTradeoff = "Check the exact generation, screen size, supported formats, and library compatibility. A device purchase does not include every book or subscription.";
const kindleAlternative = "Use your current reader or phone with notifications paused, or borrow a print book from the library.";
const pillowTradeoff = "Support and firmness are personal. Measure your chair or bed and check cleaning instructions and return options.";
const pillowAlternative = "Try arranging pillows you already own behind your back and beneath your arms.";
const candleTradeoff = "Fragrance is subjective and may not suit people with sensitivities. Keep flames away from books and never leave a candle unattended.";
const candleAlternative = "Use an existing lamp and a quiet corner; fragrance is not needed for a reading or writing ritual.";
const socksAlternative = "Wear your usual warm socks or use a blanket you already own.";
const glassTradeoff = "Check capacity, material, and care instructions. A novelty design adds no reading benefit.";
const glassAlternative = "Use a glass or mug you already own, with any drink you enjoy.";

/**
 * Approved existing products only. Aliases identify specific named products,
 * never broad topics such as “reading”, “pillow”, or “candle”.
 * Existing ASINs are preserved, not represented as newly verified listings.
 */
export const approvedAffiliateProducts: AffiliateProduct[] = [
  product(
    "B0CFPJYX7P", "Kindle Paperwhite (7-inch listing)",
    kindleReason, kindleTradeoff, kindleAlternative,
    ["Kindle Paperwhite", 'Kindle Paperwhite (7" Display, Latest Model)', 'Kindle Paperwhite (newest model, 7" display)', "Kindle Paperwhite (newest model)"],
    "Around $150", 4.7,
  ),
  product(
    "B0CFPJYX2T", "Kindle Paperwhite (2024)",
    kindleReason, kindleTradeoff, kindleAlternative,
    [], "Around $150", 4.7,
  ),
  product(
    "B0BMPFB4TT", "Husband Pillow Original Shredded Memory Foam",
    "A reading pillow with arms may offer another way to support a seated reading position.",
    pillowTradeoff, pillowAlternative, ["Husband Pillow Original"], "Around $55", 4.5,
  ),
  product(
    "B07WNRN9WQ", "Glocusent LED Book Light",
    "A separate book light may help direct light onto a print page in a shared room.",
    "Check the clip fit, charging requirements, and brightness settings. A small light may still disturb someone nearby.",
    "Reposition a lamp you already own, or read beside a window during the day.",
    ["Glocusent book light"], "Around $13", 4.6,
  ),
  product(
    "B0CQS2SSFW", "Aimuan Reading Pillow",
    "A reading pillow may be useful if your usual seating lacks support.",
    pillowTradeoff, pillowAlternative,
  ),
  product(
    "B09V518DRK", "Aimuan Reading Pillow with Arms",
    "A pillow with arms is one option for changing your seated reading setup.",
    pillowTradeoff, pillowAlternative,
  ),
  product(
    "B0F1FY6XT7", "Classical Library Candle",
    "A library-themed candle is an optional atmosphere detail for readers who enjoy fragrance.",
    candleTradeoff, candleAlternative, [], "Around $20", 4.6,
  ),
  product(
    "B0CMTXKBWW", '"Smells Like She\'s Writing a Bestseller" Soy Candle',
    "A writing-themed label may make this an option for a small, personal gift.",
    candleTradeoff, candleAlternative, ["Smells Like She's Writing a Bestseller"], "Around $22", 4.7,
  ),
  product(
    "B0F1THN236", "HAPPYPOP Book Lover Fuzzy Socks",
    "Book-themed socks are an optional way to add warmth to a reading evening.",
    "Check sizing, fabric, and grip. Fuzzy socks may be slippery on smooth floors.",
    socksAlternative,
  ),
  product(
    "B0F8BPSCZV", "HAPPYPOP Book Lover Fuzzy Socks (gift guide listing)",
    "Book-themed socks may suit a recipient who enjoys practical small gifts.",
    "Check the exact design, size, and fabric rather than assuming every listing is identical.",
    socksAlternative,
  ),
  product(
    "B0DD4FWCJW", "Book Lover Wine Glass",
    "A book-themed glass is an optional gift when you already know the recipient's taste.",
    glassTradeoff, glassAlternative,
  ),
  product(
    "B0FWC3HD8X", '"Too Many Books" Wine Glass',
    "A book-themed glass may suit someone who enjoys novelty tableware.",
    glassTradeoff, glassAlternative, ["Too Many Books Wine Glass"],
  ),
  product(
    "B0CW63NL9F", "Huglanket Book Lovers Wearable Blanket Hoodie",
    "A wearable blanket may leave your hands free while keeping you warm during a reading session.",
    "Check sizing, fabric, and washing instructions. Bulky layers can be too warm or restrictive for some readers.",
    "Use a sweater or blanket you already have.",
    ["Huglanket Book Lovers Blanket Hoodie"], "Around $35", 4.6,
  ),
];

const byAsin = new Map(approvedAffiliateProducts.map(p => [p.affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/)![1], p]));
function pick(asin: string): AffiliateProduct {
  const entry = byAsin.get(asin);
  if (!entry) throw new Error(`Unapproved product: ${asin}`);
  return entry;
}
function inline(entries: [string, string][]) {
  return Object.fromEntries(entries.map(([name, asin]) => [
    name, { url: pick(asin).affiliateUrl, rel: PRODUCT_LINK_REL },
  ]));
}

/** Explicit article curation takes precedence over automatic matches. */
export const affiliateProductsBySlug: Record<string, {
  ftcDisclosure: boolean;
  topPicks: AffiliateProduct[];
  inlineProducts: Record<string, { url: string; rel: string }>;
}> = {
  "ultimate-cozy-reading-night-setup": {
    ftcDisclosure: true,
    topPicks: [pick("B0CFPJYX7P"), pick("B0BMPFB4TT"), pick("B07WNRN9WQ")],
    inlineProducts: inline([
      ["Husband Pillow Original Shredded Memory Foam", "B0BMPFB4TT"],
      ["Aimuan Reading Pillow", "B0CQS2SSFW"],
      ["Glocusent LED Book Light", "B07WNRN9WQ"],
      ["Classical Library Candle", "B0F1FY6XT7"],
      ['"Smells Like She\'s Writing a Bestseller" Soy Candle', "B0CMTXKBWW"],
      ["HAPPYPOP Book Lover Fuzzy Socks", "B0F1THN236"],
      ["Book Lover Wine Glass", "B0DD4FWCJW"],
      ['Kindle Paperwhite (newest model, 7" display)', "B0CFPJYX7P"],
    ]),
  },
  "best-billionaire-romance-series-2024": {
    ftcDisclosure: true, topPicks: [pick("B0CFPJYX2T")], inlineProducts: {},
  },
  "nyc-romance-books-manhattan-guide": {
    ftcDisclosure: true, topPicks: [], inlineProducts: {},
  },
  "secret-baby-romance-books-guide": {
    ftcDisclosure: true, topPicks: [], inlineProducts: {},
  },
  "best-kindle-setup-romance-readers": {
    ftcDisclosure: true, topPicks: [pick("B0CFPJYX2T"), pick("B07WNRN9WQ")], inlineProducts: {},
  },
  "enemies-to-lovers-books-that-ruined-me": {
    ftcDisclosure: true, topPicks: [], inlineProducts: {},
  },
  "booktok-made-me-buy-it-honest-reviews": {
    ftcDisclosure: true, topPicks: [pick("B0CFPJYX2T")], inlineProducts: {},
  },
  "reading-self-care-routine-book-lovers": {
    ftcDisclosure: true, topPicks: [pick("B0CFPJYX2T"), pick("B07WNRN9WQ")], inlineProducts: {},
  },
  "romance-reader-gift-guide": {
    ftcDisclosure: true,
    topPicks: [pick("B0CFPJYX7P"), pick("B0CW63NL9F"), pick("B07WNRN9WQ")],
    inlineProducts: inline([
      ["HAPPYPOP Book Lover Fuzzy Socks", "B0F8BPSCZV"],
      ['"Too Many Books" Wine Glass', "B0FWC3HD8X"],
      ["Classical Library Candle", "B0F1FY6XT7"],
      ["Glocusent LED Book Light", "B07WNRN9WQ"],
      ["Aimuan Reading Pillow with Arms", "B09V518DRK"],
      ["Kindle Paperwhite (newest model)", "B0CFPJYX7P"],
    ]),
  },
  "what-i-burn-while-i-write": {
    ftcDisclosure: true,
    topPicks: [pick("B0F1FY6XT7"), pick("B0CMTXKBWW")],
    inlineProducts: inline([
      ["Classical Library Candle", "B0F1FY6XT7"],
      ['"Smells Like She\'s Writing a Bestseller" Soy Candle', "B0CMTXKBWW"],
    ]),
  },
};
