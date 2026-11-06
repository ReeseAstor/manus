import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Copy guard for /read/the-first-acquisition only.
 * The series page, the book hook, and the offer URLs are outside this edit.
 */
const PAGE = path.join(process.cwd(), "client/public/read/the-first-acquisition/index.html");

const CHECKED = "11/05/2026";
const BUTTON = "Join the newsletter to get the free download link by email.";
const KINDLE_PLUS = `As of ${CHECKED}, it is not in Kindle+ (formerly Kindle Unlimited). It is free when you join the newsletter, and the download link is sent by email. It is also sold on Kindle.`;
const START = "With Book 1, Hostile Tender, or with the prequel novella, The First Acquisition, which is free when you join the newsletter. The download link is sent by email.";
const FREE_BOOK = "Yes. Join Reese Astor\u2019s newsletter and The First Acquisition, the Hudson Dynasty prequel novella, is free. The download link is sent by email. You can unsubscribe anytime.";
const DEAL = "Three weeks. One ring. Zero feelings. That\u2019s the deal.";
const TRADEMARK = "Amazon, Kindle and Kindle Unlimited are trademarks of Amazon.com, Inc. or its affiliates.";

const STALE = [
  "Read it free",
  "Get it free",
  "free on BookFunnel",
  "Free to read",
  "Free ebook",
  "open the BookFunnel",
  "BookFunnel may ask",
  "on BookFunnel",
  "yours free",
  "newsletter subscribers get free",
  "Is it in Kindle Unlimited?",
  "Not at the moment",
  "instant",
];

function count(html: string, needle: string): number {
  return html.split(needle).length - 1;
}

function jsonLdStrings(html: string): string[] {
  const blocks = [...html.matchAll(/<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const out: string[] = [];
  const walk = (node: unknown) => {
    if (typeof node === "string") out.push(node);
    else if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === "object") Object.values(node).forEach(walk);
  };
  for (const block of blocks) {
    walk(JSON.parse(block));
  }
  return out;
}

/** Tags become line breaks, so a heading is not merged into the next paragraph. */
export function sentencesIn(html: string): string[] {
  const extra = jsonLdStrings(html);
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "\n")
    .replace(/<style[\s\S]*?<\/style>/gi, "\n")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"');
  return [text, ...extra].flatMap((chunk) =>
    chunk
      .split(/\n+|(?<=[.!?])\s+/)
      .map((sentence) => sentence.replace(/\s+/g, " ").trim())
      .filter(Boolean),
  );
}

function elementTexts(html: string, re: RegExp): string[] {
  return [...html.matchAll(re)].map((match) => match[0].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

/** Reader-visible or snippet text carried in attributes: alt, aria-label, title, and description/title meta content. URLs are ignored. */
export function attributeTexts(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(/\s(?:alt|aria-label|title)\s*=\s*(["'])([\s\S]*?)\1/gi)) out.push(m[2]);
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (!/(?:name|property)\s*=\s*["'](?:description|og:description|twitter:description|og:title|twitter:title)["']/i.test(tag)) continue;
    const c = tag.match(/\bcontent\s*=\s*(["'])([\s\S]*?)\1/i);
    if (c) out.push(c[2]);
  }
  return out.map((t) => t.replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()).filter(Boolean);
}

function claimUnits(html: string): string[] {
  const stats = html.match(/<section class="stats"[\s\S]*?<\/section>/gi) ?? [];
  return [
    ...elementTexts(html, /<h[1-3]\b[^>]*>[\s\S]*?<\/h[1-3]>/gi),
    ...elementTexts(html, /<p class="label">[\s\S]*?<\/p>/gi),
    ...elementTexts(html, /<a\b[^>]*class="[^"]*\bbtn\b[^"]*"[^>]*>[\s\S]*?<\/a>/gi),
    ...stats.flatMap((block) => elementTexts(block, /<(?:b|span)>[\s\S]*?<\/(?:b|span)>/gi)),
  ];
}

function isQuestion(text: string): boolean {
  return /^(?:is|are|do|does|did|where|how|what|when|why|can|will)\b/i.test(text) && text.endsWith("?");
}

/** Book-offer "free" after the Kindle app and the separate ARC sentence are set aside. */
function bookFreeWord(text: string): boolean {
  if (isQuestion(text)) return false;
  const rest = text.replace(/free Kindle app/gi, "").replace(/free advance copies/gi, "");
  return /\bfree\b/i.test(rest);
}

function hasJoinNewsletter(text: string): boolean {
  return /\bjoin\b/i.test(text) && /\bnewsletter\b/i.test(text);
}

/** Headings, buttons, stat cells, and sentences, each judged on its own. */
export function bareFreeClaims(html: string): string[] {
  const attrs = attributeTexts(html);
  const attrSentences = attrs.flatMap((t) => t.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean));
  const units = [...claimUnits(html), ...sentencesIn(html), ...attrs, ...attrSentences];
  return units.filter((unit) => bookFreeWord(unit) && !hasJoinNewsletter(unit));
}

/** Receiving language has to say the download link is emailed, and must not say instant. */
export function deliveryProblems(html: string): string[] {
  return sentencesIn(html).filter((sentence) => {
    const receiving = /download|read it free|get it free|get the free|yours free|open the bookfunnel|bookfunnel copy/i.test(sentence);
    if (!receiving) return false;
    if (/\b(?:instant|instantly|immediately|right away|in seconds)\b/i.test(sentence)) return true;
    return !/(?:by email|sent by email|emailed)/i.test(sentence);
  });
}

describe("The First Acquisition offer copy", () => {
  const html = readFileSync(PAGE, "utf8");

  it("puts join and newsletter on every free claim, including headings and buttons alone", () => {
    expect(bareFreeClaims(html)).toEqual([]);
    expect(bareFreeClaims("<h3>Free ebook</h3><p>It is free when you join the newsletter.</p>")).toContain("Free ebook");
    expect(bareFreeClaims('<p>It is free when you join the newsletter. The download link is sent by email.</p><a class="btn">Get it free</a>')).toContain("Get it free");
    expect(bareFreeClaims('<section class="stats"><b>Free</b><span>when you join the newsletter, download link by email</span></section>')).toContain("Free");
    expect(bareFreeClaims("<h2>Get The First Acquisition free</h2><p>Join the newsletter.</p>")).toContain("Get The First Acquisition free");
    expect(bareFreeClaims("<h3>Free when you join the newsletter</h3>")).toEqual([]);
    expect(bareFreeClaims("<p>Read on any Kindle or in the free Kindle app.</p>")).toEqual([]);
    expect(bareFreeClaims("<p>The Reese Astor ARC Team sends free advance copies to readers who leave an honest review.</p>")).toEqual([]);
    expect(bareFreeClaims("<summary>Is there a free book?</summary>")).toEqual([]);
    expect(bareFreeClaims('<img src="c.jpg" alt="Get The First Acquisition free">')).toContain("Get The First Acquisition free");
    expect(bareFreeClaims('<a class="btn" href="x" aria-label="Read it free">Join the newsletter to get the free download link by email.</a>')).toContain("Read it free");
    expect(bareFreeClaims('<meta name="description" content="Read The First Acquisition free.">')).toContain("Read The First Acquisition free.");
    expect(bareFreeClaims('<meta property="og:description" content="Free ebook.">')).toContain("Free ebook.");
    expect(bareFreeClaims('<script type="application/ld+json" id="faq" data-rh="true">{"text":"Read it free."}</script>')).toContain("Read it free.");
    expect(bareFreeClaims("<script type='application/ld+json'>{\"text\":\"Read it free.\"}</script>")).toContain("Read it free.");
    expect(bareFreeClaims('<p>Claim <a href="x">The First Acquisition</a> <a href="y">today free.</a></p>')).toContain("today free.");
    expect(bareFreeClaims('<img src="https://cdn.example/free-book.jpg" alt="Free when you join the newsletter.">')).toEqual([]);
    expect(bareFreeClaims('<a href="https://example.com/get-it-free" aria-label="Cover of The First Acquisition">Read</a>')).toEqual([]);
    expect(html).toContain(`<h3>Free when you join the newsletter</h3>`);
    expect(html).toContain(`<b>Free when you join the newsletter</b><span>download link by email</span>`);
    expect(html).toContain('<p class="label">Reader newsletter</p>');
    expect(count(html, BUTTON)).toBe(2);
    expect(html).toContain(
      `<a class="btn ghost" href="https://dl.bookfunnel.com/kw1yge3479" data-cta="bookfunnel-hd">${BUTTON}</a>`,
    );
    expect(html).toContain(
      `<a class="btn primary" href="https://dl.bookfunnel.com/kw1yge3479" data-cta="bookfunnel-hd-format">${BUTTON}</a>`,
    );
    for (const stale of STALE) expect(html, stale).not.toContain(stale);
    expect(html).not.toMatch(/[\u2014\u2013]/);
  });

  it("says the download link is emailed and does not promise an instant download", () => {
    expect(deliveryProblems(html)).toEqual([]);
    expect(deliveryProblems("<p>Open the BookFunnel copy on any device.</p>")).toEqual([
      "Open the BookFunnel copy on any device.",
    ]);
    expect(deliveryProblems("<p>Read it free from BookFunnel.</p>")).toEqual(["Read it free from BookFunnel."]);
    expect(deliveryProblems("<p>The download is instant.</p>")).toEqual(["The download is instant."]);
    expect(deliveryProblems("<p>The download link arrives immediately by email.</p>")).toEqual(["The download link arrives immediately by email."]);
    expect(deliveryProblems("<p>The download link is sent by email after you join the newsletter.</p>")).toEqual([]);
    expect(html).toContain("<p>The download link is sent by email after you join the newsletter.</p>");
    expect(html).toContain("The download link for the free ebook is sent by email after you join the newsletter.");
    expect(html).toContain("Read the Kindle edition on a Kindle or in the free Kindle app, or read the paperback.");
    expect(html).toContain("Pick a format above: the ebook that is free when you join the newsletter, Kindle, or paperback.");
    expect(count(html, "The download link is sent by email.")).toBe(4);
  });

  it("uses the 11/05/2026 Kindle+ wording and leaves the trademark line", () => {
    expect(KINDLE_PLUS).toContain(CHECKED);
    expect(KINDLE_PLUS).not.toContain("11/06/2026");
    expect(count(html, "Is it in Kindle+?")).toBe(2);
    expect(count(html, KINDLE_PLUS)).toBe(2);
    expect(count(html, START)).toBe(2);
    expect(count(html, FREE_BOOK)).toBe(2);
    expect(count(html, "formerly Kindle Unlimited")).toBe(2);
    expect(count(html, "Kindle Unlimited")).toBe(3);
    expect(count(html, TRADEMARK)).toBe(1);
    expect(html).not.toContain("Read free with Kindle+");
    expect(html).not.toContain("Kindle Unlimited subscription");
    expect(html).toContain("It is also sold on Kindle.");
    expect(html).toContain("Amazon sets the price shown on each listing, so check there for today\u2019s price.");
  });

  it("keeps the BookFunnel, Kindle, paperback, and newsletter destinations", () => {
    expect(count(html, 'href="https://dl.bookfunnel.com/kw1yge3479"')).toBe(2);
    expect(count(html, 'href="https://www.amazon.com/dp/B0D82GWFD9?tag=reeseastor-20"')).toBe(5);
    expect(count(html, 'href="https://www.amazon.com/dp/B0GWL7GC98?tag=reeseastor-20"')).toBe(1);
    expect(count(html, 'href="https://reeseastor.com/newsletter"')).toBe(1);
    expect(html).toContain('"url":"https://www.amazon.com/dp/B0D82GWFD9"');
    expect(html).toContain('"url":"https://www.amazon.com/dp/B0GWL7GC98"');
    expect(html).toContain('href="https://booksprout.co/reviewer/team/54354/reese-astor-arc-team"');
    expect(html).toContain('href="https://www.amazon.com/review/create-review?asin=B0D82GWFD9"');
    expect(html).toContain('href="https://reeseastor.com/privacy"');
    for (const cta of [
      "amazon-kindle",
      "bookfunnel-hd",
      "amazon-kindle-excerpt",
      "arc-team",
      "review",
      "newsletter",
      "bookfunnel-hd-format",
      "amazon-kindle-format",
      "amazon-paperback-format",
      "next-read",
      "amazon-kindle-final",
    ]) {
      expect(html).toContain(`data-cta="${cta}"`);
    }
    expect(html).toContain('<a class="btn primary" href="https://reeseastor.com/newsletter" data-cta="newsletter">Join the newsletter</a>');
    expect(html).toContain("The Reese Astor ARC Team sends free advance copies to readers who leave an honest review.");
  });

  it("leaves the book hook and the story in place", () => {
    expect(count(html, DEAL)).toBe(5);
    expect(html).toContain(`<p class="tagline">${DEAL}</p>`);
    expect(html).toContain(`<meta name="description" content="${DEAL} A steamy fake engagement romance, Hudson Dynasty prequel.">`);
    expect(html).toContain(`<h1>The First Acquisition</h1>`);
    expect(html).toContain(
      "Forensic compliance attorney Arden Shaw has been hired to find out who is bleeding Hudson Vale Capital dry",
    );
    expect(html).toContain("<p>The boardroom smelled like flop sweat and dying careers.</p>");
    expect(html).not.toContain("She was hired to audit him. The board wants her to wear his ring.");
  });
});
