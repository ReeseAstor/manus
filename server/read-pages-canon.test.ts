import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BOOKS } from "../client/src/data/books";

const READ_DIR = path.join(__dirname, "../client/public/read");
const pages = fs
  .readdirSync(READ_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(READ_DIR, d.name, "index.html")))
  .map((d) => ({ name: d.name, html: fs.readFileSync(path.join(READ_DIR, d.name, "index.html"), "utf8") }));

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const fakeWife = BOOKS.find((b) => b.slug === "the-billionaire-s-fake-wife")!;
const FW_CHIPS = fakeWife.tropes.map(cap);

describe("/read static pages: canon on marketing surfaces", () => {
  it("never shows the 'Chen' company or surname", () => {
    for (const p of pages) expect(p.html, p.name).not.toMatch(/\bChen\b/);
  });

  it("Fake Wife chips match books.ts tropes wherever a Fake Wife card has chips", () => {
    let cards = 0;
    for (const p of pages) {
      for (const m of p.html.matchAll(/<ul class="chips">(.*?)<\/ul>/g)) {
        const before = p.html.slice(Math.max(0, (m.index ?? 0) - 400), m.index);
        const lastTitle = [...before.matchAll(/The Billionaire’s ([A-Z][a-z]+ ?[A-Za-z]*)/g)].pop()?.[0];
        if (lastTitle !== "The Billionaire’s Fake Wife") continue;
        cards++;
        expect([...m[1].matchAll(/<li>(.*?)<\/li>/g)].map((x) => x[1]), p.name).toEqual(FW_CHIPS);
      }
    }
    expect(cards).toBeGreaterThanOrEqual(2);
  });

  it("Fake Wife page keywords and trope grid match books.ts", () => {
    const fw = pages.find((p) => p.name === "the-billionaires-fake-wife")!;
    expect(fw.html).toContain(`"keywords":"${FW_CHIPS.join(", ")}"`);
    for (const t of FW_CHIPS) expect(fw.html).toContain(`<h3>${t}</h3>`);
    expect(fw.html).not.toMatch(/Pregnant heroine|Protective hero/);
  });

  it("F4: the whole Fake Wife page uses the books.ts tropes (hero bullet, 'Read it if', chips, grid)", () => {
    const fw = pages.find((p) => p.name === "the-billionaires-fake-wife")!;
    const lower = fakeWife.tropes.map((t) => t.toLowerCase());
    const phrase = `${cap(lower[0])}, ${lower.slice(1, -1).join(", ")}${lower.length > 2 ? " and " : ""}${lower[lower.length - 1]}`;
    expect(fw.html).toContain(`<li>${phrase}</li>`);
    expect(fw.html).toContain(`<li>You love ${phrase.charAt(0).toLowerCase()}${phrase.slice(1)}</li>`);
    // no trope wording anywhere on the page that is not in books.ts (the Amazon subtitle "Pregnant and Protected" is allowed: QA ruling)
    const withoutSubtitle = fw.html.split("Pregnant and Protected").join("");
    expect(withoutSubtitle).not.toMatch(/pregnan|protective hero/i);
  });

  it("Baby Secret taglines say 'almost four years' (Amazon), never 'three years'", () => {
    for (const p of pages) expect(p.html, p.name).not.toMatch(/missed three years/i);
    const bs = pages.find((p) => p.name === "the-billionaires-baby-secret")!;
    expect(bs.html).toContain("He missed almost four years. He&#x27;s not missing another day.");
  });
});

describe("books.ts canon vs Amazon (QA F3)", () => {
  it("Baby Secret blurb opens with 'Almost four years ago' and the snowbound Chicago weekend", () => {
    const bs = BOOKS.find((b) => b.slug === "the-billionaire-s-baby-secret")!;
    expect(bs.blurb.startsWith("Almost four years ago, Sophia Reed spent one snowbound weekend in Chicago")).toBe(true);
    expect(bs.blurb).not.toMatch(/three years/i);
  });
});
