/** Walk error causes for the production failure: relation "newsletters" does not exist. */
export function missingNewslettersTable(error: unknown): boolean {
  const seen = new Set<unknown>();
  let current: unknown = error;
  while (current && typeof current === "object" && !seen.has(current)) {
    seen.add(current);
    const message = current instanceof Error ? current.message : String(current);
    if (/relation ["']newsletters["'] does not exist/i.test(message)) return true;
    current = current instanceof Error ? current.cause : undefined;
  }
  return false;
}

type ArchivedNewsletter = { status: string };

/**
 * Public archive: sent rows only. A missing newsletters table is an empty
 * archive, not a 500 that leaves /newsletter-archive on "Loading newsletters...".
 */
export async function loadPublicNewsletterArchive<T extends ArchivedNewsletter>(
  load: () => Promise<T[] | null | undefined>,
): Promise<T[]> {
  try {
    const newsletters = await load();
    if (!newsletters?.length) return [];
    return newsletters.filter(newsletter => newsletter.status === "sent");
  } catch (error) {
    const reason = missingNewslettersTable(error)
      ? "archive table is missing"
      : "archive read failed";
    console.error(`[newsletters.getAll] ${reason}; returning an empty list`, error);
    return [];
  }
}
