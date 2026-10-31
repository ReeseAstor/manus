import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
// @ts-expect-error plain .mjs module without types
import { bareFreeClaims } from "../scripts/lib/free-wording-guard.mjs";

type Hit = { sentence: string; near: string };
const scan = bareFreeClaims as (src: string, opts?: { kind?: "html" | "source" }) => Hit[];
const root = path.join(__dirname, "..");

// QA rule 2026-10-30: The First Acquisition, The Billionaire's One Night Stand and The Photograph He Kept are
// free only when you join the newsletter ($0.99 in stores). A bare "free" near them fails.
describe("free wording (newsletter-only prequels)", () => {
  it("flags a bare 'free' near a prequel title and accepts the newsletter-qualified wording", () => {
    for (const bad of [
      "<p>Get The First Acquisition free</p>",
      "<p>100% FREE</p><h1>The First Acquisition</h1>",
      "<h2>Get Your Free Book</h2>",
      "<p>Start here, free.</p><p>The Billionaire's One Night Stand</p>",
      "<p>The Photograph He Kept is free.</p>",
      "<p>Read the prequel free</p>",
      '<meta name="description" content="Download The First Acquisition for free.">',
    ])
      expect(scan(bad), bad).not.toEqual([]);
    for (const ok of [
      "<p>Start the Hudson Dynasty with The First Acquisition, free when you join my newsletter.</p>",
      "<p>Free prequel when you join my newsletter.</p>",
      "<p>Start here · Free when you join my newsletter</p><h1>The First Acquisition</h1>",
      "<p>Poison Pill. Read free with Kindle+ (formerly Kindle Unlimited).</p><p>The First Acquisition</p>",
      "<p>Read on any Kindle or in the free Kindle app.</p><p>The First Acquisition</p>",
      '<a href="/free-book">The First Acquisition</a>',
    ])
      expect(scan(ok), ok).toEqual([]);
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
    expect(pre).toContain('assertNoBareFree("llms.txt", llms);');
    expect(pre).toMatch(/if \(hits\.length\) throw new Error/);
  });
});
