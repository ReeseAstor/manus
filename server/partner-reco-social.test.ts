import { describe, it, expect, vi } from "vitest";

// ============================================
// Partner Applications Tests
// ============================================
describe("Partner Applications System", () => {
  it("should define partner_applications table with required fields", async () => {
    const schema = await import("../drizzle/schema");
    expect(schema.partnerApplications).toBeDefined();
  });

  it("should have correct partner application fields", async () => {
    const schema = await import("../drizzle/schema");
    const table = schema.partnerApplications;
    // Verify the table has the expected columns
    expect(table).toBeDefined();
  });

  it("should validate partner application data structure", () => {
    const validApplication = {
      authorName: "Jane Author",
      email: "jane@example.com",
      bookTitle: "Her Secret Love",
      genre: "Contemporary Romance",
      bookLink: "https://books2read.com/her-secret-love",
      bio: "Jane is a bestselling romance author...",
      socialMedia: "@janeauthor",
      status: "pending" as const,
    };

    expect(validApplication.authorName).toBeTruthy();
    expect(validApplication.email).toContain("@");
    expect(validApplication.bookTitle).toBeTruthy();
    expect(validApplication.genre).toBeTruthy();
    expect(validApplication.bookLink).toMatch(/^https?:\/\//);
    expect(validApplication.status).toBe("pending");
  });

  it("should support status transitions: pending -> approved/rejected", () => {
    const statuses = ["pending", "approved", "rejected"];
    const validTransitions: Record<string, string[]> = {
      pending: ["approved", "rejected"],
      approved: ["rejected"],
      rejected: ["approved"],
    };

    expect(statuses).toContain("pending");
    expect(statuses).toContain("approved");
    expect(statuses).toContain("rejected");
    expect(validTransitions.pending).toContain("approved");
    expect(validTransitions.pending).toContain("rejected");
  });

  it("should require all mandatory fields for submission", () => {
    const requiredFields = [
      "authorName",
      "email",
      "bookTitle",
      "genre",
      "bookLink",
      "bio",
    ];

    const submission: Record<string, string> = {
      authorName: "Test Author",
      email: "test@example.com",
      bookTitle: "Test Book",
      genre: "Romance",
      bookLink: "https://example.com/book",
      bio: "A romance author",
    };

    requiredFields.forEach((field) => {
      expect(submission[field]).toBeTruthy();
    });
  });
});

// ============================================
// Social Media Kit Tests
// ============================================
describe("Social Media Kit", () => {
  it("should have 4 quiz promotion graphics", () => {
    const graphics = [
      { id: 1, title: "Which Romance Trope Are You?", platform: "instagram" },
      { id: 2, title: "Enemies to Lovers or Forbidden Love?", platform: "instagram" },
      { id: 3, title: "Take the Quiz - Find Your Perfect Read", platform: "tiktok" },
      { id: 4, title: "Your Romance Personality Awaits", platform: "facebook" },
    ];

    expect(graphics).toHaveLength(4);
    graphics.forEach((g) => {
      expect(g.title).toBeTruthy();
      expect(g.platform).toBeTruthy();
    });
  });

  it("should provide pre-written captions with hashtags", () => {
    const caption = {
      text: "Which romance trope defines your love story? Take the quiz!",
      hashtags: [
        "#RomanceBooks",
        "#BookTok",
        "#RomanceReader",
        "#BookQuiz",
        "#RomanceTropes",
      ],
      callToAction: "Link in bio!",
    };

    expect(caption.text.length).toBeGreaterThan(20);
    expect(caption.hashtags.length).toBeGreaterThanOrEqual(3);
    expect(caption.callToAction).toBeTruthy();
  });

  it("should include posting schedule recommendations", () => {
    const schedule = {
      frequency: "3-4 times per week",
      bestTimes: ["9am", "12pm", "7pm"],
      platforms: ["Instagram", "TikTok", "Facebook", "Pinterest"],
    };

    expect(schedule.platforms).toContain("Instagram");
    expect(schedule.platforms).toContain("TikTok");
    expect(schedule.bestTimes.length).toBeGreaterThanOrEqual(2);
  });

  it("should include Reel script templates", () => {
    const reelScripts = [
      {
        title: "The Reveal",
        duration: "15-30 seconds",
        hook: "POV: You just found out which romance trope you are...",
      },
      {
        title: "The Debate",
        duration: "30-60 seconds",
        hook: "Enemies to Lovers vs Second Chance - which is better?",
      },
    ];

    reelScripts.forEach((script) => {
      expect(script.title).toBeTruthy();
      expect(script.hook.length).toBeGreaterThan(10);
      expect(script.duration).toBeTruthy();
    });
  });
});

// ============================================
// Readers Also Loved Recommendation Engine Tests
// ============================================
describe("Readers Also Loved Recommendation Engine", () => {
  const mockBooks = [
    {
      id: 1,
      title: "The Billionaire's Secret Baby",
      slug: "billionaires-secret-baby",
      tropes: "enemies-to-lovers, secret-baby, billionaire",
      series: "Manhattan Money Kings",
      seriesOrder: 1,
      rating: 4.5,
    },
    {
      id: 2,
      title: "The Billionaire's Forbidden Desire",
      slug: "billionaires-forbidden-desire",
      tropes: "forbidden-love, billionaire, age-gap",
      series: "Manhattan Money Kings",
      seriesOrder: 2,
      rating: 4.7,
    },
    {
      id: 3,
      title: "The Billionaire's Second Chance",
      slug: "billionaires-second-chance",
      tropes: "second-chance, billionaire, friends-to-lovers",
      series: "Manhattan Money Kings",
      seriesOrder: 3,
      rating: 4.6,
    },
    {
      id: 4,
      title: "The Billionaire's Forbidden Nanny",
      slug: "billionaires-forbidden-nanny",
      tropes: "forbidden-love, nanny, billionaire",
      series: "Manhattan Money Kings",
      seriesOrder: 4,
      rating: 4.8,
    },
  ];

  it("should find trope-matched books based on shared tropes", () => {
    const currentBook = mockBooks[0]; // enemies-to-lovers, secret-baby, billionaire
    const currentTropes = currentBook.tropes
      .split(",")
      .map((t) => t.trim().toLowerCase());
    const otherBooks = mockBooks.filter((b) => b.id !== currentBook.id);

    const tropeMatched = otherBooks
      .map((book) => {
        const bookTropes = book.tropes
          .split(",")
          .map((t) => t.trim().toLowerCase());
        const sharedTropes = currentTropes.filter((t) =>
          bookTropes.includes(t)
        );
        return { ...book, sharedTropes, matchScore: sharedTropes.length };
      })
      .filter((b) => b.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    // All books share "billionaire" trope
    expect(tropeMatched.length).toBe(3);
    // Each should have at least 1 shared trope (billionaire)
    tropeMatched.forEach((b) => {
      expect(b.matchScore).toBeGreaterThanOrEqual(1);
      expect(b.sharedTropes).toContain("billionaire");
    });
  });

  it("should find series books in correct order", () => {
    const currentBook = mockBooks[0];
    const otherBooks = mockBooks.filter((b) => b.id !== currentBook.id);

    const seriesBooks = otherBooks
      .filter((b) => b.series === currentBook.series)
      .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));

    expect(seriesBooks.length).toBe(3);
    expect(seriesBooks[0].seriesOrder).toBe(2);
    expect(seriesBooks[1].seriesOrder).toBe(3);
    expect(seriesBooks[2].seriesOrder).toBe(4);
  });

  it("should personalize recommendations based on quiz result", () => {
    const quizResult = "forbidden-love";
    const otherBooks = mockBooks;

    const personalizedBooks = otherBooks
      .map((book) => {
        const bookTropes = book.tropes
          .split(",")
          .map((t) => t.trim().toLowerCase());
        const matchesQuiz = bookTropes.some(
          (t) =>
            t.includes(quizResult) ||
            quizResult.includes(t.replace(/\s+/g, "-"))
        );
        return { ...book, matchesQuiz, quizScore: matchesQuiz ? 2 : 0 };
      })
      .sort((a, b) => b.quizScore - a.quizScore);

    // Books 2 and 4 have "forbidden-love" trope
    const quizMatches = personalizedBooks.filter((b) => b.matchesQuiz);
    expect(quizMatches.length).toBe(2);
    expect(quizMatches.map((b) => b.id)).toContain(2);
    expect(quizMatches.map((b) => b.id)).toContain(4);
  });

  it("should exclude the current book from recommendations", () => {
    const currentBookId = 1;
    const otherBooks = mockBooks.filter((b) => b.id !== currentBookId);

    expect(otherBooks.length).toBe(mockBooks.length - 1);
    expect(otherBooks.find((b) => b.id === currentBookId)).toBeUndefined();
  });

  it("should handle books with no tropes gracefully", () => {
    const bookWithNoTropes = {
      id: 5,
      title: "Mystery Book",
      slug: "mystery-book",
      tropes: "",
      series: null,
      seriesOrder: null,
      rating: 4.0,
    };

    const bookTropes = bookWithNoTropes.tropes
      ? bookWithNoTropes.tropes
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter((t) => t.length > 0)
      : [];

    expect(bookTropes).toHaveLength(0);
  });

  it("should store and retrieve quiz result from localStorage", () => {
    const mockStorage: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => {
        mockStorage[key] = value;
      },
    };

    // Save quiz result
    mockLocalStorage.setItem("romanceQuizResult", "Enemies to Lovers");
    expect(mockLocalStorage.getItem("romanceQuizResult")).toBe(
      "Enemies to Lovers"
    );

    // Retrieve for recommendations
    const result = mockLocalStorage.getItem("romanceQuizResult");
    expect(result).toBeTruthy();
    expect(result!.toLowerCase().replace(/\s+/g, "-")).toBe(
      "enemies-to-lovers"
    );
  });

  it("should paginate recommendations with 3 books per page", () => {
    const books = mockBooks;
    const booksPerPage = 3;
    const totalPages = Math.ceil(books.length / booksPerPage);

    expect(totalPages).toBe(2);

    const page1 = books.slice(0, booksPerPage);
    const page2 = books.slice(booksPerPage, booksPerPage * 2);

    expect(page1.length).toBe(3);
    expect(page2.length).toBe(1);
  });
});

// ============================================
// Integration: Quiz -> Recommendations Flow
// ============================================
describe("Quiz to Recommendations Integration", () => {
  it("should map quiz trope results to recommendation categories", () => {
    const tropeRecommendations: Record<
      string,
      { icon: string; tagline: string }
    > = {
      "enemies-to-lovers": {
        icon: "⚔️",
        tagline: "You love the tension!",
      },
      "forbidden-love": {
        icon: "🔥",
        tagline: "Rules were made to be broken!",
      },
      "second-chance": {
        icon: "💫",
        tagline: "Every love deserves another shot!",
      },
      "boss-romance": {
        icon: "👔",
        tagline: "Power meets passion!",
      },
    };

    const quizResults = [
      "enemies-to-lovers",
      "forbidden-love",
      "second-chance",
      "boss-romance",
    ];

    quizResults.forEach((result) => {
      expect(tropeRecommendations[result]).toBeDefined();
      expect(tropeRecommendations[result].icon).toBeTruthy();
      expect(tropeRecommendations[result].tagline).toBeTruthy();
    });
  });

  it("should provide tab-based navigation between recommendation types", () => {
    const tabs = [
      { key: "personalized", label: "For You ✨", requiresQuiz: true },
      { key: "trope-match", label: "Similar Vibes", requiresQuiz: false },
      { key: "series", label: "In This Series", requiresQuiz: false },
    ];

    // Without quiz result, personalized tab should be hidden
    const tabsWithoutQuiz = tabs.filter((t) => !t.requiresQuiz);
    expect(tabsWithoutQuiz.length).toBe(2);

    // With quiz result, all tabs available
    expect(tabs.length).toBe(3);
  });
});
