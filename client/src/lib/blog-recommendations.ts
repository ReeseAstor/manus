import type { AffiliateProduct } from "../components/AffiliateProductCard";
import { isAmazonAffiliateDestination } from "./amazon-tag";
export { isAmazonAffiliateDestination } from "./amazon-tag";
import {
  affiliateProductsBySlug,
  approvedAffiliateProducts,
  PRODUCT_LINK_REL,
} from "../data/affiliateProducts";

export const AFFILIATE_LINK_REL = PRODUCT_LINK_REL;
export const MAX_BLOG_RECOMMENDATIONS = 3;

const wordCharacter = new RegExp("[\\p{L}\\p{N}]", "u");

function asinFromUrl(href: string): string | undefined {
  if (!isAmazonAffiliateDestination(href)) return undefined;
  const url = new URL(href);
  if (url.hostname === "amzn.to") return undefined;
  return url.pathname
    .match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([a-z0-9]{10})(?:\/|$)/i)?.[1].toUpperCase();
}

const approvedByAsin = new Map(
  approvedAffiliateProducts.map(product => [asinFromUrl(product.affiliateUrl), product]),
);

function normalizeText(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/&(?:quot|#34);/gi, '"')
    .replace(/&(?:apos|#39);/gi, "'")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function visibleText(text: string): string {
  return normalizeText(text
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/https?:\/\/[^\s<>"')\]]+/gi, " "));
}

function namedProducts(text: string): AffiliateProduct[] {
  const matches: { start: number; end: number; product: AffiliateProduct }[] = [];
  for (const product of approvedAffiliateProducts) {
    for (const name of [product.name, ...(product.aliases || [])]) {
      const needle = normalizeText(name);
      let start = text.indexOf(needle);
      while (start !== -1) {
        const end = start + needle.length;
        // Avoid matching inside a longer word or brand name.
        if (!wordCharacter.test(text[start - 1] || "") &&
            !wordCharacter.test(text[end] || "")) {
          matches.push({ start, end, product });
        }
        start = text.indexOf(needle, start + 1);
      }
    }
  }
  // Prefer a specific model/name over a shorter alias in the same mention.
  matches.sort((a, b) => (b.end - b.start) - (a.end - a.start) || a.start - b.start);
  const selected: typeof matches = [];
  for (const match of matches) {
    if (!selected.some(other => match.start < other.end && match.end > other.start)) {
      selected.push(match);
    }
  }
  return selected.sort((a, b) => a.start - b.start).map(match => match.product);
}

export interface BlogRecommendationInput {
  slug: string;
  title: string;
  content: string;
}

export interface BlogRecommendations {
  products: AffiliateProduct[];
  hasAffiliateLinks: boolean;
}

/**
 * Pure, deterministic resolution: explicit slug curation wins (including empty
 * selections); otherwise use complete approved names/aliases and exact ASIN URLs.
 * Never add generic fallback products or convert arbitrary keywords to links.
 */
export function resolveBlogRecommendations({
  slug, title, content,
}: BlogRecommendationInput): BlogRecommendations {
  const curated = Object.hasOwn(affiliateProductsBySlug, slug) ? affiliateProductsBySlug[slug] : undefined;
  const urls = content.match(/https?:\/\/[^\s<>"')\]]+/gi) || [];
  const hasInlineAmazonLink = urls.some(isAmazonAffiliateDestination);
  const linkedProducts = urls.flatMap(url => {
    const asin = asinFromUrl(url);
    const product = asin ? approvedByAsin.get(asin) : undefined;
    return product ? [product] : [];
  });
  const candidates = curated ? curated.topPicks : [
    ...namedProducts(visibleText(`${title}\n${content}`)),
    ...linkedProducts,
  ];
  const seen = new Set<string>();
  const products = candidates.filter(product => {
    const asin = asinFromUrl(product.affiliateUrl);
    if (!asin || !approvedByAsin.has(asin) || seen.has(asin)) return false;
    seen.add(asin);
    return true;
  }).slice(0, MAX_BLOG_RECOMMENDATIONS);

  return {
    products,
    hasAffiliateLinks: products.length > 0 || hasInlineAmazonLink || Boolean(curated?.ftcDisclosure),
  };
}
