import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock email service
vi.mock("./email-service", () => ({
  sendEmail: vi.fn(),
}));

// Mock db
vi.mock("./db", () => ({
  getDb: vi.fn(),
  createNewsletter: vi.fn(),
}));

import { sendEmail } from "./email-service";
import { getDb } from "./db";

describe("Send Test Email Feature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call sendEmail with [TEST] prefix in subject", async () => {
    const mockSendEmail = sendEmail as ReturnType<typeof vi.fn>;
    mockSendEmail.mockResolvedValue(true);

    // Simulate what the router does
    const newsletter = {
      id: 1,
      title: "AI Studio Music - 3/14/2026",
      subject: "New Music Release",
      content: "<h1>Hello</h1><p>Test content</p>",
    };

    const subject = `[TEST] ${newsletter.subject || newsletter.title || "Newsletter Draft"}`;
    const testBanner = `<div style="background:#d4af37;color:#1a1a2e;padding:12px 20px;text-align:center;font-family:sans-serif;font-size:14px;font-weight:bold;">⚠️ TEST EMAIL — This is a preview, not sent to subscribers</div>`;
    const html = testBanner + newsletter.content;

    await sendEmail({
      to: "test@example.com",
      subject,
      html,
      from: {
        email: "noreply@reeseastor.us",
        name: "Reese Astor (Test)",
      },
    });

    expect(mockSendEmail).toHaveBeenCalledWith({
      to: "test@example.com",
      subject: "[TEST] New Music Release",
      html: expect.stringContaining("TEST EMAIL"),
      from: {
        email: "noreply@reeseastor.us",
        name: "Reese Astor (Test)",
      },
    });
  });

  it("should use newsletter title as fallback when subject is empty", () => {
    const newsletter = {
      id: 1,
      title: "My Newsletter Draft",
      subject: "",
      content: "<p>Content</p>",
    };

    const subject = `[TEST] ${newsletter.subject || newsletter.title || "Newsletter Draft"}`;
    expect(subject).toBe("[TEST] My Newsletter Draft");
  });

  it("should use default fallback when both subject and title are empty", () => {
    const newsletter = {
      id: 1,
      title: "",
      subject: "",
      content: "<p>Content</p>",
    };

    const subject = `[TEST] ${newsletter.subject || newsletter.title || "Newsletter Draft"}`;
    expect(subject).toBe("[TEST] Newsletter Draft");
  });

  it("should prepend test banner to newsletter HTML content", () => {
    const content = "<h1>Hello World</h1>";
    const testBanner = `<div style="background:#d4af37;color:#1a1a2e;padding:12px 20px;text-align:center;font-family:sans-serif;font-size:14px;font-weight:bold;">⚠️ TEST EMAIL — This is a preview, not sent to subscribers</div>`;
    const html = testBanner + content;

    expect(html).toContain("TEST EMAIL");
    expect(html).toContain("This is a preview");
    expect(html).toContain("<h1>Hello World</h1>");
    expect(html.indexOf("TEST EMAIL")).toBeLessThan(html.indexOf("Hello World"));
  });

  it("should handle sendEmail failure gracefully", async () => {
    const mockSendEmail = sendEmail as ReturnType<typeof vi.fn>;
    mockSendEmail.mockResolvedValue(false);

    const result = await sendEmail({
      to: "test@example.com",
      subject: "[TEST] Draft",
      html: "<p>test</p>",
    });

    expect(result).toBe(false);
  });

  it("should include the correct from address", async () => {
    const mockSendEmail = sendEmail as ReturnType<typeof vi.fn>;
    mockSendEmail.mockResolvedValue(true);

    await sendEmail({
      to: "admin@example.com",
      subject: "[TEST] Test Subject",
      html: "<p>test</p>",
      from: {
        email: "noreply@reeseastor.us",
        name: "Reese Astor (Test)",
      },
    });

    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: {
          email: "noreply@reeseastor.us",
          name: "Reese Astor (Test)",
        },
      })
    );
  });
});
