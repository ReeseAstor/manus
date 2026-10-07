import { describe, expect, it } from "vitest";
import { detectBotSignup, isDottedGmail } from "./signupBotGuard";

describe("signupBotGuard", () => {
  const now = 1_000_000;

  it("allows a normal signup", () => {
    expect(
      detectBotSignup({ email: "jane.doe@gmail.com", formRenderedAt: now - 8000, formSubmittedAt: now }, now)
    ).toBeNull();
  });

  it("allows older callers that send no bot fields", () => {
    expect(detectBotSignup({ email: "reader@example.com" }, now)).toBeNull();
  });

  it("flags a filled honeypot", () => {
    expect(detectBotSignup({ email: "a@example.com", company_website: "http://spam" }, now)).toBe("honeypot");
  });

  it("ignores a whitespace-only honeypot", () => {
    expect(detectBotSignup({ email: "a@example.com", company_website: "  " }, now)).toBeNull();
  });

  it("flags submissions faster than 2 seconds", () => {
    expect(
      detectBotSignup({ email: "a@example.com", formRenderedAt: now - 500, formSubmittedAt: now }, now)
    ).toBe("too_fast");
    expect(detectBotSignup({ email: "a@example.com", formRenderedAt: now - 500 }, now)).toBe("too_fast");
  });

  it("flags heavily dotted gmail addresses", () => {
    expect(isDottedGmail("e.van.s.r.ebecca1.10@gmail.com")).toBe(true);
    expect(isDottedGmail("t.e.s.t.h.o.n.e.y.1007@GoogleMail.com")).toBe(true);
    expect(isDottedGmail("a.b.c.d@gmail.com")).toBe(true);
    expect(isDottedGmail("mary.jane.doe@gmail.com")).toBe(false);
    expect(isDottedGmail("a.b+c.d.e.f@gmail.com")).toBe(false);
    expect(isDottedGmail("a.b.c.d@example.com")).toBe(false);
    expect(detectBotSignup({ email: "e.van.s.r.ebecca1.10@gmail.com" }, now)).toBe("dotted_gmail");
  });
});
