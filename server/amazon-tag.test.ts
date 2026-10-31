import { describe, expect, it } from "vitest";
import { withAmazonTag } from "../client/src/lib/amazon-tag";

describe("withAmazonTag", () => {
  it("tags an Amazon book page link", () => {
    expect(withAmazonTag("https://www.amazon.com/dp/B0FCCBNF8X")).toBe(
      "https://www.amazon.com/dp/B0FCCBNF8X?tag=reeseastor-20",
    );
  });
  it("keeps an existing tag", () => {
    const href = "https://www.amazon.com/dp/B0CMTXKBWW?tag=someoneelse-20";
    expect(withAmazonTag(href)).toBe(href);
  });
  it("leaves other links alone", () => {
    expect(withAmazonTag("https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX")).toBe(
      "https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX",
    );
    expect(withAmazonTag("https://dl.bookfunnel.com/xrodg0t77p")).toBe("https://dl.bookfunnel.com/xrodg0t77p");
    expect(withAmazonTag(null)).toBe(null);
  });
});
