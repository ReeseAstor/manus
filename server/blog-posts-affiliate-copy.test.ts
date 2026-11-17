import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  SEED_RETIRED_SLUGS,
  SEED_UNAVAILABLE_ASINS,
  assertSeedableBlogCopy,
} from "../scripts/seed-blog-posts";

const BLOG_DIR = path.join(import.meta.dirname ?? __dirname, "..", "blog-posts");
const PRICE_NEAR_AMAZON = /(?:\$\s*\d|\d[\d,]*\s*dollars?|around\s+\$)/i;
const AMAZON_LINK = /https?:\/\/(?:www\.)?amazon\.com\/\S+/i;
const EM_OR_EN_DASH = /[\u2013\u2014]/;
const OLD_NAMES = [
  /Original Shredded/i,
  /Latest Model/i,
  /Glocusent LED Book Light/i,
  /Huglanket/i,
  /mahogany/i,
];

function seededPosts(): { slug: string; file: string; text: string }[] {
  return readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.md$/, ""),
      file,
      text: readFileSync(path.join(BLOG_DIR, file), "utf8"),
    }))
    .filter((post) => !SEED_RETIRED_SLUGS.has(post.slug));
}

describe("seeded blog-posts affiliate copy", () => {
  it("contains no static Amazon prices next to Amazon links", () => {
    for (const post of seededPosts()) {
      const paragraphs = post.text.split(/\n\s*\n/);
      for (const paragraph of paragraphs) {
        if (AMAZON_LINK.test(paragraph) && PRICE_NEAR_AMAZON.test(paragraph)) {
          expect.fail(`${post.file} has a $ price next to an Amazon link: ${paragraph.slice(0, 180)}`);
        }
      }
      const priced = post.text.match(/\$\s*\d[\d,]*(?:\.\d+)?/g) ?? [];
      expect(priced, `${post.file} still states a dollar amount`).toEqual([]);
    }
  });

  it("does not use unavailable ASINs, old product names, mahogany, or typographic dashes", () => {
    for (const post of seededPosts()) {
      for (const asin of SEED_UNAVAILABLE_ASINS) {
        expect(post.text, `${post.file} still links ${asin}`).not.toContain(asin);
      }
      for (const pattern of OLD_NAMES) {
        expect(post.text, `${post.file} still matches ${pattern}`).not.toMatch(pattern);
      }
      expect(post.text, `${post.file} contains an em or en dash`).not.toMatch(EM_OR_EN_DASH);
    }
  });

  it("is accepted by the seed copy guard", () => {
    for (const post of seededPosts()) {
      expect(() => assertSeedableBlogCopy(post.text, post.slug)).not.toThrow();
    }
  });

  it("refuses to seed unavailable ASINs, prices, and old names", () => {
    expect(() => assertSeedableBlogCopy("See https://www.amazon.com/dp/B0CW63NL9F?tag=reeseastor-20", "x")).toThrow(
      /unavailable ASIN B0CW63NL9F/,
    );
    expect(() => assertSeedableBlogCopy("The Husband Pillow Original Shredded Memory Foam", "x")).toThrow(
      /Original Shredded/,
    );
    expect(() => assertSeedableBlogCopy('The Glocusent LED Book Light is a gift. Around $13.', "x")).toThrow();
    expect(() => assertSeedableBlogCopy("Kindle Paperwhite (7-inch Display, Latest Model)", "x")).toThrow(
      /Latest Model/,
    );
    expect(() => assertSeedableBlogCopy("The Huglanket Book Lovers Wearable Blanket Hoodie", "x")).toThrow(
      /Huglanket/,
    );
    expect(() => assertSeedableBlogCopy("Notes of mahogany and leather", "x")).toThrow(/mahogany/);
    expect(() => assertSeedableBlogCopy("A cozy night\u2014finally", "x")).toThrow(/em or en dash/);
    expect(() => assertSeedableBlogCopy("Around $180 for the Kindle", "x")).toThrow(/static Amazon price/);
    expect(() => assertSeedableBlogCopy("The 6.8-inch screen is the sweet spot.", "x")).toThrow(/6\.8-inch/);
    expect(() => assertSeedableBlogCopy("### The Fall Risk by Abby Jimenez", "x")).toThrow(/Fall Risk/);
    expect(() => assertSeedableBlogCopy("It appeared on every list, all 52 weeks.", "x")).toThrow(/52-week/);
    expect(() => assertSeedableBlogCopy("a heroine who kept Vivi secret for years.", "x")).toThrow(/kept Vivi secret for years/);
    expect(() => assertSeedableBlogCopy("a heroine who kept Vivi a secret.", "x")).not.toThrow();
  });
});
