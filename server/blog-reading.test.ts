import { describe, expect, it } from "vitest";
import {
  headingId,
  matchesBlogSearch,
  parseSavedProgress,
  plainArticleText,
  readingMinutes,
  readingProgress,
} from "../client/src/lib/blog-reading";

describe("reader helpers", () => {
  it("counts article words rather than markdown links and markup", () => {
    expect(
      plainArticleText(
        "## Notes\n[Read here](https://example.com) ![cover](image.jpg) <b>today</b>"
      )
    ).toBe("Notes Read here today");
    expect(readingMinutes("word ".repeat(441))).toBe(3);
    expect(readingMinutes("")).toBe(1);
  });
  it("makes unique, safe IDs for repeated and non-Latin headings", () => {
    expect(headingId("Café & comfort", 0)).toBe("article-cafe-comfort-0");
    expect(headingId("Café & comfort", 1)).not.toBe(
      headingId("Café & comfort", 0)
    );
    expect(headingId("阅读", 2)).toBe("article-section-2");
  });
  it("clamps progress and handles articles shorter than the viewport", () => {
    expect(readingProgress(100, 2000, 800)).toBe(0);
    expect(readingProgress(-600, 2000, 800)).toBe(0.5);
    expect(readingProgress(-3000, 2000, 800)).toBe(1);
    expect(readingProgress(100, 200, 800)).toBe(1);
    expect(readingProgress(900, 200, 800)).toBe(0);
  });
  it("only resumes meaningful and finite saved progress", () => {
    for (const invalid of [
      null,
      "",
      "NaN",
      "Infinity",
      "-1",
      "1",
      "0",
      "0.999",
    ])
      expect(parseSavedProgress(invalid)).toBeNull();
    expect(parseSavedProgress("0.45")).toBe(0.45);
  });
  it("searches title, excerpt and category without requiring exact phrasing", () => {
    const post = {
      title: "A quiet reading night",
      excerpt: "Comfort and books",
      category: "Reading life",
    };
    expect(matchesBlogSearch(post, "  NIGHT books ")).toBe(true);
    expect(matchesBlogSearch(post, "reading gift")).toBe(false);
    expect(matchesBlogSearch(post, "")).toBe(true);
    expect(matchesBlogSearch({ title: "Notes" }, "notes")).toBe(true);
  });
});
