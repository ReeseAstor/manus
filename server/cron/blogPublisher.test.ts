import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PgDialect } from "drizzle-orm/pg-core";
import type { SQL } from "drizzle-orm";
import type { BlogPost } from "../../drizzle/schema";
import { getDb } from "../db";
import { getScheduledPosts, publishScheduledPosts } from "./blogPublisher";

vi.mock("../db", () => ({ getDb: vi.fn() }));

const now = new Date("2026-11-01T13:00:00.000Z");
const dialect = new PgDialect();
const compile = (condition: SQL) => dialect.sqlToQuery(condition);
function makePost(id = 1, overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    id,
    title: `Reading guide ${id}`,
    slug: `reading-guide-${id}`,
    excerpt: "Make room for a thoughtful evening with your next book.",
    content:
      "Readers enjoy thoughtful stories with memorable characters. ".repeat(33),
    category: "Reading",
    readTime: "99 min read",
    published: "draft",
    authorId: 1,
    featuredImage: null,
    audioUrl: null,
    scheduledPublishAt: now,
    seoKeywords: null,
    metaDescription: null,
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    ...overrides,
  };
}

function mockDatabase(
  rows: BlogPost[],
  options: {
    failSelect?: unknown;
    failIds?: number[];
    beforeUpdate?: (row: BlogPost) => void;
  } = {}
) {
  const conditions: ReturnType<typeof compile>[] = [];
  const updates: Record<string, unknown>[] = [];
  const where = vi.fn(async (condition: SQL) => {
    conditions.push(compile(condition));
    if (options.failSelect) throw options.failSelect;
    return rows
      .filter(
        row =>
          row.published === "draft" &&
          row.scheduledPublishAt &&
          row.scheduledPublishAt <= now
      )
      .map(row => ({ ...row }));
  });
  const scheduledOrder = vi.fn(async () => rows);
  const calendarWhere = vi.fn(() => ({ orderBy: scheduledOrder }));
  const select = vi.fn((fields?: unknown) => ({
    from: vi.fn(() => ({ where: fields ? calendarWhere : where })),
  }));
  const update = vi.fn(() => ({
    set: vi.fn((values: Record<string, unknown>) => {
      updates.push(values);
      return {
        where: vi.fn((condition: SQL) => ({
          returning: vi.fn(async () => {
            const query = compile(condition);
            conditions.push(query);
            const id = query.params[0] as number;
            const row = rows.find(item => item.id === id)!;
            options.beforeUpdate?.(row);
            if (options.failIds?.includes(id))
              throw new Error("simulated update failure");
            // Simulate an atomic UPDATE predicate: only a matching snapshot can transition.
            const [
              _,
              draft,
              due,
              schedule,
              title,
              slug,
              excerpt,
              content,
              category,
            ] = query.params;
            if (
              row.published !== draft ||
              !row.scheduledPublishAt ||
              row.scheduledPublishAt > new Date(due as string) ||
              row.scheduledPublishAt.getTime() !==
                new Date(schedule as string).getTime() ||
              row.title !== title ||
              row.slug !== slug ||
              row.excerpt !== excerpt ||
              row.content !== content ||
              row.category !== category
            )
              return [];
            Object.assign(row, values);
            return [{ id, title: row.title }];
          }),
        })),
      };
    }),
  }));
  const db = { select, update };
  vi.mocked(getDb).mockResolvedValue(
    db as unknown as NonNullable<Awaited<ReturnType<typeof getDb>>>
  );
  return { db, conditions, updates, where, scheduledOrder, calendarWhere };
}

describe("scheduled publisher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(now);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("retains the empty result contract when no posts are due", async () => {
    mockDatabase([]);
    expect(await publishScheduledPosts()).toEqual({
      published: 0,
      titles: [],
      errors: [],
    });
  });

  it("selects only due scheduled drafts, includes the exact due boundary, and derives readTime", async () => {
    const due = makePost(1);
    const future = makePost(2, {
      scheduledPublishAt: new Date(now.getTime() + 1),
    });
    const unscheduled = makePost(3, { scheduledPublishAt: null });
    const published = makePost(4, { published: "published" });
    const mock = mockDatabase([due, future, unscheduled, published]);
    const result = await publishScheduledPosts();
    expect(result).toEqual({ published: 1, titles: [due.title], errors: [] });
    expect(mock.conditions[0].sql).toContain('"blog_posts"."published" = $1');
    expect(mock.conditions[0].sql).toContain(
      '"blog_posts"."scheduledPublishAt" is not null'
    );
    expect(mock.conditions[0].sql).toContain(
      '"blog_posts"."scheduledPublishAt" <= $2'
    );
    expect(mock.conditions[0].params).toEqual(["draft", now.toISOString()]);
    expect(mock.updates[0]).toEqual({
      published: "published",
      publishedAt: now,
      updatedAt: now,
      readTime: "2 min read",
    });
    expect(future.published).toBe("draft");
    expect(unscheduled.published).toBe("draft");
  });

  it("keeps incomplete, retired and invalid-affiliate posts as drafts with actionable errors", async () => {
    const rows = [
      makePost(1, { content: "<p>&nbsp;</p>" }),
      makePost(2, { slug: "self-publishing-journey" }),
      makePost(3, {
        content: `${makePost().content} [product](https://amazon.com/dp/INVALID)`,
      }),
      makePost(4),
    ];
    const mock = mockDatabase(rows);
    const result = await publishScheduledPosts();
    expect(result.published).toBe(1);
    expect(result.errors).toHaveLength(3);
    expect(result.errors[0]).toContain("Blocked draft #1");
    expect(result.errors[0]).toContain("content: add meaningful text");
    expect(result.errors[1]).toContain("retired");
    expect(result.errors[2]).toContain("ASIN");
    expect(mock.db.update).toHaveBeenCalledTimes(1);
    expect(rows.slice(0, 3).every(row => row.published === "draft")).toBe(true);
  });

  it("returns database-unavailable and selection errors without throwing", async () => {
    vi.mocked(getDb).mockResolvedValue(null);
    expect(await publishScheduledPosts()).toEqual({
      published: 0,
      titles: [],
      errors: ["Database not available"],
    });
    mockDatabase([], { failSelect: new Error("select failed") });
    expect((await publishScheduledPosts()).errors).toEqual([
      "Blog publisher error: select failed",
    ]);
    vi.mocked(getDb).mockRejectedValue("connection failed");
    expect((await publishScheduledPosts()).errors).toEqual([
      "Blog publisher error: connection failed",
    ]);
  });

  it("continues after individual update failure and counts only successful returned transitions", async () => {
    const rows = [makePost(1), makePost(2)];
    mockDatabase(rows, { failIds: [1] });
    const result = await publishScheduledPosts();
    expect(result.published).toBe(1);
    expect(result.titles).toEqual([rows[1].title]);
    expect(result.errors[0]).toContain(
      'Failed to publish draft #1 "Reading guide 1": simulated update failure'
    );
    expect(rows[0].published).toBe("draft");
  });

  it("counts a shared draft once when two runs overlap", async () => {
    const rows = [makePost()];
    const mock = mockDatabase(rows);
    const results = await Promise.all([
      publishScheduledPosts(),
      publishScheduledPosts(),
    ]);
    expect(results.reduce((sum, result) => sum + result.published, 0)).toBe(1);
    expect(results.flatMap(result => result.titles)).toEqual([rows[0].title]);
    expect(results.flatMap(result => result.errors)).toEqual([
      expect.stringContaining("already published"),
    ]);
    const query = mock.conditions.find(condition =>
      condition.sql.includes('"blog_posts"."id"')
    )!.sql;
    for (const field of [
      "published",
      "scheduledPublishAt",
      "title",
      "slug",
      "excerpt",
      "content",
      "category",
    ]) {
      expect(query).toContain(`"blog_posts"."${field}"`);
    }
    expect(query).toContain('"blog_posts"."scheduledPublishAt" <= ');
  });

  it.each([
    "content",
    "title",
    "excerpt",
    "category",
    "slug",
    "scheduledPublishAt",
  ] as const)(
    "does not publish after %s changes between readiness and update",
    async field => {
      const row = makePost();
      mockDatabase([row], {
        beforeUpdate: current => {
          if (field === "scheduledPublishAt")
            current[field] = new Date(now.getTime() + 1000);
          else current[field] = "changed";
        },
      });
      const result = await publishScheduledPosts();
      expect(result.published).toBe(0);
      expect(result.titles).toEqual([]);
      expect(result.errors[0]).toContain("Skipped draft #1");
      expect(row.published).toBe("draft");
    }
  );

  it("preserves the content calendar query and its empty fallback", async () => {
    const rows = [makePost()];
    const mock = mockDatabase(rows);
    expect(await getScheduledPosts()).toEqual(rows);
    expect(mock.scheduledOrder).toHaveBeenCalledOnce();
    expect(mock.calendarWhere).toHaveBeenCalledOnce();
    vi.mocked(getDb).mockResolvedValue(null);
    expect(await getScheduledPosts()).toEqual([]);
    vi.mocked(getDb).mockRejectedValue(new Error("calendar failed"));
    expect(await getScheduledPosts()).toEqual([]);
  });
});
