import { describe, expect, it } from "vitest";
import { RETIRED_BLOG_SLUGS } from "../../shared/const";
import {
  articlePlainText,
  checkBlogReadiness,
  MIN_ARTICLE_WORDS,
  type ReadinessPost,
} from "./blogReadiness";

const prose = Array.from(
  { length: 100 },
  () => "Readers enjoy thoughtful stories with memorable characters."
).join(" ");
const post: ReadinessPost = {
  title: "A comfortable reading night",
  slug: "comfortable-reading-night",
  excerpt: "A practical guide to making time for your next book.",
  content: prose,
  category: "Reading",
};

describe("scheduled article readiness", () => {
  it("accepts reviewed prose without subjective bans on old marketing language", () => {
    expect(
      checkBlogReadiness({
        ...post,
        content: `${prose} My absolute essential is this candle. I tested it and your back will thank you.`,
      }).ready
    ).toBe(true);
  });

  it.each(["title", "excerpt", "category", "content"] as const)(
    "rejects empty/markup-only %s",
    field => {
      expect(
        checkBlogReadiness({ ...post, [field]: "<p>&nbsp; &#32; \u200b</p>" })
          .issues
      ).toContainEqual(
        expect.stringContaining(`${field}: add meaningful text`)
      );
    }
  );

  it("requires a short summary and a structurally nontrivial article", () => {
    expect(checkBlogReadiness({ ...post, excerpt: "Read this" }).ready).toBe(
      false
    );
    expect(
      checkBlogReadiness({
        ...post,
        content: "word ".repeat(MIN_ARTICLE_WORDS - 1),
      }).ready
    ).toBe(false);
    expect(
      checkBlogReadiness({
        ...post,
        content: "word ".repeat(MIN_ARTICLE_WORDS),
      }).ready
    ).toBe(true);
  });

  it.each([
    "Lorem ipsum",
    "[insert content here]",
    "{{article_body}}",
    "[TODO]",
  ])("rejects explicit placeholder %s", placeholder => {
    expect(
      checkBlogReadiness({ ...post, content: `${prose} ${placeholder}` }).issues
    ).toContain("content: replace explicit placeholder text");
  });

  it.each([
    "TODO",
    "**TODO**",
    "# Untitled post",
    "<h1>TODO</h1>",
    "Untitled post",
    "Coming soon",
    "Placeholder",
  ])("rejects whole-field placeholder %s", title => {
    expect(checkBlogReadiness({ ...post, title }).ready).toBe(false);
  });

  it("shares all retired-slug suppressions and requires a valid slug", () => {
    for (const slug of RETIRED_BLOG_SLUGS) {
      expect(checkBlogReadiness({ ...post, slug }).issues).toContainEqual(
        expect.stringContaining("article is retired")
      );
    }
    expect(checkBlogReadiness({ ...post, slug: "" }).ready).toBe(false);
  });

  it.each([
    "[product](https://www.amazon.com/dp/YOUR_ASIN?tag=88away0d-20)",
    '<a href="https://www.amazon.com/dp/B123?tag=88away0d-20">product</a>',
    "<a href='https://www.amazon.com/gp/product/B0XXXXXXXX'>product</a>",
    "<a href=https://www.amazon.com/dp/B000000000>product</a>",
    "[product][p]\n[p]: https://www.amazon.com/dp/INVALID",
    "[product](https://www.amazon.com/s?k=candle&tag=88away0d-20)",
    "[product](https://www.amazon.com/dp/B07WNRN9WQ?tag=YOUR_TAG)",
    "[product](https://amazon.com.evil.test/dp/B07WNRN9WQ)",
    "[product](https://amzn.to/)",
    "[product](https://example.com/product)",
    "[product](javascript:alert)",
    "[product](not-a-url)",
    "[product]()",
  ])("rejects placeholder or invalid link: %s", link => {
    expect(
      checkBlogReadiness({ ...post, content: `${prose}\n${link}` }).ready
    ).toBe(false);
  });

  it.each([
    "https://www.amazon.com/dp/B07WNRN9WQ?tag=88away0d-20",
    "https://www.amazon.com/name/dp/B07WNRN9WQ?tag=reeseastor-20",
    "https://www.amazon.co.uk/gp/product/B07WNRN9WQ",
    "https://amzn.to/3AbcDef",
    "https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX",
    "https://dl.bookfunnel.com/kw1yge3479",
    "/books",
    "#reading",
  ])("accepts valid link without changing configured tags: %s", href => {
    expect(
      checkBlogReadiness({ ...post, content: `${prose}\n[Read](${href})` })
        .ready
    ).toBe(true);
  });

  it("supports HTML entities in links and does not leak private URL values in issues", () => {
    expect(
      checkBlogReadiness({
        ...post,
        content: `${prose}<a href="https://www.amazon.com/dp/B07WNRN9WQ?ref=reader&amp;tag=88away0d-20">Light</a>`,
      }).ready
    ).toBe(true);
    const result = checkBlogReadiness({
      ...post,
      content: `${prose} [x](https://user:private@shop.test/item)`,
    });
    expect(result.ready).toBe(false);
    expect(result.issues.join(" ")).not.toContain("private");
  });

  it("derives read time at 220 words/minute from visible prose, excluding markup and destinations", () => {
    const content = `<h2>Reading</h2><p>${"word ".repeat(219)}</p><!-- invisible words --><script>invisible words</script>![image](https://image.test/words)`;
    expect(checkBlogReadiness({ ...post, content }).readTime).toBe(
      "1 min read"
    );
    expect(
      checkBlogReadiness({ ...post, content: `${content} extra` }).readTime
    ).toBe("2 min read");
    expect(
      articlePlainText("[book](https://books.test/long-url) &amp; reading")
    ).toBe("book & reading");
  });
});
