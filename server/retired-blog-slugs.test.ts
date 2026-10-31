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

describe("vercel.json redirects (v5: row 13 retired)", () => {
  it("301s every retired slug to /blog (trailingSlash:false strips a trailing slash first)", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const { RETIRED_BLOG_SLUGS: slugs } = await import("../shared/const");
    const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "vercel.json"), "utf8"));
    const r301 = new Set((cfg.redirects as { source: string; destination: string; statusCode?: number; permanent?: boolean }[])
      .filter((r) => r.destination === "/blog" && (r.statusCode === 301 || r.permanent)).map((r) => r.source));
    expect(cfg.trailingSlash).toBe(false);
    const missing = slugs.map((s) => `/blog/${s}`).filter((s) => !r301.has(s));
    expect(missing).toEqual([]);
  });
});
