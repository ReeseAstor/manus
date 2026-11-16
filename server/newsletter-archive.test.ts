import { describe, expect, it, vi } from "vitest";
import { loadPublicNewsletterArchive, missingNewslettersTable } from "./newsletter-archive";

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

  it("still throws when the archive read fails for another reason", async () => {
    await expect(loadPublicNewsletterArchive(async () => {
      throw new Error("connection refused");
    })).rejects.toThrow("connection refused");
  });
});
