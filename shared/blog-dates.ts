export function toIsoDate(value: string | Date | null | undefined): string | undefined {
  if (value == null || value === "") return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

/** The later of the given timestamps, as an ISO string. */
export function laterIsoDate(
  ...values: Array<string | Date | null | undefined>
): string | undefined {
  const times = values
    .map((value) => {
      const iso = toIsoDate(value);
      return iso ? Date.parse(iso) : Number.NaN;
    })
    .filter((time) => !Number.isNaN(time));
  if (!times.length) return undefined;
  return new Date(Math.max(...times)).toISOString();
}

/**
 * JSON-LD article dates. dateModified is always max(updatedAt, publishedAt)
 * so it is never earlier than datePublished.
 */
export function articleJsonLdDates(
  publishedAt: string | Date | null | undefined,
  updatedAt?: string | Date | null,
): { datePublished?: string; dateModified?: string } {
  const datePublished = toIsoDate(publishedAt);
  const dateModified = laterIsoDate(updatedAt, publishedAt);
  return {
    ...(datePublished ? { datePublished } : {}),
    ...(dateModified ? { dateModified } : {}),
  };
}
