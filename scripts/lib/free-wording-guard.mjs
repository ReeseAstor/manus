/**
 * QA rule (2026-10-30): a bare "free" fails. The First Acquisition, The Billionaire's One Night Stand
 * and the Beneath His Shadow prequel The Photograph He Kept are free only through the newsletter
 * (they cost $0.99 in stores), so every "free" near one of them, or near "prequel" / "free book",
 * must say "newsletter" in the same sentence. Used by scripts/prerender-static.mjs (fails the build)
 * and server/free-wording.test.ts (sources, /read pages and prerendered pages).
 */

/** Titles and phrases that tie a nearby "free" to the newsletter offer. */
export const OFFER_TITLES = [
  /the\s+first\s+acquisition/i,
  /one\s+night\s+stand/i,
  /the\s+photograph\s+he\s+kept/i,
  /\bprequel/i,
  /\bfree[\s-]+(?:book|copy|ebook|e-book|novella|romance|starter|gift|download|read)/i,
];

/** Uses of "free" that are not about the offer (removed before scanning). */
const EXEMPT = [
  /Read free with Kindle\+ \(formerly Kindle Unlimited\)\.?/g, // approved KU line, other titles only
  /\bfree Kindle app\b/gi,
  /\bfree advance copies\b/gi,
  /\b(?:glare|royalty|spam|gluten|toll|duty|cruelty|hands|risk|worry|stress|guilt)-free\b/gi,
  /\bfeel free\b/gi,
  /[\/#]free-books?\b|\bfree-books\b|\bid=["']free-books?["']/g, // the /free-book route and #free-books anchor
];

const WINDOW = 200;
const BLOCK_TAGS = "p|h[1-6]|li|ul|ol|div|button|Button|label|section|article|nav|header|footer|summary|details|td|th|tr|title|option|dt|dd|figcaption|blockquote|br";

function decode(t) {
  return t
    .replace(/&nbsp;?/gi, " ").replace(/&amp;/gi, "&").replace(/&rsquo;|&#8217;/gi, "\u2019").replace(/&lsquo;|&#8216;/gi, "\u2018")
    .replace(/&quot;|&#34;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&mdash;/gi, "\u2014").replace(/&ndash;/gi, "\u2013")
    .replace(/&middot;/gi, "\u00B7").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">");
}

/** Reader text of an HTML page or a TSX/TS source, with sentence/element boundaries marked as "\n". */
export function readerText(src, { kind = "html" } = {}) {
  let t = src.replace(/<!--[\s\S]*?-->/g, " ");
  const attrs = [];
  for (const m of t.matchAll(/\b(?:content|alt|title|aria-label|placeholder)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) attrs.push(m[1] ?? m[2]);
  t = t.replace(/<script\b(?![^>]*ld\+json)[^>]*>[\s\S]*?<\/script>/gi, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
  if (kind === "source") {
    t = t.replace(/\/\*[\s\S]*?\*\//g, "\n").replace(/(^|[^:])\/\/[^\n]*/g, "$1\n").replace(/\{\s*["'`]\s*["'`]\s*\}/g, " ");
    t = t.replace(/\s*\n\s*/g, " ").replace(/["`]|[{}]|\\n|[;,]\s*$/g, "\n");
  } else {
    t = t.replace(/\s*\n\s*/g, " ");
  }
  t = t.replace(new RegExp(`</?(?:${BLOCK_TAGS})\\b[^>]*>`, "g"), "\n").replace(/<[^>]+>/g, " ");
  t = [t, ...attrs].join("\n");
  t = decode(t);
  for (const re of EXEMPT) t = t.replace(re, " ");
  return t.replace(/[ \t\u00A0]+/g, " ");
}

/** Bare "free" claims tied to the newsletter offer: [{ sentence, near }]. Empty when clean. */
export function bareFreeClaims(src, opts) {
  const t = readerText(src, opts);
  const out = [];
  for (const m of t.matchAll(/\bfree\b/gi)) {
    const i = m.index;
    // the sentence: from the previous boundary to the next one
    const start = Math.max(t.lastIndexOf("\n", i), ...[".", "!", "?"].map((p) => { const k = t.lastIndexOf(p + " ", i); return k < 0 ? -1 : k + 1; }));
    const ends = ["\n", ". ", "! ", "? "].map((p) => t.indexOf(p, i)).filter((k) => k >= 0);
    const end = ends.length ? Math.min(...ends) + 1 : t.length;
    const sentence = t.slice(start + 1, end).trim();
    if (/newsletter/i.test(sentence)) continue;
    const around = t.slice(Math.max(0, i - WINDOW), i + WINDOW);
    const near = OFFER_TITLES.find((re) => re.test(around));
    if (near) out.push({ sentence: sentence.slice(0, 160), near: String(near) });
  }
  return out;
}
