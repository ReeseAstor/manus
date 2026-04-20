import { describe, it, expect } from "vitest";

// Test the pagination logic used in Blog.tsx
const POSTS_PER_PAGE = 9;

function paginatePosts<T>(allPosts: T[], visibleCount: number) {
  const displayPosts = allPosts.slice(0, visibleCount);
  const hasMore = allPosts.length > visibleCount;
  const remainingCount = allPosts.length - visibleCount;
  return { displayPosts, hasMore, remainingCount };
}

describe("Blog pagination logic", () => {
  const mockPosts = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    title: `Post ${i + 1}`,
    slug: `post-${i + 1}`,
  }));

  it("should show first 9 posts initially", () => {
    const result = paginatePosts(mockPosts, POSTS_PER_PAGE);
    expect(result.displayPosts.length).toBe(9);
    expect(result.hasMore).toBe(true);
    expect(result.remainingCount).toBe(16);
  });

  it("should show 18 posts after one Load More click", () => {
    const result = paginatePosts(mockPosts, POSTS_PER_PAGE * 2);
    expect(result.displayPosts.length).toBe(18);
    expect(result.hasMore).toBe(true);
    expect(result.remainingCount).toBe(7);
  });

  it("should show all 25 posts after two Load More clicks", () => {
    const result = paginatePosts(mockPosts, POSTS_PER_PAGE * 3);
    expect(result.displayPosts.length).toBe(25);
    expect(result.hasMore).toBe(false);
    expect(result.remainingCount).toBe(-2); // 25 - 27 = -2, but hasMore is false
  });

  it("should handle empty posts array", () => {
    const result = paginatePosts([], POSTS_PER_PAGE);
    expect(result.displayPosts.length).toBe(0);
    expect(result.hasMore).toBe(false);
  });

  it("should handle fewer posts than page size", () => {
    const fewPosts = mockPosts.slice(0, 5);
    const result = paginatePosts(fewPosts, POSTS_PER_PAGE);
    expect(result.displayPosts.length).toBe(5);
    expect(result.hasMore).toBe(false);
  });

  it("should handle exactly page size number of posts", () => {
    const exactPosts = mockPosts.slice(0, 9);
    const result = paginatePosts(exactPosts, POSTS_PER_PAGE);
    expect(result.displayPosts.length).toBe(9);
    expect(result.hasMore).toBe(false);
  });

  it("should reset visible count when category changes", () => {
    // Simulate: user loads more, then switches category
    const result1 = paginatePosts(mockPosts, POSTS_PER_PAGE * 2);
    expect(result1.displayPosts.length).toBe(18);
    
    // After category change, visibleCount resets to POSTS_PER_PAGE
    const categoryPosts = mockPosts.slice(0, 12); // filtered by category
    const result2 = paginatePosts(categoryPosts, POSTS_PER_PAGE);
    expect(result2.displayPosts.length).toBe(9);
    expect(result2.hasMore).toBe(true);
    expect(result2.remainingCount).toBe(3);
  });
});
