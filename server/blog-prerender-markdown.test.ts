import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { PRODUCT_LINK_REL } from "../client/src/data/affiliateProducts";
import { renderBlogMarkdownToHtml } from "../scripts/lib/render-blog-markdown";

const BLOG_DIR = path.resolve(import.meta.dirname, "../blog-posts");

describe("blog markdown prerender (shared with the client reader)", () => {
  it("converts markdown links into real anchors with client affiliate attributes", () => {
    const html = renderBlogMarkdownToHtml(
      "A warm blanket and a [bookish candle](https://www.amazon.com/dp/B087YPT934?tag=reeseastor-20) complete the setup.",
    );
    expect(html).toContain(
      '<a href="https://www.amazon.com/dp/B087YPT934?tag=reeseastor-20" target="_blank" rel="' +
        PRODUCT_LINK_REL +
        '">bookish candle',
    );
    expect(html).not.toContain("](http");
    expect(html).not.toContain("[bookish candle]");
    expect(html).toContain("affiliate link");
  });

  it("keeps internal links in-page and marks other external links", () => {
    const html = renderBlogMarkdownToHtml(
      "[Reading list](/books)\n\n[Resource](https://example.com)",
    );
    expect(html).toContain('<a href="/books">Reading list</a>');
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain(PRODUCT_LINK_REL);
  });

  it("renders thematic breaks as hr instead of a literal dash paragraph", () => {
    const html = renderBlogMarkdownToHtml(
      "The last paragraph.\n\n---\n\nDisclosure: As an Amazon Associate I earn from qualifying purchases.",
    );
    expect(html).toMatch(/<hr\s*\/?>/);
    expect(html).not.toContain("<p>---</p>");
    expect(html).not.toMatch(/<p>\s*---\s*<\/p>/);
    expect(html).toContain("Disclosure:");
  });

  it("does not inject raw HTML or javascript URLs", () => {
    const html = renderBlogMarkdownToHtml(
      '<script>alert("bad")</script>\n\n[Bad](javascript:alert%281%29)\n\n<img src="x" onerror="alert(1)">\n\n## A quiet note',
    );
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('href="javascript:');
    expect(html).not.toContain("onerror=");
    expect(html).toContain("<h2>A quiet note</h2>");
  });

  it("turns every seedable blog post's markdown links into anchors and drops literal hr text", () => {
    const files = readdirSync(BLOG_DIR).filter((file) => file.endsWith(".md"));
    expect(files.length).toBeGreaterThan(0);
    let rawLinks = 0;
    let dashParagraphs = 0;
    let amazonAnchors = 0;
    for (const file of files) {
      const md = readFileSync(path.join(BLOG_DIR, file), "utf8");
      const html = renderBlogMarkdownToHtml(md);
      const raw = html.match(/\]\(https?:/g) ?? [];
      const dashes = html.match(/<p>\s*---\s*<\/p>/g) ?? [];
      rawLinks += raw.length;
      dashParagraphs += dashes.length;
      amazonAnchors += (html.match(/<a href="https:\/\/www\.amazon\.com\/dp\/[^"]+"[^>]*>/g) ?? []).length;
      expect(html, file).not.toContain("](http");
      expect(html, file).not.toMatch(/<p>\s*---\s*<\/p>/);
    }
    expect(rawLinks).toBe(0);
    expect(dashParagraphs).toBe(0);
    expect(amazonAnchors).toBeGreaterThanOrEqual(29);
  });
});

describe("client markdown module stays browser-safe", () => {
  it("does not import react-dom/server or renderToStaticMarkup", () => {
    const source = readFileSync(
      path.resolve(import.meta.dirname, "../client/src/lib/blog-markdown.tsx"),
      "utf8",
    );
    const reader = readFileSync(
      path.resolve(import.meta.dirname, "../client/src/components/BlogReader.tsx"),
      "utf8",
    );
    expect(source).not.toContain("react-dom/server");
    expect(source).not.toContain("renderToStaticMarkup");
    expect(reader).not.toContain("react-dom/server");
    expect(reader).not.toContain("renderToStaticMarkup");
    expect(reader).toContain("BlogArticleMarkdown");
    expect(reader).not.toContain("renderBlogMarkdownToHtml");
  });
});
