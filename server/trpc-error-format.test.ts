import { afterEach, describe, expect, it, vi } from "vitest";
import { publicTrpcErrorShape, redactQueryParams } from "./_core/trpc";

const sqlShape = {
  message: 'Failed query: select "id" from "books"\nparams:',
  code: -32603,
  data: {
    code: "INTERNAL_SERVER_ERROR",
    httpStatus: 500,
    path: "books.list",
    stack: 'select "id" from "books"',
  },
};

describe("public tRPC errors", () => {
  const previous = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = previous;
    vi.restoreAllMocks();
  });

  it("replaces production internal errors with a generic message", () => {
    process.env.NODE_ENV = "production";
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = publicTrpcErrorShape(sqlShape, {
      code: "INTERNAL_SERVER_ERROR",
      message: `${sqlShape.message}\nparams: reader@example.com`,
      cause: new Error('relation "books" does not exist\nparams: reader@example.com'),
    });

    expect(result.message).toBe("Something went wrong.");
    expect(result.data.stack).toBeUndefined();
    expect(result.data.path).toBe("books.list");
    expect(result.message).not.toContain("select");
    expect(errorLog).toHaveBeenCalled();
    const logged = errorLog.mock.calls.flat().map((part) => String(part)).join(" ");
    expect(logged).not.toContain("reader@example.com");
    expect(redactQueryParams("Failed query: select 1\nparams: reader@example.com")).toBe(
      "Failed query: select 1\nparams: [redacted]",
    );
  });

  it("keeps client errors and non-production internal errors", () => {
    process.env.NODE_ENV = "production";
    const notFound = publicTrpcErrorShape(
      {
        ...sqlShape,
        message: "Blog post not found",
        data: { ...sqlShape.data, code: "NOT_FOUND", httpStatus: 404 },
      },
      { code: "NOT_FOUND", message: "Blog post not found" },
    );
    expect(notFound.message).toBe("Blog post not found");

    process.env.NODE_ENV = "test";
    const internal = publicTrpcErrorShape(sqlShape, {
      code: "INTERNAL_SERVER_ERROR",
      message: sqlShape.message,
    });
    expect(internal.message).toContain("Failed query");
  });
});
