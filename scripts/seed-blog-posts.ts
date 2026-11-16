import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Client } from "pg";

const BLOG_DIR = path.join(import.meta.dirname ?? __dirname, "..", "blog-posts");

/** UPDATE must never write publishedAt; re-seeding an existing slug preserves the original date. */
export const UPDATE_EXISTING_POST_SQL = `UPDATE blog_posts SET title=$1, excerpt=$2, content=$3, category=$4, "readTime"=$5,
         published='published' WHERE slug=$6`;

/** Only INSERT sets publishedAt. The bound Date is stored as a UTC instant. */
export const INSERT_NEW_POST_SQL = `INSERT INTO blog_posts (title, slug, excerpt, content, category, "readTime", published, "authorId", "publishedAt")
         VALUES ($1,$2,$3,$4,$5,$6,'published',$7,$8)`;

/** UTC instant used only when inserting a new slug. */
export function publishedAtForNewPost(now: Date = new Date(), earlierInserts = 0): Date {
  return new Date(now.getTime() - earlierInserts * 86_400_000);
}

/** Copy #80 removed from /favorites: the seed must not republish these into blog_posts. */
export const SEED_UNAVAILABLE_ASINS = ["B0CW63NL9F", "B0CMTXKBWW", "B0DD4FWCJW"] as const;

const SEED_BANNED_COPY: { label: string; pattern: RegExp }[] = [
  { label: "Original Shredded", pattern: /Original Shredded/i },
  { label: "Latest Model", pattern: /Latest Model/i },
  { label: "Glocusent LED Book Light", pattern: /Glocusent LED Book Light/i },
  { label: "Huglanket", pattern: /Huglanket/i },
  { label: "mahogany", pattern: /mahogany/i },
  { label: "em or en dash", pattern: /[\u2013\u2014]/ },
  { label: "static Amazon price", pattern: /\$\s*\d/ },
];

/** Throws if markdown would write unavailable ASINs, static prices, or retired product names. */
export function assertSeedableBlogCopy(text: string, slug: string): void {
  for (const asin of SEED_UNAVAILABLE_ASINS) {
    if (text.includes(asin)) {
      throw new Error(`Seed refused for ${slug}: unavailable ASIN ${asin}`);
    }
  }
  for (const { label, pattern } of SEED_BANNED_COPY) {
    if (pattern.test(text)) {
      throw new Error(`Seed refused for ${slug}: banned copy (${label})`);
    }
  }
}

const categoryBySlug: Record<string, string> = {
  "ultimate-cozy-reading-night-setup": "Reading Recommendations",
  "best-billionaire-romance-series-2024": "Reading Recommendations",
  "nyc-romance-books-manhattan-guide": "Reading Recommendations",
  "secret-baby-romance-books-guide": "Reading Recommendations",
  "dark-romance-books-beginners-guide": "Reading Recommendations",
  "best-kindle-setup-romance-readers": "Reading Recommendations",
  "enemies-to-lovers-books-that-ruined-me": "Reading Recommendations",
  "booktok-made-me-buy-it-honest-reviews": "Reading Recommendations",
  "reading-self-care-routine-book-lovers": "Reading Recommendations",
  "what-i-burn-while-i-write": "Reading Recommendations",
  "romance-reader-gift-guide": "Reading Recommendations",
  "storyorigin-email-list-building-guide": "Marketing",
};

// Retired on purpose. Re-seeding these would put AI-workflow posts back on the public site.
export const SEED_RETIRED_SLUGS = new Set([
  "ai-assisted-romance-writing-workflow",
  "romance-author-writing-tools-setup",
  "quality-control-workflows-romance-authors",
  "storyorigin-email-list-building-guide",
]);

function parsePost(md: string): { title: string; excerpt: string; content: string } {
  const lines = md.split(/\r?\n/);
  const firstHeading = lines.findIndex((l) => l.startsWith("# "));
  const title = firstHeading >= 0 ? lines[firstHeading].replace(/^#\s+/, "").trim() : "";
  const contentLines = lines.filter((_, i) => i !== firstHeading).join("\n").replace(/^\s+/, "").trim();
  const paragraphs = contentLines
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\*\*/g, "").replace(/^[*\s]+|[*\s]+$/g, "").trim())
    .filter((p) => p.length > 0);
  const first = paragraphs[0] ?? "";
  const excerpt = first.length > 170 ? `${first.slice(0, 167)}...` : first;
  return { title, excerpt, content: contentLines };
}

function readTimeFor(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export async function seed(env: NodeJS.ProcessEnv = process.env) {
  const DATABASE_URL = env.DATABASE_URL;
  if (!DATABASE_URL) {
    console.error("DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  await client.connect();

  const admin = await client.query("SELECT id FROM users WHERE role='admin' ORDER BY id LIMIT 1");
  if (admin.rows.length === 0) {
    console.error("No admin user found.");
    process.exit(1);
  }
  const authorId = admin.rows[0].id;

  const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith(".md")).sort();
  let created = 0;
  let updated = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    if (SEED_RETIRED_SLUGS.has(slug)) {
      console.log(`⊘ Skipped retired post: ${slug}`);
      continue;
    }
    const md = await readFile(path.join(BLOG_DIR, file), "utf8");
    assertSeedableBlogCopy(md, slug);
    const { title, excerpt, content } = parsePost(md);
    const category = categoryBySlug[slug] ?? "Reading Recommendations";
    const readTime = readTimeFor(content);

    const existing = await client.query("SELECT id FROM blog_posts WHERE slug = $1", [slug]);
    if (existing.rows.length > 0) {
      // Do not set publishedAt: an UPDATE must preserve the existing publish date.
      await client.query(
        UPDATE_EXISTING_POST_SQL,
        [title, excerpt, content, category, readTime, slug]
      );
      updated++;
      console.log(`✎ Updated: ${slug}`);
    } else {
      const publishedAt = publishedAtForNewPost(new Date(), created);
      await client.query(
        INSERT_NEW_POST_SQL,
        [title, slug, excerpt, content, category, readTime, authorId, publishedAt]
      );
      created++;
      console.log(`✓ Created: ${slug}`);
    }
  }

  const total = await client.query("SELECT count(*) FROM blog_posts");
  console.log(`\nDone. ${created} created, ${updated} updated. Total blog_posts: ${total.rows[0].count}`);
  await client.end();
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(path.resolve(entry)).href) {
  seed().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
