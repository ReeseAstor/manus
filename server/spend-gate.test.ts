import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

vi.mock("./_core/gemini", () => ({
  generateText: vi.fn(),
}));

vi.mock("./_core/imageGeneration", () => ({
  generateImage: vi.fn(),
}));

vi.mock("./_core/audioService", () => ({
  ALL_VOICES: [],
  STANDARD_VOICES: [],
  PREMIUM_VOICES: [],
  TIER_LIMITS: {},
  CHARACTER_VOICE_MAPPINGS: {},
  generateAudio: vi.fn(),
  generateVoicePreview: vi.fn(async () => "https://example.com/preview.mp3"),
  estimateMinutes: vi.fn(() => 1),
}));

import { appRouter } from "./routers";
import { generateText } from "./_core/gemini";
import { generateImage } from "./_core/imageGeneration";
import { generateVoicePreview } from "./_core/audioService";

function user(role: "admin" | "user", id = 1): User {
  const now = new Date();
  return {
    id,
    openId: `${role}-${id}`,
    email: `${role}@example.com`,
    name: role,
    loginMethod: "email",
    role,
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
}

function ctxFor(account: User | null, ip: string): TrpcContext {
  return {
    user: account,
    req: {
      protocol: "https",
      headers: { "x-forwarded-for": ip },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("anonymous LLM and voice spend", () => {
  beforeEach(() => {
    vi.mocked(generateText).mockReset();
    vi.mocked(generateImage).mockReset();
    vi.mocked(generateVoicePreview).mockClear();
    vi.mocked(generateText).mockResolvedValue(
      JSON.stringify({
        character: "Michael Hastings",
        matchPercentage: 80,
        personality: "Direct and loyal.",
        bookRecommendation: "The Billionaire's Executive Assistant",
        bookLink: "https://www.amazon.com/dp/B0F2W8QL7S",
        reason: "The pace matches.",
      }),
    );
    vi.mocked(generateImage).mockResolvedValue({ url: "https://example.com/image.png" });
  });

  it("rejects anonymous and signed-in non-admin chat before calling the model", async () => {
    const anonymous = appRouter.createCaller(ctxFor(null, "203.0.113.1"));
    const member = appRouter.createCaller(ctxFor(user("user", 2), "203.0.113.2"));

    await expect(anonymous.ai.chat({ message: "hello" })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    await expect(member.ai.chat({ message: "hello" })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    expect(generateText).not.toHaveBeenCalled();
  });

  it("rejects anonymous author-generation calls", async () => {
    const caller = appRouter.createCaller(ctxFor(null, "203.0.113.3"));

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
    expect(generateText).not.toHaveBeenCalled();
    expect(generateImage).not.toHaveBeenCalled();
  });

  it("lets an admin chat and still rate-limits that admin", async () => {
    vi.mocked(generateText).mockResolvedValue("The series is set in Manhattan.");
    const caller = appRouter.createCaller(ctxFor(user("admin", 7), "203.0.113.7"));

    const first = await caller.ai.chat({ message: "Where is the series set?" });
    expect(first.response).toContain("Manhattan");

    for (let i = 0; i < 14; i++) {
      await caller.ai.chat({ message: "again" });
    }
    await expect(caller.ai.chat({ message: "over the limit" })).rejects.toMatchObject({
      code: "TOO_MANY_REQUESTS",
    });
  });

  it("keeps the public quiz available and caps it per address", async () => {
    const caller = appRouter.createCaller(ctxFor(null, "203.0.113.20"));
    const result = await caller.ai.submitQuiz({ answers: ["slow burn"] });
    expect(result.character).toBe("Michael Hastings");

    for (let i = 0; i < 5; i++) {
      await caller.ai.submitQuiz({ answers: ["slow burn"] });
    }
    await expect(caller.ai.submitQuiz({ answers: ["slow burn"] })).rejects.toMatchObject({
      code: "TOO_MANY_REQUESTS",
    });
  });

  it("requires a signed-in user for voice preview and then rate-limits them", async () => {
    const anonymous = appRouter.createCaller(ctxFor(null, "203.0.113.30"));
    await expect(anonymous.audio.previewVoice({ voiceId: "rachel" })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
    expect(generateVoicePreview).not.toHaveBeenCalled();

    const member = appRouter.createCaller(ctxFor(user("user", 40), "203.0.113.40"));
    const preview = await member.audio.previewVoice({ voiceId: "rachel" });
    expect(preview.audioUrl).toBe("https://example.com/preview.mp3");

    for (let i = 0; i < 9; i++) {
      await member.audio.previewVoice({ voiceId: "rachel" });
    }
    await expect(member.audio.previewVoice({ voiceId: "rachel" })).rejects.toMatchObject({
      code: "TOO_MANY_REQUESTS",
    });
  });
});
