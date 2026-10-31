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

function countOf(haystack, needle) {
  return haystack.split(needle).length - 1;
}

/**
 * Problems in a /books/<slug> fallback body. Returns a list of messages (empty when clean):
 * - an Amazon /dp/ link without tag=reeseastor-20;
 * - the retired line "Available in Kindle Unlimited";
 * - with a slug: the exact Kindle+ line not exactly once on a KU title, or present on a
 *   non-KU title, and an unknown slug;
 * - any "Kindle Unlimited" or "Kindle+" text outside that exact line.
 * JSON-LD is not checked: sameAs / offers.url identifiers stay untagged on purpose.
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
  const rest = bodyHtml.split(EXPECTED_KINDLE_PLUS_LINE).join(" ");
  const stray = rest.match(/kindle(?:\s|&nbsp;)+unlimited|kindle\s*(?:\+|&#43;|&plus;)/gi);
  if (stray) problems.push(`Kindle Unlimited / Kindle+ text outside the exact line: ${stray.join(", ")}`);
  return problems;
}
