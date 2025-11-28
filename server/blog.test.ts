import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

// Mock the database module
vi.mock("./db", () => ({
  getAllBlogPosts: vi.fn(),
  getBlogPostBySlug: vi.fn(),
  createBlogPost: vi.fn(),
  updateBlogPost: vi.fn(),
  deleteBlogPost: vi.fn(),
}));

function createTestContext(isAdmin = false): TrpcContext {
  const user = isAdmin
    ? {
        id: 1,
        openId: "admin-user",
        email: "admin@example.com",
        name: "Admin User",
        loginMethod: "manus",
        role: "admin" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

const mockBlogPost = {
  id: 1,
  title: "Test Blog Post",
  slug: "test-blog-post",
  excerpt: "This is a test excerpt",
  content: "# Test Content\n\nThis is the full content.",
  category: "Writing Tips",
  readTime: "5 min read",
  published: "published" as const,
  authorId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  publishedAt: new Date(),
};

describe("blog.list", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all blog posts when no filter is provided", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getAllBlogPosts).mockResolvedValue([mockBlogPost]);

    const result = await caller.blog.list();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      title: "Test Blog Post",
      slug: "test-blog-post",
    });
    expect(db.getAllBlogPosts).toHaveBeenCalledWith(undefined);
  });

  it("filters published posts when requested", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getAllBlogPosts).mockResolvedValue([mockBlogPost]);

    const result = await caller.blog.list({ published: true });

    expect(result).toHaveLength(1);
    expect(db.getAllBlogPosts).toHaveBeenCalledWith(true);
  });
});

describe("blog.getBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns a blog post by slug", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getBlogPostBySlug).mockResolvedValue(mockBlogPost);

    const result = await caller.blog.getBySlug({ slug: "test-blog-post" });

    expect(result).toMatchObject({
      title: "Test Blog Post",
      slug: "test-blog-post",
    });
    expect(db.getBlogPostBySlug).toHaveBeenCalledWith("test-blog-post");
  });

  it("throws NOT_FOUND error when post doesn't exist", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.getBlogPostBySlug).mockResolvedValue(undefined);

    await expect(
      caller.blog.getBySlug({ slug: "non-existent" })
    ).rejects.toThrow("Blog post not found");
  });
});

describe("blog.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a blog post when user is admin", async () => {
    const ctx = createTestContext(true);
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.createBlogPost).mockResolvedValue({} as any);

    const input = {
      title: "New Post",
      slug: "new-post",
      excerpt: "Excerpt",
      content: "Content",
      category: "Writing Tips",
      readTime: "5 min read",
      published: "draft" as const,
    };

    const result = await caller.blog.create(input);

    expect(result.success).toBe(true);
    expect(db.createBlogPost).toHaveBeenCalledWith({
      ...input,
      authorId: 1,
      publishedAt: null,
    });
  });

  it("sets publishedAt when creating as published", async () => {
    const ctx = createTestContext(true);
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.createBlogPost).mockResolvedValue({} as any);

    const input = {
      title: "Published Post",
      slug: "published-post",
      excerpt: "Excerpt",
      content: "Content",
      category: "Marketing",
      readTime: "3 min read",
      published: "published" as const,
    };

    await caller.blog.create(input);

    const createCall = vi.mocked(db.createBlogPost).mock.calls[0][0];
    expect(createCall.publishedAt).toBeInstanceOf(Date);
  });

  it("throws error when user is not logged in", async () => {
    const ctx = createTestContext(false);
    const caller = appRouter.createCaller(ctx);

    const input = {
      title: "New Post",
      slug: "new-post",
      excerpt: "Excerpt",
      content: "Content",
      category: "Writing Tips",
      readTime: "5 min read",
      published: "draft" as const,
    };

    await expect(caller.blog.create(input)).rejects.toThrow(
      "Please login"
    );
  });

  it("throws FORBIDDEN error when user is not admin", async () => {
    const nonAdminCtx: TrpcContext = {
      user: {
        id: 2,
        openId: "regular-user",
        email: "user@example.com",
        name: "Regular User",
        loginMethod: "manus",
        role: "user" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    const caller = appRouter.createCaller(nonAdminCtx);

    const input = {
      title: "New Post",
      slug: "new-post",
      excerpt: "Excerpt",
      content: "Content",
      category: "Writing Tips",
      readTime: "5 min read",
      published: "draft" as const,
    };

    await expect(caller.blog.create(input)).rejects.toThrow(
      "Only admins can create blog posts"
    );
  });
});

describe("blog.update", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a blog post when user is admin", async () => {
    const ctx = createTestContext(true);
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.updateBlogPost).mockResolvedValue({} as any);

    const input = {
      id: 1,
      title: "Updated Title",
      content: "Updated content",
    };

    const result = await caller.blog.update(input);

    expect(result.success).toBe(true);
    expect(db.updateBlogPost).toHaveBeenCalledWith(1, {
      title: "Updated Title",
      content: "Updated content",
    });
  });

  it("throws error when user is not logged in", async () => {
    const ctx = createTestContext(false);
    const caller = appRouter.createCaller(ctx);

    const input = {
      id: 1,
      title: "Updated Title",
    };

    await expect(caller.blog.update(input)).rejects.toThrow(
      "Please login"
    );
  });
});

describe("blog.delete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes a blog post when user is admin", async () => {
    const ctx = createTestContext(true);
    const caller = appRouter.createCaller(ctx);

    vi.mocked(db.deleteBlogPost).mockResolvedValue({} as any);

    const result = await caller.blog.delete({ id: 1 });

    expect(result.success).toBe(true);
    expect(db.deleteBlogPost).toHaveBeenCalledWith(1);
  });

  it("throws error when user is not logged in", async () => {
    const ctx = createTestContext(false);
    const caller = appRouter.createCaller(ctx);

    await expect(caller.blog.delete({ id: 1 })).rejects.toThrow(
      "Please login"
    );
  });
});
