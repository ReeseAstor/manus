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
});
