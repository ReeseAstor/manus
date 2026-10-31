/**
 * QA rule (2026-10-30, ruling c of the v3 card): The First Acquisition, The Billionaire's One Night
 * Stand and the Beneath His Shadow prequel The Photograph He Kept cost $0.99 in stores and are free
 * only when a reader joins the newsletter. So, on every page and source string:
 * - every "free" (or "freebie") passes only if its own sentence or UI element has a form of "join"
 *   AND "newsletter" ("Free prequel when you join my newsletter."). There is no title requirement
 *   for a pass, and no title is needed to fail: a CTA like "Start reading free" fails on its own;
 * - "free with (my/the/her) newsletter", "Free with newsletter", "newsletter subscribers get (it)
 *   free" and "Free Prequel" in a <title>, og:title, twitter:title or page title always fail;
 * - synonyms ("complimentary", "no cost", "at no charge", "$0") within 200 characters of an offer
 *   title or "prequel" follow the same join + newsletter rule;
 * - text is normalised the same way as the books fallback guard: comments and tags removed (so
 *   fr<b>ee</b> is read as "free"), the full HTML5 entity table decoded, soft hyphens and zero-width
 *   characters dropped, NFKC (fullwidth, math letters) and lookalike letters folded; data-*
 *   attributes, meta content, alt/title/aria-label and JSON-LD are read too;
 * - the approved Kindle+ line and Reader's Club "Join for free" / "No Cost to Join" are exempt only
 *   when no offer title is in the same section (they may never stand next to a prequel);
 * - non-prequel offers (ruling c) are listed by name: the free quiz, the steamy scene checklist and
 *   "Free Bonus Content" content upgrades, the "Free" membership tier label.
 * Used by scripts/prerender-static.mjs (fails the build) and server/free-wording.test.ts.
 */
import { normalizeForScan } from "./book-fallback-guard.mjs";

/** Titles and phrases that tie a nearby "free" (or synonym) to the newsletter offer. */
export const OFFER_TITLES = [
  /the\s+first\s+acquisition/i,
  /one\s+night\s+stand/i,
  /the\s+photograph\s+he\s+kept/i,
  /\bprequel/i,
  /\bfree[\s-]+(?:book|copy|ebook|e-book|novella|romance|starter|gift|download|read)/i,
];

const WINDOW = 200;

/** Non-offer uses of "free", removed everywhere (also next to a title). */
const EXEMPT_ALWAYS = [
  /\bfree Kindle (?:app|reading app)s?\b/gi,
  /\bfree advance (?:reader )?copies\b/gi,
  /\b(?:glare|royalty|spam|gluten|toll|duty|cruelty|hands|risk|worry|stress|guilt|ad|clutter|scent|fragrance|BPA|lint|tangle|smudge|sugar|fee|interest|hassle|stain|wrinkle|lag|eye[\s-]?strain)-free\b/gi,
  /\bfeel free(?! *[,.:;!?-]* *it'?s free)\b/gi,
  /[\/#]free-books?\b|\bfree-books?\b|\bid=["']free-books?["']/gi, // the /free-book route and #free-books anchor
  // Non-prequel offers, outside the rule per QA ruling (c): the quiz and the blog content upgrades.
  /\b(?:take (?:my|this) )?free (?:\d+-question )?(?:romance |book boyfriend )?quiz\b/gi,
  /\bFree: My 10-Point Steamy Scene Checklist\b/g,
  /\bFree Bonus Content\b/g,
  // "free of" = rid of ("almost free of a toxic marriage"), not a price; "free of charge/cost" still counts.
  /\bfree of\b(?! *(?:charge|cost))/gi,
  // Software pricing tiers (e.g. a newsletter tool's free tier), not a book offer.
  /\bfree (?:tier|plan|trial|version|account)s?\b/gi,
  // Reader's Club badge: membership costs nothing (ruling c), it is not a book offer.
  /\bNo Cost to Join\b/gi,
];
/** Exempt only when no offer title is within WINDOW characters (QA v3: never next to a prequel). */
const EXEMPT_AWAY_FROM_OFFER = [
  /Read free with Kindle\+ \(formerly Kindle Unlimited\)\.?/g, // approved KU line, KU titles only
  // Reader's Club membership (ruling c: outside the rule), never next to a prequel.
  /\bjoin(?:s|ed|ing)? (?:the club |the Reader'?s Club |Reader'?s Club )?(?:\()?(?:for )?free\b\)?|\bfree to join\b|\bfree (?:club )?membership\b/gi,
];

const HARD_FAIL = [
  [/\bfree\s+with\s+(?:my\s+|the\s+|her\s+|our\s+|reese\s+astor'?s\s+)?newsletter\b/gi, '"free with … newsletter" (does not say join)'],
  [/\bnewsletter\s+subscribers\s+get\s+(?:it\s+|them\s+|this\s+)?free\b/gi, '"newsletter subscribers get free" (does not say join)'],
  [/\bfree\b[^\n.!?]{0,40}\bno\s+newsletter\b|\bno\s+newsletter\s+(?:required|needed|necessary)\b/gi, "'free' with the newsletter negated"],
];
const FREE_RE = /\bfree(?:bies?)?\b/gi;
const SYNONYM_RE = /\bcomplimentary\b|\bno[\s-]+cost\b|\bat\s+no\s+charge\b|\bfor\s+nothing\b|(?<![\w$])\$\s?0(?:\.00)?(?![\d,]|\.\d)/gi;
const JOIN_RE = /\bjoin(?:s|ed|ing)?\b/i;
const NEWSLETTER_RE = /newsletter/i;
const BLOCK_TAGS = "p|h[1-6]|li|ul|ol|div|button|Button|label|section|article|main|aside|nav|header|footer|summary|details|td|th|tr|table|title|option|dt|dd|dl|figcaption|figure|blockquote|br|hr|form|fieldset|legend|caption|meta|link|img|input|textarea|select|script|noscript|template|svg";
const ATTR_RE = /\b(?:content|alt|title|aria-label|aria-description|placeholder|value|data-[\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;

/** Page titles: <title>, og:/twitter:title, title="…" props, document.title = "…", title: "…". */
function titleTexts(src) {
  const out = [];
  for (const m of src.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)) out.push(m[1]);
  for (const m of src.matchAll(/<meta\b[^>]*>/gi)) {
    if (!/(?:property|name)\s*=\s*["'](?:og:title|twitter:title|title)["']/i.test(m[0])) continue;
    const c = m[0].match(/\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
    if (c) out.push(c[1] ?? c[2]);
  }
  for (const m of src.matchAll(/(?:\btitle\s*=\s*|document\.title\s*=\s*|\btitle\s*:\s*)(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/g)) out.push(m[1] ?? m[2] ?? m[3]);
  return out.map((t) => normalizeForScan(t));
}

/** Normalise each line separately, so the "\n" sentence/element boundaries survive. */
const normLines = (t) => t.split("\n").map((l) => normalizeForScan(l)).join("\n");

/**
 * Reader text views of an HTML page, a TSX/TS source or Markdown (one view), with sentence/element boundaries as "\n".
 * Two views: inline tags removed with no gap (fr<b>ee</b> -> free) and with a space (so
 * <span>Get</span><span>free</span> still reads as two words).
 */
export function readerViews(src, { kind = "html" } = {}) {
  // Markdown (llms.txt): every line (list item, heading, paragraph) is its own element.
  if (kind === "markdown") return [normLines(src.split("\n").join("\n\n\n")).replace(/[ \t]+/g, " ")];
  let t = src.replace(/<!--[\s\S]*?-->/g, " ");
  const attrs = [];
  for (const m of t.matchAll(ATTR_RE)) attrs.push(m[1] ?? m[2]);
  // JSON-LD stays (crawlers read it); JSON string quotes become boundaries.
  t = t.replace(/<script\b[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/gi, (_, j) => `\n${j.replace(/\\"/g, "'").replace(/"/g, "\n")}\n`);
  t = t.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "\n").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "\n");
  if (kind === "source") {
    t = t.replace(/\b(?:tier|plan)\s*\|\|\s*["'`]Free["'`]/g, " "); // a membership tier label, not an offer
    t = t.replace(/\/\*[\s\S]*?\*\//g, "\n").replace(/(^|[^:])\/\/[^\n]*/g, "$1\n").replace(/\{\s*["'`]\s*["'`]\s*\}/g, " ");
    t = t.replace(/\s*\n\s*/g, " ").replace(/["`]|[{}]|\\n|[;,]\s*$/g, "\n");
  } else {
    t = t.replace(/\s*\n\s*/g, " ");
  }
  t = t.replace(new RegExp(`</?(?:${BLOCK_TAGS})\\b[^>]*>`, "gi"), "\n");
  const tight = t.replace(/<\/?[A-Za-z][^>]*>/g, "");
  const spaced = t.replace(/<\/?[A-Za-z][^>]*>/g, " ");
  const tail = attrs.join("\n\n\n"); // each attribute value is its own element (a section)
  return [tight, spaced].map((v) => normLines(`${v}\n\n\n${tail}`).replace(/[ \t]+/g, " "));
}

/** Back-compat for callers of the v3 API: the first (tight) view. */
export const readerText = (src, opts) => readerViews(src, opts)[0];

function sentenceAt(t, i) {
  const start = Math.max(t.lastIndexOf("\n", i), ...[".", "!", "?"].map((p) => { const k = t.lastIndexOf(p + " ", i); return k < 0 ? -1 : k + 1; }));
  const ends = ["\n", ". ", "! ", "? "].map((p) => t.indexOf(p, i)).filter((k) => k >= 0);
  const end = ends.length ? Math.min(...ends) + 1 : t.length;
  return t.slice(start + 1, end).trim();
}

const nearOffer = (t, i, len = 0) => OFFER_TITLES.find((re) => re.test(t.slice(Math.max(0, i - WINDOW), i + len + WINDOW)));

// A section break: a blank line between elements (two or more empty lines in the reader text).
const SECTION_BREAK = /\n(?:[ \t]*\n){2,}/g;
/**
 * The exempt phrase's own section: up to WINDOW characters either side, stopping at a section
 * break. So "The First Acquisition. Read free with Kindle+ …" (same element, QA v3 probe) is not
 * exempt, while a KU book card on a series page is not tied to the prequel band further down.
 */
export function sectionAround(t, i, len) {
  let a = Math.max(0, i - WINDOW);
  let b = Math.min(t.length, i + len + WINDOW);
  const base = a;
  for (const m of t.slice(base, i).matchAll(SECTION_BREAK)) a = base + m.index + m[0].length;
  const after = t.slice(i + len, b).search(SECTION_BREAK);
  if (after >= 0) b = i + len + after;
  return t.slice(a, b);
}
const offerInSection = (t, i, len) => OFFER_TITLES.find((re) => re.test(sectionAround(t, i, len)));

function scanView(view) {
  const out = [];
  for (const [re, why] of HARD_FAIL) for (const m of view.matchAll(re)) out.push({ sentence: sentenceAt(view, m.index).slice(0, 160), near: why });
  // Exemptions: blank them out (same length, so offsets stay valid for the window checks).
  let t = view;
  const blank = (s) => " ".repeat(s.length);
  for (const re of EXEMPT_ALWAYS) t = t.replace(re, blank);
  for (const re of EXEMPT_AWAY_FROM_OFFER)
    t = t.replace(re, (m, ...rest) => {
      const i = rest.find((x) => typeof x === "number");
      return offerInSection(view, i, m.length) ? m : blank(m);
    });
  const check = (m, kind) => {
    const sentence = sentenceAt(t, m.index);
    if (JOIN_RE.test(sentence) && NEWSLETTER_RE.test(sentence)) return;
    const near = nearOffer(t, m.index, m[0].length);
    if (kind === "synonym" && !near) return; // synonyms only count next to an offer
    out.push({ sentence: sentence.slice(0, 160), near: near ? String(near) : `${kind} without "join … newsletter"` });
  };
  for (const m of t.matchAll(FREE_RE)) check(m, "free");
  for (const m of t.matchAll(SYNONYM_RE)) check(m, "synonym");
  return out;
}

/** 'free' claims that break the newsletter-join rule: [{ sentence, near }]. Empty when clean. */
export function bareFreeClaims(src, opts) {
  const seen = new Map();
  for (const view of readerViews(src, opts)) for (const h of scanView(view)) seen.set(`${h.near}|${h.sentence}`, h);
  for (const title of titleTexts(src))
    if (/\bfree\s+prequels?\b/i.test(title)) seen.set(`title|${title}`, { sentence: title.slice(0, 160), near: '"Free Prequel" in a page title' });
  return [...seen.values()];
}
