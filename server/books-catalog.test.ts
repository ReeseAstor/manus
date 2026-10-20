import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BOOKS } from "../client/src/data/books";

describe("static book catalog", () => {
  it("matches the confirmed series order and ASINs", () => {
    const labels = BOOKS.map((book) => [book.slug, book.position_label, book.asin]);
    expect(labels).toEqual([
      ["the-billionaires-one-night-stand", "Prequel", "B0DSG7NKGP"],
      ["the-billionaire-s-executive-assistant", "Book 1", "B0F2W8QL7S"],
      ["the-billionaire-s-fake-wife", "Book 2", "B0FCCBNF8X"],
      ["the-billionaire-s-baby-secret", "Book 3", "B0G12LBZ24"],
      ["the-billionaires-forbidden-nanny", "Book 4", "B0GDZ4T164"],
      ["the-first-acquisition", "Prequel novella", "B0D82GWFD9"],
      ["hostile-tender", "Book 1", "B0H1F9PV97"],
      ["poison-pills", "Book 2", "B0H53BP5S1"],
      ["golden-parachute", "Book 3", "B0HDKNP9F6"],
    ]);
    expect(BOOKS.some((book) => book.slug === "the-need-for-permission")).toBe(false);
  });

  it("uses plain Amazon links for the prequel and the Fake Wife ebook", () => {
    const ons = BOOKS.find((book) => book.slug === "the-billionaires-one-night-stand");
    const fakeWife = BOOKS.find((book) => book.slug === "the-billionaire-s-fake-wife");
    expect(ons?.retailers.amazon_kindle).toBe("https://www.amazon.com/dp/B0DSG7NKGP");
    expect(fakeWife?.retailers.amazon_kindle).toBe("https://www.amazon.com/dp/B0FCCBNF8X");
    for (const book of BOOKS) {
      const href = book.retailers.amazon_kindle;
      if (href) expect(href.startsWith("https://www.amazon.com/dp/")).toBe(true);
    }
  });

  it("keeps every local cover file in client/public", () => {
    for (const book of BOOKS) {
      for (const image of [book.cover_image, book.cover_image_square]) {
        if (!image?.startsWith("/")) continue;
        const file = path.join(process.cwd(), "client/public", image);
        expect(existsSync(file), `${book.slug} ${image}`).toBe(true);
      }
    }
  });
});
