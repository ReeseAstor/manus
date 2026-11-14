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
  load: () => Promise<T[]>,
): Promise<T[]> {
  try {
    const newsletters = await load();
    return newsletters.filter(newsletter => newsletter.status === "sent");
  } catch (error) {
    if (missingNewslettersTable(error)) {
      console.error("[newsletters.getAll] archive table is missing; returning an empty list");
      return [];
    }
    throw error;
  }
}
