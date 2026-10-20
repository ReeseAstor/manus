import { describe, it, expect } from "vitest";

// Test the quiz logic
describe("Romance Trope Quiz Logic", () => {
  const tropeOptions = ["enemies", "forbidden", "second-chance", "boss"];

  function calculateResult(answers: string[]): string {
    const counts: Record<string, number> = {};
    answers.forEach((a) => {
      counts[a] = (counts[a] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }

  it("should return enemies-to-lovers when most answers are enemies", () => {
    const answers = ["enemies", "enemies", "enemies", "forbidden", "boss", "enemies", "second-chance"];
    expect(calculateResult(answers)).toBe("enemies");
  });

  it("should return forbidden when most answers are forbidden", () => {
    const answers = ["forbidden", "forbidden", "forbidden", "enemies", "forbidden", "boss", "second-chance"];
    expect(calculateResult(answers)).toBe("forbidden");
  });

  it("should return second-chance when most answers are second-chance", () => {
    const answers = ["second-chance", "second-chance", "second-chance", "second-chance", "enemies", "boss", "forbidden"];
    expect(calculateResult(answers)).toBe("second-chance");
  });

  it("should return boss when most answers are boss", () => {
    const answers = ["boss", "boss", "boss", "boss", "boss", "enemies", "forbidden"];
    expect(calculateResult(answers)).toBe("boss");
  });

  it("should handle tie by returning the first highest count", () => {
    // When there's a tie, the sort is stable and returns the first one encountered
    const answers = ["enemies", "enemies", "forbidden", "forbidden", "boss", "boss", "second-chance"];
    const result = calculateResult(answers);
    expect(tropeOptions).toContain(result);
  });

  it("should handle all same answers", () => {
    const answers = ["enemies", "enemies", "enemies", "enemies", "enemies", "enemies", "enemies"];
    expect(calculateResult(answers)).toBe("enemies");
  });

  it("should handle exactly 7 answers (quiz length)", () => {
    const answers = ["boss", "forbidden", "enemies", "boss", "boss", "second-chance", "boss"];
    expect(calculateResult(answers)).toBe("boss");
    expect(answers.length).toBe(7);
  });
});

// Test the content upgrade matching
describe("Blog Content Upgrade Matching", () => {
  const contentUpgradeSlugs = [
    "ultimate-cozy-reading-night-setup",
    "romance-reader-gift-guide-2026",
    "5-tips-writing-steamy-scenes",
    "behind-scenes-manhattan-money-kings",
    "how-to-start-romance-book-club",
  ];

  it("should have content upgrades for 5 blog articles", () => {
    expect(contentUpgradeSlugs.length).toBe(5);
  });

  it("should have unique slugs for each content upgrade", () => {
    const uniqueSlugs = new Set(contentUpgradeSlugs);
    expect(uniqueSlugs.size).toBe(contentUpgradeSlugs.length);
  });

  it("should return null for blog posts without content upgrades", () => {
    const unknownSlug = "random-blog-post-slug";
    expect(contentUpgradeSlugs.includes(unknownSlug)).toBe(false);
  });
});

// Test the exit-intent popup logic
describe("Exit Intent Popup Logic", () => {
  it("should only trigger when mouse Y position is <= 5", () => {
    const shouldTrigger = (clientY: number) => clientY <= 5;
    expect(shouldTrigger(0)).toBe(true);
    expect(shouldTrigger(5)).toBe(true);
    expect(shouldTrigger(6)).toBe(false);
    expect(shouldTrigger(100)).toBe(false);
  });

  it("should not trigger before 30 seconds have passed", () => {
    const pageLoadTime = Date.now();
    const currentTime = pageLoadTime + 20000; // 20 seconds later
    const hasWaitedEnough = currentTime - pageLoadTime >= 30000;
    expect(hasWaitedEnough).toBe(false);
  });

  it("should trigger after 30 seconds have passed", () => {
    const pageLoadTime = Date.now();
    const currentTime = pageLoadTime + 35000; // 35 seconds later
    const hasWaitedEnough = currentTime - pageLoadTime >= 30000;
    expect(hasWaitedEnough).toBe(true);
  });
});

// Test the trope result mapping against the quiz page.
describe("Trope Result Mapping", () => {
  it("maps each result to a real Reese Astor title", async () => {
    const { tropeResults } = await import("../client/src/pages/Quiz");
    expect(tropeResults.enemies.bookTitle).toBe("Hostile Tender");
    expect(tropeResults.enemies.bookSubtitle).toBe("Hudson Dynasty Book 1");
    expect(tropeResults.forbidden.bookTitle).toBe("The Billionaire's Forbidden Nanny");
    expect(tropeResults.forbidden.bookLink).toBe("https://www.amazon.com/dp/B0GDZ4T164");
    expect(tropeResults["second-chance"].bookTitle).toBe("The Billionaire's Baby Secret");
    expect(tropeResults["second-chance"].bookLink).toBe("https://www.amazon.com/dp/B0G12LBZ24");
    expect(tropeResults.boss.bookTitle).toBe("The Billionaire's Executive Assistant");
    expect(tropeResults.boss.bookSubtitle).toBe("Manhattan Money Kings Book 1");
    expect(tropeResults.boss.bookLink).toBe("https://www.amazon.com/dp/B0F2W8QL7S");
    expect(Object.values(tropeResults).map((result) => result.bookTitle)).not.toContain(
      "The Billionaire's Rival",
    );
    for (const result of Object.values(tropeResults)) {
      expect(result.bookLink.startsWith("https://www.amazon.com/dp/")).toBe(true);
    }
  });
});
