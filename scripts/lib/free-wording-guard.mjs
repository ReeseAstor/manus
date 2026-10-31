/**
 * QA rule (2026-10-30, ruling c of the v3 card; v5 per the v4 card G1-G8 and rulings 2-4): The First
 * Acquisition, The Billionaire's One Night Stand and The Photograph He Kept cost $0.99 in stores and
 * are free only when a reader joins the newsletter. On every page and source string:
 * - G1: a "free" (or "freebie") passes only if its own sentence has a join clause tied to the
 *   newsletter ("join … newsletter" within 4 words, or "when you/they/readers join … newsletter"),
 *   and the sentence does not negate it or make it optional ("no need to", "without", "skip",
 *   "optional", "not required", "don't have/need to", "never"). No title is needed to fail or pass;
 * - G2: "free with/via/through/w//from/in/for … newsletter", "free for (newsletter) subscribers/
 *   members/readers" and "newsletter subscribers/readers/members (who) get/receive … free" always fail;
 * - G3: a sentence ends at . ! ? … (plus closing quotes or brackets); every block element, <a> and
 *   <button> is its own element;
 * - G4: text is read from an HTML tree: comments removed with no gap, the full entity table decoded,
 *   zero-width and soft hyphens dropped, NFKC, lookalike letters (incl. small capitals and IPA)
 *   folded, letter-spaced "f r e e" joined; meta content, alt, title, aria-*, placeholder, value,
 *   label and data-* attributes (quoted or not), <textarea> text and JSON-LD strings are read too;
 * - G5: synonyms ("complimentary", "no cost", "no charge", "costs nothing", "on the house",
 *   "gratis", "zero dollars/cost", "$0", "0.00 USD") follow the same rule next to an offer title;
 * - G6/G7 (rulings 2, 3): every named exemption, the approved Kindle+ line included, applies only
 *   when its nearest container (article, section, li, or a div with a heading; the whole page when
 *   there is none) holds no offer title in its text or its alt/title/aria-label, with no length cap.
 *   Empty elements and <br> never form a boundary. There is no always-exempt list; only the
 *   /free-book path, #free-book anchor and id="free-book" are not reader copy;
 * - G8: "Free Prequel" in a <title>, og:/twitter:title, a page title prop or JSON-LD name,
 *   headline or alternativeHeadline always fails.
 * Used by scripts/prerender-static.mjs (fails the build), the v5 rendered check and
 * server/free-wording.test.ts.
 */
import { normalizeForScan } from "./book-fallback-guard.mjs";

/** Titles and phrases that tie a "free" (or synonym) to the newsletter offer. */
export const OFFER_TITLES = [
  /the\s+first\s+acquisition/i,
  // The title, not the trope: "The Billionaire's One Night Stand", "One Night Stand" (title case) or
  // ONE NIGHT STAND; the lowercase trope chip "One night stand" on a KU card is not the prequel.
  /billionaire\W{0,2}s\s+one\s+night\s+stand|\bOne\s+Night\s+Stand\b|\bONE\s+NIGHT\s+STAND\b/,
  /the\s+photograph\s+he\s+kept/i,
  /\bprequel/i,
  /\bfree[\s-]+(?:book|copy|ebook|e-book|novella|romance|starter|gift|download|read)/i,
];
const hasOffer = (t) => OFFER_TITLES.some((re) => re.test(t));
/** The first offer title in t, with a little context (for the failure message), or "". */
function offerAt(t) {
  for (const re of OFFER_TITLES) {
    const m = t.match(re);
    if (m) return `offer "${m[0]}" in the same container: …${t.slice(Math.max(0, m.index - 40), m.index + m[0].length + 20).replace(/\s+/g, " ")}…`;
  }
  return "";
}
const WINDOW = 200;

/** Not reader copy: the /free-book route, the #free-book anchor and the free-book id (ruling 2). */
const PATHS = [/(?<=[\/#])free-books?\b/gi, /\bid\s*=\s*["']?free-books?\b/gi];

/** Exempt only when the nearest container holds no offer title (rulings 2 and 3). */
const EXEMPT_AWAY_FROM_OFFER = [
  /Read free with Kindle\+ \(formerly Kindle Unlimited\)\.?/g, // approved KU line, KU titles only
  /\bfree Kindle (?:reading )?apps?\b/gi,
  /\bfree advance (?:reader )?copies\b/gi,
  /\b(?:glare|royalty|spam|gluten|cruelty|hands|worry|stress|guilt|ad|clutter|scent|fragrance|BPA|lint|tangle|smudge|sugar|hassle|stain|wrinkle|lag|eye[\s-]?strain)-free\b/gi,
  /\bfeel free(?! *[,.:;!?-]* *it'?s free)\b/gi,
  /\b(?:take (?:my|this) )?free (?:\d+-question )?(?:romance |book boyfriend )?quiz\b/gi,
  /\bFree: My 10-Point Steamy Scene Checklist\b/g,
  /\bfree of\b(?! *(?:any |all |extra )?(?:charge|cost|fee|payment|price|obligation)s?\b)/gi,
  /\bjoin(?:s|ed|ing)? (?:the club |the Reader'?s Club |Reader'?s Club )?(?:\()?(?:for )?free\b\)?|\bfree to join\b|\bfree (?:club )?membership\b/gi,
  /\bNo Cost to Join\b/gi,
];

const HARD_FAIL = [
  [/\bfree\s+(?:with|via|through|w\/|from|in|for)\s+(?:\S+\s+){0,3}?newsletter\b/gi, '"free with/via/for … newsletter" (does not say join)'],
  [/\bfree\s+for\s+(?:newsletter\s+)?(?:subscribers|members|readers)\b/gi, '"free for subscribers" (does not say join)'],
  [/\bnewsletter\s+(?:subscribers|readers|members)\s+(?:who\s+)?(?:get|got|receive|received)\b[^.!?\n]{0,30}\bfree\b/gi, '"newsletter subscribers get … free" (does not say join)'],
  [/\bfree\b[^\n.!?]{0,40}\bno\s+newsletter\b|\bno\s+newsletter\s+(?:required|needed|necessary)\b/gi, "'free' with the newsletter negated"],
];
const FREE_RE = /\bfree(?:bies?)?\b/gi;
const SYNONYM_RE = /\bcomplimentary\b|\bno[\s-]+cost\b|\bno\s+charge\b|\bfor\s+nothing\b|\bcosts?\s+nothing\b|\bon\s+the\s+house\b|\bgratis\b|\bzero\s+(?:dollars?|cost)\b|(?<![\w$])\$\s?0(?:\.00)?(?![\d,]|\.\d)|(?<![\w.$])0\.00\s*(?:USD|dollars?)\b/gi;
const LINK_RE = [/\bjoin(?:s|ed|ing)?\b(?:\s+\S+){0,4}?\s+newsletter\b/i, /\bwhen\s+(?:you|they|readers)\s+join\b[^.!?…\n]{0,80}?\bnewsletter\b/i];
const NEG_RE = /\b(?:no need to|without|skip(?:s|ped|ping)?|optional(?:ly)?|not required|don'?t (?:have|need) to|never)\b/i;
const linked = (s) => LINK_RE.some((re) => re.test(s)) && !NEG_RE.test(s);
const SPACED_FREE = /\bf(?:[\s._*\u00B7\u2022-]{1,3})r(?:[\s._*\u00B7\u2022-]{1,3})e(?:[\s._*\u00B7\u2022-]{1,3})e\b/gi;
const norm = (t) => normalizeForScan(t).replace(SPACED_FREE, "free").replace(/[ \t]+/g, " ");

// ---- HTML tree ---------------------------------------------------------------------------------
const VOID = new Set("area base br col embed hr img input link meta param source track wbr keygen".split(" "));
const RAW_TEXT = new Set(["script", "style", "textarea", "title", "xmp", "noscript"]);
const BLOCK = new Set(("p h1 h2 h3 h4 h5 h6 li ul ol div button label section article main aside nav header footer summary details " +
  "td th tr table title option dt dd dl figcaption figure blockquote br hr form fieldset legend caption meta link img input " +
  "textarea select template svg a dialog body head html pre address").split(" "));
const CONTAINER = new Set(["article", "section", "li"]);
const READ_ATTR = /^(?:content|alt|title|aria-label|aria-description|aria-roledescription|placeholder|value|label|data-[\w-]+)$/i;
const IMPLIED_CLOSE = { li: ["li"], p: ["p"], option: ["option"], dt: ["dt", "dd"], dd: ["dt", "dd"], tr: ["tr", "td", "th"], td: ["td", "th"], th: ["td", "th"] };

function parseAttrs(s) {
  const out = [];
  for (const m of s.matchAll(/([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) out.push([m[1].toLowerCase(), m[2] ?? m[3] ?? m[4] ?? ""]);
  return out;
}

/** A tolerant HTML tree (enough for the guard): elements, text, comments dropped with no gap. */
export function parseHtml(src) {
  const root = { tag: "#root", attrs: [], children: [], parent: null };
  let cur = root;
  const TAG = /<!--[\s\S]*?(?:--!?>|$)|<!\[CDATA\[[\s\S]*?(?:\]\]>|$)|<![^>]*>|<\?[^>]*>|<\/\s*([A-Za-z][\w:-]*)[^>]*>|<([A-Za-z][\w:-]*)((?:\s*[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?\s*>/g;
  let last = 0;
  const text = (t) => t && cur.children.push({ text: t, parent: cur });
  for (let m; (m = TAG.exec(src)); ) {
    text(src.slice(last, m.index));
    last = TAG.lastIndex;
    if (m[1]) {
      const name = m[1].toLowerCase();
      for (let n = cur; n && n !== root; n = n.parent) if (n.tag === name) { cur = n.parent; break; }
      continue;
    }
    if (!m[2]) continue; // comment, doctype, CDATA: removed with no gap
    const tag = m[2].toLowerCase();
    for (const c of IMPLIED_CLOSE[tag] ?? []) {
      if (cur.tag === c) { cur = cur.parent; break; }
    }
    const el = { tag, attrs: parseAttrs(m[3] || ""), children: [], parent: cur };
    cur.children.push(el);
    if (VOID.has(tag) || /\/\s*>$/.test(m[0])) continue; // void or self-closing (SVG, JSX)
    if (RAW_TEXT.has(tag)) {
      const end = src.slice(last).search(new RegExp(`</\\s*${tag}\\s*>`, "i"));
      const body = end < 0 ? src.slice(last) : src.slice(last, last + end);
      el.children.push({ text: body, parent: el, raw: true });
      last = end < 0 ? src.length : last + end;
      const close = src.slice(last).match(new RegExp(`^</\\s*${tag}\\s*>`, "i"));
      if (close) last += close[0].length;
      TAG.lastIndex = last;
      continue;
    }
    cur = el;
  }
  text(src.slice(last));
  return root;
}

const isHeading = (n) => /^h[1-6]$/.test(n.tag) || (n.attrs ?? []).some(([k, v]) => k === "role" && v === "heading");
function hasHeading(n) {
  for (const c of n.children ?? []) if (c.tag && (isHeading(c) || (!CONTAINER.has(c.tag) && hasHeading(c)))) return true;
  return false;
}
const isContainer = (n) => n.tag === "#root" || CONTAINER.has(n.tag) || (n.tag === "div" && hasHeading(n));

/**
 * Units of reader text: each block element's text (tight and spaced views), each readable attribute,
 * each JSON-LD string, each <textarea>; with the nearest container and title-ness recorded.
 */
function htmlUnits(src) {
  const root = parseHtml(src);
  const units = [];
  const titles = [];
  const containerText = new Map(); // container -> raw text of all its units (for the offer check)
  const add = (tight, spaced, cont, extra = {}) => {
    if (!/\S/.test(tight + spaced)) return;
    units.push({ tight, spaced, cont, ...extra });
    for (let c = cont; c; c = c.parentCont) containerText.set(c, (containerText.get(c) ?? "") + "\n" + tight + "\n" + spaced);
  };
  const walk = (n, cont) => {
    // One buffer object, reset in place: walkInline holds a reference to it, so text after a block
    // inside an inline element (an <svg> icon in a <span>) is never dropped.
    const buf = { tight: "", spaced: "" };
    const flush = () => { add(buf.tight, buf.spaced, cont); buf.tight = ""; buf.spaced = ""; };
    for (const c of n.children) {
      if (c.text !== undefined) {
        if (c.raw) continue;
        buf.tight += c.text.replace(/\s*\n\s*/g, " ");
        buf.spaced += c.text.replace(/\s*\n\s*/g, " ");
        continue;
      }
      let cc = cont;
      if (isContainer(c)) { cc = c; c.parentCont = cont; }
      // <meta> values and the <title> stand alone (search results, social cards): each is its own container.
      if (c.tag === "meta" || c.tag === "title") { cc = { tag: c.tag, parentCont: null }; }
      for (const [k, v] of c.attrs) if (READ_ATTR.test(k) && v) add(v, v, cc, { attr: k, el: c });
      if (c.tag === "title") { titles.push(c.children.map((x) => x.text ?? "").join("")); }
      if (c.tag === "meta") {
        const key = (c.attrs.find(([k]) => k === "property" || k === "name") ?? [])[1] ?? "";
        const content = (c.attrs.find(([k]) => k === "content") ?? [])[1];
        if (/^(?:og:title|twitter:title|title)$/i.test(key) && content) titles.push(content);
      }
      if (c.tag === "script") {
        const body = c.children.map((x) => x.text ?? "").join("");
        if ((c.attrs.find(([k]) => k === "type") ?? [])[1]?.toLowerCase().includes("ld+json")) {
          flush();
          for (const [key, s, obj] of jsonLdStrings(body, cc)) {
            add(s, s, obj, { jsonld: key });
            if (/^(?:name|headline|alternativeHeadline)$/.test(key)) titles.push(s);
          }
        }
        continue;
      }
      if (c.tag === "style") continue;
      if (c.tag === "textarea" || c.tag === "title" || c.tag === "noscript" || c.tag === "xmp") {
        flush();
        const body = c.children.map((x) => x.text ?? "").join("");
        if (c.tag === "noscript") walk(parseHtml(body), cc); else add(body, body, cc);
        continue;
      }
      if (BLOCK.has(c.tag) || cc !== cont) {
        flush();
        walk(c, cc);
      } else {
        // inline element: its text joins the current unit (fr<b>ee</b> -> free), block children split it
        buf.spaced += " ";
        walkInline(c, cc, buf, flush, walk, add);
        buf.spaced += " ";
      }
    }
    flush();
  };
  const walkInline = (n, cont, buf, flush, walkFn, addFn) => {
    for (const c of n.children) {
      if (c.text !== undefined) {
        if (c.raw) continue;
        buf.tight += c.text.replace(/\s*\n\s*/g, " ");
        buf.spaced += c.text.replace(/\s*\n\s*/g, " ");
        continue;
      }
      for (const [k, v] of c.attrs) if (READ_ATTR.test(k) && v) addFn(v, v, cont, { attr: k, el: c });
      if (c.tag === "script" || c.tag === "style") continue;
      if (BLOCK.has(c.tag) || isContainer(c)) {
        flush();
        if (isContainer(c)) c.parentCont = cont;
        walkFn(c, isContainer(c) ? c : cont);
      } else {
        buf.spaced += " ";
        walkInline(c, cont, buf, flush, walkFn, addFn);
        buf.spaced += " ";
      }
    }
  };
  walk(root, root);
  return { units, titles, containerText };
}

/**
 * [key, string, container] for every string in the JSON-LD blocks (decoded). Each JSON object is a
 * container (a FAQ Question, a Book, an Offer), nested in its parent object; non-JSON text is split
 * on quotes and kept in the script's container.
 */
function jsonLdStrings(body, outer) {
  const out = [];
  const walk = (v, key, cont) => {
    if (typeof v === "string") out.push([key, v, cont]);
    else if (Array.isArray(v)) v.forEach((x) => walk(x, key, cont));
    else if (v && typeof v === "object") {
      const own = { tag: "json-object", parentCont: cont };
      for (const [k, x] of Object.entries(v)) walk(x, k, own);
    }
  };
  try {
    walk(JSON.parse(body), "", outer);
  } catch {
    for (const s of body.replace(/\\"/g, "'").split('"')) out.push(["", s, outer]);
  }
  return out;
}

// ---- Source (TSX/TS) and Markdown --------------------------------------------------------------
/**
 * JSX tags with their attributes removed (quotes and {…} depth respected, so className="…" or
 * onClick={() => a > b} never splits the text). Readable attribute values (alt, title, aria-label,
 * placeholder, label, value, content, data-*) are returned as their own units.
 */
function stripJsxTags(src) {
  const attrs = [];
  let out = "";
  let i = 0;
  while (i < src.length) {
    const lt = src.indexOf("<", i);
    if (lt < 0) { out += src.slice(i); break; }
    const name = src.slice(lt).match(/^<\/?([A-Za-z][\w.]*)/);
    if (!name) { out += src.slice(i, lt + 1); i = lt + 1; continue; }
    out += src.slice(i, lt);
    let k = lt + name[0].length, depth = 0, q = "";
    const start = k;
    for (; k < src.length; k++) {
      const ch = src[k];
      if (q) { if (ch === q && src[k - 1] !== "\\") q = ""; continue; }
      if (ch === '"' || ch === "'" || ch === "`") q = ch;
      else if (ch === "{") depth++;
      else if (ch === "}") depth--;
      else if (ch === ">" && depth <= 0) break;
    }
    const body = src.slice(start, k);
    for (const m of body.matchAll(/\b(alt|title|aria-label|aria-description|placeholder|label|value|content|data-[\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*["'`]([^"'`]*)["'`]\s*\})/g)) attrs.push(m[2] ?? m[3] ?? m[4]);
    out += `<${name[0].slice(1)}${/\/\s*$/.test(body) ? "/" : ""}>`;
    i = k + 1;
  }
  return { out, attrs };
}
function sourceUnits(src) {
  let t = src.replace(/<!--[\s\S]*?-->/g, "");
  t = t.replace(/\b(?:tier|plan)\s*\|\|\s*["'`]Free["'`]/g, " "); // VIP membership tier label (ruling 2: source-only, exact)
  t = t.replace(/\/\*[\s\S]*?\*\//g, "\n").replace(/(^|[^:])\/\/[^\n]*/g, "$1\n");
  t = t.replace(/(["'`])\s*\+\s*(["'`])/g, ""); // "Fr" + "ee" string concatenation
  t = t.replace(/\{\s*(["'`])(\s*)\1\s*\}/g, "$2"); // {" "} and {""} in JSX
  const { out, attrs } = stripJsxTags(t);
  t = out.replace(/\s*\n\s*/g, " ").replace(/["`]|[{}]|\\n|[;,]\s*$/g, "\n");
  t = t.replace(new RegExp(`</?(?:${[...BLOCK].join("|")}|Button|Link|A|DialogTitle|DialogDescription|CardTitle|CardDescription)/?>`, "g"), "\n");
  const lines = [...t.split("\n"), ...attrs];
  const units = lines
    .map((l) => ({ tight: l.replace(/<\/?[A-Za-z][\w.]*\/?>/g, ""), spaced: l.replace(/<\/?[A-Za-z][\w.]*\/?>/g, " ") }))
    .filter((u) => /\S/.test(u.tight));
  // Container in source: the unit and its neighbours within WINDOW characters (the rendered and
  // prerendered scans apply the DOM container rule to what readers actually get).
  const doc = units.map((u) => u.tight).join("\n");
  const containerText = new Map();
  let off = 0;
  for (const u of units) {
    u.cont = { tag: "source" };
    containerText.set(u.cont, doc.slice(Math.max(0, off - WINDOW), off + u.tight.length + WINDOW));
    off += u.tight.length + 1;
  }
  const titles = [];
  for (const m of src.matchAll(/(?:\btitle\s*=\s*|document\.title\s*=\s*|\btitle\s*:\s*)(?:"([^"]*)"|'([^']*)'|`([^`]*)`)/g)) titles.push(m[1] ?? m[2] ?? m[3]);
  return { units, titles, containerText };
}
/** Markdown / plain text (llms.txt, robots.txt): every line is its own element and container. */
function markdownUnits(src) {
  const units = [];
  const containerText = new Map();
  for (const line of src.split("\n")) {
    if (!/\S/.test(line)) continue;
    const cont = { tag: "line" };
    units.push({ tight: line, spaced: line, cont });
    containerText.set(cont, line);
  }
  return { units, titles: src.split("\n").filter((l) => /^#\s/.test(l)).map((l) => l.slice(2)), containerText };
}

// ---- Scan --------------------------------------------------------------------------------------
// NFKC turns "…" into "...", so three dots end a sentence too, with or without a space (QA v4 G3).
const SENT_END = /\.{3}["'\u201D\u2019)\]]*|[.!?\u2026]["'\u201D\u2019)\]]*(?=\s|$)|\u2026/g;
function sentenceAt(t, i) {
  let start = 0;
  let end = t.length;
  for (const m of t.matchAll(SENT_END)) {
    const e = m.index + m[0].length;
    if (e <= i) start = e;
    else if (m.index >= i) { end = e; break; }
  }
  return t.slice(start, end).trim();
}

function scanUnit(text, offerInContainer, docWindow) {
  const out = [];
  for (const [re, why] of HARD_FAIL) for (const m of text.matchAll(re)) out.push({ sentence: sentenceAt(text, m.index).slice(0, 160), near: why });
  const blank = (s) => " ".repeat(s.length);
  let t = text;
  for (const re of PATHS) t = t.replace(re, blank);
  if (!offerInContainer) for (const re of EXEMPT_AWAY_FROM_OFFER) t = t.replace(re, blank);
  for (const m of t.matchAll(FREE_RE)) {
    const s = sentenceAt(t, m.index);
    if (linked(s)) continue;
    out.push({ sentence: s.slice(0, 160), near: offerInContainer ? `free next to an offer, no join … newsletter (${offerInContainer})` : 'free without "join … newsletter"' });
  }
  for (const m of t.matchAll(SYNONYM_RE)) {
    const s = sentenceAt(t, m.index);
    if (linked(s)) continue;
    if (!hasOffer(s) && !hasOffer(docWindow(m.index, m[0].length))) continue; // synonyms count next to an offer
    out.push({ sentence: s.slice(0, 160), near: `synonym "${m[0]}" next to an offer` });
  }
  return out;
}

/** 'free' claims that break the newsletter-join rule: [{ sentence, near }]. Empty when clean. */
export function bareFreeClaims(src, { kind = "html" } = {}) {
  const { units, titles, containerText } = kind === "source" ? sourceUnits(src) : kind === "markdown" ? markdownUnits(src) : htmlUnits(src);
  const offerCache = new Map();
  const offerIn = (c) => {
    if (!offerCache.has(c)) offerCache.set(c, offerAt(norm(containerText.get(c) ?? "")));
    return offerCache.get(c);
  };
  // Document order, for the synonym window.
  const views = units.map((u) => [norm(u.tight), norm(u.spaced)]);
  const doc = views.map((v) => v[0]).join("\n");
  const starts = [];
  views.reduce((o, v, k) => ((starts[k] = o), o + v[0].length + 1), 0);
  const seen = new Map();
  units.forEach((u, k) => {
    const offer = offerIn(u.cont);
    for (const [vi, text] of views[k].entries()) {
      const win = (i, len) => (vi === 0 ? doc.slice(Math.max(0, starts[k] + i - WINDOW), starts[k] + i + len + WINDOW) : text.slice(Math.max(0, i - WINDOW), i + len + WINDOW));
      for (const h of scanUnit(text, offer, win)) seen.set(`${h.near}|${h.sentence}`, h);
    }
  });
  for (const title of titles.map(norm))
    if (/\bfree\s+prequels?\b/i.test(title)) seen.set(`title|${title}`, { sentence: title.slice(0, 160), near: '"Free Prequel" in a page title' });
  return [...seen.values()];
}
