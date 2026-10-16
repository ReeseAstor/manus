import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL!);
  const db = drizzle(connection, { schema, mode: 'default' });

  // First, get the admin user (owner)
  const users = await db.select().from(schema.users).where(eq(schema.users.role, 'admin')).limit(1);

  if (users.length === 0) {
    console.error('No admin user found. Please log in first to create an admin user.');
    process.exit(1);
  }

  const adminUser = users[0];

  const samplePosts = [
    {
      title: "5 Essential Tips for Writing Steamy Romance Scenes",
      slug: "writing-steamy-romance-scenes",
      excerpt: "Learn how to write compelling, authentic intimate scenes that enhance your story and connect with readers on an emotional level.",
      content: `Writing steamy romance scenes is both an art and a skill that can elevate your romance novel from good to unforgettable. Whether you're writing your first intimate scene or your hundredth, these five essential tips will help you craft moments that resonate with readers and enhance your story.

## 1. Build Emotional Tension First

The best intimate scenes aren't just about physical attraction—they're the culmination of emotional connection. Before your characters come together physically, ensure you've built a foundation of emotional tension. Show us why these characters are drawn to each other beyond surface-level attraction.

Consider their shared vulnerabilities, the obstacles they've overcome together, and the emotional walls they've broken down. When readers are emotionally invested in your characters' relationship, the intimate scenes become powerful expressions of that connection rather than isolated moments.

## 2. Use All Five Senses

Don't limit yourself to describing what your characters see. Engage all five senses to create an immersive, visceral experience. What do they hear—their partner's breathing, whispered words, the rustle of sheets? What scents surround them—cologne, perfume, or natural body chemistry?

Texture matters too. Describe the softness of skin, the roughness of stubble, the smoothness of silk sheets. Even taste can play a role. These sensory details ground readers in the moment and make scenes feel authentic and immediate.

## 3. Show Character Through Action

Intimate scenes are perfect opportunities for character development. How your characters behave in vulnerable moments reveals who they truly are. Is your billionaire hero surprisingly gentle? Does your strong heroine let down her guard?

Use these scenes to deepen characterization. Show how past experiences influence present behavior, how trust is built or tested, and how characters grow through intimacy. Every touch, every word, every reaction should feel true to who your characters are.

## 4. Vary Your Pacing and Intensity

Not every intimate scene needs to be a fireworks display. Vary the pacing and intensity throughout your book. Some scenes might be slow and tender, others passionate and urgent. This variation keeps readers engaged and prevents scenes from feeling formulaic.

Consider the emotional context of each scene. A reunion after separation might be desperate and intense, while a morning-after scene could be playful and sweet. Let the emotional stakes and story context guide the tone and pacing of each intimate moment.

## 5. Edit with Confidence

Many writers feel uncertain when editing intimate scenes. Remember that romance readers choose the genre because they enjoy these moments. Don't shy away from sensuality, but do ensure every scene serves the story and character development.

During editing, check that your word choices feel natural rather than clinical or overly flowery. Read scenes aloud to catch awkward phrasing. Most importantly, trust your voice and your readers' intelligence. You don't need to explain everything—leave room for readers' imagination.

## Final Thoughts

Writing compelling intimate scenes takes practice, but these fundamentals will serve you well. Focus on emotional connection, engage the senses, reveal character, vary your approach, and edit with confidence. Your readers will appreciate the authenticity and depth you bring to these crucial moments in your romance novels.`,
      category: "Writing Tips",
      readTime: "8 min read",
      published: "published" as const,
      authorId: adminUser.id,
      publishedAt: new Date('2024-11-15'),
    },
    {
      title: "Building Your Author Brand on Social Media",
      slug: "author-brand-social-media",
      excerpt: "Practical strategies for growing your author platform on Instagram and Facebook without spending hours online every day.",
      content: `As a romance author, your social media presence can be a powerful tool for connecting with readers, building your brand, and ultimately selling more books. But between writing, publishing, and living your life, who has time to be constantly online? Here's how to build an effective author platform without social media taking over your life.

## Define Your Brand Identity First

Before posting anything, get clear on your author brand. What makes you unique? What themes run through your books? What personality do you want to project? Your brand should feel authentic to you while appealing to your target readers.

## The 80/20 Rule for Content

Only 20% of your content should be direct book promotion. The other 80% should provide value, entertainment, or connection. Share writing tips, behind-the-scenes glimpses of your process, book recommendations, or relatable memes about the writing life.

## Final Thoughts

Building an author brand on social media is a marathon, not a sprint. Consistency matters more than perfection. Show up regularly, provide value, engage authentically, and protect your creative time.`,
      category: "Marketing",
      readTime: "10 min read",
      published: "published" as const,
      authorId: adminUser.id,
      publishedAt: new Date('2024-11-05'),
    },
  ];

  console.log('Seeding blog posts...');

  for (const post of samplePosts) {
    try {
      await db.insert(schema.blogPosts).values(post);
      console.log(`✓ Created: ${post.title}`);
    } catch (error) {
      console.error(`✗ Failed to create: ${post.title}`, error);
    }
  }

  console.log('\nBlog posts seeded successfully!');
  await connection.end();
}

seed().catch(console.error);
