export const AMAZON_ASSOCIATE_TAG = "reeseastor-20";
const amazonHosts = new Set(["amazon.com", "www.amazon.com", "smile.amazon.com", "amzn.to"]);

/** Validated destinations for affiliate disclosure and external link attributes. */
export function isAmazonAffiliateDestination(href: string | null | undefined): boolean {
  if (!href) return false;
  try {
    const url = new URL(href);
    return url.protocol === "https:" && !url.username && !url.password &&
      !url.port && amazonHosts.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Normalize supported Amazon product links to the confirmed Reese Astor tag.
 * Legacy tags are replaced; unrelated, unsafe, author, and short links stay as is.
 */
export function withAmazonTag(href: string): string;
export function withAmazonTag(href: string | null | undefined): string | null | undefined;
export function withAmazonTag(href: string | null | undefined) {
  if (!href) return href;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  if (!isAmazonAffiliateDestination(href) || url.hostname === "amzn.to" ||
      !/\/(?:dp|gp\/product|gp\/aw\/d)\/[a-z0-9]{10}(?:\/|$)/i.test(url.pathname)) return href;
  url.searchParams.set("tag", AMAZON_ASSOCIATE_TAG);
  return url.toString();
}
