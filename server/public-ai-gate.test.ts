import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { QUIZ_QUESTIONS, scoreCharacterQuiz } from "@shared/character-quiz";

vi.mock("./_core/gemini", () => ({
  generateText: vi.fn(),
}));

vi.mock("./_core/imageGeneration", () => ({
  generateImage: vi.fn(),
}));

import { appRouter } from "./routers";
import { generateText } from "./_core/gemini";
import { generateImage } from "./_core/imageGeneration";

function ctxFor(role: "admin" | "user" | null, ip: string): TrpcContext {
  const now = new Date();
  return {
    user: role
      ? {
          id: 1,
          openId: `${role}-1`,
          email: `${role}@example.com`,
          name: role,
          loginMethod: "email",
          role,
          createdAt: now,
          updatedAt: now,
          lastSignedIn: now,
        }
      : null,
    req: {
      protocol: "https",
      headers: { "x-forwarded-for": ip },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const loyalAnswers = QUIZ_QUESTIONS.map((question) => question.options[2]);

describe("static character quiz", () => {
  it("maps the charm answers to Fake Wife's contract-marriage positioning", () => {
    const charmAnswers = QUIZ_QUESTIONS.map((question) => question.options[1]);
    const result = scoreCharacterQuiz(charmAnswers);
    expect(result.bookLink).toBe("https://www.amazon.com/dp/B0FCCBNF8X");
    expect(result.reason.toLowerCase()).not.toContain("enemies");
    expect(result.reason.toLowerCase()).toContain("contract-wife");
    expect(result.reason.toLowerCase()).toContain("marriage of convenience");
  });

  it("maps the loyal answers to Baby Secret's live ASIN", () => {
    const result = scoreCharacterQuiz(loyalAnswers);
    expect(result.bookRecommendation).toBe("The Billionaire's Baby Secret");
    expect(result.bookLink).toBe("https://www.amazon.com/dp/B0G12LBZ24");
    expect(result.bookLink).not.toContain("B0DRZG5KKD");
  });

  it("answers the public procedure without calling a model", async () => {
    vi.mocked(generateText).mockClear();
    const caller = appRouter.createCaller(ctxFor(null, "203.0.113.20"));
    const result = await caller.ai.submitQuiz({ answers: loyalAnswers });
    expect(result.bookLink).toBe("https://www.amazon.com/dp/B0G12LBZ24");
    expect(generateText).not.toHaveBeenCalled();
  });
});

describe("author generation requires an admin", () => {
  beforeEach(() => {
    vi.mocked(generateText).mockReset();
    vi.mocked(generateImage).mockReset();
    vi.mocked(generateText).mockResolvedValue("# A reunion\n\nThe rain started.");
    vi.mocked(generateImage).mockResolvedValue({ url: "https://example.com/image.png" });
  });

  async function expectRejected(caller: ReturnType<typeof appRouter.createCaller>) {
    await expect(
      caller.ai.generateBlogPost({ topic: "a rainy reunion", tone: "casual", length: "short" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      caller.ai.generateStoryIdea({ genre: "contemporary", tropes: ["rivals"] }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      caller.ai.generateBookCover({ title: "Midnight", style: "dark" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      caller.ai.generateCharacterPortrait({
        description: "A reserved founder in a charcoal coat",
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(
      caller.ai.generateSocialGraphic({
        text: "Out now",
        platform: "instagram",
        theme: "book_promo",
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  }

  it("rejects anonymous callers before any model call", async () => {
    await expectRejected(appRouter.createCaller(ctxFor(null, "203.0.113.1")));
    expect(generateText).not.toHaveBeenCalled();
    expect(generateImage).not.toHaveBeenCalled();
  });

  it("rejects a signed-in reader before any model call", async () => {
    await expectRejected(appRouter.createCaller(ctxFor("user", "203.0.113.2")));
    expect(generateText).not.toHaveBeenCalled();
    expect(generateImage).not.toHaveBeenCalled();
  });

  it("lets an admin write a post and then rate-limits that admin", async () => {
    const caller = appRouter.createCaller(ctxFor("admin", "203.0.113.10"));
    const first = await caller.ai.generateBlogPost({
      topic: "a rainy reunion",
      tone: "casual",
      length: "short",
    });
    expect(first.content).toContain("reunion");

    for (let i = 0; i < 14; i++) {
      await caller.ai.generateBlogPost({
        topic: "a rainy reunion",
        tone: "casual",
        length: "short",
      });
    }
    await expect(
      caller.ai.generateBlogPost({ topic: "a rainy reunion", tone: "casual", length: "short" }),
    ).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
  });

  it("rate-limits an admin image request", async () => {
    const caller = appRouter.createCaller(ctxFor("admin", "203.0.113.11"));
    for (let i = 0; i < 8; i++) {
      const cover = await caller.ai.generateBookCover({ title: "Midnight", style: "dark" });
      expect(cover.imageUrl).toBe("https://example.com/image.png");
    }
    await expect(
      caller.ai.generateBookCover({ title: "Midnight", style: "dark" }),
    ).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
    expect(generateImage).toHaveBeenCalledTimes(8);
  });
});
