import { describe, it, expect } from "vitest";
import { affiliateProductsBySlug } from "../client/src/data/affiliateProducts";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const AFFILIATE_TAG = "88away0d-20";

const newBlogSlugs = [
  "dark-romance-books-beginners-guide",
  "best-kindle-setup-romance-readers",
  "enemies-to-lovers-books-that-ruined-me",
  "booktok-made-me-buy-it-honest-reviews",
  "reading-self-care-routine-book-lovers",
];

const updatedBlogSlugs = [
  "best-billionaire-romance-series-2024",
  "nyc-romance-books-manhattan-guide",
  "secret-baby-romance-books-guide",
];

const allAffiliateSlugs = [...newBlogSlugs, ...updatedBlogSlugs];

describe("Affiliate Blog Posts", () => {
  describe("Blog post markdown files exist", () => {
    for (const slug of [...newBlogSlugs, ...updatedBlogSlugs]) {
      it(`should have markdown file for ${slug}`, () => {
        const filePath = join(process.cwd(), "blog-posts", `${slug}.md`);
        expect(existsSync(filePath)).toBe(true);
      });
    }
  });

  describe("Blog post content contains affiliate links", () => {
    for (const slug of [...newBlogSlugs, ...updatedBlogSlugs]) {
      it(`should contain affiliate tag in ${slug}`, () => {
        const filePath = join(process.cwd(), "blog-posts", `${slug}.md`);
        const content = readFileSync(filePath, "utf-8");
        expect(content).toContain(`tag=${AFFILIATE_TAG}`);
      });
    }
  });

  describe("Blog post content contains FTC disclosure", () => {
    for (const slug of [...newBlogSlugs, ...updatedBlogSlugs]) {
      it(`should contain disclosure text in ${slug}`, () => {
        const filePath = join(process.cwd(), "blog-posts", `${slug}.md`);
        const content = readFileSync(filePath, "utf-8");
        expect(content.toLowerCase()).toContain("affiliate");
        expect(content.toLowerCase()).toContain("disclosure");
      });
    }
  });

  describe("Affiliate product data is configured for all posts", () => {
    for (const slug of allAffiliateSlugs) {
      it(`should have affiliate data entry for ${slug}`, () => {
        expect(affiliateProductsBySlug[slug]).toBeDefined();
        expect(affiliateProductsBySlug[slug].ftcDisclosure).toBe(true);
      });
    }
  });

  describe("Affiliate URLs use correct tag", () => {
    for (const [slug, data] of Object.entries(affiliateProductsBySlug)) {
      if (data.topPicks.length > 0) {
        it(`should use correct affiliate tag in topPicks for ${slug}`, () => {
          for (const product of data.topPicks) {
            expect(product.affiliateUrl).toContain(`tag=${AFFILIATE_TAG}`);
          }
        });
      }
    }
  });

  describe("Blog post content quality checks", () => {
    for (const slug of newBlogSlugs) {
      it(`should have substantial content in ${slug} (>2000 chars)`, () => {
        const filePath = join(process.cwd(), "blog-posts", `${slug}.md`);
        const content = readFileSync(filePath, "utf-8");
        expect(content.length).toBeGreaterThan(2000);
      });
    }
  });
});
