import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Schema: id, title, slug, excerpt, content, category, readTime, published (draft/published), authorId, createdAt, updatedAt, publishedAt

const blogPosts = [
  {
    title: "Best Billionaire Romance Series to Binge-Read in 2024",
    slug: "best-billionaire-romance-series-2024",
    excerpt: "Looking for your next book boyfriend? These billionaire romance series deliver swoon-worthy heroes, emotional depth, and the kind of chemistry that keeps you reading until 3 AM.",
    category: "Reading Recommendations",
    readTime: "8 min read",
    published: "published",
    publishedAt: new Date("2024-12-15"),
  },
  {
    title: "Secret Baby Romance Books: The Ultimate Reading Guide",
    slug: "secret-baby-romance-books-guide",
    excerpt: "Few tropes in romance deliver the emotional punch of a secret baby story. The revelation, the reckoning, the journey to becoming a family—when done right, these books will have you ugly-crying in the best possible way.",
    category: "Reading Recommendations",
    readTime: "10 min read",
    published: "published",
    publishedAt: new Date("2024-12-16"),
  },
  {
    title: "NYC Romance Books: Fall in Love with Manhattan",
    slug: "nyc-romance-books-manhattan-guide",
    excerpt: "There's a reason so many romance novels are set in New York City. The energy, the ambition, the collision of millions of lives in one extraordinary place—Manhattan provides the perfect backdrop for love stories.",
    category: "Reading Recommendations",
    readTime: "9 min read",
    published: "published",
    publishedAt: new Date("2024-12-17"),
  }
];

async function seedBlogPosts() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('Connected to database');
  
  for (const post of blogPosts) {
    // Read the markdown content
    const contentPath = path.join(process.cwd(), 'blog-posts', `${post.slug}.md`);
    let content = '';
    
    try {
      content = fs.readFileSync(contentPath, 'utf-8');
      // Remove the title from content since it's stored separately
      content = content.replace(/^# .+\n\n/, '');
    } catch (err) {
      console.error(`Could not read content for ${post.slug}:`, err.message);
      continue;
    }
    
    // Check if post already exists
    const [existing] = await connection.execute(
      'SELECT id FROM blog_posts WHERE slug = ?',
      [post.slug]
    );
    
    // Get admin user ID (authorId = 1 for Reese Astor)
    const authorId = 1;
    
    if (existing.length > 0) {
      console.log(`Post "${post.title}" already exists, updating...`);
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
        [
          post.title,
          post.excerpt,
          content,
          post.category,
          post.readTime,
          post.published,
          post.publishedAt,
          post.slug
        ]
      );
    } else {
      console.log(`Creating post "${post.title}"...`);
      await connection.execute(
        `INSERT INTO blog_posts (title, slug, excerpt, content, category, readTime, published, authorId, createdAt, updatedAt, publishedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)`,
        [
          post.title,
          post.slug,
          post.excerpt,
          content,
          post.category,
          post.readTime,
          post.published,
          authorId,
          post.publishedAt
        ]
      );
    }
    
    console.log(`✓ ${post.title}`);
  }
  
  await connection.end();
  console.log('\\nBlog posts seeded successfully!');
}

seedBlogPosts().catch(console.error);
