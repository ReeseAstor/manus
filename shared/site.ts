/**
 * Canonical site identity. One host, used by the client (canonical, Open
 * Graph, JSON-LD), the server (sitemap, robots, llms.txt) and the build-time
 * prerender. The www host should 301 to this one in Vercel → Domains.
 */
export const SITE_URL = "https://reeseastor.com";
export const SITE_NAME = "Reese Astor";
export const AUTHOR_ID = `${SITE_URL}/#author`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const DEFAULT_OG_IMAGE = "/covers/og-default.jpg";

/** Turn a path or absolute URL into an absolute URL on SITE_URL. */
export function absoluteUrl(pathOrUrl: string | undefined | null): string {
  if (!pathOrUrl) return SITE_URL;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/** Profiles that identify the pen name (Person.sameAs). Public pen-name profiles only. */
export const AUTHOR_SAME_AS = [
  "https://www.amazon.com/Reese-Astor/e/B0DVGQY6TX",
  "https://www.goodreads.com/author/show/54036770.Reese_Astor",
  "https://www.bookbub.com/authors/reese-astor",
];
