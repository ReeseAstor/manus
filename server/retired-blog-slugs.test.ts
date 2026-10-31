import { afterEach, describe, expect, it, vi } from "vitest";
import { RETIRED_BLOG_SLUGS } from "../shared/const";
import { getBlogPostBySlug } from "./db";

describe("retired blog slugs", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns nothing for each retired slug before touching the database", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    for (const slug of RETIRED_BLOG_SLUGS) {
      expect(await getBlogPostBySlug(slug)).toBeUndefined();
    }
    expect(warn).not.toHaveBeenCalled();

    expect(await getBlogPostBySlug("a-live-post")).toBeUndefined();
    expect(warn).toHaveBeenCalled();
  });
});
