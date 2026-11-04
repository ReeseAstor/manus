import type { BlogPost } from "../../drizzle/schema";
import { isRetiredBlogSlug } from "../../shared/const";

export type ReadinessPost = Pick<
  BlogPost,
  "title" | "slug" | "excerpt" | "content" | "category"
>;

// These are structural minimums, not an editorial quality or fact checker.
export const MIN_ARTICLE_WORDS = 80;
const WORDS_PER_MINUTE = 220;
const LETTER = new RegExp("\\p{L}", "u");
const WORD = new RegExp("[\\p{L}\\p{N}]+(?:['’-][\\p{L}\\p{N}]+)*", "gu");

function decodeEntities(text: string): string {
  return text
    .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, value: string) => {
      const point =
        value[0].toLowerCase() === "x"
          ? parseInt(value.slice(1), 16)
          : parseInt(value, 10);
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : " ";
    })
    .replace(/&nbsp;/gi, " ")
    .replace(/&(?:mdash|ndash|hellip|lsquo|rsquo|ldquo|rdquo);/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'");
}

/** Estimate visible prose in the Markdown/HTML formats accepted by the CMS. */
export function articlePlainText(content: string): string {
  return decodeEntities(
    content
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/^\s*\[[^\]]+\]:\s+\S+.*$/gm, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/https?:\/\/[^\s<>]+/gi, " ")
  )
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text: string): number {
  return (text.match(WORD) ?? []).length;
}

const EXPLICIT_PLACEHOLDER =
  /\blorem ipsum\b|\{\{[^{}]+\}\}|\[(?:insert|add|replace)\s+(?:your\s+)?(?:title|excerpt|content|text|link|url|asin|product)[^\]]*\]|\[(?:TODO|TBD)\]/i;
const WHOLE_PLACEHOLDER =
  /^(?:todo|tbd|untitled(?: post| article)?|coming soon|placeholder|(?:title|excerpt|content|category)(?: here)?)\s*[.!…]*$/i;

function hasPlaceholder(value: string): boolean {
  const plain = articlePlainText(value).replace(
    /^[\s#*_~`>-]+|[\s*_~`]+$/g,
    ""
  );
  return EXPLICIT_PLACEHOLDER.test(value) || WHOLE_PLACEHOLDER.test(plain);
}

function articleLinks(content: string): string[] {
  const links = new Set<string>();
  // Quoted and unquoted HTML href, Markdown inline/reference links, and bare URLs.
  for (const match of Array.from(
    content.matchAll(/\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)
  )) {
    links.add(match[1] ?? match[2] ?? match[3]);
  }
  for (const match of Array.from(
    content.matchAll(/!?\[[^\]]*\]\(\s*<?([^\s)>]*)/g)
  )) {
    links.add(match[1]);
  }
  for (const match of Array.from(
    content.matchAll(/^\s*\[[^\]]+\]:\s*<?([^\s>]+)/gm)
  )) {
    links.add(match[1]);
  }
  for (const match of Array.from(
    content.matchAll(/https?:\/\/[^\s<>"')\]]+/gi)
  )) {
    links.add(match[0].replace(/[.,;!?]+$/, ""));
  }
  return Array.from(links).map(decodeEntities);
}

function linkIssue(href: string): string | undefined {
  if (
    !href ||
    /(?:YOUR[_-]?(?:ASIN|TAG|AFFILIATE|LINK)|ASIN[_-]?HERE|REPLACE[_-]?ME|B0X{8}|B0{9}|example\.(?:com|org)|\{\{|\[insert)/i.test(
      href
    )
  ) {
    return "Replace placeholder links with reviewed destinations";
  }
  if (/^(?:\/(?!\/)|#|mailto:)/i.test(href)) return;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return "Use a valid absolute HTTP(S) URL (or a site-relative link)";
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    return "Use HTTP(S) links without embedded credentials";
  }
  // Amazon product URLs must identify a product. Preserve existing tags; do not
  // invent an Associate account. Short links are syntax-checked, not resolved.
  const amazonHost =
    /^(?:www\.|smile\.)?amazon\.(?:com|co\.uk|ca|de|fr|it|es|co\.jp|com\.au|in|com\.br|com\.mx|nl|se|pl|sg|ae|sa|com\.tr|com\.be|ie)$/i;
  if (/amazon\./i.test(url.hostname) && !amazonHost.test(url.hostname)) {
    return "Use a recognized Amazon marketplace hostname";
  }
  if (amazonHost.test(url.hostname)) {
    const productPath = /\/(?:dp|gp\/product)\//i.test(url.pathname);
    if (
      productPath &&
      !/\/(?:dp|gp\/product)\/[A-Z0-9]{10}(?:\/|$)/i.test(url.pathname)
    ) {
      return "Amazon product links need a 10-character ASIN in /dp/ or /gp/product/";
    }
    if (!productPath && url.searchParams.has("tag")) {
      return "Use a direct Amazon product link instead of a tagged search/storefront URL";
    }
    if (
      url.searchParams.has("tag") &&
      !/^[a-z0-9][a-z0-9-]*-\d+$/i.test(url.searchParams.get("tag") ?? "")
    ) {
      return "Replace the invalid Amazon Associate tag with your configured tag";
    }
  }
  if (
    /^(?:www\.)?amzn\.to$/i.test(url.hostname) &&
    !/^\/[a-z0-9]+\/?$/i.test(url.pathname)
  ) {
    return "Replace the invalid Amazon short link";
  }
}

export function checkBlogReadiness(post: ReadinessPost): {
  ready: boolean;
  issues: string[];
  readTime: string;
} {
  const issues: string[] = [];
  const words = wordCount(articlePlainText(post.content));
  const minimums = {
    title: 1,
    excerpt: 5,
    category: 1,
    content: MIN_ARTICLE_WORDS,
  };
  for (const field of ["title", "excerpt", "category", "content"] as const) {
    const text = articlePlainText(post[field]);
    if (!LETTER.test(text) || wordCount(text) < minimums[field]) {
      issues.push(
        `${field}: add meaningful text (at least ${minimums[field]} ${minimums[field] === 1 ? "word" : "words"})`
      );
    }
    if (hasPlaceholder(post[field]))
      issues.push(`${field}: replace explicit placeholder text`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
    issues.push("slug: use a nonempty lowercase, hyphen-separated URL slug");
  }
  if (isRetiredBlogSlug(post.slug))
    issues.push(
      "slug: this article is retired; review the shared retired-slug policy before scheduling"
    );
  for (const [index, href] of Array.from(
    articleLinks(post.content).entries()
  )) {
    const issue = linkIssue(href);
    // Do not echo URLs, which can contain private query parameters.
    if (issue) issues.push(`content link ${index + 1}: ${issue}`);
  }
  return {
    ready: issues.length === 0,
    issues,
    readTime: `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min read`,
  };
}
