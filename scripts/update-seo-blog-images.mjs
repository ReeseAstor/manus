import 'dotenv/config';
import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

// Exact slug -> CDN image URL mapping
const imageMap = {
  'enemies-to-lovers-romance-trope-guide': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/xzvnYPGFUfcjvdet.jpg',
  'how-to-write-billionaire-romance-authentic': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/HTqSoaERmKLvstwF.jpg',
  'romance-book-tropes-ultimate-guide': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/IKwhmIFDXetgwSCz.jpg',
  'self-publishing-romance-amazon-kdp-beginners-guide': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/KGeWoByqzbiBHoDI.webp',
  'manhattan-romance-nyc-love-stories': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/CmSEAYgznmQIyQgI.jpg',
  'steamy-vs-sweet-romance-heat-levels-guide': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/OVcSHLPVEoCqpREq.jpg',
  'author-email-list-strategy-sell-books': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/FFJeybjcPyPVQjKe.jpg',
  'secret-baby-trope-romance-readers-guide': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/xWJAQlIPQxPjrzUo.jpg',
  'romance-writing-prompts-novel-ideas': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/xhnBoaYDlchhPqoh.jpg',
  'booktok-romance-viral-books-2026': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/XHnzFLJdgGwnJWEa.jpeg',
  'creating-compelling-romance-characters-guide': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/TemSEnxmujVpigZn.jpeg',
  'forced-proximity-romance-best-books': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/YpOsDdxxbSylsyYk.jpg',
  'the-art-of-world-building-in-fantasy-romance': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/mEfgBMjnEZkvXGJP.jpg',
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
  
  // Verify all posts now have images
  const [rows] = await connection.execute('SELECT slug, title, featuredImage FROM blog_posts ORDER BY id');
  const withImage = rows.filter(r => r.featuredImage);
  const withoutImage = rows.filter(r => !r.featuredImage);
  
  console.log(`\n--- Summary ---`);
  console.log(`Total posts: ${rows.length}`);
  console.log(`With featured image: ${withImage.length}`);
  console.log(`Without featured image: ${withoutImage.length}`);
  
  if (withoutImage.length > 0) {
    console.log(`\nPosts still missing images:`);
    withoutImage.forEach(r => console.log(`  - ${r.slug}: ${r.title}`));
  }
  
  console.log(`\nDone! Updated ${updated} posts.`);
  await connection.end();
}

main().catch(console.error);
