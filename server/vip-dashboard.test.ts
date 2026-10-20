import { beforeEach, describe, expect, it, vi } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, getDb: vi.fn() };
});

function signedInContext(): TrpcContext {
  return {
    user: {
      id: 7,
      openId: "reader-user",
      email: "reader@example.com",
      name: "Reader",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function queryResult<T>(rows: T[]) {
  const builder: Record<string, unknown> = {};
  const passthrough = () => builder;
  for (const method of ["from", "where", "limit", "innerJoin", "orderBy", "offset"]) {
    builder[method] = passthrough;
  }
  builder.then = (resolve: (value: T[]) => unknown, reject?: (reason: unknown) => unknown) =>
    Promise.resolve(rows).then(resolve, reject);
  return builder;
}

describe("vip.getDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects anonymous callers", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    });

    await expect(caller.vip.getDashboard()).rejects.toBeInstanceOf(TRPCError);
  });

  it("turns play-history seconds into whole minutes and uses the distinct story count", async () => {
    const joinedAt = new Date("2026-01-04T00:00:00.000Z");
    const periodEnd = new Date("2026-02-04T00:00:00.000Z");
    const playedAt = new Date("2026-03-01T00:00:00.000Z");
    const queued = [
      [{ status: "active", joinedAt, currentPeriodEnd: periodEnd }],
      [{ id: 4, title: "The Penthouse Reunion", category: "passion", excerpt: "A night in.", heatLevel: 5 }],
      [{ id: 9, title: "The Penthouse Reunion", heatLevel: 5, progress: 90, playedAt }],
      [{ seconds: 90, stories: 2 }],
    ];
    vi.mocked(db.getDb).mockResolvedValue({
      select: () => queryResult(queued.shift() ?? []),
    } as never);

    const result = await appRouter.createCaller(signedInContext()).vip.getDashboard();

    expect(result.storiesPlayed).toBe(2);
    expect(result.minutesPlayed).toBe(1);
    expect(result.favorites).toHaveLength(1);
    expect(result.memberSince).toEqual(joinedAt);
    expect(result.subscriptionStatus).toBe("active");
    expect(result.currentPeriodEnd).toEqual(periodEnd);
    expect(result.history[0]?.progress).toBe(90);
    expect(result.minutesPlayed).not.toBe(245);
  });

  it("reports zero when the member has no listening history", async () => {
    const queued = [[], [], [], [{ seconds: 0, stories: 0 }]];
    vi.mocked(db.getDb).mockResolvedValue({
      select: () => queryResult(queued.shift() ?? []),
    } as never);

    const result = await appRouter.createCaller(signedInContext()).vip.getDashboard();

    expect(result.storiesPlayed).toBe(0);
    expect(result.minutesPlayed).toBe(0);
    expect(result.favorites).toEqual([]);
    expect(result.history).toEqual([]);
    expect(result.subscriptionStatus).toBeNull();
  });

  it("rejects a playback position longer than six hours", async () => {
    const caller = appRouter.createCaller(signedInContext());
    await expect(
      caller.vip.updatePlayProgress({ storyId: 1, progress: 6 * 60 * 60 + 1, completed: false }),
    ).rejects.toBeInstanceOf(TRPCError);
  });

  it("upserts one furthest position per story", async () => {
    const onConflictDoUpdate = vi.fn(() => Promise.resolve());
    const values = vi.fn(() => ({ onConflictDoUpdate }));
    vi.mocked(db.getDb).mockResolvedValue({
      insert: () => ({ values }),
    } as never);

    const result = await appRouter.createCaller(signedInContext()).vip.updatePlayProgress({
      storyId: 4,
      progress: 90,
      completed: false,
    });

    expect(result).toEqual({ success: true });
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 7, storyId: 4, progress: 90, completed: false }),
    );
    expect(onConflictDoUpdate).toHaveBeenCalled();
  });
});
