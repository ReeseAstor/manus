import { describe, it, expect } from "vitest";

const GRAPHQL_URL = "https://graphql.switchy.io/v1/graphql";
const REST_BASE = "https://api.switchy.io/v1/links";

function getApiKey() {
  return process.env.SWITCHY_API_KEY!;
}

describe("Switchy API Key Validation", () => {
  it("should authenticate and return workspace data", async () => {
    const apiKey = getApiKey();
    expect(apiKey).toBeDefined();
    expect(apiKey).not.toBe("");

    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Authorization": apiKey,
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

describe("Switchy GraphQL Link Queries", () => {
  it("should list links with correct fields", async () => {
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Authorization": getApiKey(),
      },
      body: JSON.stringify({
        query: `{
          links(limit: 5, order_by: {createdDate: desc}) {
            id uniq domain url title description name note tags createdDate
          }
        }`,
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.data).toBeDefined();
    expect(data.data.links).toBeDefined();
    expect(Array.isArray(data.data.links)).toBe(true);

    // Verify at least one link exists
    expect(data.data.links.length).toBeGreaterThan(0);

    // Verify link structure
    const link = data.data.links[0];
    expect(link).toHaveProperty("id");
    expect(link).toHaveProperty("uniq");
    expect(link).toHaveProperty("domain");
    expect(link).toHaveProperty("url");
    expect(link).toHaveProperty("createdDate");
  });

  it("should search links by URL pattern", async () => {
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Authorization": getApiKey(),
      },
      body: JSON.stringify({
        query: `{
          links(where: {url: {_ilike: "%amzn%"}}) {
            id domain url title
          }
        }`,
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.data).toBeDefined();
    expect(data.data.links).toBeDefined();
    // Should find Amazon links
    expect(data.data.links.length).toBeGreaterThan(0);
    expect(data.data.links[0].url).toContain("amzn");
  });

  it("should find a specific link by slug", async () => {
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Authorization": getApiKey(),
      },
      body: JSON.stringify({
        query: `{
          links(where: {id: {_eq: "b01"}, domain: {_eq: "swiy.co"}}) {
            id domain url title
          }
        }`,
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.data.links).toBeDefined();
    expect(data.data.links.length).toBe(1);
    expect(data.data.links[0].id).toBe("b01");
    expect(data.data.links[0].domain).toBe("swiy.co");
  });
});

describe("Switchy REST API - Create Link", () => {
  it("should create a new short link and verify it exists", async () => {
    const testSlug = `test-${Date.now()}`;
    const testUrl = "https://reeseastor.com/test-link-verification";

    // Create the link
    const createResponse = await fetch(`${REST_BASE}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Authorization": getApiKey(),
      },
      body: JSON.stringify({
        link: {
          url: testUrl,
          domain: "swiy.co",
          id: testSlug,
          title: "Test Link - Automated",
          description: "Created by automated test",
          tags: ["test", "automated"],
          note: "Auto-created by vitest, safe to delete",
          pixels: [],
          showGDPR: false,
        },
        autofill: false,
      }),
    });

    expect(createResponse.ok).toBe(true);

    // Verify the link exists via GraphQL
    const verifyResponse = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Authorization": getApiKey(),
      },
      body: JSON.stringify({
        query: `{
          links(where: {id: {_eq: "${testSlug}"}, domain: {_eq: "swiy.co"}}) {
            id domain url title tags note
          }
        }`,
      }),
    });

    expect(verifyResponse.ok).toBe(true);
    const verifyData = await verifyResponse.json();
    expect(verifyData.data.links).toBeDefined();
    expect(verifyData.data.links.length).toBe(1);
    expect(verifyData.data.links[0].url).toBe(testUrl);
    expect(verifyData.data.links[0].title).toBe("Test Link - Automated");
    expect(verifyData.data.links[0].tags).toContain("test");
  });
});

describe("Switchy Service Module", () => {
  it("should export all required functions", async () => {
    const switchy = await import("./switchy");
    expect(typeof switchy.listLinks).toBe("function");
    expect(typeof switchy.getLinkBySlug).toBe("function");
    expect(typeof switchy.searchLinks).toBe("function");
    expect(typeof switchy.createLink).toBe("function");
    expect(typeof switchy.updateLinkByUniq).toBe("function");
    expect(typeof switchy.updateLinkBySlug).toBe("function");
    expect(typeof switchy.shortenUrl).toBe("function");
  });

  it("listLinks should return an array of links", async () => {
    const { listLinks } = await import("./switchy");
    const links = await listLinks(5);
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveProperty("id");
    expect(links[0]).toHaveProperty("uniq");
    expect(links[0]).toHaveProperty("domain");
    expect(links[0]).toHaveProperty("url");
  });

  it("getLinkBySlug should return a specific link", async () => {
    const { getLinkBySlug } = await import("./switchy");
    const link = await getLinkBySlug("b01");
    expect(link).not.toBeNull();
    expect(link!.id).toBe("b01");
    expect(link!.domain).toBe("swiy.co");
  });

  it("getLinkBySlug should return null for non-existent slug", async () => {
    const { getLinkBySlug } = await import("./switchy");
    const link = await getLinkBySlug("nonexistent-slug-xyz-999");
    expect(link).toBeNull();
  });

  it("searchLinks should find links matching a query", async () => {
    const { searchLinks } = await import("./switchy");
    const links = await searchLinks("amzn");
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBeGreaterThan(0);
  });
});
