import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/trpc";

describe("Reader's Club", () => {
  const testEmail = `test-${Date.now()}@example.com`;
  let memberId: number;

  // Mock context for tests
  const createContext = (): TrpcContext => ({
    req: {} as any,
    res: {} as any,
    user: null,
  });

  const caller = appRouter.createCaller(createContext());

  describe("Content Access", () => {
    it("should get all exclusive content", async () => {
      const content = await caller.readerClub.getAllContent();
      expect(Array.isArray(content)).toBe(true);
      expect(content.length).toBeGreaterThan(0);
    });

    it("should get featured exclusive content", async () => {
      const content = await caller.readerClub.getFeaturedContent();
      expect(Array.isArray(content)).toBe(true);
      // Featured content should be a subset of all content
      const allContent = await caller.readerClub.getAllContent();
      expect(content.length).toBeLessThanOrEqual(allContent.length);
    });

    it("should get content by slug", async () => {
      const content = await caller.readerClub.getContentBySlug({
        slug: "alexander-first-meeting",
      });
      expect(content).toBeDefined();
      expect(content.slug).toBe("alexander-first-meeting");
      expect(content.title).toBeDefined();
      expect(content.content).toBeDefined();
    });

    it("should throw error for non-existent content", async () => {
      await expect(
        caller.readerClub.getContentBySlug({ slug: "non-existent-slug" })
      ).rejects.toThrow();
    });
  });

  describe("Membership", () => {
    it("should allow user to join Reader's Club", async () => {
      const result = await caller.readerClub.join({
        email: testEmail,
        name: "Test User",
      });
      
      expect(result.success).toBe(true);
      expect(result.memberId).toBeDefined();
      memberId = result.memberId!;
    });

    it("should check membership status", async () => {
      const member = await caller.readerClub.checkMembership({
        email: testEmail,
      });
      
      expect(member).toBeDefined();
      expect(member?.email).toBe(testEmail);
      expect(member?.active).toBe(true);
    });

    it("should return null for non-member", async () => {
      const member = await caller.readerClub.checkMembership({
        email: "nonexistent@example.com",
      });
      
      expect(member).toBeNull();
    });

    it("should handle duplicate membership gracefully", async () => {
      const result = await caller.readerClub.join({
        email: testEmail,
        name: "Test User",
      });
      
      expect(result.success).toBe(true);
      expect(result.message).toContain("already a member");
    });
  });

  describe("Content Access Tracking", () => {
    it("should track content access for members", async () => {
      const content = await caller.readerClub.getContentBySlug({
        slug: "alexander-first-meeting",
      });

      const result = await caller.readerClub.trackAccess({
        email: testEmail,
        contentId: content.id,
      });

      expect(result.success).toBe(true);
    });

    it("should reject access tracking for non-members", async () => {
      const content = await caller.readerClub.getContentBySlug({
        slug: "alexander-first-meeting",
      });

      await expect(
        caller.readerClub.trackAccess({
          email: "nonmember@example.com",
          contentId: content.id,
        })
      ).rejects.toThrow("Not a member");
    });
  });

  describe("Content Types", () => {
    it("should have bonus chapter content", async () => {
      const allContent = await caller.readerClub.getAllContent();
      const bonusChapters = allContent.filter((c) => c.type === "bonus_chapter");
      expect(bonusChapters.length).toBeGreaterThan(0);
    });

    it("should have interview content", async () => {
      const allContent = await caller.readerClub.getAllContent();
      const interviews = allContent.filter((c) => c.type === "interview");
      expect(interviews.length).toBeGreaterThan(0);
    });

    it("should have behind-the-scenes content", async () => {
      const allContent = await caller.readerClub.getAllContent();
      const behindScenes = allContent.filter((c) => c.type === "behind_scenes");
      expect(behindScenes.length).toBeGreaterThan(0);
    });
  });

  describe("Content Structure", () => {
    it("should have required fields", async () => {
      const content = await caller.readerClub.getContentBySlug({
        slug: "alexander-first-meeting",
      });

      expect(content.id).toBeDefined();
      expect(content.title).toBeDefined();
      expect(content.slug).toBeDefined();
      expect(content.type).toBeDefined();
      expect(content.content).toBeDefined();
      expect(content.publishDate).toBeDefined();
    });

    it("should have valid content length", async () => {
      const content = await caller.readerClub.getContentBySlug({
        slug: "alexander-first-meeting",
      });

      expect(content.content.length).toBeGreaterThan(100);
      expect(content.title.length).toBeGreaterThan(0);
    });
  });
});
