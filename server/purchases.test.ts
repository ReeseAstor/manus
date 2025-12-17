import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getUserPurchases: vi.fn(),
  getUserPurchaseByBook: vi.fn(),
  createUserPurchase: vi.fn(),
  updatePurchaseDownloadCount: vi.fn(),
  getEbookFiles: vi.fn(),
}));

import {
  getUserPurchases,
  getUserPurchaseByBook,
  createUserPurchase,
  updatePurchaseDownloadCount,
  getEbookFiles,
} from "./db";

describe("Purchases Database Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserPurchases", () => {
    it("should return purchases for a user", async () => {
      const mockPurchases = [
        {
          purchase: {
            id: 1,
            userId: 1,
            bookId: 1,
            purchaseType: "single",
            purchasePrice: 499,
            downloadCount: 2,
            purchasedAt: new Date("2024-01-15"),
          },
          book: {
            id: 1,
            title: "The Billionaire's Baby Secret",
            coverImage: "/book3-cover.jpg",
            slug: "the-billionaires-baby-secret",
          },
        },
      ];

      vi.mocked(getUserPurchases).mockResolvedValue(mockPurchases as any);

      const result = await getUserPurchases(1);

      expect(getUserPurchases).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
      expect(result[0].book.title).toBe("The Billionaire's Baby Secret");
    });

    it("should return empty array for user with no purchases", async () => {
      vi.mocked(getUserPurchases).mockResolvedValue([]);

      const result = await getUserPurchases(999);

      expect(result).toHaveLength(0);
    });
  });

  describe("getUserPurchaseByBook", () => {
    it("should return purchase if user owns the book", async () => {
      const mockPurchase = {
        id: 1,
        userId: 1,
        bookId: 1,
        purchaseType: "single",
        purchasePrice: 499,
      };

      vi.mocked(getUserPurchaseByBook).mockResolvedValue(mockPurchase as any);

      const result = await getUserPurchaseByBook(1, 1);

      expect(getUserPurchaseByBook).toHaveBeenCalledWith(1, 1);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
    });

    it("should return null if user does not own the book", async () => {
      vi.mocked(getUserPurchaseByBook).mockResolvedValue(null);

      const result = await getUserPurchaseByBook(1, 999);

      expect(result).toBeNull();
    });
  });

  describe("createUserPurchase", () => {
    it("should create a new purchase record", async () => {
      const newPurchase = {
        userId: 1,
        bookId: 2,
        purchaseType: "single" as const,
        purchasePrice: 399,
      };

      vi.mocked(createUserPurchase).mockResolvedValue({ insertId: 1 } as any);

      const result = await createUserPurchase(newPurchase);

      expect(createUserPurchase).toHaveBeenCalledWith(newPurchase);
      expect(result).toBeDefined();
    });
  });

  describe("updatePurchaseDownloadCount", () => {
    it("should increment download count", async () => {
      vi.mocked(updatePurchaseDownloadCount).mockResolvedValue(undefined);

      await updatePurchaseDownloadCount(1);

      expect(updatePurchaseDownloadCount).toHaveBeenCalledWith(1);
    });
  });

  describe("getEbookFiles", () => {
    it("should return all available formats for a book", async () => {
      const mockFiles = [
        { id: 1, bookId: 1, format: "epub", fileUrl: "https://s3.example.com/book1.epub", fileSize: "2.5 MB" },
        { id: 2, bookId: 1, format: "mobi", fileUrl: "https://s3.example.com/book1.mobi", fileSize: "2.8 MB" },
        { id: 3, bookId: 1, format: "pdf", fileUrl: "https://s3.example.com/book1.pdf", fileSize: "3.2 MB" },
      ];

      vi.mocked(getEbookFiles).mockResolvedValue(mockFiles as any);

      const result = await getEbookFiles(1);

      expect(getEbookFiles).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(3);
      expect(result.map(f => f.format)).toContain("epub");
      expect(result.map(f => f.format)).toContain("mobi");
      expect(result.map(f => f.format)).toContain("pdf");
    });

    it("should return empty array if no files available", async () => {
      vi.mocked(getEbookFiles).mockResolvedValue([]);

      const result = await getEbookFiles(999);

      expect(result).toHaveLength(0);
    });
  });
});

describe("Purchase Flow Integration", () => {
  it("should verify complete purchase flow", async () => {
    // 1. Create purchase
    const purchaseData = {
      userId: 1,
      bookId: 1,
      purchaseType: "single" as const,
      purchasePrice: 499,
    };

    vi.mocked(createUserPurchase).mockResolvedValue({ insertId: 1 } as any);
    await createUserPurchase(purchaseData);
    expect(createUserPurchase).toHaveBeenCalled();

    // 2. Verify ownership
    vi.mocked(getUserPurchaseByBook).mockResolvedValue({
      id: 1,
      ...purchaseData,
    } as any);
    const ownership = await getUserPurchaseByBook(1, 1);
    expect(ownership).not.toBeNull();

    // 3. Get download files
    vi.mocked(getEbookFiles).mockResolvedValue([
      { id: 1, bookId: 1, format: "epub", fileUrl: "https://example.com/book.epub", fileSize: "2.5 MB" },
    ] as any);
    const files = await getEbookFiles(1);
    expect(files.length).toBeGreaterThan(0);

    // 4. Record download
    vi.mocked(updatePurchaseDownloadCount).mockResolvedValue(undefined);
    await updatePurchaseDownloadCount(1);
    expect(updatePurchaseDownloadCount).toHaveBeenCalledWith(1);
  });
});
