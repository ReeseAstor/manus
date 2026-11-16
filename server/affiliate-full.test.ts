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

  it("should list the remaining favorites after the dead socks listing is removed", async () => {
    const { favoritesCategories, allFavoritesProducts } = await import("../client/src/data/favoritesProducts");
    const counts = Object.fromEntries(favoritesCategories.map(cat => [cat.id, cat.products.length]));
    expect(counts).toEqual({
      "reading-essentials": 4,
      "cozy-atmosphere": 3,
      "book-lover-gifts": 4,
      "writers-desk": 4,
    });
    expect(allFavoritesProducts.length).toBe(15);
    expect(allFavoritesProducts.some(product => product.affiliateUrl.includes("B0F1THN236"))).toBe(false);
  });

  it("should have valid affiliate URLs with correct store ID on all products", async () => {
    const { allFavoritesProducts } = await import("../client/src/data/favoritesProducts");
    expect(allFavoritesProducts.length).toBe(15);
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
      expect(cat.emoji).toBeTruthy();
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

  it("does not state static Amazon prices or star ratings on /favorites", async () => {
    const { allFavoritesProducts } = await import("../client/src/data/favoritesProducts");
    allFavoritesProducts.forEach((p) => {
      expect(p).not.toHaveProperty("priceRange");
      expect(p).not.toHaveProperty("rating");
      expect(JSON.stringify(p)).not.toMatch(/\$/);
      expect(JSON.stringify(p)).not.toMatch(/[\u2014\u2013]/);
    });
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const data = readFileSync(join(process.cwd(), "client/src/data/favoritesProducts.ts"), "utf8");
    const page = readFileSync(join(process.cwd(), "client/src/pages/Favorites.tsx"), "utf8");
    expect(data).not.toMatch(/priceRange/);
    expect(data).not.toMatch(/\brating\s*:/);
    expect(data).not.toMatch(/Around \$/);
    expect(data).not.toMatch(/\$[0-9]/);
    expect(data).not.toMatch(/[\u2014\u2013]/);
    expect(page).not.toMatch(/product\.priceRange/);
    expect(page).not.toMatch(/product\.rating/);
    expect(page).not.toMatch(/Around \$/);
    expect(page).not.toMatch(/[\u2014\u2013]/);
    expect(page).toContain("See Amazon for the current price and rating");
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
      const hasAffiliateProducts =
        article.topPicks.length > 0 || Object.keys(article.inlineProducts).length > 0;
      if (slug === "best-billionaire-romance-series-2024") {
        expect(hasAffiliateProducts).toBe(false);
        expect(article.ftcDisclosure).toBe(false);
        return;
      }
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

  it("replaces the 404 and unavailable listings with verified ASINs", async () => {
    const { allFavoritesProducts } = await import("../client/src/data/favoritesProducts");
    const asins = allFavoritesProducts.map((p) => {
      const match = p.affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/);
      return match ? match[1] : null;
    });
    expect(asins).not.toContain("B08B4GHZ5L");
    expect(asins).not.toContain("B0BN9QGKQG");
    expect(asins).not.toContain("B0D9FQGQCR");
    expect(asins).not.toContain("B0CMTXKBWW");
    expect(asins).not.toContain("B0CW63NL9F");
    expect(asins).not.toContain("B0DD4FWCJW");
    expect(asins).toContain("B0C6MD8YBR");
    expect(asins).toContain("B078SDB5WY");
    expect(asins).toContain("B07PGW7C8R");
    expect(asins).toContain("B0DXPL9RL2");
    expect(asins).toContain("B0FXWF75B4");
    expect(asins).toContain("B0DTYGQYGQ");
  });

  it("matches the live Moleskine, Bose, Pilot, pillow, and candle attributes", async () => {
    const { allFavoritesProducts } = await import("../client/src/data/favoritesProducts");
    const byAsin = Object.fromEntries(
      allFavoritesProducts.map((p) => {
        const match = p.affiliateUrl.match(/\/dp\/([A-Z0-9]{10})/);
        return [match?.[1], p];
      }),
    );
    const moleskine = byAsin.B015NG45Q0;
    const bose = byAsin.B0CCZ26B5V;
    const pilot = byAsin.B00006JNJ8;
    const pillow = byAsin.B0BMPFB4TT;
    const candle = byAsin.B0F1FY6XT7;
    const kindle = byAsin.B0CFPJYX7P;
    const light = byAsin.B07WNRN9WQ;
    const aimuan = byAsin.B09V518DRK;
    expect(moleskine?.name).toBe("Moleskine Classic Notebook, Large, Plain, Sapphire Blue, Hard Cover");
    expect(moleskine?.description).toMatch(/plain pages/i);
    expect(moleskine?.description).not.toMatch(/ruled/i);
    expect(bose?.name).toBe("Bose QuietComfort Headphones");
    expect(bose?.name).not.toMatch(/ultra/i);
    expect(bose?.description).not.toMatch(/\bultra\b|immersive|spatial audio/i);
    expect(pilot?.name).toContain("0.5mm Extra Fine");
    expect(pilot?.name).not.toMatch(/0\.7/);
    expect(pilot?.description).toMatch(/0\.5 mm/);
    expect(pillow?.name).toBe("Husband Pillow Medium Reading Pillow with Arms, Purple");
    expect(pillow?.name).not.toMatch(/Original Shredded/i);
    expect(pillow?.description).not.toMatch(/shredded/i);
    expect(candle?.description).toMatch(/bergamot rose/);
    expect(candle?.description).toMatch(/cedarwood/);
    expect(candle?.description).not.toMatch(/mahogany|old paper/i);
    expect(kindle?.name).toContain("2024 model");
    expect(kindle?.name).not.toMatch(/Latest Model/i);
    expect(kindle?.description).not.toMatch(/fastest Kindle/i);
    expect(light?.name).toMatch(/Neck Reading Light/);
    expect(light?.description).not.toMatch(/clip-on/i);
    expect(aimuan?.name).toContain("Ivory");
    expect(aimuan?.description).not.toMatch(/detachable neck roll|side pockets/i);
  });
});
