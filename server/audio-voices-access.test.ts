import { describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

function ctx(role: "admin" | "user" | null): TrpcContext {
  const now = new Date();
  return {
    user: role
      ? {
          id: 9,
          openId: `${role}-9`,
          email: `${role}@example.com`,
          name: role,
          loginMethod: "email",
          role,
          createdAt: now,
          updatedAt: now,
          lastSignedIn: now,
        }
      : null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  } as TrpcContext;
}

describe("audio voice endpoints are admin-only", () => {
  for (const who of [null, "user"] as const) {
    const label = who ?? "anonymous";
    it(`rejects ${label} callers on audio.getVoices`, async () => {
      await expect(appRouter.createCaller(ctx(who)).audio.getVoices({ includePremium: true })).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });
    it(`rejects ${label} callers on audio.getCharacterVoices`, async () => {
      await expect(appRouter.createCaller(ctx(who)).audio.getCharacterVoices()).rejects.toMatchObject({
        code: "FORBIDDEN",
      });
    });
  }

  it("still serves admins, with first names only", async () => {
    const caller = appRouter.createCaller(ctx("admin"));
    const voices = await caller.audio.getVoices({ includePremium: true });
    expect(voices.all.length).toBeGreaterThan(0);
    const mappings = await caller.audio.getCharacterVoices();
    expect(JSON.stringify(mappings)).not.toMatch(/\bChen\b/);
    expect(mappings.some((m) => m.characterName === "James")).toBe(true);
  });
});
