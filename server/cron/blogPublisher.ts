/**
 * Blog Auto-Publisher Cron Handler
 *
 * Checks for draft blog posts with a scheduledPublishAt date that has passed
 * and publishes only those passing structural readiness checks. Scheduling
 * remains an admin review step; this handler never generates article content.
 * Vercel Cron calls the route daily at 13:00 UTC. Blocked posts remain drafts.
 */
import { getDb } from "../db";
import { blogPosts } from "../../drizzle/schema";
import { eq, and, lte, isNotNull } from "drizzle-orm";
import { checkBlogReadiness } from "./blogReadiness";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function publishScheduledPosts(): Promise<{
  published: number;
  titles: string[];
  errors: string[];
}> {
  const result = {
    published: 0,
    titles: [] as string[],
    errors: [] as string[],
  };

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

    console.log(
      `[BlogPublisher] Found ${postsToPublish.length} posts ready to publish`
    );

    for (const post of postsToPublish) {
      try {
        const readiness = checkBlogReadiness(post);
        if (!readiness.ready) {
          result.errors.push(
            `Blocked draft #${post.id} "${post.title}": ${readiness.issues.join("; ")}`
          );
          continue;
        }

        const transitioned = await db
          .update(blogPosts)
          .set({
            published: "published",
            publishedAt: now,
            updatedAt: now,
            readTime: readiness.readTime,
          })
          .where(
            and(
              eq(blogPosts.id, post.id),
              eq(blogPosts.published, "draft"),
              isNotNull(blogPosts.scheduledPublishAt),
              lte(blogPosts.scheduledPublishAt, now),
              // Don't publish a different version than the one validated above.
              eq(blogPosts.scheduledPublishAt, post.scheduledPublishAt!),
              eq(blogPosts.title, post.title),
              eq(blogPosts.slug, post.slug),
              eq(blogPosts.excerpt, post.excerpt),
              eq(blogPosts.content, post.content),
              eq(blogPosts.category, post.category)
            )
          )
          .returning({ id: blogPosts.id, title: blogPosts.title });
        if (transitioned.length === 0) {
          result.errors.push(
            `Skipped draft #${post.id}: changed, rescheduled, or already published by another run; refresh the content calendar`
          );
          continue;
        }

        result.published++;
        result.titles.push(transitioned[0].title);
        console.log(`[BlogPublisher] Published: "${post.title}"`);
      } catch (err: unknown) {
        const errorMsg = `Failed to publish draft #${post.id} "${post.title}": ${errorMessage(err)}`;
        result.errors.push(errorMsg);
        console.error(`[BlogPublisher] ${errorMsg}`);
      }
    }

    return result;
  } catch (err: unknown) {
    result.errors.push(`Blog publisher error: ${errorMessage(err)}`);
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
