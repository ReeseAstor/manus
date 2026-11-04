import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  AFFILIATE_LINK_REL,
  isAmazonAffiliateDestination,
  resolveBlogRecommendations,
} from "../client/src/lib/blog-recommendations";
import { affiliateProductsBySlug, approvedAffiliateProducts } from "../client/src/data/affiliateProducts";
import { AffiliateProductCard, AffiliateProductSection, FTCDisclosure } from "../client/src/components/AffiliateProductCard";

vi.mock("../client/src/lib/trpc", () => ({
  trpc: { affiliateTracking: { trackClick: { useMutation: () => ({ mutate: vi.fn() }) } } },
}));
vi.mock("wouter", () => ({ useLocation: () => ["/blog/new-article"] }));

function resolve(content: string, title = "A new article", slug = "new-article") {
  return resolveBlogRecommendations({ slug, title, content });
}

describe("approved blog recommendations", () => {
  it("adds no unrelated fallback for an ordinary reading article", () => {
    expect(resolve("A candle, a pillow, a Kindle, socks, and a good romance make a reading night.")).toEqual({
      products: [], hasAffiliateLinks: false,
    });
  });

  it("matches complete product names and aliases in title or content, case-insensitively", () => {
    const result = resolve("Try a GLOCUSENT book light.", "A Kindle Paperwhite reading setup");
    expect(result.products.map(p => p.name)).toEqual([
      "Kindle Paperwhite (7-inch listing)", "Glocusent LED Book Light",
    ]);
    expect(result.hasAffiliateLinks).toBe(true);
  });

  it("handles punctuation, curly apostrophes, and repeated whitespace", () => {
    const result = resolve("“Smells Like She’s Writing a Bestseller” and Glocusent\nLED Book Light.");
    expect(result.products).toHaveLength(2);
  });

  it("does not match product aliases inside longer words or URL paths", () => {
    expect(resolve("NotKindle PaperwhiteX https://example.org/Kindle-Paperwhite")).toEqual({
      products: [], hasAffiliateLinks: false,
    });
  });

  it("ignores HTML attributes, comments, and scripts when matching product names", () => {
    expect(resolve('<div title="Kindle Paperwhite">Hello</div><!-- Glocusent LED Book Light --><script>Kindle Paperwhite</script>').products).toEqual([]);
  });

  it("prefers the specific variant over a shorter overlapping product alias", () => {
    expect(resolve("Kindle Paperwhite (2024)").products.map(p => p.affiliateUrl)).toEqual([
      "https://www.amazon.com/dp/B0CFPJYX2T?tag=reeseastor-20",
    ]);
    expect(resolve("Aimuan Reading Pillow with Arms").products).toHaveLength(1);
  });

  it("matches approved ASIN destinations and preserves the configured tag, not incoming tags", () => {
    const result = resolve("[Device](https://amazon.com/gp/product/B0CFPJYX7P?tag=someone-20)");
    expect(result.products).toHaveLength(1);
    expect(result.products[0].affiliateUrl).toBe("https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20");
  });

  it("deduplicates repeated names, aliases, and ASIN links", () => {
    const result = resolve("Glocusent book light, Glocusent LED Book Light. https://www.amazon.com/dp/B07WNRN9WQ https://amazon.com/gp/aw/d/B07WNRN9WQ");
    expect(result.products).toHaveLength(1);
  });

  it("caps recommendations at three without adding arbitrary products", () => {
    const result = resolve("Kindle Paperwhite, Glocusent book light, Classical Library Candle, Huglanket Book Lovers Blanket Hoodie.");
    expect(result.products).toHaveLength(3);
  });

  it("retains explicit slug curation ahead of automatic matches", () => {
    const slug = "what-i-burn-while-i-write";
    const result = resolve("Glocusent book light", "An updated title", slug);
    expect(result.products).toEqual(affiliateProductsBySlug[slug].topPicks);
  });

  it("respects an explicitly empty curated selection while still detecting inline links", () => {
    const result = resolve("Kindle Paperwhite https://amazon.com/dp/B000000000", "Title", "nyc-romance-books-manhattan-guide");
    expect(result.products).toEqual([]);
    expect(result.hasAffiliateLinks).toBe(true);
  });

  it("handles non-catalog slugs that are object prototype property names", () => {
    expect(resolve("A quiet day.", "Title", "__proto__").products).toEqual([]);
  });

  it("discloses inline Amazon links independently of whether the ASIN is approved", () => {
    const result = resolve("[Book](https://www.amazon.com/dp/B000000000?tag=reeseastor-20)");
    expect(result.products).toEqual([]);
    expect(result.hasAffiliateLinks).toBe(true);
    expect(resolve("https://amzn.to/example").hasAffiliateLinks).toBe(true);
    expect(resolve("https://amzn.to/dp/B0CFPJYX7P").products).toEqual([]);
  });

  it.each([
    "https://amazon.com.evil.example/dp/B0CFPJYX7P",
    "https://evilamazon.com/dp/B0CFPJYX7P",
    "https://www.amazon.com@evil.example/dp/B0CFPJYX7P",
    "https://evil.example/?url=https%3A%2F%2Famazon.com%2Fdp%2FB0CFPJYX7P",
    "http://www.amazon.com/dp/B0CFPJYX7P",
    "javascript:alert(1)",
    "https://www.amazon.com:444/dp/B0CFPJYX7P",
    "https://user@www.amazon.com/dp/B0CFPJYX7P",
  ])("rejects unsafe or spoofed destinations: %s", href => {
    expect(isAmazonAffiliateDestination(href)).toBe(false);
    expect(resolve(`[More](${href})`)).toEqual({ products: [], hasAffiliateLinks: false });
  });

  it("requires an exact approved ASIN, not a bare ASIN or prefix", () => {
    expect(resolve("B0CFPJYX7P").products).toEqual([]);
    expect(resolve("https://amazon.com/dp/B0CFPJYX7PX").products).toEqual([]);
  });

  it("gives every approved product practical notes and a no-purchase alternative", () => {
    for (const product of approvedAffiliateProducts) {
      expect(product.editorialReason).toBeTruthy();
      expect(product.tradeoff).toBeTruthy();
      expect(product.noPurchaseAlternative).toBeTruthy();
      expect(product.whyRecommend).not.toMatch(/\b(I|my|I've)\b/);
      expect(isAmazonAffiliateDestination(product.affiliateUrl)).toBe(true);
    }
  });
});

describe("editorial affiliate cards", () => {
  it("discloses affiliate status before the first recommendation link", () => {
    const html = renderToStaticMarkup(createElement(AffiliateProductSection, {
      products: [approvedAffiliateProducts[0]], sourceSlug: "new-article",
    }));
    expect(html.indexOf("As an Amazon Associate")).toBeLessThan(html.indexOf("<a "));
    expect(html).toContain(`rel="${AFFILIATE_LINK_REL}"`);
    expect(html).toContain("No purchase needed");
    expect(html).toContain("Consider before buying");
    expect(html).not.toContain("Around $150");
    expect(html).not.toContain("4.7");
    expect(html).not.toContain("Why I love");
  });

  it("offers a first-use disclosure even when an article only has inline book links", () => {
    const result = resolve("https://amazon.com/dp/B000000000");
    const html = renderToStaticMarkup(createElement("article", null,
      result.hasAffiliateLinks && createElement(FTCDisclosure),
      createElement("a", { href: "https://amazon.com/dp/B000000000", rel: AFFILIATE_LINK_REL }, "Book"),
    ));
    expect(html.indexOf("As an Amazon Associate")).toBeLessThan(html.indexOf("<a "));
  });

  it("keeps favorites-compatible legacy data without rendering unverified claims", () => {
    const html = renderToStaticMarkup(createElement(AffiliateProductCard, {
      index: 0,
      product: {
        name: "A legacy favorite",
        affiliateUrl: "https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20",
        description: "An unverified claim",
        whyRecommend: "I tested this every day.",
        priceRange: "$150",
        rating: 4.7,
      },
    }));
    expect(html).not.toContain("I tested");
    expect(html).not.toContain("unverified claim");
    expect(html).not.toContain("$150");
    expect(html).not.toContain("4.7");
    expect(html).toContain("An optional item");
  });

  it("does not render a link for an unsafe product destination", () => {
    const html = renderToStaticMarkup(createElement(AffiliateProductCard, {
      index: 0, product: { ...approvedAffiliateProducts[0], affiliateUrl: "https://amazon.com.evil.example" },
    }));
    expect(html).not.toContain("<a ");
  });

  it("renders no empty recommendation section", () => {
    expect(renderToStaticMarkup(createElement(AffiliateProductSection, { products: [] }))).toBe("");
  });
});
