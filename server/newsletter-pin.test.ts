import { describe, expect, it } from "vitest";
import { NEWSLETTER_PINNED_SLUG, pinPost } from "../client/src/lib/pin-post";

const post = (slug: string) => ({ slug });
const live = [
  "best-billionaire-romance-series-2024",
  "best-kindle-setup-romance-readers",
  "booktok-made-me-buy-it-honest-reviews",
  "dark-romance-books-beginners-guide",
  "enemies-to-lovers-books-that-ruined-me",
  "nyc-romance-books-manhattan-guide",
].map(post);

describe("newsletter pinned post", () => {
  it("pins the enemies-to-lovers post first and keeps three cards", () => {
    expect(NEWSLETTER_PINNED_SLUG).toBe("enemies-to-lovers-books-that-ruined-me");
    expect(pinPost(live).map((p) => p.slug)).toEqual([
      "enemies-to-lovers-books-that-ruined-me",
      "best-billionaire-romance-series-2024",
      "best-kindle-setup-romance-readers",
    ]);
  });

  it("does not repeat the pinned post when it is already first", () => {
    const list = [post(NEWSLETTER_PINNED_SLUG), post("a"), post("b"), post("c")];
    expect(pinPost(list).map((p) => p.slug)).toEqual([NEWSLETTER_PINNED_SLUG, "a", "b"]);
  });

  it("falls back to the first three posts when the slug is missing", () => {
    const list = [post("a"), post("b"), post("c"), post("d")];
    expect(pinPost(list).map((p) => p.slug)).toEqual(["a", "b", "c"]);
  });

  it("returns an empty list when there are no posts", () => {
    expect(pinPost(undefined)).toEqual([]);
    expect(pinPost([])).toEqual([]);
  });
});
