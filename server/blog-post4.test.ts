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
  it("F1: Book 3 timing matches Amazon, word for word (QA CARD-v6 F1, 10/31/2026)", () => {
    expect(md).toContain(
      "Book 3 brings together **Dominic Kane** and **Sophia Reed** in a second chance romance that will have you reaching for tissues. Almost four years ago, she called him eleven times. Now he's back, and her daughter has his eyes.",
    );
    expect(md).toContain("*Tropes: A secret baby and a second chance, A single mom who sets the rules*");
    expect(md).not.toMatch(/three years/i);
  });
  it("QA CARD-v6 F1: Book 4 paragraph is the exact card text (no paraphrased child words)", () => {
    expect(md).toContain(
      "**Camille Torres** takes a live-in job in billionaire **Ethan Calloway**'s Park Avenue penthouse and never expects to become the family they both need. Ethan hasn't smiled since his wife died, and seven nannies have left in two years. The last thing he needs is a nanny with quick wit, warm hands, and a mouth that talks back.",
    );
    expect(md).not.toMatch(/silent daughter|storm-gray|five-year-old|Secret baby\?/i);
    expect(md).toContain("*For readers 18+.*");
  });
});

describe("blog post 4: Amazon links (QA F2)", () => {
  it("post 4's third-party links use the verified ASINs, each tagged reeseastor-20 exactly once", () => {
    for (const a of ["B0B36FKPS8", "B08Y6DCS1Y", "B00TG1CZFC", "B0CFPJYX7P", "B0C9TWJKP5"]) expect(md).toContain(`https://www.amazon.com/dp/${a}?tag=reeseastor-20)`);
    for (const m of md.matchAll(/https:\/\/www\.amazon\.com\/[^\s)]+/g)) expect(m[0].match(/tag=/g)?.length, m[0]).toBe(1);
  });
});

