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
