import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BlogReader } from "../client/src/components/BlogReader";

const render = (content: string) => renderToStaticMarkup(createElement(BlogReader, { slug: "reading-notes", content }));

describe("article reader rendering", () => {
  it("normalizes old product tags and marks inline affiliate links", () => {
    const html = render("[A book light](https://www.amazon.com/dp/B07WNRN9WQ?tag=88away0d-20)");
    expect(html).toContain("tag=reeseastor-20");
    expect(html).not.toContain("tag=88away0d-20");
    expect(html).toContain('rel="sponsored noopener noreferrer nofollow"');
    expect(html).toContain("affiliate link");
  });
  it("preserves internal reading links and protects external links", () => {
    const html = render("[Reading list](/books)\n\n[Resource](https://example.com)");
    expect(html).toContain('<a href="/books">Reading list</a>');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("opens in a new tab");
  });
  it("does not execute raw HTML or unsafe markdown URLs", () => {
    const html = render('<script>alert("bad")</script>\n\n[Bad](javascript:alert%281%29)\n\n## A quiet note');
    expect(html).not.toContain("<script>");
    expect(html).not.toContain('href="javascript:');
    expect(html).toContain("<h2>A quiet note</h2>");
  });
  it("preserves rich-text CMS paragraphs and headings while sanitizing attributes", () => {
    const html = render('<h2>Reading rituals</h2><p>A quiet evening.</p><img src="/reading.jpg" onerror="alert(1)"><a href="https://www.amazon.com/dp/B07WNRN9WQ?tag=88away0d-20" onclick="alert(1)">Book light</a>');
    expect(html).toContain("<h2>Reading rituals</h2>");
    expect(html).toContain("<p>A quiet evening.</p>");
    expect(html).toContain("tag=reeseastor-20");
    expect(html).toContain('rel="sponsored noopener noreferrer nofollow"');
    expect(html).not.toContain("onerror=");
    expect(html).not.toContain("onclick=");
  });
  it("offers reading preferences without requiring storage or an account", () => {
    const html = render("A quiet note.");
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain("Remember my place on this device");
    expect(html).not.toContain('checked=""');
    expect(html).not.toContain("<form");
  });
});
