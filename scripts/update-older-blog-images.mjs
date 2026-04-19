import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const imageMap = [
  {
    slug: 'day-in-the-life-romance-author',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/aDMMjIoZxQGkCPJY.jpg',
    desc: 'Cozy writing desk with laptop and coffee'
  },
  {
    slug: 'nyc-romance-books-fall-in-love-manhattan',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/MhmehKqWyQQiZJQT.jpg',
    desc: 'NYC skyline at night with romantic city lights'
  },
  {
    slug: 'secret-baby-romance-books-reading-guide',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/kXfoWJYEGWKUgpDG.jpg',
    desc: 'Stack of colorful books'
  },
  {
    slug: 'best-billionaire-romance-series-2024',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/QMcEunwiwQoPDQyB.jpg',
    desc: 'Cozy reading nook in bookstore'
  },
  {
    slug: 'tips-writing-steamy-romance-scenes',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/UuLTuTorGlsaLKXN.jpg',
    desc: 'Coffee and typewriter on wooden table'
  },
  {
    slug: 'zero-to-published-self-publishing-journey',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/ZqwGZElTPcnHAEcs.jpg',
    desc: 'Open book with pages fluttering'
  },
  {
    slug: 'building-author-brand-social-media',
    image: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/wqKravlsFFqmkXYA.jpg',
    desc: 'Desk with laptop and smartphone for content creation'
  }
];

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  // First get all existing slugs to match
  const [rows] = await connection.execute('SELECT id, slug, title FROM blog_posts WHERE featuredImage IS NULL');
  console.log(`Found ${rows.length} posts without featured images:`);
  rows.forEach(r => console.log(`  - [${r.id}] ${r.slug}: ${r.title}`));
  
  let updated = 0;
  for (const mapping of imageMap) {
    // Try exact slug match first, then partial match
    let matched = rows.find(r => r.slug === mapping.slug);
    if (!matched) {
      // Try partial match on key words from slug
      const keywords = mapping.slug.split('-').filter(w => w.length > 3);
      matched = rows.find(r => keywords.some(kw => r.slug.includes(kw)));
    }
    
    if (matched) {
      await connection.execute(
        'UPDATE blog_posts SET featuredImage = ? WHERE id = ?',
        [mapping.image, matched.id]
      );
      console.log(`✓ Updated: ${matched.title} (${mapping.desc})`);
      updated++;
    } else {
      console.log(`✗ No match found for slug pattern: ${mapping.slug}`);
    }
  }
  
  console.log(`\nDone! Updated ${updated} of ${imageMap.length} posts.`);
  await connection.end();
}

main().catch(console.error);
