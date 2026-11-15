import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";

const guidePath = join(process.cwd(), "blog-posts", "secret-baby-romance-books-guide.md");

/** Amazon pages QA recorded as 404, plus the same dead listings in the seed posts. */
const deadBlogAsins = [
  "B00LD1ORBI",
  "B01N0V3PEI",
  "B085HN5DPG",
  "B08QGBR5NF",
  "B08R4JFQKQ",
  "B09BFCGKN8",
  "B09FGCFZ9S",
  "B09FJ4YWNG",
  "B09FKGXQMC",
  "B09MFKDNBY",
  "B09RQHZ8GG",
  "B0B2PPMV8Y",
  "B0BT3HLJNQ",
  "B0BVNLF7GY",
  "B0BVTMGK6Y",
  "B0BXJH5C3G",
  "B0BXKWXQMJ",
  "B0C1LBXLG4",
  "B0CFPJYX2T",
  "B0CFPN2YMK",
  "B0D5BDHG7V",
  "B0DKFXNHFV",
  "B0F1THN236",
];

describe("secret baby guide house style", () => {
  it("does not use child-coded wording", () => {
    const guide = readFileSync(guidePath, "utf8");
    const banned = [
      /\bchild(?:ren)?\b/i,
      /\blittle ones?\b/i,
      /\bkiddo\b/i,
      /\bkids?\b/i,
      /\btoddler\b/i,
    ];
    for (const pattern of banned) {
      expect(guide).not.toMatch(pattern);
    }
  });
});

describe("blog Amazon links", () => {
  it("does not keep the dead affiliate ASINs in seed markdown", () => {
    const dir = join(process.cwd(), "blog-posts");
    const corpus = readdirSync(dir)
      .filter(name => name.endsWith(".md"))
      .map(name => readFileSync(join(dir, name), "utf8"))
      .join("\n");
    for (const asin of deadBlogAsins) {
      expect(corpus, asin).not.toContain(asin);
    }
  });
});
