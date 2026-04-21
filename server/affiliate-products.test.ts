import { describe, it, expect } from "vitest";

// Test the affiliate products data structure
describe("Affiliate Products Data", () => {
  it("should have valid affiliate product data for the cozy reading article", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    
    const data = affiliateProductsBySlug["ultimate-cozy-reading-night-setup"];
    expect(data).toBeDefined();
    expect(data.ftcDisclosure).toBe(true);
    expect(data.topPicks).toHaveLength(3);
    expect(data.inlineProducts).toBeDefined();
  });

  it("should have valid Amazon affiliate URLs with correct store tag", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    
    const data = affiliateProductsBySlug["ultimate-cozy-reading-night-setup"];
    const storeTag = "88away0d-20";
    
    // Check top picks
    for (const product of data.topPicks) {
      expect(product.affiliateUrl).toContain("amazon.com");
      expect(product.affiliateUrl).toContain(`tag=${storeTag}`);
      expect(product.name).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(product.whyRecommend).toBeTruthy();
      expect(product.priceRange).toBeTruthy();
    }
  });

  it("should have valid inline product links with correct store tag", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    
    const data = affiliateProductsBySlug["ultimate-cozy-reading-night-setup"];
    const storeTag = "88away0d-20";
    
    // Check inline products
    for (const [name, link] of Object.entries(data.inlineProducts)) {
      expect(name).toBeTruthy();
      expect(link.url).toContain("amazon.com");
      expect(link.url).toContain(`tag=${storeTag}`);
      expect(link.rel).toContain("nofollow");
    }
  });

  it("should have 8 inline products matching the blog article", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    
    const data = affiliateProductsBySlug["ultimate-cozy-reading-night-setup"];
    const inlineProducts = Object.keys(data.inlineProducts);
    
    expect(inlineProducts.length).toBe(8);
    
    // Verify key products are present
    expect(inlineProducts).toContain("Husband Pillow Original Shredded Memory Foam");
    expect(inlineProducts).toContain("Glocusent LED Book Light");
    expect(inlineProducts).toContain("Classical Library Candle");
    expect(inlineProducts).toContain("HAPPYPOP Book Lover Fuzzy Socks");
    expect(inlineProducts).toContain("Book Lover Wine Glass");
  });

  it("should have top picks with ratings between 1 and 5", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    
    const data = affiliateProductsBySlug["ultimate-cozy-reading-night-setup"];
    
    for (const product of data.topPicks) {
      if (product.rating) {
        expect(product.rating).toBeGreaterThanOrEqual(1);
        expect(product.rating).toBeLessThanOrEqual(5);
      }
    }
  });

  it("should have the Kindle Paperwhite as the first top pick (highest value)", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    
    const data = affiliateProductsBySlug["ultimate-cozy-reading-night-setup"];
    
    expect(data.topPicks[0].name).toContain("Kindle Paperwhite");
    expect(data.topPicks[0].priceRange).toContain("150");
  });

  it("should return undefined for non-existent blog slugs", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    
    expect(affiliateProductsBySlug["non-existent-slug"]).toBeUndefined();
  });

  it("should have all affiliate URLs using HTTPS protocol", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    
    const data = affiliateProductsBySlug["ultimate-cozy-reading-night-setup"];
    
    for (const product of data.topPicks) {
      expect(product.affiliateUrl).toMatch(/^https:\/\//);
    }
    
    for (const link of Object.values(data.inlineProducts)) {
      expect(link.url).toMatch(/^https:\/\//);
    }
  });
});
