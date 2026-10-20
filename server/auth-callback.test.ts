import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGetUser, mockExchange, mockUpsertUser, mockCreateSessionToken } = vi.hoisted(() => {
  process.env.VITE_SUPABASE_URL = "https://example.supabase.co";
  process.env.VITE_SUPABASE_ANON_KEY = "test-anon-key";
  return {
    mockGetUser: vi.fn(),
    mockExchange: vi.fn(),
    mockUpsertUser: vi.fn(),
    mockCreateSessionToken: vi.fn(),
  };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth: {
      getUser: (...args: unknown[]) => mockGetUser(...args),
      exchangeCodeForSession: (...args: unknown[]) => mockExchange(...args),
    },
  }),
}));

vi.mock("./db", () => ({
  upsertUser: (...args: unknown[]) => mockUpsertUser(...args),
}));

vi.mock("./_core/sdk", () => ({
  sdk: {
    createSessionToken: (...args: unknown[]) => mockCreateSessionToken(...args),
  },
}));

vi.mock("./_core/cookies", () => ({
  getSessionCookieOptions: () => ({ httpOnly: true, path: "/" }),
}));

import { authCallback } from "./api.auth.callback";

function response() {
  return {
    redirect: vi.fn(),
    cookie: vi.fn(),
  };
}

describe("auth callback email confirmation", () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockExchange.mockReset();
    mockUpsertUser.mockReset();
    mockCreateSessionToken.mockReset();
    mockCreateSessionToken.mockResolvedValue("session-token");
    mockUpsertUser.mockResolvedValue(undefined);
  });

  it("does not create a session when the email is unconfirmed", async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: "user-1",
          email: "reader@example.com",
          email_confirmed_at: null,
          confirmed_at: null,
        },
      },
      error: null,
    });
    const res = response();
    await authCallback({ query: { access_token: "token" } } as never, res as never);
    expect(mockUpsertUser).not.toHaveBeenCalled();
    expect(res.cookie).not.toHaveBeenCalled();
    const target = String(res.redirect.mock.calls[0]?.[0] ?? res.redirect.mock.calls[0]?.[1]);
    expect(decodeURIComponent(target)).toMatch(/Confirm your email/i);
  });

  it("signs in when confirmed_at is set", async () => {
    mockExchange.mockResolvedValue({
      data: {
        user: {
          id: "user-2",
          email: "member@example.com",
          email_confirmed_at: null,
          confirmed_at: "2026-01-01T00:00:00.000Z",
          user_metadata: { full_name: "Member" },
        },
      },
      error: null,
    });
    const res = response();
    await authCallback({ query: { code: "pkce" } } as never, res as never);
    expect(mockUpsertUser).toHaveBeenCalledWith(
      expect.objectContaining({ openId: "supabase:user-2", email: "member@example.com" }),
    );
    expect(res.cookie).toHaveBeenCalled();
    expect(res.redirect).toHaveBeenCalledWith(302, "/");
  });
});
