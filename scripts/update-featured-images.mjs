import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '..', '.env') });

const mysql2 = await import('mysql2/promise');
const connection = await mysql2.createConnection(process.env.DATABASE_URL);

// First check what columns exist for featured image
const [cols] = await connection.execute('DESCRIBE blog_posts');
const colNames = cols.map(c => c.Field);
console.log('Available columns:', colNames.join(', '));

// Determine the correct column name for featured image
const imageCol = colNames.find(c =>
  c.toLowerCase().includes('image') ||
  c.toLowerCase().includes('photo') ||
  c.toLowerCase().includes('thumbnail') ||
  c.toLowerCase().includes('cover')
);

if (!imageCol) {
  console.error('No image column found! Available columns:', colNames.join(', '));
  process.exit(1);
}

console.log(`Using image column: ${imageCol}`);

const updates = [
  {
    slug: 'ultimate-cozy-reading-night-setup',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/OLDOtXHetLfcORaj.jpg',
    description: 'Cozy reading in bed with warm light'
  },
  {
    slug: 'best-billionaire-romance-books-after-manhattan-money-kings',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/PQfoDHIXsSESshjw.jpg',
    description: 'Pastel book flat lay aesthetic'
  },
  {
    slug: 'favorite-candles-for-writing-mood',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/pqcmOUkvsElrDgFf.jpg',
    description: 'Lit candle with open notebook and pen'
  },
  {
    slug: 'romance-reader-gift-guide',
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/ffPqPYAWbLfFnknH.jpg',
    description: 'Book with pink ribbon bow gift'
  },
];

const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

for (const update of updates) {
  await connection.execute(
    `UPDATE blog_posts SET \`${imageCol}\` = ?, updatedAt = ? WHERE slug = ?`,
    [update.imageUrl, now, update.slug]
  );
  console.log(`✓ Set image for: ${update.slug} (${update.description})`);
}

console.log('\nAll 4 featured images updated successfully!');
await connection.end();
