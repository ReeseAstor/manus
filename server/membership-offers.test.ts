import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  AFFILIATE_DISCLOSURE,
  MEMBERSHIP_OFFERS,
} from "../client/src/data/membership-offers";
import { AMAZON_ASSOCIATE_TAG } from "../client/src/lib/amazon-tag";

const source = (relative: string) =>
  readFileSync(path.resolve(import.meta.dirname, "..", relative), "utf8");

describe("Amazon membership offers", () => {
  it("links only the two bounty landing pages, each tagged", () => {
    expect(MEMBERSHIP_OFFERS.map((offer) => offer.href)).toEqual([
      `https://www.amazon.com/hz/audible/mlp?tag=${AMAZON_ASSOCIATE_TAG}`,
      `https://www.amazon.com/gp/kindle/ku/gift_landing?tag=${AMAZON_ASSOCIATE_TAG}`,
    ]);
  });

  it("makes no price, duration or payout claim", () => {
    for (const offer of MEMBERSHIP_OFFERS) {
      const copy = `${offer.label} ${offer.detail}`;
      expect(copy).not.toMatch(/\$\s?\d|\b\d+\s*(?:days?|months?|years?)\b/i);
      expect(copy).not.toMatch(/earn|commission|payout|credit/i);
    }
  });

  it("discloses the associate relationship", () => {
    expect(AFFILIATE_DISCLOSURE).toContain(
      "As an Amazon Associate I earn from qualifying purchases.",
    );
  });

  it("is mounted where readers decide, and stays sponsored-tagged", () => {
    expect(source("client/src/pages/BookTitle.tsx")).toContain("<MembershipOffers");
    expect(source("client/src/pages/BooksCatalog.tsx")).toContain("<MembershipOffers");
    expect(
      source("client/src/components/author-kit/MembershipOffers.tsx"),
    ).toContain('rel="sponsored noopener noreferrer nofollow"');
  });

  it("also rides the blog, the surface with measured affiliate clicks", () => {
    const post = source("client/src/pages/BlogPost.tsx");
    expect(post).toContain("MEMBERSHIP_OFFERS.map");
    expect(post).toContain('rel="sponsored noopener noreferrer nofollow"');
    expect(post).toContain("{AFFILIATE_DISCLOSURE}");
    expect(source("client/src/styles/blog.css")).toContain(".journal-membership");
  });
});
