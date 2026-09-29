import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Client } from "pg";

const BLOG_DIR = path.join(import.meta.dirname ?? __dirname, "..", "blog-posts");
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set");
  process.exit(1);
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
  "romance-author-writing-tools-setup": "Writing Tips",
  "ai-assisted-romance-writing-workflow": "Writing Tips",
  "storyorigin-email-list-building-guide": "Marketing",
};

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

async function seed() {
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
    const md = await readFile(path.join(BLOG_DIR, file), "utf8");
    const { title, excerpt, content } = parsePost(md);
    const category = categoryBySlug[slug] ?? "Reading Recommendations";
    const readTime = readTimeFor(content);
    const publishedAt = new Date(Date.now() - created * 86400000);

    const existing = await client.query("SELECT id FROM blog_posts WHERE slug = $1", [slug]);
    if (existing.rows.length > 0) {
      await client.query(
        `UPDATE blog_posts SET title=$1, excerpt=$2, content=$3, category=$4, "readTime"=$5,
         published='published', "publishedAt"=$6 WHERE slug=$7`,
        [title, excerpt, content, category, readTime, publishedAt, slug]
      );
      updated++;
      console.log(`✎ Updated: ${slug}`);
    } else {
      await client.query(
        `INSERT INTO blog_posts (title, slug, excerpt, content, category, "readTime", published, "authorId", "publishedAt")
         VALUES ($1,$2,$3,$4,$5,$6,'published',$7,$8)`,
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

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});