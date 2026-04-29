import { describe, it, expect } from "vitest";

describe("Switchy API Key Validation", () => {
  it("should authenticate and return workspace data", async () => {
    const apiKey = process.env.SWITCHY_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe("");

    const response = await fetch("https://graphql.switchy.io/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Authorization": apiKey!,
      },
      body: JSON.stringify({
        query: "{ workspaces { id name } }",
      }),
    });

    expect(response.ok).toBe(true);

    const data = await response.json();
    expect(data.data).toBeDefined();
    expect(data.data.workspaces).toBeDefined();
    expect(data.data.workspaces.length).toBeGreaterThan(0);
    expect(data.data.workspaces[0].id).toBe(95668);
  });
});
