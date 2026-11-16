import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";
import { loadPublicNewsletterArchive, missingNewslettersTable } from "./newsletter-archive";

vi.mock("./db", () => ({
  getAllNewsletters: vi.fn(),
}));

vi.mock("./_core/stripe", () => ({
  stripe: {},
  STRIPE_WEBHOOK_SECRET: "",
}));

vi.mock("stripe", () => ({
  default: class Stripe {
    constructor() {}
  },
}));

describe("public newsletter archive", () => {
  it("recognizes a missing newsletters table through the drizzle cause", () => {
    const error = new Error('Failed query: select "id" from "newsletters"');
    error.cause = new Error('relation "newsletters" does not exist');
    expect(missingNewslettersTable(error)).toBe(true);
    expect(missingNewslettersTable(new Error("connection refused"))).toBe(false);
  });

  it("returns an empty list instead of throwing when the archive table is missing", async () => {
    const error = new Error('Failed query: select from "newsletters"');
    error.cause = new Error('relation "newsletters" does not exist');
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(loadPublicNewsletterArchive(async () => {
      throw error;
    })).resolves.toEqual([]);
    errorLog.mockRestore();
  });

  it("returns only sent newsletters when the table exists", async () => {
    const result = await loadPublicNewsletterArchive(async () => [
      { id: 1, status: "draft", subject: "Draft" },
      { id: 2, status: "sent", subject: "Sent" },
    ]);
    expect(result.map(item => item.subject)).toEqual(["Sent"]);
  });

  it("returns an empty list when the archive has no rows", async () => {
    await expect(loadPublicNewsletterArchive(async () => [])).resolves.toEqual([]);
    await expect(loadPublicNewsletterArchive(async () => undefined)).resolves.toEqual([]);
  });

  it("returns an empty list and logs when the archive read fails", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(loadPublicNewsletterArchive(async () => {
      throw new Error("connection refused");
    })).resolves.toEqual([]);
    expect(errorLog).toHaveBeenCalled();
    errorLog.mockRestore();
  });

  it("newsletters.getAll returns an empty list when the database errors", async () => {
    vi.mocked(db.getAllNewsletters).mockRejectedValue(
      new Error('relation "newsletters" does not exist'),
    );
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    const { appRouter } = await import("./routers");
    const ctx: TrpcContext = {
      user: null,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };
    await expect(appRouter.createCaller(ctx).newsletters.getAll()).resolves.toEqual([]);
    expect(errorLog).toHaveBeenCalled();
    errorLog.mockRestore();
  });
});
