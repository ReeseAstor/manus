import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const read = (slug: string) => readFileSync(path.join(__dirname, `../blog-posts/${slug}.md`), "utf8");

// QA card v2 (2026-10-30) W1-W3: blog copy must follow the Amazon descriptions and the books' real settings.
describe("blog facts (QA v2 R1-R3)", () => {
  const post12 = read("secret-baby-romance-books-guide");
  const post9 = read("nyc-romance-books-manhattan-guide");

  it("post 12: The Billionaire's Baby Secret follows Amazon (almost four years, Chicago weekend, eleven calls)", () => {
    expect(post12).not.toMatch(/three years/i);
    expect(post12).toContain("Almost four years ago, Sophia Reed spent one snowbound weekend in Chicago with Dominic Kane.");
    expect(post12).toContain("She called Dominic eleven times");
    expect(post12).toContain("by Thursday");
    for (const gone of ["hotel room", "left Manhattan", "never planned to reveal", "walked away", "keeping her daughter hidden", "reluctant hero"])
      expect(post12, gone).not.toContain(gone);
  });

  it("post 12: Reckless is a one-night stand and a plus sign, not a years-long hidden daughter", () => {
    expect(post12).toContain("a one-night stand with rowdy bull rider Theo Silva");
    expect(post12).not.toMatch(/kept their daughter secret|reveal scene/i);
  });

  it("post 9: Part of Your World is set in Minneapolis and Wakan, Minnesota", () => {
    expect(post9).not.toContain("life in New York");
    expect(post9).toContain("Minneapolis");
    expect(post9).toContain("Wakan");
  });
});
