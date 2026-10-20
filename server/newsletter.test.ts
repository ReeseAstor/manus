import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as mailerlite from "./mailerlite";

// Mock the mailerlite module
vi.mock("./mailerlite", () => ({
  subscribeToMailerLite: vi.fn(),
}));

let signupFixtureIp = 1;
function createTestContext(): TrpcContext {
  const ip = `203.0.115.${signupFixtureIp++}`;
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: { "x-vercel-forwarded-for": ip },
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("newsletter.subscribe", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully subscribes a valid email", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    // Mock successful subscription
    vi.mocked(mailerlite.subscribeToMailerLite).mockResolvedValue({
      success: true,
      message: "Successfully subscribed to newsletter",
    });

    const result = await caller.newsletter.subscribe({
      email: "test@example.com",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Successfully subscribed to newsletter");
    expect(mailerlite.subscribeToMailerLite).toHaveBeenCalledWith(
      "test@example.com",
      undefined,
      undefined
    );
  });

  it("subscribes with name when provided", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(mailerlite.subscribeToMailerLite).mockResolvedValue({
      success: true,
      message: "Successfully subscribed to newsletter",
    });

    const result = await caller.newsletter.subscribe({
      email: "test@example.com",
      name: "John Doe",
    });

    expect(result.success).toBe(true);
    expect(mailerlite.subscribeToMailerLite).toHaveBeenCalledWith(
      "test@example.com",
      "John Doe",
      undefined
    );
  });

  it("rejects invalid email format", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.newsletter.subscribe({
        email: "invalid-email",
      })
    ).rejects.toThrow();
  });

  it("handles subscription failure", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(mailerlite.subscribeToMailerLite).mockResolvedValue({
      success: false,
      message: "Failed to subscribe",
    });

    await expect(
      caller.newsletter.subscribe({
        email: "test@example.com",
      })
    ).rejects.toThrow("Failed to subscribe");
  });

  it("handles already subscribed users", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(mailerlite.subscribeToMailerLite).mockResolvedValue({
      success: true,
      message: "You're already subscribed to our newsletter",
    });

    const result = await caller.newsletter.subscribe({
      email: "existing@example.com",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("already subscribed");
  });
});
