import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The Hudson Dynasty series card for The First Acquisition (ASIN B0D82GWFD9)
 * must use the live US Kindle listing hook (checked 11/05/2026).
 */
const PAGE = path.join(process.cwd(), "client/public/read/hudson-dynasty/index.html");

const STALE_HOOK = "Three weeks. One ring. Zero feelings. That’s the deal.";
const REJECTED_HOOK =
  "She was hired to audit his empire. Falling for him could destroy them both.";
const PUBLISHED_HOOK = "She was hired to audit him. The board wants her to wear his ring.";

const OTHER_CARD_BLURBS = [
  "One anonymous night. One Bronx building. Neither of them can afford to lose.",
  "Her poison pill stopped his takeover. Nothing stopped what came next.",
  "He can restructure a billion dollars of bad debt. He can’t buy her.",
];

function firstAcquisitionCard(html: string): string {
  const marker =
    '<p class="label">Prequel</p><h3><a href="/read/the-first-acquisition">The First Acquisition</a></h3>';
  const start = html.indexOf(marker);
  const end = html.indexOf("</article>", start);
  if (start < 0 || end < start) {
    throw new Error("First Acquisition series card not found");
  }
  return html.slice(start, end);
}

describe("Hudson Dynasty series page, First Acquisition card", () => {
  const html = readFileSync(PAGE, "utf8");
  const card = firstAcquisitionCard(html);

  it("uses the published hook and rejects the stale deal line", () => {
    expect(card).toContain(`<p>${PUBLISHED_HOOK}</p>`);
    expect(card).not.toContain(STALE_HOOK);
    expect(html).not.toContain(STALE_HOOK);
    expect(card).not.toContain(REJECTED_HOOK);
    expect(html).not.toContain(REJECTED_HOOK);
  });

  it("keeps the card's label, tropes, and Kindle link on the published book", () => {
    expect(card).toContain('<p class="label">Prequel</p>');
    expect(card).toContain("<li>Fake engagement</li>");
    expect(card).toContain("<li>Billionaire CEO</li>");
    expect(card).toContain("<li>Romantic suspense</li>");
    expect(card).toContain(
      'href="https://www.amazon.com/dp/B0D82GWFD9?tag=reeseastor-20" data-cta="amazon-kindle">Get it on Kindle</a>',
    );
  });

  it("leaves the other series-card blurbs unchanged", () => {
    for (const blurb of OTHER_CARD_BLURBS) {
      expect(html).toContain(`<p>${blurb}</p>`);
    }
  });
});
