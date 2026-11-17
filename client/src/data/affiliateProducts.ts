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
 * never broad topics such as "reading", "pillow", or "candle".
 * Names and ASINs are aligned to live Amazon listings (same replacements as /favorites).
 * Do not state static Amazon prices or star ratings; those change.
 */
export const approvedAffiliateProducts: AffiliateProduct[] = [
  product(
    "B0CFPJYX7P", "Kindle Paperwhite 16GB (2024 model)",
    kindleReason, kindleTradeoff, kindleAlternative,
    ["Kindle Paperwhite", "Kindle Paperwhite (2024)", "Kindle Paperwhite 16GB"],
  ),
  product(
    "B0BMPFB4TT", "Husband Pillow Medium Reading Pillow with Arms, Purple",
    "A reading pillow with arms may offer another way to support a seated reading position.",
    pillowTradeoff, pillowAlternative, ["Husband Pillow", "Husband Pillow Medium"],
  ),
  product(
    "B07WNRN9WQ", "Glocusent Neck Reading Light",
    "A separate book light may help direct light onto a print page in a shared room.",
    "Check the neck fit, charging requirements, and brightness settings. A small light may still disturb someone nearby.",
    "Reposition a lamp you already own, or read beside a window during the day.",
    ["Glocusent book light", "Glocusent Neck Light"],
  ),
  product(
    "B0CQS2SSFW", "Aimuan Reading Pillow with Arms, Large, Blush",
    "A reading pillow may be useful if your usual seating lacks support.",
    pillowTradeoff, pillowAlternative, ["Aimuan Reading Pillow"],
  ),
  product(
    "B09V518DRK", "Aimuan Reading Pillow with Arms, Ivory",
    "A pillow with arms is one option for changing your seated reading setup.",
    pillowTradeoff, pillowAlternative, ["Aimuan Reading Pillow with Arms"],
  ),
  product(
    "B0F1FY6XT7", "Classical Library Candle",
    "A library-themed candle is an optional atmosphere detail for readers who enjoy fragrance.",
    candleTradeoff, candleAlternative,
  ),
  product(
    "B0DXPL9RL2", '"Smells Like She\'s Writing a Bestseller" Scented Soy Candle',
    "A writing-themed label may make this an option for a small, personal gift.",
    candleTradeoff, candleAlternative,
    ["Smells Like She's Writing a Bestseller", '"Smells Like She\'s Writing a Bestseller" Soy Candle'],
  ),
  product(
    "B0F8BPSCZV", "HAPPYPOP Book Lover Fuzzy Socks (gift guide listing)",
    "Book-themed socks may suit a recipient who enjoys practical small gifts.",
    "Check the exact design, size, and fabric rather than assuming every listing is identical.",
    socksAlternative,
  ),
  product(
    "B0DTYGQYGQ", "C M Books & Wine Stemless Wine Glass, 17 oz",
    "A book-themed glass is an optional gift when you already know the recipient's taste.",
    glassTradeoff, glassAlternative, ["Book Lover Wine Glass"],
  ),
  product(
    "B0FWC3HD8X", "There Is No Such Thing as Too Many Books Wine Glass, 15 oz",
    "A book-themed glass may suit someone who enjoys novelty tableware.",
    glassTradeoff, glassAlternative, ['"Too Many Books" Wine Glass', "Too Many Books Wine Glass"],
  ),
  product(
    "B0FXWF75B4", "Krifey Wearable Blanket Hoodie, Full Coverage Oversized Sherpa",
    "A wearable blanket may leave your hands free while keeping you warm during a reading session.",
    "Check sizing, fabric, and washing instructions. Bulky layers can be too warm or restrictive for some readers.",
    "Use a sweater or blanket you already have.",
    ["Krifey Wearable Blanket Hoodie"],
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
      ["Husband Pillow Medium Reading Pillow with Arms, Purple", "B0BMPFB4TT"],
      ["Aimuan Reading Pillow with Arms, Large, Blush", "B0CQS2SSFW"],
      ["Glocusent Neck Reading Light", "B07WNRN9WQ"],
      ["Classical Library Candle", "B0F1FY6XT7"],
      ['"Smells Like She\'s Writing a Bestseller" Scented Soy Candle', "B0DXPL9RL2"],
      ["C M Books & Wine Stemless Wine Glass, 17 oz", "B0DTYGQYGQ"],
      ["Kindle Paperwhite 16GB (2024 model)", "B0CFPJYX7P"],
    ]),
  },
  "best-billionaire-romance-series-2024": {
    ftcDisclosure: false, topPicks: [], inlineProducts: {},
  },
  "nyc-romance-books-manhattan-guide": {
    ftcDisclosure: true, topPicks: [], inlineProducts: {},
  },
  "secret-baby-romance-books-guide": {
    ftcDisclosure: true, topPicks: [], inlineProducts: {},
  },
  "best-kindle-setup-romance-readers": {
    ftcDisclosure: true, topPicks: [pick("B07WNRN9WQ")], inlineProducts: {},
  },
  "enemies-to-lovers-books-that-ruined-me": {
    ftcDisclosure: true, topPicks: [], inlineProducts: {},
  },
  "booktok-made-me-buy-it-honest-reviews": {
    ftcDisclosure: true, topPicks: [], inlineProducts: {},
  },
  "reading-self-care-routine-book-lovers": {
    ftcDisclosure: true, topPicks: [pick("B07WNRN9WQ")], inlineProducts: {},
  },
  "romance-reader-gift-guide": {
    ftcDisclosure: true,
    topPicks: [pick("B0CFPJYX7P"), pick("B0FXWF75B4"), pick("B07WNRN9WQ")],
    inlineProducts: inline([
      ["HAPPYPOP Book Lover Fuzzy Socks", "B0F8BPSCZV"],
      ["There Is No Such Thing as Too Many Books Wine Glass, 15 oz", "B0FWC3HD8X"],
      ["Classical Library Candle", "B0F1FY6XT7"],
      ["Glocusent Neck Reading Light", "B07WNRN9WQ"],
      ["Aimuan Reading Pillow with Arms, Ivory", "B09V518DRK"],
      ["Kindle Paperwhite 16GB (2024 model)", "B0CFPJYX7P"],
    ]),
  },
  "what-i-burn-while-i-write": {
    ftcDisclosure: true,
    topPicks: [pick("B0F1FY6XT7"), pick("B0DXPL9RL2")],
    inlineProducts: inline([
      ["Classical Library Candle", "B0F1FY6XT7"],
      ['"Smells Like She\'s Writing a Bestseller" Scented Soy Candle', "B0DXPL9RL2"],
    ]),
  },
};
