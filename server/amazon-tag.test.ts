import { describe, expect, it } from "vitest";
import { AMAZON_ASSOCIATE_TAG, withAmazonTag } from "../client/src/lib/amazon-tag";

describe("withAmazonTag", () => {
  it("tags an Amazon book page link", () => {
    expect(withAmazonTag("https://www.amazon.com/dp/B0FCCBNF8X")).toBe(
      "https://www.amazon.com/dp/B0FCCBNF8X?tag=reeseastor-20",
    );
  });
  it("uses the user-confirmed canonical tag", () => {
    expect(AMAZON_ASSOCIATE_TAG).toBe("reeseastor-20");
  });
  it("replaces a legacy existing tag", () => {
    const href = "https://www.amazon.com/dp/B0CMTXKBWW?tag=88away0d-20";
    expect(withAmazonTag(href)).toBe("https://www.amazon.com/dp/B0CMTXKBWW?tag=reeseastor-20");
  });
  it("normalizes duplicate or third-party tags while keeping other parameters and fragments", () => {
    expect(withAmazonTag("https://amazon.com/gp/product/B0CMTXKBWW?ref=article&tag=other-20&tag=another-20#details"))
      .toBe("https://amazon.com/gp/product/B0CMTXKBWW?ref=article&tag=reeseastor-20#details");
  });
  it("is idempotent", () => {
    const href = "https://www.amazon.com/dp/B0CMTXKBWW?tag=reeseastor-20";
    expect(withAmazonTag(href)).toBe(href);
  });
  it.each([
    "https://amazon.com.evil.example/dp/B0CMTXKBWW",
    "https://evilamazon.com/dp/B0CMTXKBWW",
    "https://www.amazon.com@evil.example/dp/B0CMTXKBWW",
    "https://user@www.amazon.com/dp/B0CMTXKBWW",
    "http://www.amazon.com/dp/B0CMTXKBWW",
    "https://www.amazon.com:444/dp/B0CMTXKBWW",
    "https://www.amazon.com/dp/B0CMTXKBWWX",
    "javascript:alert(1)",
    "not a URL",
  ])("leaves unsafe or unsupported links unchanged: %s", href => {
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
