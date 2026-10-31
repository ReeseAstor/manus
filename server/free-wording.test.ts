import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { RETIRED_BLOG_SLUGS } from "../shared/const";
// @ts-expect-error plain .mjs module without types
import { bareFreeClaims } from "../scripts/lib/free-wording-guard.mjs";

type Hit = { sentence: string; near: string };
const scan = bareFreeClaims as (src: string, opts?: { kind?: "html" | "source" | "markdown" }) => Hit[];

const root = path.join(__dirname, "..");

// QA rule 2026-10-30: The First Acquisition, The Billionaire's One Night Stand and The Photograph He Kept are
// free only when you join the newsletter ($0.99 in stores). A bare "free" near them fails.
// QA v3 evidence-v3/probes-free-qa-v3.mjs, verbatim (26 must-fail, 6 controls).
const QA_MUST_FAIL: [string, string][] = [
  ["no-join, has newsletter (QA ruling)", "<p>The First Acquisition, free with my newsletter.</p>"],
  ["newsletter mentioned but negated", "<p>The First Acquisition is free, no newsletter required.</p>"],
  ["newsletter in same sentence, unrelated", "<p>Get The First Acquisition free and read my newsletter archive.</p>"],
  ["title far from free (>200 chars)", "<p>Start free today.</p>" + "<p>" + "x ".repeat(150) + "</p><p>The First Acquisition</p>"],
  ["no title, generic CTA", "<button>Get your free book</button>"],
  ["no title words at all", "<button>Start reading free</button>"],
  ["synonym: complimentary", "<p>The First Acquisition is complimentary.</p>"],
  ["synonym: $0", "<p>The First Acquisition for $0.</p>"],
  ["synonym: no cost", "<p>The First Acquisition at no cost.</p>"],
  ["soft hyphen split", "<p>The First Acquisition, fr\u00ADee.</p>"],
  ["zero-width split", "<p>The First Acquisition, fr\u200Bee.</p>"],
  ["entity split", "<p>The First Acquisition, fr&#101;e.</p>"],
  ["hex entity", "<p>The First Acquisition, &#x66;ree.</p>"],
  ["tag split", "<p>The First Acquisition, fr<b>ee</b>.</p>"],
  ["Cyrillic e", "<p>The First Acquisition, fr\u0435e.</p>"],
  ["fullwidth", "<p>The First Acquisition, \uFF46\uFF52\uFF45\uFF45.</p>"],
  ["freebie", "<p>The First Acquisition is my freebie for you.</p>"],
  ["FREE caps run-on", "<p>THE FIRST ACQUISITION FREE</p>"],
  ["KU line exempt abused on a prequel", "<p>The First Acquisition. Read free with Kindle+ (formerly Kindle Unlimited).</p>"],
  ["data attribute", '<div data-label="The First Acquisition free"></div>'],
  ["JSON-LD offer name", '<script type="application/ld+json">{"name":"The First Acquisition","description":"Free prequel"}</script>'],
  ["heading on its own line, sentence lacks newsletter", "<h2>Free prequel</h2><p>Join my newsletter.</p>"],
  ["One Night Stand short title", "<p>One Night Stand, free!</p>"],
  ["Photograph He Kept", "<p>The Photograph He Kept is free.</p>"],
  ["free download", "<a>Free download</a>"],
  ["'feel free' exemption abused", "<p>The First Acquisition: feel free, it's free.</p>"],
];
// v5: cases that passed before and now must fail by QA's v4 rulings 2 and 3.
const RULED_NOW_FAIL: [string, string][] = [
  ["v3 control 'glare-free' next to a prequel (ruling 2)", "<p>A glare-free display for The First Acquisition.</p>"],
  ["v3 control 'free Kindle app' next to a prequel (ruling 2)", "<p>Read The First Acquisition in the free Kindle app.</p>"],
  ["blank lines are not a container boundary (ruling 3)", "<div><h3>Hostile Tender</h3><p>One night stand</p></div>\n\n\n<p>Read free with Kindle+ (formerly Kindle Unlimited).</p>\n\n\n<section><h2>The First Acquisition, free when you join the newsletter</h2></section>"],
  ["software free tier exemption dropped (ruling 2)", "<p>The platform has a free tier that covers everything you need to start.</p>"],
];
const QA_MUST_PASS: [string, string][] = [
  ["canonical", "<p>Start the Hudson Dynasty with The First Acquisition, free when you join my newsletter.</p>"],
  ["short form", "<p>Free prequel when you join my newsletter.</p>"],
  ["KU line on KU title", "<p>Hostile Tender. Read free with Kindle+ (formerly Kindle Unlimited).</p>"],
  // v5: QA v4 ruling 2 moved every exemption to away-from-offer, so the v3 controls "glare-free" and "free
  // Kindle app" next to The First Acquisition now must fail (RULED_NOW_FAIL); here they stand away from an offer.
  ["glare-free (away from an offer)", "<p>A glare-free display for night reading.</p>"],
  ["free Kindle app (away from an offer)", "<p>Read Hostile Tender in the free Kindle app.</p>"],
  ["third person", "<p>The First Acquisition, free when you join Reese Astor's newsletter.</p>"],
];
// PE's own probes on top of QA's (v4).
const PE_MUST_FAIL: [string, string][] = [
  ["Free with the newsletter button", '<a class="btn">Free with the newsletter</a>'],
  ["Free with newsletter (no my/the)", "<span>Free with newsletter</span>"],
  ["free with her newsletter", "<p>The First Acquisition is free with her newsletter.</p>"],
  ["even with join, 'free with my newsletter' fails", "<p>Join today: The First Acquisition, free with my newsletter.</p>"],
  ["subscribers get it free", "<p>Newsletter subscribers get it free.</p>"],
  ["subscribers get free, no title", "<p>Is there a free book? Newsletter subscribers get free.</p>"],
  ["Free Prequel in <title>", "<title>Reese Astor's Newsletter | Free Prequel & Release Alerts</title>"],
  ["Free Prequel in og:title", '<meta property="og:title" content="Free Prequel | Reese Astor">'],
  ["Free Prequel in twitter:title", '<meta name="twitter:title" content="Free Prequels from Reese Astor">'],
  ["join and newsletter in the next sentence only", "<p>Free prequel. Join my newsletter.</p>"],
  ["newsletter without join", "<p>The First Acquisition is free for my newsletter readers.</p>"],
  ["Reader's Club join-free abused next to a prequel", "<p>Join free and get The First Acquisition.</p>"],
  ["KU line in the same section as a prequel", "<p>The Billionaire's One Night Stand</p><p>Read free with Kindle+ (formerly Kindle Unlimited).</p>"],
  ["empty span split", "<p>The First Acquisition, fr<span></span>ee.</p>"],
  ["math bold letters", "<p>The First Acquisition, \u{1D41F}\u{1D42B}\u{1D41E}\u{1D41E}.</p>"],
  ["double-encoded entity", "<p>The First Acquisition, fr&amp;#101;e.</p>"],
  ["named entity in caps", "<p>THE FIRST ACQUISITION, F&#82;EE</p>"],
  ["aria-label", '<a aria-label="Get The First Acquisition free" href="/free-book">Go</a>'],
  ["meta description", '<meta name="description" content="Download The First Acquisition for free.">'],
  ["$0.00 near a prequel", "<p>The Billionaire's One Night Stand: $0.00</p>"],
  ["at no charge", "<p>The Photograph He Kept, at no charge.</p>"],
  ["100% FREE banner", "<div>100% FREE</div>"],
  ["Greek and Cyrillic mix", "<p>The First Acquisition, \u0444ree or fr\u03B5e.</p>".replace("\u0444ree", "fr\u0435\u0435")],
  ["TSX source CTA without title", 'export const X = () => <Button>Start reading free</Button>;'],
  ["TSX source label", 'const offer = { label: "Free with my newsletter" };'],
  ["llms.txt: KU line on the prequel's own list item", "- [The First Acquisition](https://x): Prequel. Read free with Kindle+ (formerly Kindle Unlimited)."],
  ["free of charge next to a prequel", "<p>The First Acquisition, free of charge.</p>"],
  ["DB post v3 wording (row 8)", "<p><em>The prequel novella is free if you want to test the waters.</em></p>"],
  ["DB post v3 wording (rows 4, 9)", "<p>Start the series free: The prequel novella, The Billionaire's One Night Stand, is available as a free download.</p>"],
  ["DB post v3 wording (row 11)", "<p>The prequel novella The Billionaire's One Night Stand is free on my site.</p>"],
  ["llms.txt: bare free on a prequel item", "- [The Billionaire's One Night Stand](https://x): Manhattan Money Kings prequel, free"],
];
const PE_MUST_PASS: [string, string][] = [
  ["join first", "<p>Join my newsletter and get The First Acquisition free.</p>"],
  ["third person they", "<p>Tell a friend: The First Acquisition is free when they join my newsletter.</p>"],
  ["/read wording", "<h3>Free when you join the newsletter</h3>"],
  ["FAQ wording", "<summary>Is there a free book when I join the newsletter?</summary>"],
  ["Reader's Club, no prequel nearby", "<button>Join Reader's Club (Free)</button>"],
  ["KU card on a series page (its own card container), prequel in another section", "<section><div><h3>Hostile Tender</h3><ul><li>One night stand</li></ul><a>Read free with Kindle+ (formerly Kindle Unlimited).</a></div></section><section><h2>The First Acquisition, free when you join the newsletter</h2></section>"],
  ["royalty-free", "<p>Royalty-free photo.</p>"],
  ["free-book route", '<a href="/free-book">Newsletter prequel</a>'],
  ["free of = rid of (post 12, Amazon blurb)", "<p>A one-night stand with Theo Silva, a heroine almost free of a toxic marriage.</p>"],
  ["DB post v4 wording (row 13)", "<p>A reader magnet is the free book or bonus content readers get when they join your newsletter.</p>"],
  ["llms.txt: KU item under a prequel item", "- [The First Acquisition](https://x): Prequel.\n- [Hostile Tender](https://y): Book 1. Read free with Kindle+ (formerly Kindle Unlimited)."],
];

type Opts = { kind?: "html" | "source" };
const kindOf = (h: string): Opts | { kind: "markdown" } =>
  /^(?:export|const) /.test(h) ? { kind: "source" } : /^- \[/.test(h) ? { kind: "markdown" } : {};

// QA rule 2026-10-30 and ruling (c) of the v3 card: a prequel 'free' passes only with "join" and
// "newsletter" in the same sentence or UI element.
describe("free wording (newsletter-only prequels)", () => {
  it("catches all of QA's v3 must-fail probes and keeps QA's controls clean", () => {
    const missed = QA_MUST_FAIL.filter(([, h]) => scan(h).length === 0).map(([n]) => n);
    const flagged = QA_MUST_PASS.filter(([, h]) => scan(h).length > 0).map(([n]) => n);
    expect(missed).toEqual([]);
    expect(flagged).toEqual([]);
    expect(QA_MUST_FAIL.length).toBe(26);
    expect(QA_MUST_PASS.length).toBe(6);
  });

  it("v5: cases QA's v4 rulings 2 and 3 turned into must-fail", () => {
    expect(RULED_NOW_FAIL.filter(([, h]) => scan(h, kindOf(h)).length === 0).map(([n]) => n)).toEqual([]);
  });
  it("catches PE's added probes and keeps PE's controls clean", () => {
    const missed = PE_MUST_FAIL.filter(([, h]) => scan(h, kindOf(h)).length === 0).map(([n]) => n);
    const flagged = PE_MUST_PASS.filter(([, h]) => scan(h, kindOf(h)).length > 0).map(([n, h]) => `${n}: ${JSON.stringify(scan(h, kindOf(h)))}`);
    expect(missed).toEqual([]);
    expect(flagged).toEqual([]);
  });

  it("the QA v3 S1 strings are gone from sources, /read pages and the prerender", () => {
    const BANNED = /free\s+with\s+(?:my\s+|the\s+|her\s+)?newsletter|newsletter\s+subscribers\s+get\s+(?:it\s+)?free|free book for newsletter subscribers/i;
    const TITLE_CASE = /Free Prequel/; // the title-case form used in page titles
    const files = [
      ...fs.globSync("client/src/**/*.{ts,tsx}", { cwd: root }).filter((f) => !/\.test\./.test(f)),
      ...fs.globSync("client/public/read/**/*.html", { cwd: root }),
      "scripts/prerender-static.mjs",
    ];
    const hits = files.filter((f) => { const t = fs.readFileSync(path.join(root, f), "utf8"); return BANNED.test(t) || TITLE_CASE.test(t); });
    expect(hits).toEqual([]);
    const fb = fs.readFileSync(path.join(root, "client/src/pages/FreeBook.tsx"), "utf8");
    expect(fb.split("The First Acquisition: Free When You Join My Newsletter").length - 1).toBe(2);
    const nl = fs.readFileSync(path.join(root, "client/src/pages/Newsletter.tsx"), "utf8");
    expect(nl.split("Reese Astor's Newsletter | Prequel & Release Alerts").length - 1).toBe(2);
    for (const f of fs.globSync("client/public/read/*/index.html", { cwd: root })) {
      const h = fs.readFileSync(path.join(root, f), "utf8");
      if (/Is there a free book/.test(h)) expect(h.split("Is there a free book when I join the newsletter?").length - 1, f).toBe(2); // visible + FAQ JSON-LD
    }
  });

  it("client sources have no bare 'free' near a prequel", () => {
    const files = fs.globSync("client/src/**/*.{ts,tsx}", { cwd: root }).filter((f) => !/\.test\./.test(f));
    expect(files.length).toBeGreaterThan(50);
    const hits = files.flatMap((f) => scan(fs.readFileSync(path.join(root, f), "utf8"), { kind: "source" }).map((h) => `${f}: ${h.sentence}`));
    expect(hits).toEqual([]);
  });

  it("static /read pages have no bare 'free' near a prequel", () => {
    const files = fs.globSync("client/public/read/**/*.html", { cwd: root });
    expect(files.length).toBeGreaterThan(10);
    const hits = files.flatMap((f) => scan(fs.readFileSync(path.join(root, f), "utf8")).map((h) => `${f}: ${h.sentence}`));
    expect(hits).toEqual([]);
  });

  it("blog-posts/*.md (= the DB bodies after 01-forward-update.sql) pass the guard as the production prerender renders them", () => {
    // Production builds have DATABASE_URL, so scripts/prerender-static.mjs prerenders every published, non-retired post
    // through write() and this guard. Render each .md the same way (esc + mdToHtml copied from the prerender).
    const pre = fs.readFileSync(path.join(root, "scripts/prerender-static.mjs"), "utf8");
    const escSrc = pre.match(/const esc = \(s = ""\) =>[\s\S]*?;\n/)?.[0];
    const mdSrc = pre.match(/function mdToHtml\(md = ""\) \{[\s\S]*?\n\}\n/)?.[0];
    expect(escSrc && mdSrc).toBeTruthy();
    const { esc, mdToHtml } = new Function(`${escSrc}\n${mdSrc}\nreturn { esc, mdToHtml };`)() as { esc: (s: string) => string; mdToHtml: (s: string) => string };
    // Retired slugs are never prerendered (RETIRED_BLOG_SLUGS), so they are skipped as the prerender skips them.
    const files = fs.globSync("blog-posts/*.md", { cwd: root }).filter((f) => !(RETIRED_BLOG_SLUGS as readonly string[]).includes(path.basename(f, ".md")));
    expect(files.length).toBeGreaterThan(9);
    const hits = files.flatMap((f) => {
      const t = fs.readFileSync(path.join(root, f), "utf8");
      const html = `<article><h1>${esc(t.split("\n")[0].replace(/^# /, ""))}</h1>${mdToHtml(t.replace(/^# .*\n+/, ""))}</article>`;
      return scan(html).map((h) => `${f}: ${h.sentence}`);
    });
    expect(hits).toEqual([]);
  });

  it("/free-book sets the exact description used for meta, og and twitter", () => {
    const D = "Start the Hudson Dynasty with The First Acquisition, free when you join my newsletter.";
    expect(fs.readFileSync(path.join(root, "client/src/pages/FreeBook.tsx"), "utf8")).toContain(`description="${D}"`);
    const pre = fs.readFileSync(path.join(root, "scripts/prerender-static.mjs"), "utf8");
    expect(pre).toContain(`"${D}"`);
    expect(pre).toMatch(/property="og:description" content="\$\{esc\(desc\)\}"/);
    expect(pre).toMatch(/name="twitter:description" content="\$\{esc\(desc\)\}"/);
  });

  it("SEO title/description on the offer pages fit the SPA limits (60/160), so truncation never drops 'newsletter'", () => {
    for (const f of ["Home", "FreeBook", "Newsletter", "ReaderClub"]) {
      const src = fs.readFileSync(path.join(root, `client/src/pages/${f}.tsx`), "utf8");
      for (const m of src.matchAll(/\n\s+title="([^"]*)"/g)) expect(m[1].length, `${f} title: ${m[1]}`).toBeLessThanOrEqual(60);
      for (const m of src.matchAll(/\n\s+description="([^"]*)"/g)) expect(m[1].length, `${f} description: ${m[1]}`).toBeLessThanOrEqual(160);
    }
    const seo = fs.readFileSync(path.join(root, "client/src/components/ui/enhanced-seo-head.tsx"), "utf8");
    expect(seo).toContain("title.length > 60");
    expect(seo).toContain("description.length > 160");
  });

  it("the prerender fails the build on a bare 'free' in any page or llms.txt", () => {
    const pre = fs.readFileSync(path.join(root, "scripts/prerender-static.mjs"), "utf8");
    expect(pre).toMatch(/function write\(route, html\) \{\s*assertNoBareFree\(route, html\);/);
    expect(pre).toContain('assertNoBareFree("llms.txt", llms, { kind: "markdown" });');
    expect(pre).toMatch(/if \(hits\.length\) throw new Error/);
  });
});
