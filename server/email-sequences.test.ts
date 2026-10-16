import { describe, it, expect } from "vitest";
import {
  generateLaunchEmail1,
  generateLaunchEmail2,
  generateLaunchEmail3,
  launchSequence,
} from "./email-templates/launch-sequence";
import {
  generateSeriesUpsellEmail1,
  generateSeriesUpsellEmail2,
  generateSeriesUpsellEmail3,
  seriesUpsellSequence,
} from "./email-templates/series-upsell";

describe("Launch Sequence Email Templates", () => {
  it("should generate Release Day email with announcement structure", () => {
    const html = generateLaunchEmail1({ subscriberName: "Sarah", bookTitle: "The First Acquisition" });
    expect(html).toContain("Dear Sarah");
    expect(html).toContain("finally live");
    expect(html).toContain("The First Acquisition");
    expect(html).toContain("A Hudson Dynasty Novel");
    expect(html).toContain("Get It Now on Kindle");
    expect(html).toContain("https://swiy.co/05");
    expect(html).toContain("Romance Author");
    expect(html).toContain("{$unsubscribe}");
  });

  it("should generate Release Day email with default greeting and book", () => {
    const html = generateLaunchEmail1();
    expect(html).toContain("Dear Reader");
    expect(html).not.toContain("Dear undefined");
    expect(html).toContain("The First Acquisition");
  });

  it("should support custom book links per release", () => {
    const html = generateLaunchEmail1({ bookTitle: "Hostile Tender", bookLink: "https://swiy.co/HD1" });
    expect(html).toContain("Hostile Tender");
    expect(html).toContain("https://swiy.co/HD1");
    expect(html).not.toContain("https://swiy.co/05");
  });

  it("should generate First Chapters email with early reader social proof", () => {
    const html = generateLaunchEmail2({ subscriberName: "Emily", bookTitle: "The First Acquisition" });
    expect(html).toContain("Dear Emily");
    expect(html).toContain("early readers");
    expect(html).toContain("3am");
    expect(html).toContain("Read The First Acquisition Now");
  });

  it("should generate Release Week Finale email with next-book tease", () => {
    const html = generateLaunchEmail3({ bookTitle: "The First Acquisition", nextBookTitle: "Hostile Tender" });
    expect(html).toContain("release week");
    expect(html).toContain("Hostile Tender");
    expect(html).toContain("Next in the Hudson Dynasty");
    expect(html).toContain("VIP list");
  });

  it("should have correct sequence metadata", () => {
    expect(launchSequence).toHaveLength(3);
    expect(launchSequence[0].delay).toContain("Day 0");
    expect(launchSequence[1].delay).toContain("Day 2");
    expect(launchSequence[2].delay).toContain("Day 5");
    expect(launchSequence[0].purpose).toContain("Announce");
    expect(launchSequence[1].purpose).toContain("Social proof");
    expect(launchSequence[2].purpose).toContain("Last-chance");
  });
});

describe("Series Upsell Sequence Email Templates", () => {
  it("should generate Binge Hook email pointing at the next book", () => {
    const html = generateSeriesUpsellEmail1({
      subscriberName: "Jordan",
      finishedTitle: "The First Acquisition",
      nextTitle: "Hostile Tender",
      nextBookLink: "https://swiy.co/HD1",
    });
    expect(html).toContain("Dear Jordan");
    expect(html).toContain("finished The First Acquisition");
    expect(html).toContain("Hudson Dynasty, Book 2");
    expect(html).toContain("Hostile Tender");
    expect(html).toContain("https://swiy.co/HD1");
    expect(html).toContain("Continue the Dynasty");
  });

  it("should generate Binge Hook email with defaults", () => {
    const html = generateSeriesUpsellEmail1();
    expect(html).toContain("Dear Reader");
    expect(html).toContain("The First Acquisition");
    expect(html).toContain("Hostile Tender");
  });

  it("should generate Consequences email with spoiler-free promise", () => {
    const html = generateSeriesUpsellEmail2({ finishedTitle: "The First Acquisition", nextTitle: "Hostile Tender" });
    expect(html).toContain("the aftermath");
    expect(html).toContain("One Promise, No Spoilers");
    expect(html).toContain("The character you thought you knew? You don't.");
    expect(html).toContain("Uncover the Truth");
  });

  it("should generate Full Collection email with Reader's Club upsell", () => {
    const html = generateSeriesUpsellEmail3({ subscriberName: "Alex" });
    expect(html).toContain("Dear Alex");
    expect(html).toContain("Complete Collection");
    expect(html).toContain("Browse the Full Collection");
    expect(html).toContain("Reader's Club");
    expect(html).toContain("/books");
  });

  it("should have correct sequence metadata", () => {
    expect(seriesUpsellSequence).toHaveLength(3);
    expect(seriesUpsellSequence[0].delay).toContain("Day 0");
    expect(seriesUpsellSequence[1].delay).toContain("Day 3");
    expect(seriesUpsellSequence[2].delay).toContain("Day 7");
    expect(seriesUpsellSequence[0].purpose).toContain("next-book");
    expect(seriesUpsellSequence[1].purpose).toContain("spoiler-free");
    expect(seriesUpsellSequence[2].purpose).toContain("complete collection");
  });

  it("should never leak undefined names into HTML", () => {
    const emails = [
      generateLaunchEmail1(),
      generateLaunchEmail2(),
      generateLaunchEmail3(),
      generateSeriesUpsellEmail1(),
      generateSeriesUpsellEmail2(),
      generateSeriesUpsellEmail3(),
    ];
    for (const html of emails) {
      expect(html).not.toContain("undefined");
    }
  });
});