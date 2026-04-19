import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

// Exact slug -> image URL mapping
const imageMap = {
  'day-in-the-life-romance-author': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/aDMMjIoZxQGkCPJY.jpg',
  'nyc-romance-books-manhattan-guide': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/MhmehKqWyQQiZJQT.jpg',
  'secret-baby-romance-books-guide': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/kXfoWJYEGWKUgpDG.jpg',
  'best-billionaire-romance-series-2024': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/QMcEunwiwQoPDQyB.jpg',
  'writing-steamy-romance-scenes': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/UuLTuTorGlsaLKXN.jpg',
  'self-publishing-journey': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/ZqwGZElTPcnHAEcs.jpg',
  'author-brand-social-media': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/wqKravlsFFqmkXYA.jpg',
};

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  let updated = 0;
  for (const [slug, imageUrl] of Object.entries(imageMap)) {
    const [result] = await connection.execute(
      'UPDATE blog_posts SET featuredImage = ? WHERE slug = ?',
      [imageUrl, slug]
    );
    if (result.affectedRows > 0) {
      console.log(`✓ Updated: ${slug}`);
      updated++;
    } else {
      console.log(`✗ No post found with slug: ${slug}`);
    }
  }
  
  // Verify all posts now
  const [rows] = await connection.execute('SELECT slug, title, featuredImage FROM blog_posts ORDER BY id');
  console.log(`\n--- All blog posts ---`);
  for (const r of rows) {
    const hasImg = r.featuredImage ? '✓' : '✗';
    console.log(`${hasImg} ${r.slug}: ${r.title}`);
  }
  
  console.log(`\nDone! Updated ${updated} posts.`);
  await connection.end();
}

main().catch(console.error);
