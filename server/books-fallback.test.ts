import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BOOKS } from "../client/src/data/books";
import { withAmazonTag } from "../client/src/lib/amazon-tag";
// @ts-expect-error plain .mjs module without type declarations
import * as fallback from "../scripts/lib/book-fallback.mjs";
// @ts-expect-error plain .mjs module without type declarations
import * as guard from "../scripts/lib/book-fallback-guard.mjs";

const { KINDLE_PLUS_LINE, RETIRED_KU_LINE, bookFallbackFactsHtml, bookFallbackBuyHtml } = fallback as {
  KINDLE_PLUS_LINE: string;
  RETIRED_KU_LINE: string;
  bookFallbackFactsHtml: (book: unknown, deps: unknown) => string;
  bookFallbackBuyHtml: (book: unknown, deps: unknown) => string;
};
const { EXPECTED_KINDLE_PLUS_LINE, RETIRED_KU_TEXT, KU_TITLE_SLUGS, NON_KU_TITLE_SLUGS, fallbackProblems, normalizeForScan } = guard as {
  normalizeForScan: (s: string) => string;
  EXPECTED_KINDLE_PLUS_LINE: string;
  RETIRED_KU_TEXT: string;
  KU_TITLE_SLUGS: readonly string[];
  NON_KU_TITLE_SLUGS: readonly string[];
  fallbackProblems: (html: string, slug?: string) => string[];
};

const APPROVED_LINE = "Read free with Kindle+ (formerly Kindle Unlimited).";

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const deps = { esc, withAmazonTag };

const KU_SLUGS = [
  "the-billionaire-s-executive-assistant",
  "the-billionaire-s-fake-wife",
  "the-billionaire-s-baby-secret",
  "the-billionaires-forbidden-nanny",
  "hostile-tender",
  "poison-pill",
  "golden-parachute",
];
const NON_KU_SLUGS = ["the-billionaires-one-night-stand", "the-first-acquisition"];

describe("/books no-JS fallback", () => {
  it("uses the approved subscription wording", () => {
    expect(KINDLE_PLUS_LINE).toBe(APPROVED_LINE);
    expect(EXPECTED_KINDLE_PLUS_LINE).toBe(APPROVED_LINE);
    expect(RETIRED_KU_TEXT).toBe("Available in Kindle Unlimited");
  });

  it("keeps the guard's own canonical KU list (not the catalog flag) in step with the expected list", () => {
    expect([...KU_TITLE_SLUGS].sort()).toEqual([...KU_SLUGS].sort());
    expect([...NON_KU_TITLE_SLUGS].sort()).toEqual([...NON_KU_SLUGS].sort());
  });

  it("covers every catalog title with the expected subscription status", () => {
    expect(BOOKS.map((b) => b.slug).sort()).toEqual([...KU_SLUGS, ...NON_KU_SLUGS].sort());
    for (const slug of KU_SLUGS) expect(BOOKS.find((b) => b.slug === slug)?.kindle_unlimited, slug).toBe(true);
    for (const slug of NON_KU_SLUGS) expect(BOOKS.find((b) => b.slug === slug)?.kindle_unlimited, slug).toBe(false);
  });

  it("shows the Kindle+ line on subscription titles only", () => {
    for (const book of BOOKS) {
      const html = bookFallbackFactsHtml(book, deps);
      if (KU_SLUGS.includes(book.slug)) expect(html, book.slug).toBe(`<li>${KINDLE_PLUS_LINE}</li>`);
      else expect(html, book.slug).toBe("");
      expect(html).not.toContain(RETIRED_KU_LINE);
    }
  });

  it("tags every Amazon book link in the buy line", () => {
    for (const book of BOOKS) {
      const html = bookFallbackBuyHtml(book, deps);
      expect(fallbackProblems(html), book.slug).toEqual([]);
      if (book.retailers.amazon_kindle) expect(html, book.slug).toContain("tag=reeseastor-20");
    }
  });

  it("keeps existing query parameters when it adds the tag", () => {
    const book = { retailers: { amazon_kindle: "https://www.amazon.com/dp/B0FCCBNF8X?ref_=ast_author_dp&th=1" } };
    expect(bookFallbackBuyHtml(book, deps)).toBe(
      '<a href="https://www.amazon.com/dp/B0FCCBNF8X?ref_=ast_author_dp&amp;th=1&amp;tag=reeseastor-20">Read on Amazon</a>',
    );
  });

  it("flags untagged or wrongly tagged Amazon links and the retired line (self-test)", () => {
    expect(fallbackProblems('<a href="https://www.amazon.com/dp/B0FCCBNF8X">Read on Amazon</a>')).toHaveLength(1);
    expect(fallbackProblems('<a href="https://www.amazon.com/dp/B0FCCBNF8X?tag=other-20">x</a>')).toHaveLength(1);
    expect(fallbackProblems("<li>Available in Kindle Unlimited</li>")).toContain(`retired line "${RETIRED_KU_LINE}"`);
    expect(fallbackProblems('<a href="https://www.amazon.com/dp/B0FCCBNF8X?th=1&amp;tag=reeseastor-20">x</a>')).toEqual([]);
    expect(fallbackProblems('<a href="https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX">author</a>')).toEqual([]);
  });

  it("page guard accepts the real fallback of every title", () => {
    for (const book of BOOKS) {
      const body = `<ul>${bookFallbackFactsHtml(book, deps)}</ul><p>${bookFallbackBuyHtml(book, deps)}</p>`;
      expect(fallbackProblems(body, book.slug), book.slug).toEqual([]);
    }
  });

  it("page guard rejects wrong, missing, doubled or misplaced Kindle lines (QA F1 mutations)", () => {
    const ok = `<li>${APPROVED_LINE}</li>`;
    const ku = "the-billionaire-s-fake-wife";
    const nonKu = "the-first-acquisition";
    expect(fallbackProblems(ok, ku)).toEqual([]);
    expect(fallbackProblems("<li></li>", nonKu)).toEqual([]);
    // line without its final period
    expect(fallbackProblems("<li>Read free with Kindle+ (formerly Kindle Unlimited)</li>", ku).length).toBeGreaterThan(0);
    // "Kindle Unlimited" wording instead of the line
    expect(fallbackProblems("<li>Read free with Kindle Unlimited.</li>", ku).length).toBeGreaterThan(0);
    // line on a non-KU title (line on every title / FA flagged KU)
    expect(fallbackProblems(ok, nonKu).length).toBeGreaterThan(0);
    expect(fallbackProblems(ok, "the-billionaires-one-night-stand").length).toBeGreaterThan(0);
    // KU title missing the line (e.g. GP flag flipped to false), or showing it twice
    expect(fallbackProblems("<li></li>", "golden-parachute").length).toBeGreaterThan(0);
    expect(fallbackProblems(ok + ok, ku).length).toBeGreaterThan(0);
    // any other Kindle Unlimited / Kindle+ text, even next to the exact line
    expect(fallbackProblems(`${ok}<p>Also in kindle unlimited</p>`, ku).length).toBeGreaterThan(0);
    expect(fallbackProblems(`${ok}<p>Kindle+ members read free</p>`, ku).length).toBeGreaterThan(0);
    // a title the guard does not know
    expect(fallbackProblems("<li></li>", "a-new-title").length).toBeGreaterThan(0);
  });

  it("G1: checks JSON-LD in the full page: Amazon identifiers must be clean, untagged /dp/ URLs", () => {
    const ok = `<li>${APPROVED_LINE}</li>`;
    const ku = "the-billionaire-s-fake-wife";
    const ld = (url: string) => `<script type="application/ld+json" data-pre="1">{"sameAs":["${url}"]}</script>`;
    expect(fallbackProblems(ld("https://www.amazon.com/dp/B0FCCBNF8X") + ok, ku)).toEqual([]);
    expect(fallbackProblems(ld("https://www.amazon.com/dp/B0FCCBNF8X?tag=reeseastor-20") + ok, ku).length).toBeGreaterThan(0);
    expect(fallbackProblems(ld("https://www.amazon.com/dp/B0FCCBNF8X?ref_=x") + ok, ku).length).toBeGreaterThan(0);
    expect(fallbackProblems(ld("http://amazon.com/dp/B0FCCBNF8X") + ok, ku).length).toBeGreaterThan(0);
    // stray wording in the head (meta / JSON-LD) is caught too
    expect(fallbackProblems(`<meta name="description" content="In Kindle Unlimited">${ok}`, ku).length).toBeGreaterThan(0);
  });

  it("G2: lookalike characters, entities and odd spaces cannot hide Kindle Unlimited / Kindle+", () => {
    const ok = `<li>${APPROVED_LINE}</li>`;
    const ku = "the-billionaire-s-fake-wife";
    const sneaky = [
      "K\u0456ndle Unlimited", // Cyrillic i
      "Kindle Unl\u0456m\u0456ted",
      "\u039Aindle Unlimited", // Greek capital Kappa
      "Kin\u200Bdle Unlimited", // zero-width space
      "Kindle\u00A0Unlimited", // no-break space
      "Kindle&nbsp;Unlimited",
      "Kindle&#160;Unlimited",
      "Kindle\u2009Unlimited", // thin space
      "\uFF2Bindle Unlimited", // fullwidth K
      "Kindle-Unlimited",
      "Kindle\uFF0B", // fullwidth plus
      "Kindle&#43; members",
      "Kindle&#x2B; members",
      "Kin\u00ADdle Unlimited", // soft hyphen
    ];
    for (const s of sneaky) expect(fallbackProblems(`${ok}<p>${s}</p>`, ku), JSON.stringify(s)).not.toEqual([]);
    expect(normalizeForScan("K\u0456n\u200Bdle&nbsp;\uFF35nlimited")).toBe("Kindle Unlimited");
    // the exact approved line itself stays allowed
    expect(fallbackProblems(ok, ku)).toEqual([]);
  });

  it("F5 (QA re-card): markup splits, any separator, KU tokens, confusables, escaped JSON-LD, free claims", () => {
    const ok = `<li>${APPROVED_LINE}</li>`;
    const ku = "the-billionaire-s-fake-wife";
    const nonKu = "the-first-acquisition";
    // QA evidence/probes.mjs, wording probes (each injected into body, meta description and JSON-LD)
    const probes: Record<string, string> = {
      plain: "Kindle Unlimited", lower: "kindle unlimited", upper: "KINDLE UNLIMITED", mixed: "kInDlE uNlImItEd",
      "cyr-K": "\u041Aindle Unlimited", "cyr-i,e": "K\u0456ndl\u0435 Unlimited", "armenian U": "Kindle \u054Dnlimited",
      "greek iota": "K\u03B9ndle Unlimited",
      fullwidth: "\uFF2B\uFF49\uFF4E\uFF44\uFF4C\uFF45 \uFF35\uFF4E\uFF4C\uFF49\uFF4D\uFF49\uFF54\uFF45\uFF44",
      "math bold": "\uD835\uDC0A\uD835\uDC22\uD835\uDC27\uD835\uDC1D\uD835\uDC25\uD835\uDC1E Unlimited",
      "kelvin K": "\u212Aindle Unlimited", zwj: "Kin\u200Ddle Unli\u200Dmited", zwsp: "Kindle\u200BUnlimited",
      "soft hyphen": "Kin\u00ADdle Unlimited", nbsp: "Kindle\u00A0Unlimited", "&nbsp;": "Kindle&nbsp;Unlimited",
      "numeric entity": "K&#105;ndle Unlimited", "hex entity": "&#x4B;indle Unlimited", "double space": "Kindle   Unlimited",
      newline: "Kindle\nUnlimited", hyphen: "Kindle-Unlimited", "en dash": "Kindle\u2013Unlimited",
      "em dash": "Kindle\u2014Unlimited", slash: "Kindle/Unlimited", middot: "Kindle\u00B7Unlimited",
      "tag split b": "Kindle <b>Unlimited</b>", "tag split span": "Kin<span>dle</span> Unlimited",
      "comment split": "Kindle<!-- -->Unlimited", "Kindle+": "Kindle+", "Kindle +": "Kindle +", "Kindle&#43;": "Kindle&#43;",
      "Kindle&plus;": "Kindle&plus;", "fullwidth plus": "Kindle\uFF0B", "small plus": "Kindle\uFE62", "heavy plus": "Kindle \u2795",
      KU: "Read free in KU", "K.U.": "Read free in K.U.", "KU alone": "Now in KU", "K.U. alone": "Now in K.U.",
      "Kindle Unltd": "Kindle Unltd", "read free": "Read free today", "fr\u0435e cyrillic": "Read fr\u0435e with Kindle",
      "$0.00": "$0.00 to read", "homoglyph exact line": "Read free with \u041Aindle+ (formerly Kindle Unlimited).",
      "retired line": "Available in Kindle Unlimited", "retired line cyrillic": "Available in \u041Aindle Unlimited",
      "retired line lower": "available in kindle unlimited", "JSON \\u escape": "Kindle\\u0020Unlimited",
      "unknown confusable (Cherokee-free, Latin with stroke)": "K\u0268ndle Unlimited",
      "double-encoded entity": "K&amp;#105;ndle Unlimited",
    };
    const ld = (desc: string) =>
      `<script type="application/ld+json">{"@type":"Book","sameAs":["https://www.amazon.com/dp/B0D82GWFD9"],"description":"${desc}"}</script>`;
    for (const [name, s] of Object.entries(probes)) {
      const asJson = JSON.stringify(s).slice(1, -1);
      expect(fallbackProblems(`<p>${s}</p>`, nonKu), `nonKU body: ${name}`).not.toEqual([]);
      expect(fallbackProblems(`<meta name="description" content="${s.replace(/"/g, "&quot;")}">`, nonKu), `nonKU meta: ${name}`).not.toEqual([]);
      expect(fallbackProblems(ld(asJson), nonKu), `nonKU JSON-LD: ${name}`).not.toEqual([]);
      expect(fallbackProblems(`${ok}<p>${s}</p>`, ku), `KU body: ${name}`).not.toEqual([]);
    }
    // JSON-LD with escapes that only exist inside the JSON string
    expect(fallbackProblems(ld("Kindle\\nUnlimited"), nonKu)).not.toEqual([]);
    expect(fallbackProblems(ld("Kindle\\u00a0Unlimited"), nonKu)).not.toEqual([]);
    // things that must stay allowed: words that merely contain K/U, and the real offer wording
    for (const s of ["Kumar wrote a haiku", "KUDOS to the team", "SKU 1234", "Kindle edition", "unlimited love", "a kindled flame", "Free book", "Get it free", "price $3.99"]) {
      expect(fallbackProblems(`${ok}<p>${s}</p>`, ku), s).toEqual([]);
      expect(fallbackProblems(`<p>${s}</p>`, nonKu), s).toEqual([]);
    }
    expect(fallbackProblems(ld("A steamy romance.") + "<p>Get it free</p>", nonKu)).toEqual([]);
  });

  it("F5f: Amazon links in JSON-LD and the body: short links, /gp/product/, escaped slashes, single quotes, doubled tags", () => {
    const ok = `<li>${APPROVED_LINE}</li>`;
    const ku = "the-billionaire-s-fake-wife";
    const ld = (raw: string) => `<script type="application/ld+json">{"@type":"Book","sameAs":["${raw}"]}</script>`;
    expect(fallbackProblems(ld("https://www.amazon.com/dp/B0FCCBNF8X") + ok, ku)).toEqual([]);
    for (const raw of [
      "https://www.amazon.com/dp/B0FCCBNF8X?tag=reeseastor-20", "https://www.amazon.com/dp/B0FCCBNF8X/ref=x",
      "http://www.amazon.com/dp/B0FCCBNF8X", "https://amzn.to/abc", "https://www.amazon.com/gp/product/B0FCCBNF8X?tag=x",
      "https:\\/\\/www.amazon.com\\/dp\\/B0FCCBNF8X?tag=x", "https:\\/\\/amzn.to\\/abc", "https://a.co/d/abc",
    ]) expect(fallbackProblems(ld(raw) + ok, ku), raw).not.toEqual([]);
    for (const link of [
      '<a href="https://amzn.to/3xyz">buy</a>', '<a href="https://www.amazon.com/gp/product/B0D82GWFD9">buy</a>',
      "<a href='https://www.amazon.com/dp/B0D82GWFD9'>buy</a>", '<a href="https://www.amazon.com/dp/B0D82GWFD9">buy</a>',
      `<a href="https://www.amazon.com/dp/B0D82GWFD9?tag=${"88away0d" + "-20"}&tag=reeseastor-20">x</a>`,
      '<a href="https://www.amazon.com/dp/B0D82GWFD9?tag=reeseastor-20&amp;tag=reeseastor-20">x</a>',
      "<a href=https://www.amazon.com/dp/B0D82GWFD9>x</a>",
    ]) expect(fallbackProblems(`${ok}${link}`, ku), link).not.toEqual([]);
    expect(fallbackProblems(`${ok}<a href='https://www.amazon.com/gp/product/B0D82GWFD9?tag=reeseastor-20'>x</a>`, ku)).toEqual([]);
  });

  // QA card v2 (2026-10-30) probes, ported from evidence-v2/probes-qa-v2.mjs and probes-qa-v2b.mjs.
  // Fixtures are the two rendered preview pages QA probed (dpl_2FPSjh328nVEjKmMQmTTupdWcEUx).
  describe("QA v2 probes (probes-qa-v2*.mjs)", () => {
    const fx = (f: string) => fs.readFileSync(path.join(__dirname, "__fixtures__/books-fallback", f), "utf8");
    const KU = fx("ku-the-billionaire-s-fake-wife.html");
    const NON = fx("non-ku-the-first-acquisition.html");
    const KU_SLUG = "the-billionaire-s-fake-wife";
    const NON_SLUG = "the-first-acquisition";
    const inBody = (page: string, s: string) => page.replace("</article>", `<p>${s}</p></article>`);
    const inMeta = (s: string) => NON.replace(/<meta name="description" content="/, `$&${s.replace(/"/g, "&quot;")} `);
    const inLd = (s: string) => NON.replace(/("@type":"Book"[^<]*?"description":")/, `$1${JSON.stringify(s).slice(1, -1).replace(/<\//g, "<\\/")} `);
    const inLdRaw = (s: string) => NON.replace(/("@type":"Book"[^<]*?"description":")/, `$1${s} `);

    it("fixtures are clean as captured", () => {
      expect(fallbackProblems(KU, KU_SLUG)).toEqual([]);
      expect(fallbackProblems(NON, NON_SLUG)).toEqual([]);
    });

    const P: Record<string, string> = {
      "split <i> mid-word": "Kind<i>le</i> Unli<i>mited</i>", "split <br>": "Kindle<br>Unlimited", "split <wbr>": "Kindle Unlim<wbr>ited",
      "split nested spans+attrs": "<span class=\"a\">Kin</span><span data-x='1'>dle</span>&#32;<em>Unlimited</em>",
      "split comment mid-word": "Kin<!--x-->dle Unl<!-- y -->imited",
      "figure dash": "Kindle\u2012Unlimited", "minus sign": "Kindle\u2212Unlimited", "double hyphen spaced": "Kindle -- Unlimited",
      "spaced em dash x2": "Kindle \u2014\u2014 Unlimited", "fraction slash": "Kindle\u2044Unlimited", "backslash": "Kindle\\Unlimited",
      "bullet": "Kindle\u2022Unlimited", "katakana middot": "Kindle\u30FBUnlimited", "underscore": "Kindle_Unlimited", "pipe": "Kindle|Unlimited",
      "lower ku": "read free in ku", "K U spaced": "Read it in K U today", "K-U": "in K-U", "K/U": "in K/U", "K·U": "in K\u00B7U",
      "KU+": "on KU+", "#KU hashtag": "#KU", "KU cyr K": "in \u041AU", "KU fullwidth": "in \uFF2B\uFF35", "Kindle Plus spelled": "Read with Kindle Plus",
      "K.U lowercase dots": "in k.u.", "armenian K": "\u053Findle Unlimited", "armenian small n": "Kindle U\u0578limited",
      "cyrillic palochka": "Kind\u04CFe Unlimited", "cyrillic dotted i": "K\u0456ndle Unlimited", "greek mix": "\u039Aindle Unlim\u03B9ted",
      "Cherokee K": "\u13E6indle Unlimited", "dotless i + script l": "K\u0131nd\u2113e Unlimited", "accented": "K\u00EDndl\u00E9 \u00DAnlimited",
      "combining acute": "Ki\u0301ndle Unlimited", "small capital U": "Kindle \u1D1Cnlimited", "math script": "\uD835\uDCA6indle Unlimited",
      "Lisu K": "\uA4D7indle Unlimited", "JSON \\n": "Kindle\\nUnlimited", "JSON \\u004b": "\\u004bindle Unlimited",
      "JSON \\u003c tags": "Kindle\\u003cb\\u003eUnlimited", "JSON \\/": "Kindle\\/Unlimited", "&shy;": "Kin&shy;dle Unlimited",
      "&#173;": "Kindle Unli&#173;mited", "&nbsp no semicolon": "Kindle&nbspUnlimited", "&NonBreakingSpace;": "Kindle&NonBreakingSpace;Unlimited",
      "&hairsp;": "Kindle&hairsp;Unlimited", "&#x00A0;": "Kindle&#x00A0;Unlimited", "&amp;nbsp;": "Kindle&amp;nbsp;Unlimited",
      "U+202F": "Kindle\u202FUnlimited", "U+2060": "Kin\u2060dle Unlimited", "U+180E": "Kindle\u180EUnlimited", "U+3164": "Kindle\u3164Unlimited",
      "U+2800": "Kindle\u2800Unlimited", "$0 bare": "Read it for $0", "free to read in KU": "Free to read in Kindle Unlimited",
      "Countdown deal": "Kindle Countdown Deal: $0.99 this week",
    };
    it.each(Object.entries(P))("probes-qa-v2: %s is caught in the body, meta description, JSON-LD and on a KU page", (_n, s) => {
      for (const page of [inBody(NON, s), inMeta(s), inLd(s)]) {
        expect(page).not.toBe(NON);
        expect(fallbackProblems(page, NON_SLUG).length).toBeGreaterThan(0);
      }
      expect(fallbackProblems(inBody(KU, s), KU_SLUG).length).toBeGreaterThan(0);
    });

    const ISO: Record<string, string> = {
      "in ku": "Find it in ku", "in Ku": "Find it in Ku", "k.u.": "Find it in k.u.", "K-U": "Find it in K-U", "K/U": "Find it in K/U",
      "K·U": "Find it in K\u00B7U", "K_U": "Find it in K_U", "Kindle Plus": "Find it on Kindle Plus", "KindlePlus": "Find it on KindlePlus",
      "Kindle -- Unlimited": "Kindle -- Unlimited", "Kindle_Unlimited": "Kindle_Unlimited", "&nbsp": "Kindle&nbspUnlimited",
      "&NonBreakingSpace;": "Kindle&NonBreakingSpace;Unlimited", "&hairsp;": "Kindle&hairsp;Unlimited", "&ThinSpace;": "Kindle&ThinSpace;Unlimited",
      "Kindle - - Unlimited": "Kindle - - Unlimited", "unknown entity (fail closed)": "Kindle&madeupname;Unlimited",
      "unknown entity, no semicolon (fail closed)": "Kindle&zzUnlimited",
    };
    it.each(Object.entries(ISO))("probes-qa-v2b: isolated %s (no 'read free' words) is caught on both pages", (_n, s) => {
      expect(fallbackProblems(inBody(NON, s), NON_SLUG).length).toBeGreaterThan(0);
      expect(fallbackProblems(inBody(KU, s), KU_SLUG).length).toBeGreaterThan(0);
    });

    const RAW: Record<string, string> = {
      "\\u003cb\\u003e split": "Kindle\\u003cb\\u003eUnlimited", "\\u00ad shy": "Kin\\u00addle Unlimited",
      "\\u2014\\u2014 spaced": "Kindle \\u2014\\u2014 Unlimited", "K\\u002dU": "in K\\u002dU", "\\u004bU": "in \\u004bU",
      "&nbsp no semicolon in JSON": "Kindle&nbspUnlimited",
    };
    it.each(Object.entries(RAW))("probes-qa-v2b: raw-escaped JSON-LD %s is caught", (_n, s) => {
      const page = inLdRaw(s);
      expect(page).not.toBe(NON);
      expect(fallbackProblems(page, NON_SLUG).length).toBeGreaterThan(0);
    });

    it("controls stay clean: Kumar, haiku, SKU, plain entities", () => {
      for (const s of ["Kumar wrote a haiku about the SKU", "Tom &amp; Jerry &copy; 2026 &nbsp;", "Kudos to the book club", "Back up your library"])
        expect(fallbackProblems(inBody(NON, s), NON_SLUG), s).toEqual([]);
    });

    it("exact Kindle+ line is counted on visible text only (comment, data- attribute, hidden span do not count)", () => {
      const LINE = EXPECTED_KINDLE_PLUS_LINE;
      expect(KU.split(LINE).length - 1).toBeGreaterThan(0);
      const swap = (keep: string) => KU.split(LINE).join("§").replace("§", keep).split("§").join("Get your copy");
      for (const keep of [`<!-- ${LINE} -->`, `<span data-note="${LINE}"></span>`, `<span hidden>${LINE}</span>`,
        `<span aria-hidden="true">${LINE}</span>`, `<span style="display:none">${LINE}</span>`, `<span class="sr-only">${LINE}</span>`])
        expect(fallbackProblems(swap(keep), KU_SLUG), keep).toContain(`KU title needs "${LINE}" exactly once, found 0`);
    });

    const LINKS: Record<string, [string, boolean]> = {
      "protocol-relative untagged": ['<a href="//www.amazon.com/dp/B0D82GWFD9">x</a>', true],
      "amazon.co.uk untagged": ['<a href="https://www.amazon.co.uk/dp/B0D82GWFD9">x</a>', true],
      "smile untagged": ['<a href="https://smile.amazon.com/dp/B0D82GWFD9">x</a>', true],
      "title-slug path untagged": ['<a href="https://www.amazon.com/Some-Title/dp/B0D82GWFD9/ref=sr_1_1">x</a>', true],
      "gp/product wrong tag": ['<a href="https://www.amazon.com/gp/product/B0D82GWFD9?tag=88away0d-20">x</a>', true],
      "amzn.to uppercase host": ['<a href="https://AMZN.TO/3abc">x</a>', true], "amzn.eu": ['<a href="https://amzn.eu/d/abc">x</a>', true],
      "a.co/d": ['<a href="https://a.co/d/abc">x</a>', true],
      "entity-obfuscated host": ['<a href="https://www.am&#97;zon.com/dp/B0D82GWFD9">x</a>', true],
      "tag in fragment only": ['<a href="https://www.amazon.com/dp/B0D82GWFD9#tag=reeseastor-20">x</a>', true],
      "tag twice": ['<a href="https://www.amazon.com/dp/B0D82GWFD9?tag=reeseastor-20&amp;tag=reeseastor-20">x</a>', true],
      "uppercase TAG param + good tag": ['<a href="https://www.amazon.com/dp/B0D82GWFD9?TAG=88away0d-20&tag=reeseastor-20">x</a>', true],
      "uppercase <A HREF>": ['<A HREF="https://www.amazon.com/dp/B0D82GWFD9">x</A>', true],
      "newline before href": ['<a\n  class="b"\n  href="https://www.amazon.com/dp/B0D82GWFD9">x</a>', true],
      "meta refresh to amzn.to": ['<meta http-equiv="refresh" content="5;url=https://amzn.to/3abc">', true],
      "area href untagged": ['<map><area href="https://www.amazon.com/dp/B0D82GWFD9"></map>', true],
      "control: gp/product tagged": ['<a href="https://www.amazon.com/gp/product/B0D82GWFD9?tag=reeseastor-20">x</a>', false],
      "control: dp tagged": ['<a href="https://www.amazon.com/dp/B0D82GWFD9?tag=reeseastor-20">x</a>', false],
      "control: area tagged": ['<map><area href="https://www.amazon.com/dp/B0D82GWFD9?tag=reeseastor-20"></map>', false],
    };
    it.each(Object.entries(LINKS))("probes-qa-v2 link: %s", (_n, [l, bad]) => {
      const n = fallbackProblems(NON.replace("</article>", `${l}</article>`), NON_SLUG).length;
      if (bad) expect(n).toBeGreaterThan(0);
      else expect(n).toBe(0);
    });

    const LDURLS: Record<string, [string, boolean]> = {
      "schemeless www.amazon.com": ["www.amazon.com/dp/B0D82GWFD9?tag=x", true], "schemeless amzn.to": ["amzn.to/abc", true],
      "https gp/product": ["https://www.amazon.com/gp/product/B0D82GWFD9", true], "amazon.co.uk dp": ["https://www.amazon.co.uk/dp/B0D82GWFD9", true],
      "\\u002F escaped": ["https:\\u002F\\u002Fwww.amazon.com\\u002Fdp\\u002FB0D82GWFD9?tag=x", true],
      "control: clean dp": ["https://www.amazon.com/dp/B0D82GWFD9", false],
    };
    it.each(Object.entries(LDURLS))("probes-qa-v2 JSON-LD url: %s", (_n, [u, bad]) => {
      const page = NON.replace(/"sameAs":\[?"[^"]*"/, (m) => m.replace(/"https[^"]*"$/, `"${u}"`));
      if (bad) expect(page).not.toBe(NON);
      const n = fallbackProblems(page, NON_SLUG).length;
      if (bad) expect(n).toBeGreaterThan(0);
      else expect(n).toBe(0);
    });
  });

  it("G3: the guard's KU lists carry a dated amazon.com verification note", () => {
    const guardSrc = fs.readFileSync(path.join(__dirname, "../scripts/lib/book-fallback-guard.mjs"), "utf8");
    expect(guardSrc).toMatch(/KU verified on amazon\.com \d{4}-\d{2}-\d{2}/);
  });

  it("runs this test file in the Vercel build and npm build, before the prerender", () => {
    const vercel = JSON.parse(fs.readFileSync(path.join(__dirname, "../vercel.json"), "utf8"));
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"));
    expect(pkg.scripts["test:books-fallback"]).toBe("vitest run server/books-fallback.test.ts");
    for (const cmd of [vercel.buildCommand as string, pkg.scripts.build as string]) {
      expect(cmd.startsWith("npm run test:books-fallback && ")).toBe(true);
    }
  });

  it("is wired into the prerender script, which fails the build on a problem", () => {
    const src = fs.readFileSync(path.join(__dirname, "../scripts/prerender-static.mjs"), "utf8");
    expect(src).not.toContain(RETIRED_KU_LINE);
    expect(src).toContain("bookFallbackFactsHtml(book");
    expect(src).toContain("bookFallbackBuyHtml(book");
    expect(src).toContain('scripts/lib/book-fallback-guard.mjs');
    const guardSrc = fs.readFileSync(path.join(__dirname, "../scripts/lib/book-fallback-guard.mjs"), "utf8");
    expect(guardSrc).not.toMatch(/from\s+["'][^"']*(book-fallback\.mjs|books)["']|import\(/);
    expect(src).toMatch(/fallbackProblems\(bookPage, book\.slug\)[\s\S]{0,80}throw new Error/);
    expect(src).toMatch(/const bookPage = renderPage\(/);
    expect(src).toContain("write(`/books/${book.slug}`, bookPage)");
    expect(src).not.toMatch(/href="\$\{esc\(book\.retailers\.amazon_kindle\)\}"/);
  });
});
