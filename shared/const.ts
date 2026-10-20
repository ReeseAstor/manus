/** Published rows with these slugs stay off the public blog, sitemap, and newsletter cards. */
export const RETIRED_BLOG_SLUGS = [
  "ai-assisted-romance-writing-workflow",
  "romance-author-writing-tools-setup",
  "quality-control-workflows-romance-authors",
] as const;

export function isRetiredBlogSlug(slug: string): boolean {
  return (RETIRED_BLOG_SLUGS as readonly string[]).includes(slug);
}

export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';
