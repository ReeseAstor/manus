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
    const storeTag = "reeseastor-20";

    for (const product of data.topPicks) {
      expect(product.affiliateUrl).toContain("amazon.com");
      expect(product.affiliateUrl).toContain(`tag=${storeTag}`);
      expect(product.name).toBeTruthy();
      expect(product.description).toBeTruthy();
      expect(product.whyRecommend).toBeTruthy();
      expect(product).not.toHaveProperty("priceRange");
      expect(product).not.toHaveProperty("rating");
    }
  });

  it("should have valid inline product links with correct store tag", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");

    const data = affiliateProductsBySlug["ultimate-cozy-reading-night-setup"];
    const storeTag = "reeseastor-20";

    for (const [name, link] of Object.entries(data.inlineProducts)) {
      expect(name).toBeTruthy();
      expect(link.url).toContain("amazon.com");
      expect(link.url).toContain(`tag=${storeTag}`);
      expect(link.rel).toContain("nofollow");
    }
  });

  it("should have 7 inline products matching the blog article", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");

    const data = affiliateProductsBySlug["ultimate-cozy-reading-night-setup"];
    const inlineProducts = Object.keys(data.inlineProducts);

    expect(inlineProducts.length).toBe(7);

    expect(inlineProducts).toContain("Husband Pillow Medium Reading Pillow with Arms, Purple");
    expect(inlineProducts).toContain("Glocusent Neck Reading Light");
    expect(inlineProducts).toContain("Classical Library Candle");
    expect(inlineProducts).toContain("C M Books & Wine Stemless Wine Glass, 17 oz");
  });

  it("does not attach static Amazon prices or star ratings to catalog products", async () => {
    const { approvedAffiliateProducts } = await import("../client/src/data/affiliateProducts");

    for (const product of approvedAffiliateProducts) {
      expect(product).not.toHaveProperty("priceRange");
      expect(product).not.toHaveProperty("rating");
    }
  });

  it("should have the Kindle Paperwhite as the first top pick (highest value)", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");

    const data = affiliateProductsBySlug["ultimate-cozy-reading-night-setup"];

    expect(data.topPicks[0].name).toBe("Kindle Paperwhite 16GB (2024 model)");
    expect(data.topPicks[0].name).not.toMatch(/Latest Model/i);
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
