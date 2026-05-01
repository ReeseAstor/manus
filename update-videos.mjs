import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { mysqlTable, varchar, text, int, boolean, timestamp } from "drizzle-orm/mysql-core";

// Minimal books table definition for the update
const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull(),
  trailerVideoUrl: text("trailerVideoUrl"),
});

const videoUrls = {
  'the-first-acquisition': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/eOEeGqeTMDOfZChj.mp4',
  'audit-of-the-heart': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/HcjxEIpNhWvIRAIa.mp4',
  'hostile-tender': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/phaQMrxPrFvyOLKM.mp4',
  'the-billionaires-forbidden-nanny': 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663125551617/VyislYYghErAyTVP.mp4',
};

async function main() {
  const db = drizzle(process.env.DATABASE_URL);
  
  for (const [slug, url] of Object.entries(videoUrls)) {
    await db.update(books).set({ trailerVideoUrl: url }).where(eq(books.slug, slug));
    console.log(`Updated ${slug} with trailer video URL`);
  }
  
  // Verify
  const allBooks = await db.select({ slug: books.slug, trailerVideoUrl: books.trailerVideoUrl }).from(books);
  console.log('\nAll books trailer URLs:');
  for (const b of allBooks) {
    console.log(`  ${b.slug}: ${b.trailerVideoUrl ? 'SET' : 'NOT SET'}`);
  }
  
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
