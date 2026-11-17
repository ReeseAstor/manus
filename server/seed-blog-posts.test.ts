import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  INSERT_NEW_POST_SQL,
  UPDATE_EXISTING_POST_SQL,
  publishedAtForNewPost,
} from "../scripts/seed-blog-posts";

const seedSource = readFileSync(
  path.join(import.meta.dirname ?? __dirname, "..", "scripts", "seed-blog-posts.ts"),
  "utf8",
);

describe("seed-blog-posts publishedAt", () => {
  it("does not set publishedAt when updating an existing slug", () => {
    expect(UPDATE_EXISTING_POST_SQL).not.toMatch(/publishedAt/i);
    expect(UPDATE_EXISTING_POST_SQL).toMatch(/UPDATE blog_posts SET/i);
    expect(UPDATE_EXISTING_POST_SQL).toMatch(/WHERE slug=\$6/);
  });

  it("sets publishedAt only on INSERT of a new slug", () => {
    expect(INSERT_NEW_POST_SQL).toMatch(/INSERT INTO blog_posts/i);
    expect(INSERT_NEW_POST_SQL).toMatch(/"publishedAt"/);
  });

  it("records insert dates as UTC instants and staggers later inserts", () => {
    const now = new Date("2026-11-16T05:00:00.000Z");
    const first = publishedAtForNewPost(now, 0);
    const second = publishedAtForNewPost(now, 1);
    expect(first.toISOString()).toBe("2026-11-16T05:00:00.000Z");
    expect(second.toISOString()).toBe("2026-11-15T05:00:00.000Z");
    expect(first.toISOString().endsWith("Z")).toBe(true);
  });

  it("keeps publishedAt off the UPDATE path in the seed runner", () => {
    const updateBranch = seedSource.slice(
      seedSource.indexOf("if (existing.rows.length > 0)"),
      seedSource.indexOf("} else {"),
    );
    expect(updateBranch).toContain("UPDATE_EXISTING_POST_SQL");
    expect(updateBranch).not.toMatch(/publishedAtForNewPost/);
    expect(updateBranch).not.toMatch(/"publishedAt"/);
    expect(updateBranch).toMatch(/preserve the existing publish date/);

    const insertBranch = seedSource.slice(seedSource.indexOf("} else {"));
    expect(insertBranch).toContain("publishedAtForNewPost");
    expect(insertBranch).toContain("INSERT_NEW_POST_SQL");
  });
});
