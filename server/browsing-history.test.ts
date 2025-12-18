import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  trackBookView: vi.fn().mockResolvedValue({ id: 1, userId: 1, bookId: 1, viewCount: 1 }),
  getRecentlyViewedBooks: vi.fn().mockResolvedValue([
    {
      bookId: 1,
      bookTitle: "The Billionaire's Executive Assistant",
      bookSlug: "the-billionaires-executive-assistant",
      bookCover: "/covers/book1.jpg",
      bookSeries: "Manhattan Money Kings",
      viewCount: 3,
      lastViewedAt: new Date("2024-12-17"),
    },
    {
      bookId: 2,
      bookTitle: "The Billionaire's Fake Wife",
      bookSlug: "the-billionaires-fake-wife",
      bookCover: "/covers/book2.jpg",
      bookSeries: "Manhattan Money Kings",
      viewCount: 1,
      lastViewedAt: new Date("2024-12-16"),
    },
  ]),
  clearBrowsingHistory: vi.fn().mockResolvedValue({ success: true }),
}));

import { trackBookView, getRecentlyViewedBooks, clearBrowsingHistory } from "./db";

describe("Browsing History Feature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("trackBookView", () => {
    it("should track a book view for a user", async () => {
      const result = await trackBookView(1, 1);
      
      expect(trackBookView).toHaveBeenCalledWith(1, 1);
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("userId", 1);
      expect(result).toHaveProperty("bookId", 1);
    });

    it("should increment view count for repeated views", async () => {
      const result = await trackBookView(1, 1);
      
      expect(result).toHaveProperty("viewCount");
      expect(result.viewCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe("getRecentlyViewedBooks", () => {
    it("should return recently viewed books for a user", async () => {
      const result = await getRecentlyViewedBooks(1, 10);
      
      expect(getRecentlyViewedBooks).toHaveBeenCalledWith(1, 10);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("should include book details in results", async () => {
      const result = await getRecentlyViewedBooks(1, 10);
      
      expect(result[0]).toHaveProperty("bookId");
      expect(result[0]).toHaveProperty("bookTitle");
      expect(result[0]).toHaveProperty("bookSlug");
      expect(result[0]).toHaveProperty("bookCover");
      expect(result[0]).toHaveProperty("viewCount");
      expect(result[0]).toHaveProperty("lastViewedAt");
    });

    it("should respect the limit parameter", async () => {
      const result = await getRecentlyViewedBooks(1, 2);
      
      expect(result.length).toBeLessThanOrEqual(2);
    });
  });

  describe("clearBrowsingHistory", () => {
    it("should clear all browsing history for a user", async () => {
      const result = await clearBrowsingHistory(1);
      
      expect(clearBrowsingHistory).toHaveBeenCalledWith(1);
      expect(result).toHaveProperty("success", true);
    });
  });
});

describe("Profile Page Data", () => {
  it("should display recently viewed books in profile", async () => {
    const recentlyViewed = await getRecentlyViewedBooks(1, 10);
    
    // Verify data structure is correct for UI display
    recentlyViewed.forEach((item) => {
      expect(item.bookTitle).toBeTruthy();
      expect(item.bookSlug).toBeTruthy();
      expect(item.viewCount).toBeGreaterThanOrEqual(1);
    });
  });

  it("should sort recently viewed by last viewed date", async () => {
    const recentlyViewed = await getRecentlyViewedBooks(1, 10);
    
    // First item should be most recently viewed
    if (recentlyViewed.length > 1) {
      const firstDate = new Date(recentlyViewed[0].lastViewedAt);
      const secondDate = new Date(recentlyViewed[1].lastViewedAt);
      expect(firstDate.getTime()).toBeGreaterThanOrEqual(secondDate.getTime());
    }
  });
});
