import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { RETIRED_BLOG_SLUGS } from "../shared/const";
import { BOOKS } from "../client/src/data/books";
import { bookSchema } from "../client/src/data/structured-data";
// @ts-expect-error plain .mjs module without type declarations
import * as md from "../scripts/lib/prerender-markdown.mjs";
// @ts-expect-error plain .mjs module without type declarations
import * as brand from "../scripts/lib/brand-rules.mjs";

const { mdToHtml, safeUrl } = md as { mdToHtml: (s: string) => string; safeUrl: (s: string) => string | undefined };
const { brandHits } = brand as { brandHits: (t: string, mode?: string) => Array<{ rule: string; match: string; context: string }> };

/** Visible text of an HTML fragment as a no-JS reader sees it (block boundaries become newlines). */
function visibleText(html: string) {
  return html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, "")
    .replace(/<\/?(p|li|ul|ol|h[1-6]|hr|blockquote|pre|table|tr|td|th|div)\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

const postsDir = path.join(__dirname, "../blog-posts");
const publicPosts = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => ({ slug: f.replace(/\.md$/, ""), text: fs.readFileSync(path.join(postsDir, f), "utf8") }))
  .filter((p) => !(RETIRED_BLOG_SLUGS as readonly string[]).includes(p.slug));

describe("no-JS blog prerender markdown (QA CARD-v6 F3)", () => {
  it("covers the public posts", () => {
    expect(publicPosts.length).toBeGreaterThanOrEqual(9);
  });

  for (const p of publicPosts) {
    it(`${p.slug}: 0 spaced hyphens, 0 '--', no raw markdown links or bullets in visible text`, () => {
      const html = mdToHtml(p.text);
      const text = visibleText(html);
      const dashes = brandHits(text, "text").filter((x) => x.rule === "DASH");
      expect(dashes.map((d) => d.context)).toEqual([]);
      expect(text).not.toContain("--");
      expect(text).not.toMatch(/\S[ \t\u00A0]+-[ \t\u00A0]+\S/);
      expect(text).not.toMatch(/\]\(https?:/);
      expect(text).not.toMatch(/^\s*[-*] /m);
    });

    it(`${p.slug}: every Amazon link is a real <a> with exactly one tag=reeseastor-20 and a sponsored rel`, () => {
      const html = mdToHtml(p.text);
      const srcLinks = [...p.text.matchAll(/\]\((https:\/\/www\.amazon\.com[^)\s]*)\)/g)].map((m) => m[1]);
      const anchors = [...html.matchAll(/<a href="(https:\/\/www\.amazon\.com[^"]*)"([^>]*)>/g)];
      expect(anchors.length).toBe(srcLinks.length);
      anchors.forEach((a, i) => {
        const href = a[1].replace(/&amp;/g, "&");
        expect(href).toBe(srcLinks[i]);
        expect(href.match(/[?&]tag=/g)?.length).toBe(1);
        expect(href).toContain("tag=reeseastor-20");
        expect(a[2]).toContain('rel="nofollow sponsored noopener noreferrer"');
        expect(a[2]).toContain('target="_blank"');
      });
    });
  }
});

describe("prerender markdown structure", () => {
  const html = mdToHtml(
    "## Setup\n\nIntro with **bold** and *em*.\n\n- **Winter**: cotton\n- Spring: cedar\n\n1. one\n2. two\n\n---\n\n*Disclosure: affiliate links.*\n\n" +
      "[Kindle](https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20) [StoryOrigin](https://storyoriginapp.com?via=reese-astor) " +
      "[Atticus](https://www.atticus.io) [Books](/books) [Home](https://reeseastor.com/) [Mail](mailto:hi@example.com)",
  );
  it("renders headings, lists, hr, emphasis", () => {
    expect(html).toContain("<h2>Setup</h2>");
    expect(html).toMatch(/<ul>\s*<li><strong>Winter<\/strong>: cotton<\/li>\s*<li>Spring: cedar<\/li>\s*<\/ul>/);
    expect(html).toMatch(/<ol>\s*<li>one<\/li>\s*<li>two<\/li>\s*<\/ol>/);
    expect(html).toContain("<hr/>");
    expect(html).toContain("<em>Disclosure: affiliate links.</em>");
    expect(visibleText(html)).not.toMatch(/--|\S - \S/);
  });
  it("renders links with the right rel", () => {
    expect(html).toContain(
      '<a href="https://www.amazon.com/dp/B0CFPJYX7P?tag=reeseastor-20" target="_blank" rel="nofollow sponsored noopener noreferrer">Kindle</a>',
    );
    expect(html).toContain('<a href="https://storyoriginapp.com?via=reese-astor" target="_blank" rel="nofollow sponsored noopener noreferrer">StoryOrigin</a>');
    expect(html).toContain('<a href="https://www.atticus.io" target="_blank" rel="noopener noreferrer">Atticus</a>');
    expect(html).toContain('<a href="/books">Books</a>');
    expect(html).toContain('<a href="https://reeseastor.com/">Home</a>');
    expect(html).toContain('<a href="mailto:hi@example.com">Mail</a>');
  });
  it("never adds or changes an Amazon tag", () => {
    const untagged = mdToHtml("[x](https://www.amazon.com/dp/B000000000)");
    expect(untagged).toContain('href="https://www.amazon.com/dp/B000000000"');
    expect(untagged).not.toContain("tag=");
  });
});

describe("prerender markdown XSS safety", () => {
  const bad = [
    "[a](javascript:alert(1))",
    "[a](JAVASCRIPT:alert(1))",
    "[a](javascript&#58;alert(1))",
    "[a](<java\nscript:alert(1)>)",
    "[a](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)",
    "[a](vbscript:msgbox(1))",
    "[a](//evil.example/x)",
    "[a](/\\evil.example/x)",
    "![i](javascript:alert(1))",
    "[a]: javascript:alert(1)\n\n[a]",
  ];
  for (const s of bad) {
    it(`drops the href/src of ${JSON.stringify(s)}`, () => {
      const html = mdToHtml(s);
      expect(html).not.toMatch(/javascript:|vbscript:|data:text|evil\.example/i);
      expect(html).not.toMatch(/<a [^>]*href=/);
      expect(html).not.toMatch(/<img [^>]*src=/);
    });
  }
  it("drops raw HTML: <script>, event handlers, iframes", () => {
    const html = mdToHtml(
      'Hi\n\n<script>alert(1)</script>\n\n<img src=x onerror="alert(1)">\n\n<iframe src="https://evil.example"></iframe>\n\nInline <b onmouseover="x()">b</b> and <script>y()</script> end.',
    );
    expect(html).not.toMatch(/<script|<img|<iframe|<b\b|onerror|onmouseover/i);
    expect(html).toContain("Hi");
  });
  it("escapes text and attribute values", () => {
    const html = mdToHtml('Use 5 < 6 & "quotes"\n\n[t](https://a.example "x\\" onmouseover=\\"y")');
    expect(html).toContain("5 &lt; 6 &amp; &quot;quotes&quot;");
    expect(html).not.toMatch(/" onmouseover=/);
  });
  it("safeUrl allows only http, https, mailto and relative", () => {
    expect(safeUrl("https://a.example/x")).toBe("https://a.example/x");
    expect(safeUrl("http://a.example")).toBe("http://a.example");
    expect(safeUrl("mailto:a@b.example")).toBe("mailto:a@b.example");
    expect(safeUrl("/books")).toBe("/books");
    expect(safeUrl("#top")).toBe("#top");
    expect(safeUrl("java\tscript:alert(1)")).toBeUndefined();
    expect(safeUrl(" javascript:alert(1)")).toBeUndefined();
    expect(safeUrl("ftp://a.example")).toBeUndefined();
    expect(safeUrl("//a.example")).toBeUndefined();
  });
});

describe("JSON-LD Amazon identifiers stay untagged", () => {
  for (const b of BOOKS) {
    it(`${b.slug}: sameAs and offers.url carry no tag=`, () => {
      const s = bookSchema(b) as { sameAs?: string[]; offers?: { url?: string } };
      for (const u of s.sameAs ?? []) expect(u).not.toMatch(/[?&]tag=/);
      if (s.offers?.url) expect(s.offers.url).not.toMatch(/[?&]tag=/);
    });
  }
});
