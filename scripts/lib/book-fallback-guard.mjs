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

// Lookalike characters that could spell "Kindle Unlimited" / "Kindle+" past a plain regex.
const HOMOGLYPHS = {
  "\u0430": "a", "\u0435": "e", "\u0456": "i", "\u0458": "j", "\u043E": "o", "\u0440": "p", "\u0441": "c",
  "\u0443": "y", "\u0445": "x", "\u043A": "k", "\u043C": "m", "\u043D": "h", "\u0442": "t", "\u0501": "d",
  "\u04CF": "l", "\u0406": "I", "\u041A": "K", "\u0415": "E", "\u041C": "M", "\u041D": "H", "\u041E": "O",
  "\u0422": "T", "\u0423": "Y", "\u03B9": "i", "\u03BA": "k", "\u03BF": "o", "\u03BD": "v", "\u0399": "I",
  "\u039A": "K", "\u039C": "M", "\u039D": "N", "\u039F": "O", "\u03A4": "T", "\u0131": "i", "\u2113": "l",
  "\u2160": "I", "\u217C": "l", "\u2212": "-", "\uFE62": "+", "\u2795": "+", "\u02D6": "+",
};

/**
 * Text as a reader would see it, for the stray-wording scan only: decodes numeric and common
 * named entities, applies NFKC (fullwidth and compatibility forms), drops zero-width and
 * soft-hyphen characters, maps lookalike letters to ASCII, and turns every space-like
 * character into a plain space.
 */
export function normalizeForScan(text) {
  const named = { nbsp: " ", plus: "+", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", shy: "", zwj: "", zwnj: "" };
  let t = text
    .replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);?/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in named ? named[n.toLowerCase()] : m));
  t = t.normalize("NFKC").replace(/[\u200B-\u200F\u2060-\u2064\uFEFF\u00AD\u034F\u180E]/g, "");
  t = [...t].map((c) => HOMOGLYPHS[c] ?? c).join("");
  return t.replace(/[\s\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g, " ");
}

function countOf(haystack, needle) {
  return haystack.split(needle).length - 1;
}

/**
 * Problems in a /books/<slug> fallback body. Returns a list of messages (empty when clean):
 * - an Amazon /dp/ link without tag=reeseastor-20;
 * - the retired line "Available in Kindle Unlimited";
 * - with a slug: the exact Kindle+ line not exactly once on a KU title, or present on a
 *   non-KU title, and an unknown slug;
 * - any "Kindle Unlimited" or "Kindle+" text outside that exact line, after normalizeForScan
 *   (lookalike letters, entities, zero-width and odd spaces cannot hide it);
 * - with a full page: any Amazon URL in JSON-LD that is not a clean, untagged
 *   https://www.amazon.com/dp/<ASIN> identifier (sameAs / offers.url stay untagged on purpose).
 * Pass the full rendered page (head, JSON-LD and body), not just the article.
 */
export function fallbackProblems(bodyHtml, slug) {
  const problems = [];
  for (const m of bodyHtml.matchAll(/<a\s[^>]*href="([^"]*amazon\.[^"]*\/dp\/[^"]*)"/gi)) {
    const href = m[1].replace(/&amp;/g, "&");
    let tag = null;
    try {
      tag = new URL(href).searchParams.get("tag");
    } catch {
      /* unparseable: reported below */
    }
    if (tag !== "reeseastor-20") problems.push(`Amazon link without tag=reeseastor-20: ${href}`);
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
  const rest = normalizeForScan(bodyHtml.split(EXPECTED_KINDLE_PLUS_LINE).join(" "));
  const stray = rest.match(/kindle ?(?:-|\.|_)? ?unlimited|kindle ?\+/gi);
  if (stray) problems.push(`Kindle Unlimited / Kindle+ text outside the exact line: ${stray.join(", ")}`);

  for (const block of bodyHtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const u of block[1].matchAll(/https?:\/\/[^"\s]*amazon\.[^"\s]*/gi)) {
      const url = u[0].replace(/\\\//g, "/");
      if (/\/dp\//.test(url) && !CLEAN_JSONLD_AMAZON.test(url)) problems.push(`JSON-LD Amazon URL is not a clean /dp/ identifier: ${url}`);
    }
  }
  return problems;
}
