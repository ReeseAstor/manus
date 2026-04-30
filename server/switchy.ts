/**
 * Switchy.io API Service
 * 
 * Provides methods to interact with the Switchy short link service (swiy.co)
 * via their GraphQL and REST APIs.
 */

const GRAPHQL_URL = "https://graphql.switchy.io/v1/graphql";
const REST_BASE = "https://api.switchy.io/v1/links";
const DEFAULT_DOMAIN = "swiy.co";

function getApiKey(): string {
  const key = process.env.SWITCHY_API_KEY;
  if (!key) {
    throw new Error("SWITCHY_API_KEY environment variable is not set");
  }
  return key;
}

function getHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Api-Authorization": getApiKey(),
  };
}

// ─── Types ───────────────────────────────────────────────────────────

export interface SwitchyLink {
  id: string;         // slug (e.g., "4rd")
  uniq: number;       // numeric unique ID
  domain: string;     // e.g., "swiy.co"
  url: string;        // destination URL
  title: string | null;
  description: string | null;
  name: string | null;
  note: string | null;
  tags: string[];
  createdDate: string;
  favicon: string | null;
  image: string | null;
  folderId: number | null;
}

export interface CreateLinkInput {
  url: string;
  slug?: string;       // custom slug (id)
  title?: string;
  description?: string;
  image?: string;
  tags?: string[];
  note?: string;
  domain?: string;
}

export interface UpdateLinkInput {
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  tags?: string[];
  note?: string;
}

// ─── GraphQL Queries ─────────────────────────────────────────────────

/**
 * List all links from the Switchy account
 */
export async function listLinks(limit: number = 50, offset: number = 0): Promise<SwitchyLink[]> {
  const query = `
    query ListLinks($limit: Int!, $offset: Int!) {
      links(limit: $limit, offset: $offset, order_by: {createdDate: desc}) {
        id
        uniq
        domain
        url
        title
        description
        name
        note
        tags
        createdDate
        favicon
        image
        folderId
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ query, variables: { limit, offset } }),
  });

  if (!response.ok) {
    throw new Error(`Switchy GraphQL error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`Switchy GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  return result.data.links;
}

/**
 * Get a single link by its slug (id)
 */
export async function getLinkBySlug(slug: string, domain: string = DEFAULT_DOMAIN): Promise<SwitchyLink | null> {
  const query = `
    query GetLink($id: String!, $domain: String!) {
      links(where: {id: {_eq: $id}, domain: {_eq: $domain}}) {
        id
        uniq
        domain
        url
        title
        description
        name
        note
        tags
        createdDate
        favicon
        image
        folderId
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ query, variables: { id: slug, domain } }),
  });

  if (!response.ok) {
    throw new Error(`Switchy GraphQL error: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`Switchy GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  return result.data.links[0] || null;
}

/**
 * Search links by URL or title
 */
export async function searchLinks(searchTerm: string): Promise<SwitchyLink[]> {
  const query = `
    query SearchLinks($search: String!) {
      links(where: {_or: [
        {url: {_ilike: $search}},
        {title: {_ilike: $search}},
        {note: {_ilike: $search}}
      ]}, order_by: {createdDate: desc}) {
        id
        uniq
        domain
        url
        title
        description
        name
        note
        tags
        createdDate
        favicon
        image
        folderId
      }
    }
  `;

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ query, variables: { search: `%${searchTerm}%` } }),
  });

  if (!response.ok) {
    throw new Error(`Switchy GraphQL error: ${response.status}`);
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`Switchy GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  return result.data.links;
}

// ─── REST API (Create & Update) ──────────────────────────────────────

/**
 * Create a new short link
 */
export async function createLink(input: CreateLinkInput): Promise<{ id: string; shortUrl: string }> {
  const domain = input.domain || DEFAULT_DOMAIN;
  
  const body: any = {
    link: {
      url: input.url,
      domain,
      title: input.title || "",
      description: input.description || "",
      pixels: [],
      showGDPR: false,
      tags: input.tags || [],
      note: input.note || "",
    },
    autofill: !input.title, // auto-fill OG data if no title provided
  };

  // Only set custom slug if provided
  if (input.slug) {
    body.link.id = input.slug;
  }

  // Set image if provided
  if (input.image) {
    body.link.image = input.image;
  }

  const response = await fetch(`${REST_BASE}/create`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Switchy create error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  
  // The API returns the created link data
  const linkId = result.id || input.slug || result.uniq;
  const shortUrl = `https://${domain}/${linkId}`;

  return { id: linkId, shortUrl };
}

/**
 * Update an existing link by its uniq ID
 */
export async function updateLinkByUniq(uniqId: number, input: UpdateLinkInput): Promise<void> {
  const body: any = {
    link: {},
  };

  if (input.url !== undefined) body.link.url = input.url;
  if (input.title !== undefined) body.link.title = input.title;
  if (input.description !== undefined) body.link.description = input.description;
  if (input.image !== undefined) body.link.image = input.image;
  if (input.tags !== undefined) body.link.tags = input.tags;
  if (input.note !== undefined) body.link.note = input.note;

  const response = await fetch(`${REST_BASE}/${uniqId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Switchy update error (${response.status}): ${errorText}`);
  }
}

/**
 * Update an existing link by domain and slug
 */
export async function updateLinkBySlug(slug: string, input: UpdateLinkInput, domain: string = DEFAULT_DOMAIN): Promise<void> {
  const body: any = {
    link: {},
  };

  if (input.url !== undefined) body.link.url = input.url;
  if (input.title !== undefined) body.link.title = input.title;
  if (input.description !== undefined) body.link.description = input.description;
  if (input.image !== undefined) body.link.image = input.image;
  if (input.tags !== undefined) body.link.tags = input.tags;
  if (input.note !== undefined) body.link.note = input.note;

  const response = await fetch(`${REST_BASE}/by-domain/${domain}/${slug}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Switchy update error (${response.status}): ${errorText}`);
  }
}

/**
 * Convenience: Shorten a URL and return the short link
 * Automatically generates a slug or uses a custom one
 */
export async function shortenUrl(
  destinationUrl: string, 
  options?: { 
    slug?: string; 
    title?: string; 
    description?: string;
    tags?: string[];
    note?: string;
  }
): Promise<{ slug: string; shortUrl: string; domain: string }> {
  const result = await createLink({
    url: destinationUrl,
    slug: options?.slug,
    title: options?.title,
    description: options?.description,
    tags: options?.tags,
    note: options?.note,
  });

  return {
    slug: result.id,
    shortUrl: result.shortUrl,
    domain: DEFAULT_DOMAIN,
  };
}
