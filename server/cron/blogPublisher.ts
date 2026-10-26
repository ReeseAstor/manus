/**
 * Blog Auto-Publisher Cron Handler
 * 
 * Checks for draft blog posts with a scheduledPublishAt date that has passed
 * and automatically publishes them. Vercel Cron calls the route daily at
 * 13:00 UTC. A post is published on the first run after scheduledPublishAt.
 */
import { getDb } from "../db";
import { blogPosts } from "../../drizzle/schema";
import { eq, and, lte, isNotNull } from "drizzle-orm";

export async function publishScheduledPosts(): Promise<{
  published: number;
  titles: string[];
  errors: string[];
}> {
  const result = { published: 0, titles: [] as string[], errors: [] as string[] };

  try {
    const db = await getDb();
    if (!db) {
      result.errors.push("Database not available");
      return result;
    }

    const now = new Date();

    // Find all draft posts where scheduledPublishAt <= now
    const postsToPublish = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.published, "draft"),
          isNotNull(blogPosts.scheduledPublishAt),
          lte(blogPosts.scheduledPublishAt, now)
        )
      );

    if (postsToPublish.length === 0) {
      console.log("[BlogPublisher] No scheduled posts ready to publish");
      return result;
    }

    console.log(`[BlogPublisher] Found ${postsToPublish.length} posts ready to publish`);

    for (const post of postsToPublish) {
      try {
        await db
          .update(blogPosts)
          .set({
            published: "published",
            publishedAt: now,
          })
          .where(eq(blogPosts.id, post.id));

        result.published++;
        result.titles.push(post.title);
        console.log(`[BlogPublisher] Published: "${post.title}"`);
      } catch (err: any) {
        const errorMsg = `Failed to publish "${post.title}": ${err.message}`;
        result.errors.push(errorMsg);
        console.error(`[BlogPublisher] ${errorMsg}`);
      }
    }

    return result;
  } catch (err: any) {
    result.errors.push(`Blog publisher error: ${err.message}`);
    console.error("[BlogPublisher] Error:", err);
    return result;
  }
}

/**
 * Get upcoming scheduled posts for the content calendar view
 */
export async function getScheduledPosts() {
  try {
    const db = await getDb();
    if (!db) return [];

    const scheduled = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        category: blogPosts.category,
        excerpt: blogPosts.excerpt,
        scheduledPublishAt: blogPosts.scheduledPublishAt,
        published: blogPosts.published,
        seoKeywords: blogPosts.seoKeywords,
        createdAt: blogPosts.createdAt,
      })
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.published, "draft"),
          isNotNull(blogPosts.scheduledPublishAt)
        )
      )
      .orderBy(blogPosts.scheduledPublishAt);

    return scheduled;
  } catch (err) {
    console.error("[BlogPublisher] Error fetching scheduled posts:", err);
    return [];
  }
}
