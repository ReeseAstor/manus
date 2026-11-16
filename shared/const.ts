/** Published rows with these slugs stay off the public blog, sitemap, and newsletter cards. */
export const RETIRED_BLOG_SLUGS = [
  "ai-assisted-romance-writing-workflow",
  "romance-author-writing-tools-setup",
  "quality-control-workflows-romance-authors",
  // 10/2026 brand ruling: retired with a 301 to /blog.
  "dark-romance-books-beginners-guide",
  // 10/2026 audit: pen-name identity leaks, unverifiable credentials, and
  // author-business posts that pull the brand away from readers.
  "self-publishing-journey",
  "usa-today-bestselling-author-journey",
  "day-in-the-life-romance-author",
  "business-side-romance-writing",
  "author-brand-social-media",
  "email-list-building-authors",
  "self-publishing-romance-amazon-kdp-beginners-guide",
  "author-email-list-strategy-sell-books",
  // 10/30/2026 retire ruling: author-business post with a StoryOrigin affiliate link.
  "storyorigin-email-list-building-guide",
] as const;

export function isRetiredBlogSlug(slug: string): boolean {
  return (RETIRED_BLOG_SLUGS as readonly string[]).includes(slug);
}

export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';
