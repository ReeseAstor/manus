import { describe, it, expect } from "vitest";

// Test affiliate product data integrity
describe("Affiliate Products Data", () => {
  it("should have valid product data for cozy reading article", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    const cozy = affiliateProductsBySlug["ultimate-cozy-reading-night-setup"];
    expect(cozy).toBeDefined();
    expect(cozy.ftcDisclosure).toBe(true);
    expect(cozy.topPicks.length).toBe(3);
    cozy.topPicks.forEach((p) => {
      expect(p.name).toBeTruthy();
      expect(p.affiliateUrl).toContain("tag=reeseastor-20");
      expect(p.affiliateUrl).toContain("amazon.com");
      expect(p.description).toBeTruthy();
      expect(p.whyRecommend).toBeTruthy();
      expect(p.priceRange).toBeTruthy();
      expect(p.rating).toBeGreaterThan(0);
      expect(p.rating).toBeLessThanOrEqual(5);
    });
  });

  it("should have valid product data for gift guide article", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    const gift = affiliateProductsBySlug["romance-reader-gift-guide"];
    expect(gift).toBeDefined();
    expect(gift.ftcDisclosure).toBe(true);
    expect(gift.topPicks.length).toBe(3);
    gift.topPicks.forEach((p) => {
      expect(p.affiliateUrl).toContain("tag=reeseastor-20");
    });
  });

  it("should have nofollow on all inline product links", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    Object.values(affiliateProductsBySlug).forEach((article) => {
      Object.values(article.inlineProducts).forEach((link) => {
        expect(link.rel).toContain("nofollow");
        expect(link.url).toContain("tag=reeseastor-20");
      });
    });
  });

  it("should not have duplicate product names within an article", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    Object.entries(affiliateProductsBySlug).forEach(([slug, article]) => {
      const names = article.topPicks.map((p) => p.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });
});

// Test favorites products data
describe("Favorites Products Data", () => {
  it("should have 4 product categories", async () => {
    const { favoritesCategories } = await import("../client/src/data/favoritesProducts");
    expect(favoritesCategories.length).toBe(4);
  });

  it("should have at least 2 products per category (2-column grid)", async () => {
    // 2026-10-30: 3 cards whose Amazon products were gone (404) were removed rather than re-pointed,
    // because their copy described those exact products. Categories may hold 2-4 cards.
    const { favoritesCategories } = await import("../client/src/data/favoritesProducts");
    favoritesCategories.forEach((cat) => {
      expect(cat.products.length).toBeGreaterThanOrEqual(2);
      expect(cat.products.length).toBeLessThanOrEqual(4);
    });
  });

  it("should have valid affiliate URLs with correct store ID on all products", async () => {
    const { allFavoritesProducts, favoritesCategories } = await import("../client/src/data/favoritesProducts");
    expect(allFavoritesProducts.length).toBe(13);
    expect(allFavoritesProducts.length).toBe(favoritesCategories.reduce((n, c) => n + c.products.length, 0));
    allFavoritesProducts.forEach((p) => {
      expect(p.affiliateUrl).toContain("tag=reeseastor-20");
      expect(p.affiliateUrl).toContain("amazon.com");
    });
  });

  it("should have valid category metadata", async () => {
    const { favoritesCategories } = await import("../client/src/data/favoritesProducts");
    favoritesCategories.forEach((cat) => {
      expect(cat.id).toBeTruthy();
      expect(cat.title).toBeTruthy();
      expect(cat.subtitle).toBeTruthy();
      // QA v5 C1: category labels carry no emoji.
      expect("emoji" in cat).toBe(false);
      expect(`${cat.title} ${cat.subtitle}`).not.toMatch(/\p{Extended_Pictographic}|\uFE0F/u);
    });
  });

  it("should have expected category IDs", async () => {
    const { favoritesCategories } = await import("../client/src/data/favoritesProducts");
    const ids = favoritesCategories.map((c) => c.id);
    expect(ids).toContain("reading-essentials");
    expect(ids).toContain("cozy-atmosphere");
    expect(ids).toContain("book-lover-gifts");
    expect(ids).toContain("writers-desk");
  });

  it("should have ratings between 0 and 5 for all products", async () => {
    const { allFavoritesProducts } = await import("../client/src/data/favoritesProducts");
    allFavoritesProducts.forEach((p) => {
      if (p.rating) {
        expect(p.rating).toBeGreaterThan(0);
        expect(p.rating).toBeLessThanOrEqual(5);
      }
    });
  });

  it("should have price ranges for all products", async () => {
    const { allFavoritesProducts } = await import("../client/src/data/favoritesProducts");
    allFavoritesProducts.forEach((p) => {
      expect(p.priceRange).toBeTruthy();
      expect(p.priceRange).toMatch(/\$/);
    });
  });

  it("should have personal recommendations (whyRecommend) for all products", async () => {
    const { allFavoritesProducts } = await import("../client/src/data/favoritesProducts");
    allFavoritesProducts.forEach((p) => {
      expect(p.whyRecommend).toBeTruthy();
      expect(p.whyRecommend.length).toBeGreaterThan(20);
    });
  });
});

// Test affiliate tracking router structure
describe("Affiliate Tracking Router", () => {
  it("should export affiliateTrackingRouter", async () => {
    const { affiliateTrackingRouter } = await import("./routers/affiliateTracking");
    expect(affiliateTrackingRouter).toBeDefined();
  });

  it("should have trackClick procedure", async () => {
    const { affiliateTrackingRouter } = await import("./routers/affiliateTracking");
    const procedures = Object.keys(affiliateTrackingRouter._def.procedures);
    expect(procedures).toContain("trackClick");
  });

  it("should have getAnalytics procedure", async () => {
    const { affiliateTrackingRouter } = await import("./routers/affiliateTracking");
    const procedures = Object.keys(affiliateTrackingRouter._def.procedures);
    expect(procedures).toContain("getAnalytics");
  });

  it("should have getRecentClicks procedure", async () => {
    const { affiliateTrackingRouter } = await import("./routers/affiliateTracking");
    const procedures = Object.keys(affiliateTrackingRouter._def.procedures);
    expect(procedures).toContain("getRecentClicks");
  });
});

// Test session hash generation
describe("Click Tracking Utilities", () => {
  it("should generate consistent session hashes for same IP + user agent", () => {
    const crypto = require("crypto");
    const ip = "192.168.1.1";
    const ua = "Mozilla/5.0";
    const hash1 = crypto.createHash("sha256").update(`${ip}:${ua}`).digest("hex").slice(0, 16);
    const hash2 = crypto.createHash("sha256").update(`${ip}:${ua}`).digest("hex").slice(0, 16);
    expect(hash1).toBe(hash2);
  });

  it("should generate different hashes for different IPs", () => {
    const crypto = require("crypto");
    const ua = "Mozilla/5.0";
    const hash1 = crypto.createHash("sha256").update(`192.168.1.1:${ua}`).digest("hex").slice(0, 16);
    const hash2 = crypto.createHash("sha256").update(`192.168.1.2:${ua}`).digest("hex").slice(0, 16);
    expect(hash1).not.toBe(hash2);
  });
});

// Test FTC compliance
describe("FTC Compliance", () => {
  it("should have FTC disclosure enabled for all articles with affiliate products", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    Object.entries(affiliateProductsBySlug).forEach(([slug, article]) => {
      expect(article.ftcDisclosure).toBe(true);
    });
  });

  it("should use nofollow rel attribute on all affiliate links", async () => {
    const { affiliateProductsBySlug } = await import("../client/src/data/affiliateProducts");
    Object.values(affiliateProductsBySlug).forEach((article) => {
      Object.values(article.inlineProducts).forEach((link) => {
        expect(link.rel).toContain("nofollow");
        expect(link.rel).toContain("noopener");
      });
    });
  });
});

// Test Amazon ASIN extraction
describe("Amazon Product Link Validation", () => {
  it("should have valid Amazon product URLs with dp/ format", async () => {
    const { allFavoritesProducts } = await import("../client/src/data/favoritesProducts");
    allFavoritesProducts.forEach((p) => {
      // Should be amazon.com/dp/ASIN format
      expect(p.affiliateUrl).toMatch(/amazon\.com\/dp\/[A-Z0-9]{10}/);
    });
  });

  it("should have unique ASINs across all favorites products", async () => {
    const { allFavoritesProducts } = await import("../client/src/data/favoritesProducts");
    const asins = allFavoritesProducts.map((p) => {
      const match = p.affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/);
      return match ? match[1] : null;
    }).filter(Boolean);
    const uniqueAsins = new Set(asins);
    expect(uniqueAsins.size).toBe(asins.length);
  });
});
