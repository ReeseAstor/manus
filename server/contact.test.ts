import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as notification from "./_core/notification";

// Mock the notification module
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(),
}));

function createTestContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("contact.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successfully sends a contact form submission", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(notification.notifyOwner).mockResolvedValue(true);

    const input = {
      name: "John Doe",
      email: "john@example.com",
      subject: "Inquiry about coaching",
      message: "I'm interested in learning more about your coaching services.",
    };

    const result = await caller.contact.submit(input);

    expect(result.success).toBe(true);
    expect(result.message).toBe("Thank you for your message! I'll get back to you soon.");
    expect(notification.notifyOwner).toHaveBeenCalledWith({
      title: "New Contact: Inquiry about coaching",
      content: expect.stringContaining("John Doe"),
    });
    expect(notification.notifyOwner).toHaveBeenCalledWith({
      title: expect.any(String),
      content: expect.stringContaining("john@example.com"),
    });
  });

  it("includes all form data in the notification", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(notification.notifyOwner).mockResolvedValue(true);

    const input = {
      name: "Jane Smith",
      email: "jane@example.com",
      subject: "Book question",
      message: "When is your next book coming out?",
    };

    await caller.contact.submit(input);

    const notifyCall = vi.mocked(notification.notifyOwner).mock.calls[0][0];
    expect(notifyCall.title).toContain("Book question");
    expect(notifyCall.content).toContain("Jane Smith");
    expect(notifyCall.content).toContain("jane@example.com");
    expect(notifyCall.content).toContain("When is your next book coming out?");
  });

  it("rejects invalid email addresses", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      name: "Test User",
      email: "invalid-email",
      subject: "Test",
      message: "This is a test message.",
    };

    await expect(caller.contact.submit(input)).rejects.toThrow();
  });

  it("rejects messages that are too short", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      name: "Test User",
      email: "test@example.com",
      subject: "Test",
      message: "Short",
    };

    await expect(caller.contact.submit(input)).rejects.toThrow();
  });

  it("rejects empty required fields", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      name: "",
      email: "test@example.com",
      subject: "Test",
      message: "This is a test message.",
    };

    await expect(caller.contact.submit(input)).rejects.toThrow();
  });

  it("throws error when notification service fails", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(notification.notifyOwner).mockResolvedValue(false);

    const input = {
      name: "John Doe",
      email: "john@example.com",
      subject: "Test",
      message: "This is a test message.",
    };

    await expect(caller.contact.submit(input)).rejects.toThrow(
      "Failed to send message. Please try again later."
    );
  });

  it("handles special characters in messages", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(notification.notifyOwner).mockResolvedValue(true);

    const input = {
      name: "Test User",
      email: "test@example.com",
      subject: "Special chars: <>&\"'",
      message: "Message with special characters: <script>alert('test')</script>",
    };

    const result = await caller.contact.submit(input);

    expect(result.success).toBe(true);
    expect(notification.notifyOwner).toHaveBeenCalled();
  });
});
