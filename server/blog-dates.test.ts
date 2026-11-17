import { describe, expect, it } from "vitest";
import {
  articleJsonLdDates,
  formatBlogListDate,
  laterIsoDate,
  toIsoDate,
} from "../shared/blog-dates";
import { generateArticleSchema } from "../client/src/components/ui/enhanced-seo-head";

describe("article JSON-LD dates", () => {
  it("keeps dateModified at least as late as datePublished", () => {
    const published = "2026-11-15T23:46:04.902Z";
    const staleUpdated = "2026-08-17T05:35:43.992Z";
    const dates = articleJsonLdDates(published, staleUpdated);
    expect(dates.datePublished).toBe(published);
    expect(dates.dateModified).toBe(published);
    expect(Date.parse(dates.dateModified!)).toBeGreaterThanOrEqual(
      Date.parse(dates.datePublished!),
    );
  });

  it("uses a later updatedAt as dateModified", () => {
    const published = "2026-11-15T23:46:04.902Z";
    const updated = "2026-11-17T06:40:00.000Z";
    const dates = articleJsonLdDates(published, updated);
    expect(dates.datePublished).toBe(published);
    expect(dates.dateModified).toBe(updated);
  });

  it("falls back to datePublished when updatedAt is missing or invalid", () => {
    expect(articleJsonLdDates("2026-11-15T23:46:03.900Z")).toEqual({
      datePublished: "2026-11-15T23:46:03.900Z",
      dateModified: "2026-11-15T23:46:03.900Z",
    });
    expect(articleJsonLdDates("2026-11-15T23:46:03.900Z", "not-a-date")).toEqual({
      datePublished: "2026-11-15T23:46:03.900Z",
      dateModified: "2026-11-15T23:46:03.900Z",
    });
    expect(toIsoDate(null)).toBeUndefined();
    expect(laterIsoDate(undefined, "nope")).toBeUndefined();
  });

  it("applies the same rule in generateArticleSchema", () => {
    const schema = generateArticleSchema({
      title: "Secret Baby Romance Books: The Ultimate Reading Guide",
      description: "A guide.",
      url: "https://reeseastor.com/blog/secret-baby-romance-books-guide",
      image: "https://reeseastor.com/og.png",
      publishDate: "2026-11-15T23:46:04.902Z",
      modifiedDate: "2026-08-17T05:35:43.992Z",
    });
    expect(schema.datePublished).toBe("2026-11-15T23:46:04.902Z");
    expect(schema.dateModified).toBe("2026-11-15T23:46:04.902Z");
    expect(Date.parse(schema.dateModified)).toBeGreaterThanOrEqual(
      Date.parse(schema.datePublished),
    );
  });
});

describe("blog list dates", () => {
  it("formats list dates in America/New_York", () => {
    expect(formatBlogListDate("2026-11-15T23:46:04.902Z")).toBe("Nov 15, 2026");
    // 04:30 UTC is still the previous evening in ET.
    expect(formatBlogListDate("2026-11-16T04:30:00.000Z")).toBe("Nov 15, 2026");
    expect(formatBlogListDate("2026-11-16T05:00:00.000Z")).toBe("Nov 16, 2026");
    expect(formatBlogListDate(null)).toBe("");
  });
});
