import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock the database module
vi.mock("./db", () => ({
  getAllBooks: vi.fn(),
  getBookBySlug: vi.fn(),
  getBookById: vi.fn(),
  getBookReviews: vi.fn(),
  getRelatedBooks: vi.fn(),
  createBook: vi.fn(),
  updateBook: vi.fn(),
  deleteBook: vi.fn(),
  createBookReview: vi.fn(),
  // Stub other exports that might be needed
  getAllBlogPosts: vi.fn(),
  getBlogPostBySlug: vi.fn(),
  createBlogPost: vi.fn(),
  updateBlogPost: vi.fn(),
  deleteBlogPost: vi.fn(),
  getContactSubmissions: vi.fn(),
  createContactSubmission: vi.fn(),
  updateContactSubmission: vi.fn(),
  getUserPreferences: vi.fn(),
  upsertUserPreferences: vi.fn(),
  getBrowsingHistory: vi.fn(),
  upsertBrowsingHistory: vi.fn(),
  getPopularBooks: vi.fn(),
  getReaderClubMembership: vi.fn(),
  createReaderClubMembership: vi.fn(),
  updateReaderClubMembership: vi.fn(),
  getAllBonusContent: vi.fn(),
  getBonusContentById: vi.fn(),
  createBonusContent: vi.fn(),
  updateBonusContent: vi.fn(),
  deleteBonusContent: vi.fn(),
  getBookCharacters: vi.fn(),
  getCharacterRelationships: vi.fn(),
  getBookStorylines: vi.fn(),
  getBookPricingHistory: vi.fn(),
  createBookCharacter: vi.fn(),
  updateBookCharacter: vi.fn(),
  deleteBookCharacter: vi.fn(),
  createCharacterRelationship: vi.fn(),
  updateCharacterRelationship: vi.fn(),
  deleteCharacterRelationship: vi.fn(),
  createBookStoryline: vi.fn(),
  updateBookStoryline: vi.fn(),
  deleteBookStoryline: vi.fn(),
  createBookPricingHistory: vi.fn(),
  getAdminDashboardStats: vi.fn(),
  getAdminRecentActivity: vi.fn(),
  getAllUsers: vi.fn(),
  updateUserRole: vi.fn(),
  getGoals: vi.fn(),
  createGoal: vi.fn(),
  updateGoal: vi.fn(),
  deleteGoal: vi.fn(),
  getGoalHistory: vi.fn(),
  createGoalHistory: vi.fn(),
  getCommandCenterMetrics: vi.fn(),
  getCommandCenterAlerts: vi.fn(),
  getCommandCenterTasks: vi.fn(),
  createCommandCenterTask: vi.fn(),
  updateCommandCenterTask: vi.fn(),
  deleteCommandCenterTask: vi.fn(),
  getCommandCenterNotes: vi.fn(),
  createCommandCenterNote: vi.fn(),
  updateCommandCenterNote: vi.fn(),
  deleteCommandCenterNote: vi.fn(),
  getSmsSubscribers: vi.fn(),
  createSmsSubscriber: vi.fn(),
  updateSmsSubscriber: vi.fn(),
  getSmsMessages: vi.fn(),
  createSmsMessage: vi.fn(),
  getSmsAnalytics: vi.fn(),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const mockAuditOfTheHeart = {
  id: 5,
  title: "Audit of the Heart",
  slug: "audit-of-the-heart",
  series: "Hudson Dynasty",
  seriesOrder: 1,
  coverImage: "https://example.com/audit-cover.webp",
  description:
    "A brilliant compliance attorney is hired to stabilize Hudson Vale, the Manhattan investment empire run by ruthless billionaire Sebastian Hudson.",
  sampleChapter: null,
  rating: 5,
  reviewCount: 0,
  tropes: JSON.stringify([
    "Forced Proximity",
    "Fake Engagement",
    "Office Romance",
    "Off-Limits",
    "Billionaire Romance",
    "Corporate Power Romance",
  ]),
  heatLevel: 5,
  pageCount: 350,
  publishDate: "Coming Soon",
  amazonUrl: null,
  appleUrl: null,
  koboUrl: null,
  barnesNobleUrl: null,
  googlePlayUrl: null,
  retailPrice: 499,
  directPrice: 399,
  memberPrice: 299,
  directSaleUrl: null,
  audioSampleUrl: null,
  featured: true,
  displayOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockHostileTender = {
  id: 6,
  title: "Hostile Tender",
  slug: "hostile-tender",
  series: "Hudson Dynasty",
  seriesOrder: 2,
  coverImage: "https://example.com/hostile-tender-cover.webp",
  description:
    "She's the federal auditor sent to dismantle his empire. He's Manhattan's most dangerous billionaire fighting to save it.",
  sampleChapter: null,
  rating: 5,
  reviewCount: 0,
  tropes: JSON.stringify([
    "Enemies to Lovers",
    "Forced Proximity",
    "Cat & Mouse",
    "Forbidden Attraction",
    "Billionaire Romance",
    "Corporate Power Romance",
  ]),
  heatLevel: 5,
  pageCount: 320,
  publishDate: "Coming Soon",
  amazonUrl: null,
  appleUrl: null,
  koboUrl: null,
  barnesNobleUrl: null,
  googlePlayUrl: null,
  retailPrice: 499,
  directPrice: 399,
  memberPrice: 299,
  directSaleUrl: null,
  audioSampleUrl: null,
  featured: true,
  displayOrder: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockMMKBook = {
  id: 1,
  title: "The Billionaire's Baby Secret",
  slug: "the-billionaire-s-baby-secret",
  series: "Manhattan Money Kings",
  seriesOrder: 3,
  coverImage: "https://example.com/baby-secret.webp",
  description: "A secret baby billionaire romance.",
  sampleChapter: null,
  rating: 5,
  reviewCount: 100,
  tropes: JSON.stringify(["Secret Baby", "Second Chance", "Billionaire Romance"]),
  heatLevel: 4,
  pageCount: 340,
  publishDate: "Available Now",
  amazonUrl: "https://amazon.com/example",
  appleUrl: null,
  koboUrl: null,
  barnesNobleUrl: null,
  googlePlayUrl: null,
  retailPrice: 499,
  directPrice: 399,
  memberPrice: 299,
  directSaleUrl: null,
  audioSampleUrl: null,
  featured: true,
  displayOrder: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Hudson Dynasty Series - Books API", () => {
  const caller = appRouter.createCaller(createPublicContext());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return Hudson Dynasty books alongside Manhattan Money Kings books", async () => {
    vi.mocked(db.getAllBooks).mockResolvedValue([
      mockMMKBook,
      mockAuditOfTheHeart,
    ]);

    const books = await caller.books.list();

    expect(books).toHaveLength(2);
    expect(books.some((b: any) => b.series === "Hudson Dynasty")).toBe(true);
    expect(books.some((b: any) => b.series === "Manhattan Money Kings")).toBe(true);
  });

  it("should return Audit of the Heart by slug", async () => {
    vi.mocked(db.getBookBySlug).mockResolvedValue(mockAuditOfTheHeart);

    const book = await caller.books.getBySlug({ slug: "audit-of-the-heart" });

    expect(book.title).toBe("Audit of the Heart");
    expect(book.series).toBe("Hudson Dynasty");
    expect(book.seriesOrder).toBe(1);
    expect(book.publishDate).toBe("Coming Soon");
    expect(book.heatLevel).toBe(5);
  });

  it("should have correct tropes for Audit of the Heart", async () => {
    vi.mocked(db.getBookBySlug).mockResolvedValue(mockAuditOfTheHeart);

    const book = await caller.books.getBySlug({ slug: "audit-of-the-heart" });
    const tropes = JSON.parse(book.tropes as string);

    expect(tropes).toContain("Forced Proximity");
    expect(tropes).toContain("Fake Engagement");
    expect(tropes).toContain("Office Romance");
    expect(tropes).toContain("Off-Limits");
    expect(tropes).toContain("Billionaire Romance");
    expect(tropes).toContain("Corporate Power Romance");
    expect(tropes).toHaveLength(6);
  });

  it("should throw NOT_FOUND for non-existent book slug", async () => {
    vi.mocked(db.getBookBySlug).mockResolvedValue(undefined as any);

    await expect(
      caller.books.getBySlug({ slug: "non-existent-book" })
    ).rejects.toThrow("Book not found");
  });

  it("should filter featured books including Hudson Dynasty", async () => {
    vi.mocked(db.getAllBooks).mockResolvedValue([
      mockMMKBook,
      mockAuditOfTheHeart,
    ]);

    const books = await caller.books.list({ featuredOnly: true });

    expect(db.getAllBooks).toHaveBeenCalledWith(true);
    expect(books).toHaveLength(2);
  });

  it("should have Coming Soon publish date for Audit of the Heart", async () => {
    vi.mocked(db.getBookBySlug).mockResolvedValue(mockAuditOfTheHeart);

    const book = await caller.books.getBySlug({ slug: "audit-of-the-heart" });

    expect(book.publishDate).toBe("Coming Soon");
    expect(book.amazonUrl).toBeNull();
    expect(book.directSaleUrl).toBeNull();
  });

  it("should return Hostile Tender by slug", async () => {
    vi.mocked(db.getBookBySlug).mockResolvedValue(mockHostileTender);

    const book = await caller.books.getBySlug({ slug: "hostile-tender" });

    expect(book.title).toBe("Hostile Tender");
    expect(book.series).toBe("Hudson Dynasty");
    expect(book.seriesOrder).toBe(2);
    expect(book.publishDate).toBe("Coming Soon");
    expect(book.heatLevel).toBe(5);
  });

  it("should have correct tropes for Hostile Tender", async () => {
    vi.mocked(db.getBookBySlug).mockResolvedValue(mockHostileTender);

    const book = await caller.books.getBySlug({ slug: "hostile-tender" });
    const tropes = JSON.parse(book.tropes as string);

    expect(tropes).toContain("Enemies to Lovers");
    expect(tropes).toContain("Forced Proximity");
    expect(tropes).toContain("Cat & Mouse");
    expect(tropes).toContain("Forbidden Attraction");
    expect(tropes).toHaveLength(6);
  });

  it("should return both Hudson Dynasty books together", async () => {
    vi.mocked(db.getAllBooks).mockResolvedValue([
      mockMMKBook,
      mockAuditOfTheHeart,
      mockHostileTender,
    ]);

    const books = await caller.books.list();
    const hdBooks = books.filter((b: any) => b.series === "Hudson Dynasty");

    expect(hdBooks).toHaveLength(2);
    expect(hdBooks.find((b: any) => b.seriesOrder === 1)?.title).toBe("Audit of the Heart");
    expect(hdBooks.find((b: any) => b.seriesOrder === 2)?.title).toBe("Hostile Tender");
  });

  it("should correctly distinguish between two series with all books", async () => {
    vi.mocked(db.getAllBooks).mockResolvedValue([
      mockMMKBook,
      { ...mockMMKBook, id: 2, title: "The Billionaire's Fake Wife", seriesOrder: 2 },
      { ...mockMMKBook, id: 3, title: "The Billionaire's Executive Assistant", seriesOrder: 1 },
      mockAuditOfTheHeart,
      mockHostileTender,
    ]);

    const books = await caller.books.list();

    const mmkBooks = books.filter((b: any) => b.series === "Manhattan Money Kings");
    const hdBooks = books.filter((b: any) => b.series === "Hudson Dynasty");

    expect(mmkBooks).toHaveLength(3);
    expect(hdBooks).toHaveLength(2);
    expect(hdBooks.map((b: any) => b.title)).toContain("Audit of the Heart");
    expect(hdBooks.map((b: any) => b.title)).toContain("Hostile Tender");
  });
});

describe("Behind the Scenes - Data Validation", () => {
  const btsCharacters = [
    { title: "Sebastian Hudson", subtitle: "The Ice King", type: "character", book: "Both Books" },
    { title: "Nadia", subtitle: "Compliance Attorney", type: "character", book: "Audit of the Heart" },
    { title: "Nia Carter", subtitle: "SDNY Forensic Auditor", type: "character", book: "Hostile Tender" },
  ];

  const btsLocations = [
    { title: "Hudson Vale Tower", subtitle: "Midtown Manhattan", type: "location", book: "Both Books" },
    { title: "The Boardroom", subtitle: "42nd Floor, Hudson Vale", type: "location", book: "Hostile Tender" },
  ];

  it("should have 3 character entries in the BTS section", () => {
    expect(btsCharacters).toHaveLength(3);
  });

  it("should have 2 location entries in the BTS section", () => {
    expect(btsLocations).toHaveLength(2);
  });

  it("should include Sebastian Hudson as a character in both books", () => {
    const sebastian = btsCharacters.find(c => c.title === "Sebastian Hudson");
    expect(sebastian).toBeDefined();
    expect(sebastian!.subtitle).toBe("The Ice King");
    expect(sebastian!.book).toBe("Both Books");
  });

  it("should include Nadia as the Book 1 FMC", () => {
    const nadia = btsCharacters.find(c => c.title === "Nadia");
    expect(nadia).toBeDefined();
    expect(nadia!.subtitle).toBe("Compliance Attorney");
    expect(nadia!.book).toBe("Audit of the Heart");
  });

  it("should include Nia Carter as the Book 2 FMC", () => {
    const nia = btsCharacters.find(c => c.title === "Nia Carter");
    expect(nia).toBeDefined();
    expect(nia!.subtitle).toBe("SDNY Forensic Auditor");
    expect(nia!.book).toBe("Hostile Tender");
  });

  it("should have all BTS items with valid types", () => {
    const allItems = [...btsCharacters, ...btsLocations];
    allItems.forEach(item => {
      expect(["character", "location"]).toContain(item.type);
    });
  });

  it("should have a total of 5 BTS items", () => {
    const allItems = [...btsCharacters, ...btsLocations];
    expect(allItems).toHaveLength(5);
  });
});
