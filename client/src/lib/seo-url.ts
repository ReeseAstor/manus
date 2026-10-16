export const SITE_URL = "https://reeseastor.com";

/**
 * Returns an absolute URL exactly once. Absolute inputs ("https://...") are returned unchanged,
 * paths are joined to the site origin, and an empty/undefined input returns the site origin.
 */
export function toAbsoluteUrl(input?: string | null, siteUrl: string = SITE_URL): string {
  if (!input) return siteUrl;
  if (/^https?:\/\//i.test(input)) return input;
  return `${siteUrl}${input.startsWith("/") ? "" : "/"}${input}`;
}
