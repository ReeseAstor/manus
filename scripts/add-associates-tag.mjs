import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '..', '.env') });

const mysql2 = await import('mysql2/promise');
const connection = await mysql2.createConnection(process.env.DATABASE_URL);

const TAG = '88away0d-20';
const SLUGS = [
  'ultimate-cozy-reading-night-setup',
  'best-billionaire-romance-books-after-manhattan-money-kings',
  'favorite-candles-for-writing-mood',
  'romance-reader-gift-guide',
];

// Fetch all 4 posts
const [rows] = await connection.execute(
  `SELECT id, slug, content FROM blog_posts WHERE slug IN (${SLUGS.map(() => '?').join(',')})`,
  SLUGS
);

let totalLinks = 0;

for (const row of rows) {
  // Replace all amazon.com links: add ?tag= or &tag= as appropriate
  const updated = row.content.replace(
    /https:\/\/www\.amazon\.com\/([^"'\s>]*)/g,
    (url) => {
      // Remove any existing tag parameter first
      const cleanUrl = url.replace(/[?&]tag=[^&"'\s>]*/g, '').replace(/&&/g, '&').replace(/\?&/, '?').replace(/[?&]$/, '');
      // Add new tag parameter
      const separator = cleanUrl.includes('?') ? '&' : '?';
      totalLinks++;
      return `${cleanUrl}${separator}tag=${TAG}`;
    }
  );

  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await connection.execute(
    'UPDATE blog_posts SET content = ?, updatedAt = ? WHERE id = ?',
    [updated, now, row.id]
  );
  console.log(`✓ Tagged ${row.slug}`);
}

console.log(`\nDone! Added tag '${TAG}' to ${totalLinks} Amazon links across ${rows.length} posts.`);
await connection.end();
