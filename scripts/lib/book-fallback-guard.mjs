/**
 * Build guard for the /books/<slug> no-JS fallback (scripts/prerender-static.mjs throws on
 * any problem). Deliberately independent of the generator (book-fallback.mjs) and of the
 * catalog flag (books.ts kindle_unlimited): the expected line and KU membership are written
 * out here, so changing the generator or flipping a flag cannot make its own check pass.
 */

/** The only approved subscription line, byte-exact. */
export const EXPECTED_KINDLE_PLUS_LINE = "Read free with Kindle+ (formerly Kindle Unlimited).";

/** Wording that must never appear in fallback output. */
export const RETIRED_KU_TEXT = "Available in Kindle Unlimited";

/**
 * Canonical Kindle Unlimited membership for the guard, kept apart from the catalog flag
 * (books.ts kindle_unlimited) on purpose, so a flipped flag cannot silently pass its own check.
 * Every catalog slug must be in exactly one list; update this when a title joins or leaves KU.
 *
 * KU verified on amazon.com 2026-10-30 (logged out, headless Chrome; evidence in
 * /workspace/prep/followups-20261030/amazon/ku-check-20261030.json): the 7 KU titles show
 * "Kindle $0.00 or $X to buy"; One Night Stand (B0DSG7NKGP) and First Acquisition
 * (B0D82GWFD9) show no KU price. Re-check on amazon.com and update this date when a list changes.
 */
export const KU_TITLE_SLUGS = Object.freeze([
  "the-billionaire-s-executive-assistant",
  "the-billionaire-s-fake-wife",
  "the-billionaire-s-baby-secret",
  "the-billionaires-forbidden-nanny",
  "hostile-tender",
  "poison-pill",
  "golden-parachute",
]);
export const NON_KU_TITLE_SLUGS = Object.freeze(["the-billionaires-one-night-stand", "the-first-acquisition"]);

/** Clean JSON-LD Amazon identifier: canonical /dp/ URL, no query, no tag (QA ruling 2026-10-26). */
const CLEAN_JSONLD_AMAZON = /^https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}$/;

// Lookalike letters that could spell "Kindle Unlimited" / "Kindle+" / "KU" past a plain regex. A
// subset of the Unicode confusables table (Cyrillic, Greek, Armenian, Cherokee, Latin small
// capitals, letterlike symbols, Roman numerals). Anything not listed is still caught by the
// fail-closed token check in fallbackProblems (non-ASCII letter inside a kindle/unlimited token).
const HOMOGLYPHS = {
  // Cyrillic
  "\u0430": "a", "\u0435": "e", "\u0456": "i", "\u0458": "j", "\u043E": "o", "\u0440": "p", "\u0441": "c",
  "\u0443": "y", "\u0445": "x", "\u043A": "k", "\u043C": "m", "\u043D": "h", "\u0442": "t", "\u0501": "d",
  "\u04CF": "l", "\u0406": "I", "\u041A": "K", "\u0415": "E", "\u041C": "M", "\u041D": "H", "\u041E": "O",
  "\u0422": "T", "\u0423": "Y", "\u0410": "A", "\u0412": "B", "\u0421": "C", "\u0420": "P", "\u0425": "X",
  "\u049A": "K", "\u049B": "k", "\u04A0": "K", "\u04A1": "k", "\u0457": "i", "\u0491": "r", "\u0438": "u",
  "\u043F": "n", "\u0434": "d", "\u0475": "v", "\u051B": "q", "\u0500": "d", "\u050D": "g",
  // Greek
  "\u03B9": "i", "\u03BA": "k", "\u03BF": "o", "\u03BD": "v", "\u0399": "I", "\u039A": "K", "\u039C": "M",
  "\u039D": "N", "\u039F": "O", "\u03A4": "T", "\u0391": "A", "\u0392": "B", "\u0395": "E", "\u0397": "H",
  "\u03A1": "P", "\u03A7": "X", "\u03A5": "Y", "\u0396": "Z", "\u03C5": "u", "\u03F3": "j", "\u03B5": "e",
  "\u03C4": "t", "\u03BC": "u", "\u03F0": "k",
  // Armenian
  "\u054D": "U", "\u057D": "u", "\u0555": "O", "\u0585": "o", "\u0544": "U", "\u0574": "u", "\u0570": "h",
  "\u0578": "n", "\u0566": "q", "\u0581": "g", "\u0561": "w", "\u0575": "j", "\u0539": "P", "\u053F": "K",
  "\u056F": "k", "\u0583": "p", "\u0582": "L", "\u053C": "L", "\u0535": "t", "\u0565": "t", "\u056B": "h",
  // Cherokee and Latin small capitals / dotless / letterlike
  "\u13E6": "K", "\u13DE": "L", "\u13A1": "E", "\u13A2": "T", "\u13AA": "A", "\u13C6": "G", "\u13C1": "h",
  "\u1D0B": "K", "\u1D1C": "U", "\u026A": "I", "\u1D05": "D", "\u029F": "L", "\u1D07": "E", "\u1D0D": "M",
  "\u0274": "N", "\u1D1B": "T", "\u0131": "i", "\u0237": "j", "\u2113": "l", "\u212A": "K", "\u2129": "i",
  "\u0269": "i", "\u0285": "l", "\u01C0": "l", "\u0196": "l", "\u217F": "m", "\u217E": "d",
  // Roman numerals, minus and plus lookalikes
  "\u2160": "I", "\u217C": "l", "\u216C": "L", "\u2170": "i", "\u216F": "M", "\u216E": "D",
  "\u2212": "-", "\uFE62": "+", "\u2795": "+", "\u02D6": "+", "\u2A72": "+", "\u2A01": "+", "\u16ED": "+",
};

const NAMED_ENTITIES = {
  nbsp: " ", ensp: " ", emsp: " ", thinsp: " ", plus: "+", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'",
  shy: "", zwj: "", zwnj: "", middot: "\u00B7", ndash: "\u2013", mdash: "\u2014", sol: "/", hyphen: "-",
  period: ".", lpar: "(", rpar: ")", colon: ":", comma: ",", dollar: "$", num: "#",
};

function decodeEntities(text) {
  // Repeat so double-encoded text (&amp;#105;) is decoded too.
  let t = text;
  for (let i = 0; i < 3; i++) {
    const before = t;
    t = t
      .replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
      .replace(/&#(\d+);?/g, (_, d) => String.fromCodePoint(Number(d)))
      .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in NAMED_ENTITIES ? NAMED_ENTITIES[n.toLowerCase()] : m));
    if (t === before) break;
  }
  return t;
}

/** JSON string escapes (\\uXXXX, \\n, \\/ ...) decoded, for JSON-LD text that is not valid JSON. */
function decodeJsonEscapes(text) {
  return text
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\([nrtbf])/g, " ")
    .replace(/\\([\\/"'])/g, "$1");
}

/**
 * Text as a reader would see it, for the stray-wording scan only: decodes numeric and named
 * entities (repeatedly) and JSON escapes, applies NFKC (fullwidth and compatibility forms),
 * strips combining marks, drops zero-width and soft-hyphen characters, maps lookalike letters
 * to ASCII, and turns every space-like character into a plain space.
 */
export function normalizeForScan(text) {
  let t = decodeJsonEscapes(decodeEntities(text));
  t = t.normalize("NFKC").replace(/[\u200B-\u200F\u2060-\u2064\uFEFF\u00AD\u034F\u180E\u061C]/g, "");
  t = [...t].map((c) => HOMOGLYPHS[c] ?? c).join("");
  t = t.normalize("NFKD").replace(/\p{M}/gu, "");
  return t.replace(/[\s\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g, " ");
}

/** Visible text: comments and tags removed (QA F5a), so markup cannot split a word. */
function stripMarkup(html) {
  return html.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, "");
}

/** Every string value inside the page's JSON-LD blocks, JSON-decoded (QA F5e). */
function jsonLdStrings(html) {
  const out = [];
  for (const block of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const walk = (v) => {
      if (typeof v === "string") out.push(v);
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") Object.values(v).forEach(walk);
    };
    try {
      walk(JSON.parse(block[1]));
    } catch {
      out.push(decodeJsonEscapes(block[1])); // not valid JSON: still scan it, unescaped
    }
  }
  return out;
}

/** Attribute values a reader or crawler sees (meta content, alt, title, aria-label). */
function readableAttributes(html) {
  return [...html.matchAll(/\b(?:content|alt|title|aria-label|placeholder)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)].map((m) => m[1] ?? m[2]);
}

const AMAZON_HOST = /(?:^|\.)(?:amazon\.[a-z.]+|amzn\.(?:to|com|eu|asia)|a\.co)$/i;
const STRAY_RE = /kindle\W{0,3}unl[a-z]*|kindle\W{0,2}\+/gi;
const FREE_CLAIM_RE = /read\W{0,3}(?:it\W{0,3})?(?:for\W{0,3})?free|\$\s?0(?:\.00)?(?![\d.])/gi;
const KU_TOKEN_RE = /(?<![A-Za-z0-9])K\.?\s?U\.?(?![A-Za-z0-9])/g;

/** Fail closed (QA F5d): a word shaped like kindle/unlimited that still holds a non-ASCII letter. */
function confusableTokens(text) {
  const hits = [];
  for (const m of text.matchAll(/[\p{L}\p{N}]+/gu)) {
    const w = m[0];
    if (/^[\x00-\x7F]*$/.test(w)) continue;
    for (const target of ["kindle", "unlimited"]) {
      if (w.length !== target.length) continue;
      let ascii = 0;
      let ok = true;
      for (let i = 0; i < w.length; i++) {
        const c = w[i].toLowerCase();
        if (c.charCodeAt(0) < 128) {
          if (c !== target[i]) ok = false;
          else ascii++;
        }
      }
      if (ok && ascii >= target.length - 3) hits.push(w);
    }
  }
  return hits;
}

function countOf(haystack, needle) {
  return haystack.split(needle).length - 1;
}

/**
 * Problems in a /books/<slug> fallback page. Returns a list of messages (empty when clean):
 * - any Amazon link (/dp/, /gp/product/, amzn.to and other short hosts; double- or single-quoted
 *   href) without exactly one tag=reeseastor-20; short links can't carry a checked tag, so they fail;
 * - the retired line "Available in Kindle Unlimited";
 * - with a slug: the exact Kindle+ line not exactly once on a KU title, or present on a
 *   non-KU title, and an unknown slug;
 * - any "Kindle Unlimited" / "Kindle+" text outside that exact line, in visible text, in the raw
 *   page, in readable attributes and in JSON-decoded JSON-LD strings, after normalizeForScan, with
 *   markup removed and any non-alphanumeric separator allowed (QA F5a, b, e);
 * - a standalone "KU" or "K.U." token anywhere a reader sees text (QA F5c);
 * - a "Read free" or "$0.00" claim outside the exact line (KU wording without saying KU);
 * - a kindle/unlimited-shaped word that still carries a non-ASCII letter after folding (QA F5d);
 * - any Amazon URL in JSON-LD (decoded, so https:\/\/ escapes are covered) that is not a clean,
 *   untagged https://www.amazon.com/dp/<ASIN> identifier (QA F5f).
 * Pass the full rendered page (head, JSON-LD and body), not just the article.
 */
export function fallbackProblems(bodyHtml, slug) {
  const problems = [];
  for (const m of bodyHtml.matchAll(/<a\s[^>]*?\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
    const href = decodeEntities(m[1] ?? m[2] ?? m[3] ?? "").trim();
    let url = null;
    try {
      url = new URL(href, "https://reeseastor.com/");
    } catch {
      /* unparseable */
    }
    if (!url) {
      if (/amazon\.|amzn\./i.test(href)) problems.push(`unparseable Amazon link: ${href}`);
      continue;
    }
    if (!AMAZON_HOST.test(url.hostname)) continue;
    if (!/amazon\./i.test(url.hostname)) {
      problems.push(`Amazon short link (tag can't be checked): ${href}`);
      continue;
    }
    if (!/\/(?:dp|gp\/product|gp\/aw\/d|exec\/obidos\/asin|o\/asin)\//i.test(url.pathname)) continue; // author/search pages
    const tags = url.searchParams.getAll("tag");
    if (tags.length !== 1 || tags[0] !== "reeseastor-20") problems.push(`Amazon link without exactly one tag=reeseastor-20: ${href}`);
  }
  if (bodyHtml.includes(RETIRED_KU_TEXT)) problems.push(`retired line "${RETIRED_KU_TEXT}"`);

  const lines = countOf(bodyHtml, EXPECTED_KINDLE_PLUS_LINE);
  if (slug !== undefined) {
    if (KU_TITLE_SLUGS.includes(slug)) {
      if (lines !== 1) problems.push(`KU title needs "${EXPECTED_KINDLE_PLUS_LINE}" exactly once, found ${lines}`);
    } else if (NON_KU_TITLE_SLUGS.includes(slug)) {
      if (lines !== 0) problems.push(`non-KU title must not show "${EXPECTED_KINDLE_PLUS_LINE}", found ${lines}`);
    } else {
      problems.push(`slug "${slug}" is in neither KU_TITLE_SLUGS nor NON_KU_TITLE_SLUGS`);
    }
  }

  const withoutLine = bodyHtml.split(EXPECTED_KINDLE_PLUS_LINE).join(" ");
  const ldStrings = jsonLdStrings(withoutLine).map((s) => s.split(EXPECTED_KINDLE_PLUS_LINE).join(" "));
  const views = [
    withoutLine,
    stripMarkup(withoutLine),
    ...readableAttributes(withoutLine).map((s) => stripMarkup(decodeEntities(s))),
    ...ldStrings.map((s) => stripMarkup(decodeEntities(s))),
  ].map(normalizeForScan);
  const stray = new Set();
  const ku = new Set();
  const confusable = new Set();
  for (const v of views) {
    for (const m of v.matchAll(STRAY_RE)) stray.add(m[0]);
    for (const w of confusableTokens(v)) confusable.add(w);
  }
  // KU tokens: reader-visible text, readable attributes and JSON-LD only (not asset hashes or code).
  for (const v of views.slice(1)) for (const m of v.matchAll(KU_TOKEN_RE)) ku.add(m[0].trim());
  // "Read free" / "$0.00" claims belong only to the exact Kindle+ line (KU pages) and never on
  // non-KU pages; the free-book offer uses "Get it free" / "Free book" wording instead.
  const freeClaims = new Set();
  for (const v of views.slice(1)) for (const m of v.matchAll(FREE_CLAIM_RE)) freeClaims.add(m[0]);
  if (freeClaims.size) problems.push(`"Read free" / "$0.00" claim outside the exact line: ${[...freeClaims].join(", ")}`);
  if (stray.size) problems.push(`Kindle Unlimited / Kindle+ text outside the exact line: ${[...stray].join(", ")}`);
  if (ku.size) problems.push(`standalone KU token: ${[...ku].join(", ")}`);
  if (confusable.size) problems.push(`kindle/unlimited-shaped word with a non-ASCII letter: ${[...confusable].join(", ")}`);

  for (const s of ldStrings) {
    const decoded = decodeEntities(s);
    for (const u of decoded.matchAll(/(?:https?:)?\/\/[^\s"'<>]+/gi)) {
      let host = "";
      try {
        host = new URL(u[0], "https://x/").hostname;
      } catch {
        continue;
      }
      if (!AMAZON_HOST.test(host)) continue;
      if (!CLEAN_JSONLD_AMAZON.test(u[0])) problems.push(`JSON-LD Amazon URL is not a clean /dp/ identifier: ${u[0]}`);
    }
  }
  return problems;
}
