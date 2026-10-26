import { describe, it, expect } from "vitest";
import { toAbsoluteUrl, SITE_URL } from "../client/src/lib/seo-url";

describe("toAbsoluteUrl", () => {
  it("joins a path to the site origin exactly once", () => {
    expect(toAbsoluteUrl("/books/hostile-tender")).toBe(`${SITE_URL}/books/hostile-tender`);
  });

  it("leaves an absolute URL unchanged (no doubled origin)", () => {
    expect(toAbsoluteUrl("https://reeseastor.com/permission")).toBe("https://reeseastor.com/permission");
    expect(toAbsoluteUrl("https://m.media-amazon.com/images/I/x.jpg")).toBe("https://m.media-amazon.com/images/I/x.jpg");
    expect(toAbsoluteUrl("https://reeseastor.com/press")).not.toContain("comhttps");
  });

  it("returns the site origin for an empty value", () => {
    expect(toAbsoluteUrl(undefined)).toBe(SITE_URL);
    expect(toAbsoluteUrl("")).toBe(SITE_URL);
  });

  it("adds a missing leading slash", () => {
    expect(toAbsoluteUrl("press")).toBe(`${SITE_URL}/press`);
  });
});
