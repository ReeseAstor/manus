import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { join } from 'path';

const DATABASE_URL = process.env.DATABASE_URL;

async function seedWritingBlogPosts() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  function readPost(filename) {
    const content = readFileSync(join(process.cwd(), 'blog-posts', filename), 'utf-8');
    const lines = content.split('\n');
    const titleLineIndex = lines.findIndex(l => l.startsWith('# '));
    if (titleLineIndex !== -1) {
      lines.splice(titleLineIndex, 1);
    }
    return lines.join('\n').trim();
  }

  const posts = [
    {
      title: "How I Write a 90,000-Word Romance Novel in 30 Days (My AI Workflow, Unfiltered)",
      slug: "ai-assisted-romance-writing-workflow",
      excerpt: "The honest breakdown of my 10-workflow production system — from concept to KDP-ready manuscript in under a month. No gatekeeping, no fluff.",
      content: readPost("ai-assisted-romance-writing-workflow.md"),
      category: "Writing Craft",
      readTime: "8 min read",
      published: "published",
      publishedAt: "2025-05-10 09:00:00",
    },
    {
      title: "My Actual Writing Setup (Every Tool I Use to Write Romance Novels)",
      slug: "romance-author-writing-tools-setup",
      excerpt: "The real, granular breakdown of what's on my screen when I'm deep in a manuscript. Every tool, every app, every piece of gear — and why.",
      content: readPost("romance-author-writing-tools-setup.md"),
      category: "Writing Craft",
      readTime: "9 min read",
      published: "published",
      publishedAt: "2025-05-08 09:00:00",
    },
  ];

  for (const post of posts) {
    try {
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
  console.log('\n✅ Writing blog posts seeded successfully!');
}

seedWritingBlogPosts().catch(console.error);
