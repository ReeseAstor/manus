import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Public reading-page copy for the Hudson Dynasty hook, the series-hero
 * newsletter condition, and the Kindle Unlimited availability note.
 * Offers and links stay on the destinations already published in these files.
 */
const PUBLISHED_HOOK = "She was hired to audit him. The board wants her to wear his ring.";
const STALE_HOOK = "Three weeks. One ring. Zero feelings. That’s the deal.";
const REJECTED_HOOK = "She was hired to audit his empire. Falling for him could destroy them both.";
const DESC_SUFFIX = "A steamy fake engagement romance, Hudson Dynasty prequel.";
const BOOK_TITLE = "The First Acquisition: Fake Engagement Romance | Reese Astor";
const CHECKED = "11/06/2026";

const BOOK = path.join(process.cwd(), "client/public/read/the-first-acquisition/index.html");
const SERIES = path.join(process.cwd(), "client/public/read/hudson-dynasty/index.html");

const OTHER_CARD_BLURBS = [
  "One anonymous night. One Bronx building. Neither of them can afford to lose.",
  "Her poison pill stopped his takeover. Nothing stopped what came next.",
  "He can restructure a billion dollars of bad debt. He can’t buy her.",
];

function meta(html: string, attr: "name" | "property", key: string): string {
  const match = html.match(new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`));
  if (!match) throw new Error(`missing meta ${attr}=${key}`);
  return match[1];
}

function count(html: string, needle: string): number {
  return html.split(needle).length - 1;
}

describe("The First Acquisition reading page", () => {
  const html = readFileSync(BOOK, "utf8");
  const description = `${PUBLISHED_HOOK} ${DESC_SUFFIX}`;

  it("keeps the title and puts the published hook in the social descriptions", () => {
    expect(html).toContain(`<title>${BOOK_TITLE}</title>`);
    expect(meta(html, "property", "og:title")).toBe(BOOK_TITLE);
    expect(meta(html, "name", "twitter:title")).toBe(BOOK_TITLE);
    expect(meta(html, "name", "description")).toBe(description);
    expect(meta(html, "property", "og:description")).toBe(description);
    expect(meta(html, "name", "twitter:description")).toBe(description);
    expect(html).not.toContain(STALE_HOOK);
    expect(html).not.toContain(REJECTED_HOOK);
    expect(description).not.toMatch(/[\u2014\u2013]/);
  });

  it("uses that hook in the tagline and the closing line", () => {
    expect(html).toContain(`<p class="tagline">${PUBLISHED_HOOK}</p>`);
    expect(html).toContain(`<h2 id="fn">Start The First Acquisition today</h2>\n<p>${PUBLISHED_HOOK}</p>`);
    expect(count(html, PUBLISHED_HOOK)).toBe(5);
  });

  it("keeps the story copy and the existing Kindle, BookFunnel, and newsletter destinations", () => {
    expect(html).toContain(
      "Forensic compliance attorney Arden Shaw has been hired to find out who is bleeding Hudson Vale Capital dry",
    );
    expect(count(html, 'href="https://www.amazon.com/dp/B0D82GWFD9?tag=reeseastor-20"')).toBe(5);
    expect(count(html, 'href="https://dl.bookfunnel.com/kw1yge3479"')).toBe(2);
    expect(count(html, 'href="https://www.amazon.com/dp/B0GWL7GC98?tag=reeseastor-20"')).toBe(1);
    expect(count(html, 'href="https://reeseastor.com/newsletter"')).toBe(1);
    expect(html).toContain('"url":"https://www.amazon.com/dp/B0D82GWFD9"');
    expect(html).toContain('"url":"https://www.amazon.com/dp/B0GWL7GC98"');
    expect(html).toContain('href="https://booksprout.co/reviewer/team/54354/reese-astor-arc-team"');
    expect(html).toContain("Read it free on BookFunnel");
    expect(html).toContain(">Get it on Kindle</a>");
  });
});

describe("Hudson Dynasty series page", () => {
  const html = readFileSync(SERIES, "utf8");

  it("says the prequel is free when the reader joins the newsletter, in the hero sentence", () => {
    const hero = html.match(/<p>Start with Book 1,[\s\S]*?<\/p>/);
    expect(hero?.[0]).toBe(
      '<p>Start with Book 1, <a href="/read/hostile-tender">Hostile Tender</a>, or try the prequel novella, <a href="/read/the-first-acquisition">The First Acquisition</a>, which is free when you join the newsletter.</p>',
    );
    expect(hero?.[0]).not.toMatch(/[\u2014\u2013]/);
    expect(html).toContain(
      "Join Reese Astor’s newsletter and get The First Acquisition, the Hudson Dynasty prequel novella, free.",
    );
    expect(count(html, 'href="https://reeseastor.com/newsletter"')).toBe(2);
    expect(html).not.toContain("dl.bookfunnel.com");
  });

  it("states the verified Kindle Unlimited split with today's check date", () => {
    const note =
      "3 of the 4 books are included with a Kindle Unlimited subscription (checked 11/06/2026). The First Acquisition is not in Kindle Unlimited. Also on Kindle and in paperback.";
    const faq =
      "3 of the 4 books were included with a Kindle Unlimited subscription when we checked on 11/06/2026. The First Acquisition is not in Kindle Unlimited; it’s on Kindle and free on BookFunnel.";
    expect(html).toContain(`<p class="note">${note}</p>`);
    expect(count(html, faq)).toBe(2);
    expect(html).toContain(CHECKED);
    expect(html).not.toContain("10/23/2026");
    expect(note).not.toMatch(/[\u2014\u2013]/);
    const head = html.slice(0, html.indexOf("</head>"));
    const body = html.slice(html.indexOf("<body>"));
    expect(count(head, "Read free with Kindle+ (formerly Kindle Unlimited).")).toBe(3);
    expect(count(body, "Read free with Kindle+ (formerly Kindle Unlimited).")).toBe(3);
  });

  it("uses the published prequel hook and leaves the other card blurbs and retailer links in place", () => {
    expect(html).toContain(
      `<h3><a href="/read/the-first-acquisition">The First Acquisition</a></h3><p>${PUBLISHED_HOOK}</p>`,
    );
    expect(html).not.toContain(STALE_HOOK);
    expect(html).not.toContain(REJECTED_HOOK);
    for (const blurb of OTHER_CARD_BLURBS) expect(html).toContain(`<p>${blurb}</p>`);
    expect(count(html, 'href="https://www.amazon.com/dp/B0H1F9PV97?tag=reeseastor-20"')).toBe(3);
    expect(count(html, 'href="https://www.amazon.com/dp/B0D82GWFD9?tag=reeseastor-20"')).toBe(1);
    expect(count(html, 'href="https://www.amazon.com/dp/B0H53BP5S1?tag=reeseastor-20"')).toBe(1);
    expect(count(html, 'href="https://www.amazon.com/dp/B0HDKNP9F6?tag=reeseastor-20"')).toBe(1);
    expect(html).toContain('data-cta="amazon-ku-entry">Start Book 1</a>');
    expect(html).toContain('data-cta="newsletter">Get the prequel free</a>');
    expect(html).toContain('data-cta="newsletter">Join and get the novella</a>');
  });
});
