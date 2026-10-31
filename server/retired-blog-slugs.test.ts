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

  it("retires the AI workflow posts and the storyorigin list-building post (QA rulings 10/30)", () => {
    for (const slug of [
      "ai-assisted-romance-writing-workflow",
      "romance-author-writing-tools-setup",
      "quality-control-workflows-romance-authors",
      "storyorigin-email-list-building-guide",
    ])
      expect(RETIRED_BLOG_SLUGS as readonly string[]).toContain(slug);
  });
});
