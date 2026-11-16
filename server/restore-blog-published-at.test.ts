import { describe, expect, it } from "vitest";
import {
  ORIGINAL_PUBLISHED_AT_BY_SLUG,
  RESTORE_PUBLISHED_AT_SQL,
  parseRestoreArgs,
  planRestore,
  timestampLiteralToUtcIso,
} from "../scripts/restore-blog-published-at";

const CARD_SEEDABLE_DATES: Record<string, string> = {
  "what-i-burn-while-i-write": "2026-08-06 01:35:43.836",
  "ultimate-cozy-reading-night-setup": "2026-08-07 01:35:43.779",
  "secret-baby-romance-books-guide": "2026-08-09 01:35:43.655",
  "romance-reader-gift-guide": "2026-08-10 01:35:43.597",
  "reading-self-care-routine-book-lovers": "2026-08-11 01:35:43.395",
  "nyc-romance-books-manhattan-guide": "2026-08-12 01:35:42.258",
  "enemies-to-lovers-books-that-ruined-me": "2026-08-13 01:35:42.197",
  "dark-romance-books-beginners-guide": "2026-08-14 01:35:42.145",
  "booktok-made-me-buy-it-honest-reviews": "2026-08-15 01:35:42.1",
  "best-kindle-setup-romance-readers": "2026-08-16 01:35:42.044",
  "best-billionaire-romance-series-2024": "2026-08-17 01:35:41.98",
};

describe("restore-blog-published-at", () => {
  it("keeps the dump literals as UTC instants and matches the QA card dates", () => {
    expect(Object.keys(ORIGINAL_PUBLISHED_AT_BY_SLUG)).toHaveLength(15);
    for (const [slug, literal] of Object.entries(CARD_SEEDABLE_DATES)) {
      expect(ORIGINAL_PUBLISHED_AT_BY_SLUG[slug]).toBe(literal);
    }
    expect(timestampLiteralToUtcIso("2026-08-17 01:35:41.98")).toBe("2026-08-17T01:35:41.980Z");
    expect(timestampLiteralToUtcIso("2026-08-15 01:35:42.1")).toBe("2026-08-15T01:35:42.100Z");
    expect(timestampLiteralToUtcIso("2026-08-06 01:35:43.836")).toBe("2026-08-06T01:35:43.836Z");
    expect(timestampLiteralToUtcIso(ORIGINAL_PUBLISHED_AT_BY_SLUG["what-i-burn-while-i-write"]).endsWith("Z")).toBe(true);
  });

  it("defaults to dry-run and only applies with an explicit --apply flag", () => {
    expect(parseRestoreArgs([])).toEqual({ apply: false });
    expect(parseRestoreArgs(["--dry-run"])).toEqual({ apply: false });
    expect(parseRestoreArgs(["--apply"])).toEqual({ apply: true });
    expect(() => parseRestoreArgs(["--force"])).toThrow(/Unknown flag/);
  });

  it("keys updates by slug, writes the timestamp literal, and is idempotent", () => {
    expect(RESTORE_PUBLISHED_AT_SQL).toMatch(/WHERE slug = \$1/);
    expect(RESTORE_PUBLISHED_AT_SQL).toMatch(/"publishedAt" = \$2::timestamp/);
    expect(RESTORE_PUBLISHED_AT_SQL).toMatch(/IS DISTINCT FROM \$2::timestamp/);
    expect(RESTORE_PUBLISHED_AT_SQL).not.toMatch(/WHERE id=/);
    expect(RESTORE_PUBLISHED_AT_SQL).not.toMatch(/[a-f0-9]{32}/);
  });

  it("plans an update for reset dates and a no-op when the target is already stored", () => {
    const reset = "2026-11-16 04:46:05.000";
    const current = {
      "romance-reader-gift-guide": reset,
      "what-i-burn-while-i-write": ORIGINAL_PUBLISHED_AT_BY_SLUG["what-i-burn-while-i-write"],
    };
    const plan = planRestore(current);
    const gift = plan.find((row) => row.slug === "romance-reader-gift-guide");
    const burn = plan.find((row) => row.slug === "what-i-burn-while-i-write");
    const missing = plan.find((row) => row.slug === "best-kindle-setup-romance-readers");
    expect(gift?.action).toBe("would-update");
    expect(gift?.targetUtcIso).toBe("2026-08-10T01:35:43.597Z");
    expect(gift?.currentUtcIso).toBe("2026-11-16T04:46:05.000Z");
    expect(burn?.action).toBe("already-matches");
    expect(missing?.action).toBe("missing");
  });

  it("does not use the content MD5 hashes from the earlier restore SQL file", () => {
    const hashes = [
      "a4c269e71d2ce709c0822aadeceafc47",
      "8ffff35a1dd67e0026a76f056a6d12b6",
      "ec38bb72168bbc1491f666a2399e6a3e",
    ];
    const values = Object.values(ORIGINAL_PUBLISHED_AT_BY_SLUG).join(" ");
    for (const hash of hashes) {
      expect(values).not.toContain(hash);
      expect(RESTORE_PUBLISHED_AT_SQL).not.toContain(hash);
    }
  });
});
