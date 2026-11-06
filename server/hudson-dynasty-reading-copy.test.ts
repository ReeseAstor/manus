import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Public reading-page copy for the Hudson Dynasty hook, the series-hero
 * newsletter condition, and the Kindle+ availability note.
 * Offers and links stay on the destinations already published in these files.
 */
const PUBLISHED_HOOK = "She was hired to audit him. The board wants her to wear his ring.";
const STALE_HOOK = "Three weeks. One ring. Zero feelings. That’s the deal.";
const REJECTED_HOOK = "She was hired to audit his empire. Falling for him could destroy them both.";
const DESC_SUFFIX = "A steamy fake engagement romance, Hudson Dynasty prequel.";
const BOOK_TITLE = "The First Acquisition: Fake Engagement Romance | Reese Astor";
const CHECKED = "11/05/2026";
const NOTE = `As of ${CHECKED}, 3 of the 4 books are included with Kindle+ (formerly Kindle Unlimited). The First Acquisition is not. Also on Kindle and in paperback.`;
const FAQ = `As of ${CHECKED}, 3 of the 4 books were included with Kindle+ (formerly Kindle Unlimited). The First Acquisition is not in Kindle+. It’s on Kindle, and it’s free when you join the newsletter.`;

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

const ALLOWED_FREE = "Read free with Kindle+ (formerly Kindle Unlimited).";
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const BLOCK_TAGS = new Set([
  "address", "article", "aside", "blockquote", "br", "button", "caption", "dd", "details", "div", "dl", "dt",
  "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr",
  "label", "li", "main", "nav", "ol", "p", "pre", "section", "summary", "table", "tbody", "td", "tfoot", "th",
  "thead", "title", "tr", "ul",
]);

function decode(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function splitSentences(text: string): string[] {
  return text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((sentence) => normalize(sentence).replace(/^["'\s]+|["'\s]+$/g, "").trim())
    .filter(Boolean);
}

function hasBtnClass(attrs: string): boolean {
  const match = attrs.match(/\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
  return (match?.[1] ?? match?.[2] ?? "").split(/\s+/).includes("btn");
}

function jsonLdStrings(html: string): string[] {
  const blocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) ?? [];
  const out: string[] = [];
  const walk = (node: unknown) => {
    if (typeof node === "string") out.push(node);
    else if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === "object") Object.values(node as Record<string, unknown>).forEach(walk);
  };
  for (const block of blocks) {
    walk(JSON.parse(block.replace(/^<script[^>]*>/i, "").replace(/<\/script>$/i, "")));
  }
  return out;
}

function metaContents(html: string): string[] {
  const out: string[] = [];
  for (const match of html.matchAll(/<meta\b([^>]*)>/gi)) {
    const content = match[1].match(/\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (content) out.push(decode(content[1] ?? content[2] ?? ""));
  }
  return out;
}

/** Sentence view: inline tags stay in the sentence; block elements and each .btn link are separate. */
function sentenceUnits(html: string): string[] {
  let text = "";
  const separateStack: boolean[] = [];
  const re = /<!--[\s\S]*?-->|<\/([a-zA-Z0-9]+)\s*>|<([a-zA-Z0-9]+)([^>]*)>|([^<]+)/g;
  for (const match of html.matchAll(re)) {
    if (match[0].startsWith("<!--")) continue;
    if (match[4] != null) {
      text += decode(match[4]);
      continue;
    }
    if (match[1]) {
      if (separateStack.pop()) text += "\n";
      continue;
    }
    const tag = match[2].toLowerCase();
    const attrs = match[3] ?? "";
    const separate = hasBtnClass(attrs) || BLOCK_TAGS.has(tag);
    if (separate) text += "\n";
    const selfClosing = /\/\s*$/.test(attrs) || VOID_TAGS.has(tag);
    if (!selfClosing) separateStack.push(separate);
  }
  return splitSentences(text);
}

/** Element view: each button, heading, p, li, summary, label, span, and .btn link. */
function elementUnits(html: string): string[] {
  const units: string[] = [];
  const tagRe = /<(button|h[1-6]|p|li|summary|label|span)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  for (const match of html.matchAll(tagRe)) units.push(...splitSentences(decode(match[2].replace(/<[^>]+>/g, " "))));
  const btnRe = /<a\b[^>]*\bclass\s*=\s*"[^"]*\bbtn\b[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of html.matchAll(btnRe)) units.push(...splitSentences(decode(match[1].replace(/<[^>]+>/g, " "))));
  return units;
}

function bareUnits(input: string): string[] {
  const stripped = input.replace(/<script[\s\S]*?<\/script>/gi, "\n").replace(/<style[\s\S]*?<\/style>/gi, "\n");
  return [...sentenceUnits(stripped), ...elementUnits(stripped)];
}

/**
 * Subject-free free-offer guard. Any unit containing "free" must also contain
 * "join" and "newsletter", except the exact Kindle+ button sentence.
 * Checks sentences, block and button elements, meta content, and JSON-LD.
 */
function subjectFreeGaps(inputs: string[]): string[] {
  const seen = new Set<string>();
  const gaps: string[] = [];
  const consider = (unit: string) => {
    const text = normalize(unit);
    if (!text || text === ALLOWED_FREE || seen.has(text)) return;
    if (!/\bfree\b/i.test(text)) return;
    if (/\bjoin\b/i.test(text) && /\bnewsletter\b/i.test(text)) return;
    seen.add(text);
    gaps.push(text);
  };
  for (const input of inputs) {
    for (const content of metaContents(input)) for (const sentence of splitSentences(content)) consider(sentence);
    for (const value of jsonLdStrings(input)) for (const sentence of splitSentences(value)) consider(sentence);
    for (const unit of bareUnits(input)) consider(unit);
  }
  return gaps;
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

  it("states the Kindle+ split checked on 11/05/2026", () => {
    expect(NOTE).toBe(
      "As of 11/05/2026, 3 of the 4 books are included with Kindle+ (formerly Kindle Unlimited). The First Acquisition is not. Also on Kindle and in paperback.",
    );
    expect(FAQ).toBe(
      "As of 11/05/2026, 3 of the 4 books were included with Kindle+ (formerly Kindle Unlimited). The First Acquisition is not in Kindle+. It’s on Kindle, and it’s free when you join the newsletter.",
    );
    expect(NOTE).toContain(CHECKED);
    expect(FAQ).toContain(CHECKED);
    expect(html).toContain(`<p class="note">${NOTE}</p>`);
    expect(count(html, FAQ)).toBe(2);
    expect(count(html, "Are they in Kindle+?")).toBe(2);
    expect(html).not.toContain("Are they in Kindle Unlimited?");
    expect(html).not.toContain("Kindle Unlimited subscription");
    expect(html).not.toContain("free on BookFunnel");
    expect(html).not.toContain("11/06/2026");
    expect(html).not.toContain("10/23/2026");
    expect(NOTE).not.toMatch(/[\u2014\u2013]/);
    expect(FAQ).not.toMatch(/[\u2014\u2013]/);
    expect(html).toContain("Amazon, Kindle and Kindle Unlimited are trademarks of Amazon.com, Inc. or its affiliates.");
    const head = html.slice(0, html.indexOf("</head>"));
    const body = html.slice(html.indexOf("<body>"));
    expect(count(head, "Read free with Kindle+ (formerly Kindle Unlimited).")).toBe(3);
    expect(count(body, "Read free with Kindle+ (formerly Kindle Unlimited).")).toBe(3);
  });

  it("requires join and newsletter in every free unit except the Kindle+ button sentence", () => {
    const hero = html.match(/<p>Start with Book 1,[\s\S]*?<\/p>/)?.[0] ?? "";
    const plain = "The First Acquisition is free when you join the newsletter.";
    const markup = '<p><a href="/read/the-first-acquisition">The First Acquisition</a> is free when you join the newsletter.</p>';
    const jsonLd = '{"text":"The First Acquisition is free when you join the newsletter."}';
    expect(subjectFreeGaps([plain, markup, jsonLd, hero, FAQ, html, ...jsonLdStrings(html)])).toEqual([]);
    expect(subjectFreeGaps([ALLOWED_FREE, `<a class="btn kplus">${ALLOWED_FREE}</a>`])).toEqual([]);
    expect(subjectFreeGaps(["The First Acquisition is free on BookFunnel."])).toEqual([
      "The First Acquisition is free on BookFunnel.",
    ]);
    expect(subjectFreeGaps(["<p>The First Acquisition is free.</p>"])).toEqual(["The First Acquisition is free."]);
    expect(subjectFreeGaps(['{"text":"The First Acquisition is free on BookFunnel."}'])).toEqual([
      '{"text":"The First Acquisition is free on BookFunnel."}',
    ]);
    expect(subjectFreeGaps(["<h2>Get The First Acquisition free</h2><p>Join the newsletter.</p>"])).toEqual([
      "Get The First Acquisition free",
    ]);
    expect(subjectFreeGaps(["<a>Get the prequel free</a>"])).toEqual(["Get the prequel free"]);
    expect(subjectFreeGaps(["It’s free with the newsletter."])).toEqual(["It’s free with the newsletter."]);
    expect(subjectFreeGaps(["<a>The First Acquisition</a>, free."])).toEqual(["The First Acquisition, free."]);
    expect(subjectFreeGaps(["<a>The First Acquisition</a> free today"])).toEqual(["The First Acquisition free today"]);
    const adjacent = '<a class="btn" href="/free">Get it free</a><a class="btn" href="/newsletter">Join the newsletter</a>';
    expect(subjectFreeGaps([adjacent])).toEqual(["Get it free"]);
    expect(subjectFreeGaps([adjacent]).some((gap) => /get it free/i.test(gap) && /join the newsletter/i.test(gap))).toBe(false);
    const mutants: [string, string][] = [
      ["It’s free when you join.", "It’s free when you join."],
      ["Read free with Kindle+ (formerly Kindle Unlimited)", "Read free with Kindle+ (formerly Kindle Unlimited)"],
      ["Read free with Kindle+ (formerly Kindle Unlimited). Now it’s free.", "Now it’s free."],
      ['<meta name="description" content="Get it free.">', "Get it free."],
      ['<script type="application/ld+json">{"description":"It is free."}</script>', "It is free."],
      ["<span>It’s free.</span>", "It’s free."],
      ["<li>The prequel is free.</li>", "The prequel is free."],
      ['<p class="label">Free to read</p>', "Free to read"],
      ["<summary>Is it free?</summary>", "Is it free?"],
      ["<h1>Free book</h1><p>Join the newsletter for details.</p>", "Free book"],
      ['<button class="btn">Get it free</button><p>Join the newsletter.</p>', "Get it free"],
      ["<label>Download it free</label>", "Download it free"],
    ];
    for (const [input, flagged] of mutants) expect(subjectFreeGaps([input]), input).toEqual([flagged]);
    expect(html).not.toContain("Free to read");
    expect(html).toContain('<p class="label">Reader newsletter</p>');
    expect(html).toContain('<h2 id="su">Join the newsletter and get The First Acquisition free</h2>');
    expect(html).toContain(
      '<a class="btn ghost" href="https://reeseastor.com/newsletter" data-cta="newsletter">Join the newsletter for the free prequel</a>',
    );
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
    expect(html).toContain('data-cta="newsletter">Join the newsletter for the free prequel</a>');
    expect(html).toContain('data-cta="newsletter">Join and get the novella</a>');
  });
});
