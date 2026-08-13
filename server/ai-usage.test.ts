import { describe, it, expect, beforeEach } from "vitest";
import {
  checkRateLimit,
  estimateCostUsd,
  estimateTokens,
  getAiUsageStats,
  getClientKey,
  trackAiUsage,
} from "./ai-usage";

describe("AI Usage Token & Cost Estimation", () => {
  it("should estimate roughly 4 chars per token", () => {
    expect(estimateTokens(100)).toBe(25);
    expect(estimateTokens(1)).toBe(1);
    expect(estimateTokens(0)).toBe(1);
    expect(estimateTokens(4)).toBe(1);
    expect(estimateTokens(5)).toBe(2);
  });

  it("should estimate cost with model pricing", () => {
    const cost = estimateCostUsd("gemini-2.5-flash", 4000, 1000);
    // 1000 in-tokens * $0.30/M + 250 out-tokens * $2.50/M = 0.0003 + 0.000625 = 0.000925
    expect(cost).toBeCloseTo(0.000925, 6);
  });

  it("should fall back to default pricing for unknown models", () => {
    const cost = estimateCostUsd("mystery-model", 4000, 0);
    // 1000 in-tokens * $0.30/M + min 1 out-token * $2.50/M = 0.0003 + 0.0000025
    expect(cost).toBeCloseTo(0.0003025, 6);
  });
});

describe("AI Usage Rate Limiting", () => {
  it("should allow requests up to the limit and block beyond it", () => {
    const key = "test-ip-1";
    for (let i = 0; i < 15; i++) {
      expect(checkRateLimit(key, "chat")).toBe(true);
    }
    expect(checkRateLimit(key, "chat")).toBe(false);
  });

  it("should track rate-limited status in stats when blocked", () => {
    const key = "test-ip-2";
    for (let i = 0; i < 15; i++) {
      checkRateLimit(key, "chat");
    }
    checkRateLimit(key, "chat");
    trackAiUsage({
      feature: "chat",
      model: "gemini-1.5-flash",
      inputChars: 500,
      outputChars: 0,
      status: "rate-limited",
      key,
    });
    const stats = getAiUsageStats();
    expect(stats.today.rateLimited).toBeGreaterThanOrEqual(1);
    expect(stats.recent[0].status).toBe("rate-limited");
  });

  it("should have separate buckets per key", () => {
    for (let i = 0; i < 15; i++) {
      checkRateLimit("busy-ip", "chat");
    }
    expect(checkRateLimit("busy-ip", "chat")).toBe(false);
    expect(checkRateLimit("fresh-ip", "chat")).toBe(true);
  });
});

describe("AI Usage Tracking & Stats", () => {
  beforeEach(() => {
    // Reset state to keep tests deterministic
    trackAiUsage({
      feature: "other",
      model: "reset",
      inputChars: 1,
      outputChars: 1,
    });
  });

  it("should record interactions and aggregate today's stats", () => {
    trackAiUsage({
      feature: "workflow",
      model: "gemini-2.5-flash",
      inputChars: 8000,
      outputChars: 4000,
      key: "stat-ip",
    });
    const stats = getAiUsageStats();
    expect(stats.today.requests).toBeGreaterThanOrEqual(1);
    expect(stats.today.costUsd).toBeGreaterThan(0);
    expect(stats.today.perFeature.workflow).toBeGreaterThanOrEqual(1);
    expect(stats.recent[0].feature).toBe("workflow");
    expect(stats.recent[0].model).toBe("gemini-2.5-flash");
  });

  it("should never throw even with empty input", () => {
    expect(() =>
      trackAiUsage({ feature: "chat", model: "gemini-1.5-flash", inputChars: 0, outputChars: 0 })
    ).not.toThrow();
    const stats = getAiUsageStats();
    expect(stats.recent[0].inputTokens).toBeGreaterThanOrEqual(1);
  });
});

describe("Client Key Extraction", () => {
  it("should use x-forwarded-for first value", () => {
    const key = getClientKey({
      headers: { "x-forwarded-for": "203.0.113.5, 70.41.3.18, 150.172.238.178" },
    });
    expect(key).toBe("203.0.113.5");
  });

  it("should fall back to x-real-ip", () => {
    const key = getClientKey({ headers: { "x-real-ip": "198.51.100.7" } });
    expect(key).toBe("198.51.100.7");
  });

  it("should default to unknown when no headers present", () => {
    const key = getClientKey({ headers: {} });
    expect(key).toBe("unknown");
  });
});