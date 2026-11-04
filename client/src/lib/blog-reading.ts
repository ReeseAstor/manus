export function plainArticleText(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#*_~`>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function readingMinutes(content: string): number {
  const text = plainArticleText(content);
  return Math.max(1, Math.ceil((text ? text.split(/\s+/).length : 0) / 220));
}

export function headingId(text: string, index: number): string {
  const base = text.normalize("NFKD").toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `article-${base || "section"}-${index}`;
}

export function readingProgress(top: number, height: number, viewport: number): number {
  const distance = height - viewport;
  if (distance <= 0) return top <= viewport ? 1 : 0;
  return Math.min(1, Math.max(0, -top / distance));
}

export function parseSavedProgress(value: string | null): number | null {
  if (!value) return null;
  const progress = Number(value);
  return Number.isFinite(progress) && progress > 0.02 && progress < 0.98 ? progress : null;
}

export function matchesBlogSearch(
  post: { title: string; excerpt?: string | null; category?: string | null },
  query: string,
): boolean {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  const text = `${post.title} ${post.excerpt ?? ""} ${post.category ?? ""}`.toLocaleLowerCase();
  return terms.every(term => text.includes(term));
}
