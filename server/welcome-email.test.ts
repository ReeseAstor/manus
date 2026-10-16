import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateWelcomeEmail } from "./email-templates/welcome";
import { appRouter } from "./routers";

// Mock both mailerlite and email-service
vi.mock("./mailerlite", () => ({
  subscribeToMailerLite: vi.fn(),
  sendMailerLiteCampaign: vi.fn(),
  getMailerLiteSubscribers: vi.fn(),
}));

vi.mock("./email-service", () => ({
  sendEmail: vi.fn(),
  sendPurchaseConfirmationEmail: vi.fn(),
  generateDownloadLinks: vi.fn(),
}));

import { subscribeToMailerLite } from "./mailerlite";
import { sendEmail } from "./email-service";

function createTestContext(userId?: string) {
  return {
    user: userId ? { id: userId, claims: { sub: userId } } : null,
  };
}

describe("Welcome Email Template", () => {
  it("should generate valid HTML with prequel download link", () => {
    const html = generateWelcomeEmail({});
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain('href="https://dl.bookfunnel.com/kw1yge3479"');
    expect(html).not.toContain("swiy.co/05");
    expect(html).toContain("Download Your Free Book");
    expect(html).toContain("The First Acquisition");
  });

  it("should include subscriber name when provided", () => {
    const html = generateWelcomeEmail({ subscriberName: "Sarah" });
    expect(html).toContain("Hello Sarah,");
  });

  it("should use generic greeting when no name provided", () => {
    const html = generateWelcomeEmail({});
    expect(html).toContain("Hello,");
    expect(html).not.toContain("Hello undefined");
  });

  it("should include Amazon link as alternative", () => {
    const html = generateWelcomeEmail({});
    expect(html).toContain("https://www.amazon.com/dp/B0D82GWFD9?tag=reeseastor-20");
    expect(html).not.toContain("swiy.co/3rd");
    expect(html).toContain("Amazon");
  });

  it("should include benefit list", () => {
    const html = generateWelcomeEmail({});
    expect(html).toContain("New release alerts");
    expect(html).not.toContain("before anyone else");
    expect(html).toContain("Bonus scenes from the series");
    expect(html).toContain("Early cover reveals and ARC team invitations");
    expect(html).toContain("Sales and release-day news");
    expect(html).not.toMatch(/deleted scenes|epilogues|POV chapters|Exclusive bonus chapters/i);
  });

  it("should include preheader text", () => {
    const html = generateWelcomeEmail({});
    expect(html).toContain("Your free book is waiting");
  });
});

describe("Newsletter subscribe sends welcome email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send welcome email after successful subscription", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(subscribeToMailerLite).mockResolvedValue({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: { id: "123" },
    });
    vi.mocked(sendEmail).mockResolvedValue(true);

    await caller.newsletter.subscribe({ email: "reader@example.com", name: "Jane" });

    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "reader@example.com",
        subject: expect.stringContaining("Welcome"),
        html: expect.stringContaining("Download Your Free Book"),
      })
    );
  });

  it("should include subscriber name in welcome email", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(subscribeToMailerLite).mockResolvedValue({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: { id: "456" },
    });
    vi.mocked(sendEmail).mockResolvedValue(true);

    await caller.newsletter.subscribe({ email: "reader@example.com", name: "Sarah" });

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining("Hello Sarah,"),
      })
    );
  });

  it("should NOT fail subscription if welcome email fails", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(subscribeToMailerLite).mockResolvedValue({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: { id: "789" },
    });
    // Simulate email sending failure
    vi.mocked(sendEmail).mockRejectedValue(new Error("SMTP error"));

    // Should NOT throw — subscription should still succeed
    const result = await caller.newsletter.subscribe({ email: "reader@example.com" });
    expect(result.success).toBe(true);
  });

  it("should NOT send welcome email if subscription fails", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(subscribeToMailerLite).mockResolvedValue({
      success: false,
      message: "Invalid email address",
    });

    await expect(
      caller.newsletter.subscribe({ email: "reader@example.com" })
    ).rejects.toThrow("Invalid email address");

    // Welcome email should NOT be sent
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("should send welcome email without name when not provided", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    vi.mocked(subscribeToMailerLite).mockResolvedValue({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: { id: "101" },
    });
    vi.mocked(sendEmail).mockResolvedValue(true);

    await caller.newsletter.subscribe({ email: "reader@example.com" });

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.not.stringContaining("Hello undefined"),
      })
    );
  });
});
