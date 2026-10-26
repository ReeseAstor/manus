export const AMAZON_ASSOCIATE_TAG = "reeseastor-20";

/**
 * Add the Reese Astor associate tag to an Amazon book page link (/dp/ URLs).
 * Other URLs, and Amazon links that already carry a tag, are returned unchanged.
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
  if (!/(^|\.)amazon\.com$/i.test(url.hostname) || !url.pathname.includes("/dp/")) return href;
  if (url.searchParams.has("tag")) return href;
  url.searchParams.set("tag", AMAZON_ASSOCIATE_TAG);
  return url.toString();
}
