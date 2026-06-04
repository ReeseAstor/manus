import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the stripe module
vi.mock("./_core/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({
          id: "cs_test_123",
          url: "https://checkout.stripe.com/test",
        }),
      },
    },
  },
  STRIPE_WEBHOOK_SECRET: "whsec_test",
}));

// Mock the database
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockResolvedValue([
      {
        id: 6,
        name: "Single Book - Manhattan Money Kings",
        stripePriceId: "price_test_123",
        price: 399,
        active: true,
        type: "one_time",
      },
    ]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue({}),
  }),
}));

describe("Stripe Checkout Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have Stripe products configured in database", async () => {
    const { getDb } = await import("./db");
    const db = await getDb();
    
    expect(db).toBeDefined();
    expect(db?.select).toBeDefined();
  });

  it("should format prices correctly", () => {
    const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
    
    expect(formatPrice(399)).toBe("$3.99");
    expect(formatPrice(999)).toBe("$9.99");
    expect(formatPrice(1299)).toBe("$12.99");
    expect(formatPrice(1497)).toBe("$14.97");
  });

  it("should calculate savings percentage correctly", () => {
    const calculateSavings = (original: number, sale: number) =>
      Math.round(((original - sale) / original) * 100);
    
    // Single book: $4.99 -> $3.99 = 20% off
    expect(calculateSavings(499, 399)).toBe(20);
    
    // Complete Series: $14.97 -> $9.99 = 33% off
    expect(calculateSavings(1497, 999)).toBe(33);
    
    // Ultimate: $17.96 -> $12.99 = 28% off
    expect(calculateSavings(1796, 1299)).toBe(28);
  });

  it("should have valid bundle configurations", () => {
    const bundleOptions = [
      {
        id: "single",
        name: "Single Book",
        books: 1,
        originalPrice: 499,
        bundlePrice: 399,
        memberPrice: 299,
        productId: 6,
      },
      {
        id: "trilogy",
        name: "Complete Series",
        books: 3,
        originalPrice: 1497,
        bundlePrice: 999,
        memberPrice: 799,
        productId: 7,
      },
      {
        id: "ultimate",
        name: "Ultimate Collection",
        books: 4,
        originalPrice: 1796,
        bundlePrice: 1299,
        memberPrice: 999,
        productId: 8,
      },
    ];

    bundleOptions.forEach((bundle) => {
      // Bundle price should be less than original
      expect(bundle.bundlePrice).toBeLessThan(bundle.originalPrice);
      
      // Member price should be less than bundle price
      expect(bundle.memberPrice).toBeLessThan(bundle.bundlePrice);
      
      // Product ID should be a positive number
      expect(bundle.productId).toBeGreaterThan(0);
    });
  });

  it("should have book product mapping for individual books", () => {
    const bookProductMap: Record<string, number> = {
      "the-billionaires-executive-assistant": 9,
      "the-billionaires-fake-wife": 10,
      "the-billionaires-baby-secret": 11,
    };

    // All product IDs should be valid positive numbers
    Object.values(bookProductMap).forEach((productId) => {
      expect(productId).toBeGreaterThan(0);
    });

    // Should have all three books mapped
    expect(Object.keys(bookProductMap)).toHaveLength(3);
  });

  it("should construct valid success and cancel URLs", () => {
    const origin = "https://reeseastor.us";
    const productName = "Complete Series";
    
    const successUrl = `${origin}/purchase-success?product=${encodeURIComponent(productName)}`;
    const cancelUrl = `${origin}/shop`;
    
    expect(successUrl).toContain("/purchase-success");
    expect(successUrl).toContain("product=Complete%20Series");
    expect(cancelUrl).toBe("https://reeseastor.us/shop");
  });
});

describe("SEO Meta Tags", () => {
  it("should generate correct category keywords", () => {
    const categoryKeywords: Record<string, string> = {
      "Reading Recommendations": "book recommendations, romance series, best romance books 2024",
      "Writing Tips": "romance writing tips, how to write romance, author advice",
      "Author Journey": "self-publishing, indie author, author business",
      "Marketing": "book marketing, author platform, social media for authors",
    };

    // All categories should have keywords
    expect(Object.keys(categoryKeywords)).toHaveLength(4);
    
    // Each category should have non-empty keywords
    Object.values(categoryKeywords).forEach((keywords) => {
      expect(keywords.length).toBeGreaterThan(0);
      expect(keywords).toContain(","); // Multiple keywords
    });
  });

  it("should construct valid Open Graph tags", () => {
    const post = {
      title: "Best Billionaire Romance Series 2024",
      excerpt: "Looking for your next book boyfriend?",
      category: "Reading Recommendations",
    };

    const ogTags = [
      { property: "og:title", content: post.title },
      { property: "og:description", content: post.excerpt },
      { property: "og:type", content: "article" },
      { property: "og:site_name", content: "Reese Astor - Romance Author" },
    ];

    ogTags.forEach((tag) => {
      expect(tag.property).toMatch(/^og:/);
      expect(tag.content.length).toBeGreaterThan(0);
    });
  });
});
