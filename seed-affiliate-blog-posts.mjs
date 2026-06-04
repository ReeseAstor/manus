import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { join } from 'path';

const DATABASE_URL = process.env.DATABASE_URL;

async function seedAffiliateBlogPosts() {
  const connection = await mysql.createConnection(DATABASE_URL);

  // Helper to read markdown file and convert to HTML-like content for Streamdown
  function readPost(filename) {
    const content = readFileSync(join(process.cwd(), 'blog-posts', filename), 'utf-8');
    // Remove the title line (first # heading) since it's stored separately
    const lines = content.split('\n');
    const titleLineIndex = lines.findIndex(l => l.startsWith('# '));
    if (titleLineIndex !== -1) {
      lines.splice(titleLineIndex, 1);
    }
    return lines.join('\n').trim();
  }

  // Posts to update (existing ones with new affiliate content)
  const updatedPosts = [
    {
      slug: 'best-billionaire-romance-series-2024',
      title: 'Best Billionaire Romance Series to Binge-Read in 2025',
      excerpt: 'Looking for your next book boyfriend? These billionaire romance series deliver swoon-worthy heroes, emotional depth, and the kind of chemistry that keeps you reading until 3 AM.',
      content: readPost('best-billionaire-romance-series-2024.md'),
      category: 'Reading Recommendations',
      readTime: '12 min read',
    },
    {
      slug: 'nyc-romance-books-manhattan-guide',
      title: 'NYC Romance Books: Fall in Love with Manhattan',
      excerpt: "There's a reason so many romance novels are set in New York City. The energy, the ambition, the collision of millions of lives — Manhattan provides the perfect backdrop for love stories.",
      content: readPost('nyc-romance-books-manhattan-guide.md'),
      category: 'Reading Recommendations',
      readTime: '10 min read',
    },
    {
      slug: 'secret-baby-romance-books-guide',
      title: 'Secret Baby Romance Books: The Ultimate Reading Guide',
      excerpt: 'Few tropes deliver the emotional punch of a secret baby story. The revelation, the reckoning, the journey to becoming a family — these books will have you ugly-crying in the best way.',
      content: readPost('secret-baby-romance-books-guide.md'),
      category: 'Reading Recommendations',
      readTime: '11 min read',
    },
  ];

  // New posts with affiliate links
  const newPosts = [
    {
      slug: 'dark-romance-books-beginners-guide',
      title: 'Dark Romance for Beginners: Where to Start Without Losing Sleep',
      excerpt: "You've heard the whispers. You've seen the BookTok videos with the black covers and the trigger warnings. Here's how to dip your toe into dark romance without diving straight into the deep end.",
      content: readPost('dark-romance-books-beginners-guide.md'),
      category: 'Reading Recommendations',
      readTime: '13 min read',
      published: 'published',
      publishedAt: '2025-05-05 10:00:00',
    },
    {
      slug: 'best-kindle-setup-romance-readers',
      title: "The Best Kindle Setup for Romance Readers (From Someone Who Reads 200+ Books a Year)",
      excerpt: "I've tested every Kindle, every case, every accessory. Here's exactly what I use and why — no fluff, just the setup that lets me read more books with less friction.",
      content: readPost('best-kindle-setup-romance-readers.md'),
      category: 'Reading Life',
      readTime: '10 min read',
      published: 'published',
      publishedAt: '2025-05-08 10:00:00',
    },
    {
      slug: 'enemies-to-lovers-books-that-ruined-me',
      title: 'Enemies to Lovers Books That Absolutely Ruined Me (In the Best Way)',
      excerpt: "The banter. The tension. The moment when hatred cracks and something else bleeds through. These are the enemies-to-lovers books that wrecked me — and I'd read every single one again.",
      content: readPost('enemies-to-lovers-books-that-ruined-me.md'),
      category: 'Romance Tropes',
      readTime: '12 min read',
      published: 'published',
      publishedAt: '2025-05-12 10:00:00',
    },
    {
      slug: 'booktok-made-me-buy-it-honest-reviews',
      title: 'BookTok Made Me Buy It: Honest Reviews of the Most Hyped Romance Books',
      excerpt: "I bought every viral BookTok romance so you don't have to. Some lived up to the hype. Some didn't. Here's my honest take on each one.",
      content: readPost('booktok-made-me-buy-it-honest-reviews.md'),
      category: 'Reading Recommendations',
      readTime: '14 min read',
      published: 'published',
      publishedAt: '2025-05-15 10:00:00',
    },
    {
      slug: 'reading-self-care-routine-book-lovers',
      title: 'My Actual Reading Self-Care Routine (Not the Instagram Version)',
      excerpt: "Everyone posts the aesthetic flat-lay with the latte art and the cashmere throw. Here's what my reading routine actually looks like — and the few things that genuinely make it better.",
      content: readPost('reading-self-care-routine-book-lovers.md'),
      category: 'Reading Life',
      readTime: '11 min read',
      published: 'published',
      publishedAt: '2025-05-19 10:00:00',
    },
    {
      slug: 'storyorigin-email-list-building-guide',
      title: 'How I Grew My Romance Reader Email List to 1,000+ Subscribers (and Why StoryOrigin Was the Game-Changer)',
      excerpt: "If you're a romance author trying to build a mailing list from scratch, this is the honest guide I wish I'd had when I started. Here's how StoryOrigin changed everything.",
      content: readPost('storyorigin-email-list-building-guide.md'),
      category: 'Author Resources',
      readTime: '10 min read',
      published: 'published',
      publishedAt: '2025-06-05 10:00:00',
    },
  ];

  console.log('Updating existing posts with affiliate links...\n');

  for (const post of updatedPosts) {
    try {
      const [result] = await connection.execute(
        `UPDATE blog_posts SET
          title = ?,
          excerpt = ?,
          content = ?,
          readTime = ?,
          updatedAt = NOW()
        WHERE slug = ?`,
        [post.title, post.excerpt, post.content, post.readTime, post.slug]
      );
      console.log(`✓ Updated: ${post.title} (${result.affectedRows} row)`);
    } catch (err) {
      console.error(`✗ Failed to update ${post.slug}:`, err.message);
    }
  }

  console.log('\nCreating new affiliate blog posts...\n');

  for (const post of newPosts) {
    try {
      // Check if already exists
      const [existing] = await connection.execute(
        'SELECT id FROM blog_posts WHERE slug = ?',
        [post.slug]
      );

      if (existing.length > 0) {
        await connection.execute(
          `UPDATE blog_posts SET
            title = ?,
            excerpt = ?,
            content = ?,
            category = ?,
            readTime = ?,
            published = ?,
            publishedAt = ?,
            updatedAt = NOW()
          WHERE slug = ?`,
          [post.title, post.excerpt, post.content, post.category, post.readTime, post.published, post.publishedAt, post.slug]
        );
        console.log(`✓ Updated existing: ${post.title}`);
      } else {
        await connection.execute(
          `INSERT INTO blog_posts (title, slug, excerpt, content, category, readTime, published, authorId, createdAt, updatedAt, publishedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW(), ?)`,
          [post.title, post.slug, post.excerpt, post.content, post.category, post.readTime, post.published, post.publishedAt]
        );
        console.log(`✓ Created: ${post.title}`);
      }
    } catch (err) {
      console.error(`✗ Failed: ${post.slug}:`, err.message);
    }
  }

  await connection.end();
  console.log('\n✅ All affiliate blog posts seeded successfully!');
}

seedAffiliateBlogPosts().catch(console.error);
