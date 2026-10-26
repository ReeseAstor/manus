import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

vi.mock("./_core/audioService", async () => {
  const actual = await vi.importActual<typeof import("./_core/audioService")>("./_core/audioService");
  return {
    ...actual,
    generateAudio: vi.fn(),
  };
});

import { appRouter } from "./routers";
import { getDb } from "./db";
import { generateAudio } from "./_core/audioService";

function user(role: "admin" | "user"): TrpcContext["user"] {
  const now = new Date();
  return {
    id: 9,
    openId: `${role}-9`,
    email: `${role}@example.com`,
    name: role,
    loginMethod: "email",
    role,
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
}

function ctxFor(role: "admin" | "user"): TrpcContext {
  return {
    user: user(role),
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function dbReturning(results: unknown[][]) {
  let index = 0;
  const take = () => Promise.resolve(results[index++] ?? []);
  const chain: {
    from: () => typeof chain;
    innerJoin: () => typeof chain;
    where: () => typeof chain;
    limit: () => Promise<unknown>;
    then: Promise<unknown>["then"];
  } = {
    from: () => chain,
    innerJoin: () => chain,
    where: () => chain,
    limit: () => take(),
    then: (resolve, reject) => take().then(resolve, reject),
  };
  return {
    select: () => chain,
    insert: () => ({ values: async () => undefined }),
    update: () => ({ set: () => ({ where: async () => undefined }) }),
  };
}

function member(slug: "bronze" | "silver" | "gold") {
  return { slug, name: slug };
}

describe("audio generation VIP gate", () => {
  beforeEach(() => {
    vi.mocked(generateAudio).mockReset();
    vi.mocked(generateAudio).mockResolvedValue({
      audioUrl: "https://example.com/story.mp3",
      durationSeconds: 60,
      voiceUsed: "rachel",
      characterCount: 1000,
    });
  });

  it("rejects a signed-in non-VIP reader before any voice call", async () => {
    vi.mocked(getDb).mockResolvedValue(
      dbReturning([[{ id: 1, content: "a".repeat(1000) }], []]) as never,
    );
    const caller = appRouter.createCaller(ctxFor("user"));
    await expect(caller.audio.generateStoryAudio({ storyId: 1 })).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: expect.stringMatching(/Upgrade your membership/),
    });
    expect(generateAudio).not.toHaveBeenCalled();
  });

  it("rejects generateAudio for a signed-in non-VIP reader before any voice call", async () => {
    vi.mocked(getDb).mockResolvedValue(dbReturning([[]]) as never);
    const caller = appRouter.createCaller(ctxFor("user"));
    await expect(caller.audio.generateAudio({ text: "hello" })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    expect(generateAudio).not.toHaveBeenCalled();
  });

  it("lets an active bronze member generate inside 60 minutes", async () => {
    vi.mocked(getDb).mockResolvedValue(
      dbReturning([
        [{ id: 1, content: "a".repeat(1000) }],
        [member("bronze")],
        [{ totalMinutes: 59 }],
      ]) as never,
    );
    const caller = appRouter.createCaller(ctxFor("user"));
    const result = await caller.audio.generateStoryAudio({ storyId: 1 });
    expect(result.audioUrl).toBe("https://example.com/story.mp3");
    expect(generateAudio).toHaveBeenCalledTimes(1);
  });

  it("stops a bronze member at 60 minutes without calling the voice service", async () => {
    vi.mocked(getDb).mockResolvedValue(
      dbReturning([
        [{ id: 1, content: "a".repeat(1000) }],
        [member("bronze")],
        [{ totalMinutes: 60 }],
      ]) as never,
    );
    const caller = appRouter.createCaller(ctxFor("user"));
    await expect(caller.audio.generateStoryAudio({ storyId: 1 })).rejects.toThrow(
      /Audio limit exceeded/,
    );
    expect(generateAudio).not.toHaveBeenCalled();
  });

  it("gives a silver member 180 minutes", async () => {
    vi.mocked(getDb).mockResolvedValue(
      dbReturning([
        [{ id: 1, content: "a".repeat(1000) }],
        [member("silver")],
        [{ totalMinutes: 179 }],
      ]) as never,
    );
    const caller = appRouter.createCaller(ctxFor("user"));
    await caller.audio.generateStoryAudio({ storyId: 1 });
    expect(generateAudio).toHaveBeenCalledTimes(1);
  });

  it("treats gold as unlimited past the silver allowance", async () => {
    vi.mocked(getDb).mockResolvedValue(
      dbReturning([[member("gold")], [{ totalMinutes: 5000 }]]) as never,
    );
    const caller = appRouter.createCaller(ctxFor("user"));
    await caller.audio.generateAudio({ text: "a".repeat(1000) });
    expect(generateAudio).toHaveBeenCalledTimes(1);
  });

  it("does not apply the reader cap to an admin", async () => {
    vi.mocked(getDb).mockResolvedValue(
      dbReturning([[{ id: 1, content: "a".repeat(1000) }]]) as never,
    );
    const caller = appRouter.createCaller(ctxFor("admin"));
    await caller.audio.generateStoryAudio({ storyId: 1 });
    expect(generateAudio).toHaveBeenCalledTimes(1);
  });
});
