import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";

// Mock the mailerlite module
vi.mock("./mailerlite", () => ({
  subscribeToMailerLite: vi.fn(),
  sendMailerLiteCampaign: vi.fn(),
  getMailerLiteSubscribers: vi.fn(),
}));

import { subscribeToMailerLite } from "./mailerlite";

function createTestContext(userId?: string) {
  return {
    user: userId ? { id: userId, claims: { sub: userId } } : null,
  };
}

describe("newsletter.subscribe (new release sign-up form)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should subscribe a valid email address", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(subscribeToMailerLite).mockResolvedValue({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: { id: "123", email: "reader@example.com" },
    });

    const result = await caller.newsletter.subscribe({
      email: "reader@example.com",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Successfully subscribed to newsletter");
    expect(subscribeToMailerLite).toHaveBeenCalledWith(
      "reader@example.com",
      undefined,
      undefined // MAILERLITE_GROUP_ID env var
    );
  });

  it("should subscribe with optional name", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(subscribeToMailerLite).mockResolvedValue({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: { id: "456", email: "reader@example.com" },
    });

    const result = await caller.newsletter.subscribe({
      email: "reader@example.com",
      name: "Jane",
    });

    expect(result.success).toBe(true);
    expect(subscribeToMailerLite).toHaveBeenCalledWith(
      "reader@example.com",
      "Jane",
      undefined // MAILERLITE_GROUP_ID env var
    );
  });

  it("should reject an invalid email address", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.newsletter.subscribe({ email: "not-an-email" })
    ).rejects.toThrow();

    // subscribeToMailerLite should not be called for invalid input
    expect(subscribeToMailerLite).not.toHaveBeenCalled();
  });

  it("should throw when MailerLite returns failure", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(subscribeToMailerLite).mockResolvedValue({
      success: false,
      message: "Newsletter service is not configured",
    });

    await expect(
      caller.newsletter.subscribe({ email: "reader@example.com" })
    ).rejects.toThrow("Newsletter service is not configured");
  });

  it("should work without authentication (public procedure)", async () => {
    // No user in context — simulates an anonymous visitor
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(subscribeToMailerLite).mockResolvedValue({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: { id: "789" },
    });

    const result = await caller.newsletter.subscribe({
      email: "anonymous@example.com",
    });

    expect(result.success).toBe(true);
  });
});
