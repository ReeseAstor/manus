import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BOOKS } from "../client/src/data/books";

const SLUG = "best-billionaire-romance-series-2024";
const md = readFileSync(path.join(__dirname, `../blog-posts/${SLUG}.md`), "utf8");
const title = md.split("\n")[0].replace(/^# /, "");

describe(`blog post 4 source (${SLUG})`, () => {
  it("title carries no year that could disagree with the slug", () => {
    expect(title).toBe("Best Billionaire Romance Series to Binge-Read");
    expect(title).not.toMatch(/\b20\d\d\b/);
  });
  it("has no em or en dashes and no Elsie Silver section", () => {
    expect(md).not.toMatch(/[\u2014\u2013]/);
    expect(md).not.toMatch(/Elsie Silver|Chestnut Springs/);
  });
  it("lists all four Manhattan Money Kings books with canon leads", () => {
    for (const n of [1, 2, 3, 4]) expect(md).toMatch(new RegExp(`### Book ${n}: The Billionaire's `));
    const nanny = BOOKS.find((b) => b.slug === "the-billionaires-forbidden-nanny")!;
    expect(md).toContain("### Book 4: The Billionaire's Forbidden Nanny");
    for (const c of nanny.characters) expect(md).toContain(`**${c}**`);
    expect(md).toContain("*Tropes: Nanny Romance, Single Dad, Forbidden Romance*");
    expect(md).toContain("four unforgettable love stories");
  });
});
