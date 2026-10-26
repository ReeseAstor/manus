/** Slug of the blog post pinned as the first card on /newsletter. */
export const NEWSLETTER_PINNED_SLUG = "enemies-to-lovers-books-that-ruined-me";

/**
 * Return up to `count` posts with the pinned slug first. If the pinned post is
 * not in the list, the list order is kept unchanged.
 */
export function pinPost<T extends { slug: string }>(
  posts: readonly T[] | null | undefined,
  pinnedSlug: string = NEWSLETTER_PINNED_SLUG,
  count = 3,
): T[] {
  const list = posts ?? [];
  const pinned = list.find((post) => post.slug === pinnedSlug);
  if (!pinned) return list.slice(0, count);
  return [pinned, ...list.filter((post) => post.slug !== pinnedSlug)].slice(0, count);
}
