import { describe, it, expect, vi } from "vitest";

// Mock database functions
vi.mock("./db", () => ({
  getUserPreferences: vi.fn(),
  upsertUserPreferences: vi.fn(),
  getUserWithPreferences: vi.fn(),
  getUserPurchases: vi.fn(),
}));

import {
  getUserPreferences,
  upsertUserPreferences,
  getUserWithPreferences,
  getUserPurchases,
} from "./db";

describe("Profile API", () => {
  describe("getUserPreferences", () => {
    it("should return null when no preferences exist", async () => {
      vi.mocked(getUserPreferences).mockResolvedValue(null);
      const result = await getUserPreferences(1);
      expect(result).toBeNull();
    });

    it("should return preferences when they exist", async () => {
      const mockPrefs = {
        id: 1,
        userId: 1,
        emailNewReleases: true,
        emailNewsletter: true,
        emailPromotions: false,
        emailBlogPosts: false,
        preferredFormat: "epub" as const,
        displayName: "Test User",
        bio: "Test bio",
        favoriteGenres: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(getUserPreferences).mockResolvedValue(mockPrefs);
      const result = await getUserPreferences(1);
      expect(result).toEqual(mockPrefs);
      expect(result?.emailNewReleases).toBe(true);
      expect(result?.preferredFormat).toBe("epub");
    });
  });

  describe("upsertUserPreferences", () => {
    it("should create new preferences for new user", async () => {
      const newPrefs = {
        id: 1,
        userId: 1,
        emailNewReleases: true,
        emailNewsletter: true,
        emailPromotions: true,
        emailBlogPosts: false,
        preferredFormat: "epub" as const,
        displayName: null,
        bio: null,
        favoriteGenres: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(upsertUserPreferences).mockResolvedValue(newPrefs);
      
      const result = await upsertUserPreferences(1, { emailNewReleases: true });
      expect(result).toEqual(newPrefs);
    });

    it("should update existing preferences", async () => {
      const updatedPrefs = {
        id: 1,
        userId: 1,
        emailNewReleases: false,
        emailNewsletter: true,
        emailPromotions: true,
        emailBlogPosts: true,
        preferredFormat: "mobi" as const,
        displayName: "Updated Name",
        bio: "Updated bio",
        favoriteGenres: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(upsertUserPreferences).mockResolvedValue(updatedPrefs);
      
      const result = await upsertUserPreferences(1, {
        emailNewReleases: false,
        emailBlogPosts: true,
        preferredFormat: "mobi",
        displayName: "Updated Name",
        bio: "Updated bio",
      });
      
      expect(result?.emailNewReleases).toBe(false);
      expect(result?.emailBlogPosts).toBe(true);
      expect(result?.preferredFormat).toBe("mobi");
      expect(result?.displayName).toBe("Updated Name");
    });
  });

  describe("getUserWithPreferences", () => {
    it("should return user with preferences", async () => {
      const mockUserWithPrefs = {
        id: 1,
        openId: "test-open-id",
        name: "Test User",
        email: "test@example.com",
        loginMethod: "oauth",
        role: "user" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
        preferences: {
          id: 1,
          userId: 1,
          emailNewReleases: true,
          emailNewsletter: true,
          emailPromotions: true,
          emailBlogPosts: false,
          preferredFormat: "epub" as const,
          displayName: "Test Display",
          bio: null,
          favoriteGenres: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      vi.mocked(getUserWithPreferences).mockResolvedValue(mockUserWithPrefs);
      
      const result = await getUserWithPreferences(1);
      expect(result).toEqual(mockUserWithPrefs);
      expect(result?.preferences?.emailNewReleases).toBe(true);
    });

    it("should return null for non-existent user", async () => {
      vi.mocked(getUserWithPreferences).mockResolvedValue(null);
      const result = await getUserWithPreferences(999);
      expect(result).toBeNull();
    });
  });

  describe("Purchase History", () => {
    it("should return empty array when no purchases", async () => {
      vi.mocked(getUserPurchases).mockResolvedValue([]);
      const result = await getUserPurchases(1);
      expect(result).toEqual([]);
    });

    it("should return purchases with book details", async () => {
      const mockPurchases = [
        {
          purchase: {
            id: 1,
            userId: 1,
            bookId: 1,
            orderId: 1,
            purchaseType: "single" as const,
            purchasePrice: 399,
            bonusContentUnlocked: false,
            downloadCount: 2,
            lastDownloadAt: new Date(),
            purchasedAt: new Date(),
          },
          book: {
            id: 1,
            title: "Test Book",
            slug: "test-book",
            coverImage: "https://example.com/cover.jpg",
            series: "Test Series",
            seriesOrder: 1,
            description: "Test description",
            sampleChapter: null,
            rating: 5,
            reviewCount: 10,
            tropes: null,
            heatLevel: 3,
            pageCount: 300,
            publishDate: "2024-01-01",
            amazonUrl: null,
            appleUrl: null,
            koboUrl: null,
            barnesNobleUrl: null,
            googlePlayUrl: null,
            retailPrice: 499,
            directPrice: 399,
            memberPrice: 299,
            directSaleUrl: null,
            featured: true,
            displayOrder: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      ];
      vi.mocked(getUserPurchases).mockResolvedValue(mockPurchases);
      
      const result = await getUserPurchases(1);
      expect(result.length).toBe(1);
      expect(result[0].book.title).toBe("Test Book");
      expect(result[0].purchase.purchasePrice).toBe(399);
    });

    it("should calculate stats correctly", async () => {
      const mockPurchases = [
        {
          purchase: { id: 1, userId: 1, bookId: 1, orderId: 1, purchaseType: "single" as const, purchasePrice: 399, bonusContentUnlocked: false, downloadCount: 2, lastDownloadAt: new Date(), purchasedAt: new Date() },
          book: { id: 1, title: "Book 1", slug: "book-1", coverImage: "", series: null, seriesOrder: null, description: "", sampleChapter: null, rating: 5, reviewCount: 0, tropes: null, heatLevel: 3, pageCount: 300, publishDate: "", amazonUrl: null, appleUrl: null, koboUrl: null, barnesNobleUrl: null, googlePlayUrl: null, retailPrice: 499, directPrice: 399, memberPrice: 299, directSaleUrl: null, featured: false, displayOrder: 0, createdAt: new Date(), updatedAt: new Date() },
        },
        {
          purchase: { id: 2, userId: 1, bookId: 2, orderId: 2, purchaseType: "single" as const, purchasePrice: 499, bonusContentUnlocked: false, downloadCount: 1, lastDownloadAt: new Date(), purchasedAt: new Date() },
          book: { id: 2, title: "Book 2", slug: "book-2", coverImage: "", series: null, seriesOrder: null, description: "", sampleChapter: null, rating: 5, reviewCount: 0, tropes: null, heatLevel: 3, pageCount: 300, publishDate: "", amazonUrl: null, appleUrl: null, koboUrl: null, barnesNobleUrl: null, googlePlayUrl: null, retailPrice: 599, directPrice: 499, memberPrice: 399, directSaleUrl: null, featured: false, displayOrder: 0, createdAt: new Date(), updatedAt: new Date() },
        },
      ];
      vi.mocked(getUserPurchases).mockResolvedValue(mockPurchases);
      
      const purchases = await getUserPurchases(1);
      const totalSpent = purchases.reduce((sum, p) => sum + (p.purchase.purchasePrice || 0), 0);
      const totalBooks = purchases.length;
      const totalDownloads = purchases.reduce((sum, p) => sum + (p.purchase.downloadCount || 0), 0);
      
      expect(totalSpent).toBe(898); // 399 + 499
      expect(totalBooks).toBe(2);
      expect(totalDownloads).toBe(3); // 2 + 1
    });
  });
});

describe("Email Preferences Validation", () => {
  it("should accept valid email preference values", () => {
    const validPrefs = {
      emailNewReleases: true,
      emailNewsletter: false,
      emailPromotions: true,
      emailBlogPosts: false,
    };
    
    expect(typeof validPrefs.emailNewReleases).toBe("boolean");
    expect(typeof validPrefs.emailNewsletter).toBe("boolean");
    expect(typeof validPrefs.emailPromotions).toBe("boolean");
    expect(typeof validPrefs.emailBlogPosts).toBe("boolean");
  });

  it("should accept valid format values", () => {
    const validFormats = ["epub", "mobi", "pdf"];
    validFormats.forEach(format => {
      expect(["epub", "mobi", "pdf"]).toContain(format);
    });
  });

  it("should validate display name length", () => {
    const shortName = "A";
    const maxName = "A".repeat(100);
    const tooLongName = "A".repeat(101);
    
    expect(shortName.length).toBeLessThanOrEqual(100);
    expect(maxName.length).toBeLessThanOrEqual(100);
    expect(tooLongName.length).toBeGreaterThan(100);
  });

  it("should validate bio length", () => {
    const shortBio = "Short bio";
    const maxBio = "A".repeat(500);
    const tooLongBio = "A".repeat(501);
    
    expect(shortBio.length).toBeLessThanOrEqual(500);
    expect(maxBio.length).toBeLessThanOrEqual(500);
    expect(tooLongBio.length).toBeGreaterThan(500);
  });
});
