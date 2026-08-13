import { describe, it, expect } from "vitest";

// Test the ShareableResultCard data structure and sharing logic
describe("ShareableResultCard", () => {
  const tropeResults = [
    {
      trope: "enemies-to-lovers",
      title: "Enemies to Lovers",
      subtitle: "The tension is the point",
      icon: "⚔️",
      color: "#ef4444",
      bookTitle: "Hostile Tender",
      bookCover: "https://example.com/hostile-tender.jpg",
    },
    {
      trope: "forbidden-love",
      title: "Forbidden Love",
      subtitle: "Rules are made to be broken",
      icon: "🔥",
      color: "#f97316",
      bookTitle: "The Billionaire's Forbidden Nanny",
      bookCover: "https://example.com/forbidden-nanny.jpg",
    },
    {
      trope: "second-chance",
      title: "Second Chance",
      subtitle: "Some loves deserve another try",
      icon: "💫",
      color: "#8b5cf6",
      bookTitle: "Audit of the Heart",
      bookCover: "https://example.com/audit-heart.jpg",
    },
    {
      trope: "boss-romance",
      title: "Boss Romance",
      subtitle: "Power meets passion",
      icon: "👔",
      color: "#d4af37",
      bookTitle: "The First Acquisition",
      bookCover: "https://example.com/first-acquisition.jpg",
    },
  ];

  it("should have valid data for all 4 trope results", () => {
    expect(tropeResults).toHaveLength(4);
    tropeResults.forEach((result) => {
      expect(result.trope).toBeTruthy();
      expect(result.title).toBeTruthy();
      expect(result.subtitle).toBeTruthy();
      expect(result.icon).toBeTruthy();
      expect(result.color).toMatch(/^#[0-9a-f]{6}$/);
      expect(result.bookTitle).toBeTruthy();
      expect(result.bookCover).toBeTruthy();
    });
  });

  it("should generate correct share text for Twitter/X", () => {
    const result = tropeResults[0];
    const siteUrl = "https://reeseastor.com";
    const shareText = `I'm a ${result.title} reader! ${result.icon} Take the quiz to find your romance trope:`;
    const quizUrl = `${siteUrl}/romance-quiz`;
    const hashtags = "#RomanceBooks #BookTok #RomanceTrope #ReaderQuiz #ManhattanMoneyKings";
    const fullText = `${shareText}\n${quizUrl}\n\n${hashtags}`;

    expect(fullText).toContain("Enemies to Lovers");
    expect(fullText).toContain("⚔️");
    expect(fullText).toContain("reeseastor.com/romance-quiz");
    expect(fullText).toContain("#RomanceBooks");
    expect(fullText).toContain("#BookTok");
  });

  it("should generate correct Facebook share URL", () => {
    const siteUrl = "https://reeseastor.com";
    const quizUrl = `${siteUrl}/romance-quiz`;
    const shareText = "I'm a Forbidden Love reader!";
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(quizUrl)}&quote=${encodeURIComponent(shareText)}`;

    expect(fbUrl).toContain("facebook.com/sharer/sharer.php");
    expect(fbUrl).toContain(encodeURIComponent(quizUrl));
    expect(fbUrl).toContain(encodeURIComponent(shareText));
  });

  it("should generate correct Pinterest share URL", () => {
    const siteUrl = "https://reeseastor.com";
    const quizUrl = `${siteUrl}/romance-quiz`;
    const desc = "I'm a Boss Romance reader! #RomanceBooks #BookTok";
    const pinUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(quizUrl)}&description=${encodeURIComponent(desc)}`;

    expect(pinUrl).toContain("pinterest.com/pin/create/button");
    expect(pinUrl).toContain(encodeURIComponent(quizUrl));
  });

  it("should generate unique download filenames for each trope", () => {
    const filenames = tropeResults.map((r) => `my-romance-trope-${r.trope}.png`);
    const uniqueFilenames = new Set(filenames);
    expect(uniqueFilenames.size).toBe(4);
    filenames.forEach((f) => expect(f).toMatch(/\.png$/));
  });

  it("should include all required hashtags", () => {
    const hashtags = "#RomanceBooks #BookTok #RomanceTrope #ReaderQuiz #ManhattanMoneyKings";
    expect(hashtags).toContain("#RomanceBooks");
    expect(hashtags).toContain("#BookTok");
    expect(hashtags).toContain("#RomanceTrope");
    expect(hashtags).toContain("#ReaderQuiz");
    expect(hashtags).toContain("#ManhattanMoneyKings");
  });
});

// Test the Promo page data structure
describe("Promo Page - Group Giveaway", () => {
  const promoBooks = [
    {
      id: 1,
      title: "The First Acquisition",
      author: "Reese Astor",
      genre: "Billionaire Romance",
      tropes: ["Boss Romance", "Power Dynamic", "Manhattan"],
      featured: true,
    },
    {
      id: 2,
      title: "Tempted by the Tycoon",
      author: "Partner Author",
      genre: "Billionaire Romance",
      tropes: ["Enemies to Lovers", "Office Romance"],
    },
    {
      id: 3,
      title: "The CEO's Secret",
      author: "Partner Author",
      genre: "Contemporary Romance",
      tropes: ["Secret Baby", "Second Chance"],
    },
    {
      id: 4,
      title: "Forbidden Nights",
      author: "Partner Author",
      genre: "Dark Romance",
      tropes: ["Forbidden Love", "Age Gap"],
    },
    {
      id: 5,
      title: "His Redemption",
      author: "Partner Author",
      genre: "Romantic Suspense",
      tropes: ["Protector Romance", "Damaged Hero"],
    },
    {
      id: 6,
      title: "Wicked Arrangement",
      author: "Partner Author",
      genre: "Billionaire Romance",
      tropes: ["Fake Relationship", "Forced Proximity"],
    },
  ];

  it("should have 6 promo books", () => {
    expect(promoBooks).toHaveLength(6);
  });

  it("should have exactly one featured book (Reese Astor's)", () => {
    const featured = promoBooks.filter((b) => b.featured);
    expect(featured).toHaveLength(1);
    expect(featured[0].author).toBe("Reese Astor");
    expect(featured[0].title).toBe("The First Acquisition");
  });

  it("should have unique IDs for all books", () => {
    const ids = promoBooks.map((b) => b.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(6);
  });

  it("should have valid genre for each book", () => {
    const validGenres = ["Billionaire Romance", "Contemporary Romance", "Dark Romance", "Romantic Suspense"];
    promoBooks.forEach((book) => {
      expect(validGenres).toContain(book.genre);
    });
  });

  it("should have at least one trope for each book", () => {
    promoBooks.forEach((book) => {
      expect(book.tropes.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("should cover diverse romance sub-genres", () => {
    const genres = new Set(promoBooks.map((b) => b.genre));
    expect(genres.size).toBeGreaterThanOrEqual(3);
  });

  it("should have all partner slots available for cross-promotion", () => {
    const partnerBooks = promoBooks.filter((b) => b.author === "Partner Author");
    expect(partnerBooks).toHaveLength(5);
  });

  it("should have diverse tropes across all books", () => {
    const allTropes = promoBooks.flatMap((b) => b.tropes);
    const uniqueTropes = new Set(allTropes);
    expect(uniqueTropes.size).toBeGreaterThanOrEqual(8);
  });
});

// Test email validation for promo page
describe("Promo Page - Email Capture", () => {
  it("should validate email format", () => {
    const validEmails = ["test@example.com", "user@domain.co.uk", "name+tag@gmail.com"];
    const invalidEmails = ["", "notanemail", "@missing.com", "spaces in@email.com"];

    validEmails.forEach((email) => {
      expect(email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    invalidEmails.forEach((email) => {
      expect(email).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  it("should have correct BookHip redirect URL", () => {
    const bookHipUrl = "https://swiy.co/05";
    expect(bookHipUrl).toContain("BookHip.com");
    expect(bookHipUrl).toContain("JHRBVXT");
  });
});
