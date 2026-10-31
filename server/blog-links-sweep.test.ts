import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Dead-link sweep (QA tracked items, 2026-10-30): every replacement was verified live on amazon.com
// (logged out); cards whose product is gone and had product-specific copy were removed, not re-pointed.
describe("blog sources and affiliate data: no dead or wrong Amazon ASINs", () => {
  // ASINs that returned Amazon "Page Not Found" (or the wrong product) on 2026-10-30.
  const DEAD = ["B09MFKDNBY", "B08QGBR5NF", "B00LD1ORBI", "B0CFPJYX2T", "B0D5BDHG7V", "B01N0V3PEI", "B08R4JFQKQ", "B08WJMCFKR",
    "B09BFCGKN8", "B09FGCFZ9S", "B09FJ4YWNG", "B09FKGXQMC", "B0BVTMGK6Y", "B0DKFXNHFV", "B0BT3HLJNQ", "B085HN5DPG", "B0BVNLF7GY",
    "B0BXJH5C3G", "B0C1LBXLG4", "B0CFPN2YMK", "B0F1THN236",
    // /favorites cards whose products are gone (404 on 2026-10-30); cards removed, not re-pointed
    "B08B4GHZ5L", "B0BN9QGKQG", "B0D9FQGQCR"];
  const dir = path.join(__dirname, "../blog-posts");
  const files = readdirSync(dir).filter((f: string) => f.endsWith(".md"));
  const data = ["../client/src/data/affiliateProducts.ts", "../client/src/data/favoritesProducts.ts"].map((f) => path.join(__dirname, f));
  it("no dead or wrong ASIN remains in blog sources or affiliate data", () => {
    for (const f of [...files.map((f: string) => path.join(dir, f)), ...data]) {
      const s = readFileSync(f, "utf8");
      for (const a of DEAD) expect(s.includes(a), `${path.basename(f)} still has ${a}`).toBe(false);
    }
  });
});
