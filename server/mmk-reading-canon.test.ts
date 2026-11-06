import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BOOKS } from "../client/src/data/books";

/**
 * Canon copy on the Manhattan Money Kings reading pages, checked against the
 * live US Kindle listings on 11/06/2026. Chips that match those listings stay.
 * Offers, prices, and retailer links stay.
 */
const ROOT = process.cwd();
const read = (rel: string) => readFileSync(path.join(ROOT, rel), "utf8");

const SERIES = read("client/public/read/manhattan-money-kings/index.html");
const ONE_NIGHT = read("client/public/read/the-billionaires-one-night-stand/index.html");
const ASSISTANT = read("client/public/read/the-billionaires-executive-assistant/index.html");
const FAKE_WIFE = read("client/public/read/the-billionaires-fake-wife/index.html");
const BABY_SECRET = read("client/public/read/the-billionaires-baby-secret/index.html");
const NANNY = read("client/public/read/the-billionaires-forbidden-nanny/index.html");
const HUDSON = read("client/public/read/hudson-dynasty/index.html");

const WEEKEND_HOOK = "One weekend. Her terms. On Monday, he owns her firm.";
const MARRIAGE_HOOK = "She broke into the wrong penthouse. Now the man she robbed wants to marry her.";
const DAUGHTER_HOOK =
  "Almost four years ago, she called him eleven times. Now he&#x27;s back, and her daughter has his eyes.";

const STALE_HOOKS = [
  "One night, no strings. Then Monday, and he owns her firm.",
  "She broke into the wrong penthouse. He left the door open on purpose.",
  "He missed three years.",
];

function card(html: string, href: string): string {
  const marker = `<a href="${href}">`;
  const start = html.indexOf(`<article class="card">${marker}`);
  const end = html.indexOf("</article>", start);
  if (start < 0 || end < start) throw new Error(`card not found: ${href}`);
  return html.slice(start, end);
}

describe("Manhattan Money Kings series landing", () => {
  const ons = card(SERIES, "/read/the-billionaires-one-night-stand");
  const assistant = card(SERIES, "/read/the-billionaires-executive-assistant");
  const fakeWife = card(SERIES, "/read/the-billionaires-fake-wife");
  const baby = card(SERIES, "/read/the-billionaires-baby-secret");
  const nanny = card(SERIES, "/read/the-billionaires-forbidden-nanny");

  it("uses the published hooks for the three corrected cards", () => {
    expect(ons).toContain(`<p>${WEEKEND_HOOK}</p>`);
    expect(fakeWife).toContain(`<p>${MARRIAGE_HOOK}</p>`);
    expect(baby).toContain(`<p>${DAUGHTER_HOOK}</p>`);
    for (const stale of STALE_HOOKS) expect(SERIES).not.toContain(stale);
  });

  it("keeps tropes the Kindle listings confirm, including the child references that are canon", () => {
    expect(ons).toContain("<li>One night stand</li>");
    expect(ons).toContain("<li>Boss romance</li>");
    expect(ons).toContain("<li>Enemies to lovers</li>");
    expect(assistant).toContain("<li>Boss and assistant</li>");
    expect(fakeWife).toContain("<li>Fake marriage</li>");
    expect(fakeWife).toContain("<li>Pregnant heroine</li>");
    expect(fakeWife).toContain("<li>Protective hero</li>");
    expect(baby).toContain("<li>Secret baby</li>");
    expect(baby).toContain("<li>Second chance</li>");
    expect(baby).toContain("<li>Single mom</li>");
    expect(nanny).toContain("Seven nannies quit. His silent daughter chose the eighth.");
    expect(nanny).toContain("<li>Forbidden</li>");
    expect(nanny).toContain("<li>Single dad</li>");
    expect(nanny).toContain("<li>Nanny romance</li>");
    expect(assistant).toContain("She needs this job. She cannot need him.");
  });

  it("keeps the series offers, BookFunnel URL, newsletter URL, and tagged Kindle links", () => {
    expect(SERIES).toContain('href="https://dl.bookfunnel.com/xrodg0t77p"');
    expect(SERIES).toContain('href="https://reeseastor.com/newsletter"');
    for (const asin of ["B0DSG7NKGP", "B0F2W8QL7S", "B0FCCBNF8X", "B0G12LBZ24", "B0GDZ4T164"]) {
      expect(SERIES).toContain(`https://www.amazon.com/dp/${asin}?tag=reeseastor-20`);
    }
    expect(SERIES).toContain("Read free with Kindle+ (formerly Kindle Unlimited).");
    expect(SERIES).toContain("checked 10/23/2026");
    expect(SERIES).toContain("Get The First Acquisition free");
  });
});

describe("reading pages for the corrected books", () => {
  it("repeats the published hooks and drops the stale lines", () => {
    for (const page of [ONE_NIGHT]) {
      expect(page).toContain(WEEKEND_HOOK);
      expect(page).toContain("So she takes one weekend for herself");
      expect(page).toContain("She sets the terms for one weekend.");
      expect(page).toContain("<h3>One night stand</h3>");
      expect(page).toContain("One night stand, boss romance and enemies to lovers");
    }
    for (const page of [FAKE_WIFE, ASSISTANT]) {
      expect(page).toContain(MARRIAGE_HOOK);
    }
    for (const page of [BABY_SECRET, FAKE_WIFE]) {
      expect(page).toContain(DAUGHTER_HOOK);
    }
    for (const page of [ONE_NIGHT, ASSISTANT, FAKE_WIFE, BABY_SECRET, NANNY]) {
      for (const stale of STALE_HOOKS) expect(page).not.toContain(stale);
    }
  });

  it("describes Executive Assistant as open-door, matching the Kindle listing", () => {
    expect(ASSISTANT).toContain("Explicit, open-door heat for readers 18 and over");
    expect(ASSISTANT).toContain("guaranteed, open door, 18+");
    expect(ASSISTANT).toContain("Explicit, open-door scenes. It is written for readers 18 and over.");
    expect(ASSISTANT).not.toContain("Closed-door heat");
    expect(ASSISTANT).not.toContain("fade to black");
    expect(ASSISTANT).not.toContain("bedroom door stays shut");
    expect(ASSISTANT).not.toContain("closed bedroom door");
    expect(ASSISTANT).toContain("Late nights, closed doors and a line neither should cross.");
    expect(ASSISTANT).toContain("https://www.amazon.com/dp/B0F2W8QL7S?tag=reeseastor-20");
    expect(ASSISTANT).toContain("checked 10/23/2026");
  });

  it("keeps Fake Wife's pregnancy wording and Forbidden Nanny's daughter wording", () => {
    expect(FAKE_WIFE).toContain("Pregnant and Protected");
    expect(FAKE_WIFE).toContain("<h3>Pregnant heroine</h3>");
    expect(FAKE_WIFE).toContain("https://www.amazon.com/dp/B0FCCBNF8X?tag=reeseastor-20");
    expect(FAKE_WIFE).toContain("https://www.amazon.com/dp/B0FD33W6H6?tag=reeseastor-20");
    expect(NANNY).toContain("His silent daughter chose the eighth.");
    expect(NANNY).toContain("his silent little girl");
    expect(NANNY).toContain("https://www.amazon.com/dp/B0GDZ4T164?tag=reeseastor-20");
  });

  it("leaves the Baby Secret chapter opening and the prequel offer links in place", () => {
    expect(BABY_SECRET).toContain("back from three years in London");
    expect(BABY_SECRET).toContain("https://www.amazon.com/dp/B0G12LBZ24?tag=reeseastor-20");
    expect(ONE_NIGHT).toContain('href="https://dl.bookfunnel.com/xrodg0t77p"');
    expect(ONE_NIGHT).toContain("https://www.amazon.com/dp/B0DSG7NKGP?tag=reeseastor-20");
  });
});

describe("catalog blurbs for the same two books", () => {
  it("matches the published Baby Secret timing and keeps the daughter", () => {
    const book = BOOKS.find((entry) => entry.slug === "the-billionaire-s-baby-secret");
    expect(book?.tagline).toBe(
      "Almost four years ago, she called him eleven times. Now he's back, and her daughter has his eyes.",
    );
    expect(book?.blurb).toContain("one snowbound weekend in Chicago");
    expect(book?.blurb).toContain("a little girl with his storm-gray eyes");
    expect(book?.blurb).not.toContain("Three years ago");
    expect(book?.blurb).not.toContain("walked away from a hotel room");
    expect(book?.tropes).toEqual(["secret baby", "second chance", "workplace romance"]);
    expect(book?.price_usd).toBe(3.99);
    expect(book?.retailers.amazon_kindle).toBe("https://www.amazon.com/dp/B0G12LBZ24");
  });

  it("says the One Night Stand arrangement was one weekend and keeps the title trope", () => {
    const book = BOOKS.find((entry) => entry.slug === "the-billionaires-one-night-stand");
    expect(book?.blurb).toContain("One weekend was the plan.");
    expect(book?.blurb).not.toContain("One night was the plan.");
    expect(book?.tropes).toContain("one night stand");
    expect(book?.price_usd).toBe(0.99);
    expect(book?.retailers.bookfunnel).toBe("https://dl.bookfunnel.com/xrodg0t77p");
  });
});

describe("Hudson Dynasty Poison Pill card", () => {
  const poison = card(HUDSON, "/read/poison-pill");

  it("does not send readers to the Money Kings prequel", () => {
    expect(poison).toContain("<p>Her poison pill stopped his takeover. Nothing stopped what came next.</p>");
    expect(poison).not.toContain("One Night Stand");
    expect(poison).not.toContain("one-night-stand");
    expect(poison).not.toContain("xrodg0t77p");
    expect(poison).not.toContain("Manhattan Money Kings");
    expect(poison).toContain("https://www.amazon.com/dp/B0H53BP5S1?tag=reeseastor-20");
    expect(poison).toContain("Read free with Kindle+ (formerly Kindle Unlimited).");
  });

  it("leaves the other Hudson card blurbs and the First Acquisition offer alone", () => {
    expect(HUDSON).toContain("One anonymous night. One Bronx building. Neither of them can afford to lose.");
    expect(HUDSON).toContain("billion dollars of bad debt");
    expect(HUDSON).toContain('href="https://reeseastor.com/newsletter"');
    expect(HUDSON).toContain("https://www.amazon.com/dp/B0D82GWFD9?tag=reeseastor-20");
    expect(HUDSON).toContain("https://www.amazon.com/dp/B0H1F9PV97?tag=reeseastor-20");
    expect(HUDSON).toContain("https://www.amazon.com/dp/B0HDKNP9F6?tag=reeseastor-20");
  });
});
