import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { affiliateClicks, affiliateMetricsDaily } from "../../drizzle/schema";
import { eq, desc, sql, and, gte, lte, count } from "drizzle-orm";
import crypto from "crypto";

/**
 * Generate a session hash from IP + User Agent for anonymous click deduplication.
 * We never store raw IPs — only a one-way hash for grouping.
 */
function generateSessionHash(ip: string, userAgent: string): string {
  return crypto
    .createHash("sha256")
    .update(`${ip}|${userAgent}|${new Date().toISOString().split("T")[0]}`)
    .digest("hex")
    .substring(0, 16);
}

/**
 * Extract ASIN from an Amazon affiliate URL.
 */
function extractAsin(url: string): string | null {
  const match = url.match(/\/dp\/([A-Z0-9]{10})/i) || url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
  return match ? match[1] : null;
}

export const affiliateTrackingRouter = router({
  /**
   * Track an affiliate link click.
   * This is a public endpoint — anyone visiting the blog can trigger it.
   * Rate-limited by session hash deduplication (1 click per product per session per day).
   */
  trackClick: publicProcedure
    .input(
      z.object({
        productName: z.string().min(1).max(255),
        affiliateUrl: z.string().url(),
        sourceSlug: z.string().min(1).max(255),
        clickType: z.enum(["inline", "card", "favorites"]).default("inline"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const ip = ctx.req?.headers?.["x-forwarded-for"]?.toString() || ctx.req?.socket?.remoteAddress || "unknown";
      const userAgent = ctx.req?.headers?.["user-agent"] || "unknown";
      const referrer = ctx.req?.headers?.referer || null;
      const sessionHash = generateSessionHash(ip, userAgent);
      const productId = extractAsin(input.affiliateUrl);

      // Deduplication: Check if this session already clicked this product today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const db = await getDb();
      if (!db) return { tracked: false, reason: "db_unavailable" };

      const [existing] = await db
        .select({ id: affiliateClicks.id })
        .from(affiliateClicks)
        .where(
          and(
            eq(affiliateClicks.sessionHash, sessionHash),
            eq(affiliateClicks.productName, input.productName),
            gte(affiliateClicks.createdAt, today),
            lte(affiliateClicks.createdAt, tomorrow)
          )
        )
        .limit(1);

      if (existing) {
        return { tracked: false, reason: "duplicate" };
      }

      await db!.insert(affiliateClicks).values({
        productName: input.productName,
        productId,
        affiliateUrl: input.affiliateUrl,
        sourceSlug: input.sourceSlug,
        clickType: input.clickType,
        sessionHash,
        userAgent,
        referrer,
        userId: ctx.user?.id || null,
      });

      return { tracked: true };
    }),

  /**
   * Get affiliate analytics overview (admin only).
   * Returns KPIs, time series, and breakdowns for the dashboard.
   */
  getAnalytics: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(365).default(30),
      })
    )
    .query(async ({ input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);
      startDate.setHours(0, 0, 0, 0);

      const db = await getDb();
      if (!db) return { kpis: { totalClicks: 0, uniqueClicks: 0, estimatedConversions: 0, estimatedRevenue: 0, avgClicksPerDay: 0, clickThroughRate: 0 }, productBreakdown: [], sourceBreakdown: [], typeBreakdown: [], dailyClicks: [] };

      // Total clicks in period
      const [totalResult] = await db
        .select({ total: count() })
        .from(affiliateClicks)
        .where(gte(affiliateClicks.createdAt, startDate));
      const totalClicks = totalResult?.total || 0;

      // Unique sessions in period
      const uniqueResult = await db
        .select({ sessionHash: affiliateClicks.sessionHash })
        .from(affiliateClicks)
        .where(gte(affiliateClicks.createdAt, startDate))
        .groupBy(affiliateClicks.sessionHash);
      const uniqueClicks = uniqueResult.length;

      // Clicks by product (top 10)
      const productBreakdown = await db
        .select({
          productName: affiliateClicks.productName,
          productId: affiliateClicks.productId,
          clicks: count(),
        })
        .from(affiliateClicks)
        .where(gte(affiliateClicks.createdAt, startDate))
        .groupBy(affiliateClicks.productName, affiliateClicks.productId)
        .orderBy(desc(count()))
        .limit(10);

      // Clicks by source article (top 10)
      const sourceBreakdown = await db
        .select({
          sourceSlug: affiliateClicks.sourceSlug,
          clicks: count(),
        })
        .from(affiliateClicks)
        .where(gte(affiliateClicks.createdAt, startDate))
        .groupBy(affiliateClicks.sourceSlug)
        .orderBy(desc(count()))
        .limit(10);

      // Clicks by type
      const typeBreakdown = await db
        .select({
          clickType: affiliateClicks.clickType,
          clicks: count(),
        })
        .from(affiliateClicks)
        .where(gte(affiliateClicks.createdAt, startDate))
        .groupBy(affiliateClicks.clickType);

      // Daily time series for chart
      const dailyClicks = await db
        .select({
          date: sql<string>`DATE(${affiliateClicks.createdAt})`.as("date"),
          clicks: count(),
          uniqueSessions: sql<number>`COUNT(DISTINCT ${affiliateClicks.sessionHash})`.as("uniqueSessions"),
        })
        .from(affiliateClicks)
        .where(gte(affiliateClicks.createdAt, startDate))
        .groupBy(sql`DATE(${affiliateClicks.createdAt})`)
        .orderBy(sql`DATE(${affiliateClicks.createdAt})`);

      // Estimated earnings (Amazon Associates typical 4-8% commission, ~10% conversion from click to purchase)
      // Conservative: 4% commission rate, 8% click-to-purchase conversion, $25 avg order value
      const estimatedConversions = Math.round(uniqueClicks * 0.08);
      const estimatedRevenue = estimatedConversions * 25 * 0.04;

      return {
        kpis: {
          totalClicks,
          uniqueClicks,
          estimatedConversions,
          estimatedRevenue: Math.round(estimatedRevenue * 100) / 100,
          avgClicksPerDay: input.days > 0 ? Math.round((totalClicks / input.days) * 10) / 10 : 0,
          clickThroughRate: totalClicks > 0 ? Math.round((uniqueClicks / totalClicks) * 100) : 0,
        },
        productBreakdown,
        sourceBreakdown,
        typeBreakdown,
        dailyClicks,
      };
    }),

  /**
   * Get recent clicks (admin only).
   */
  getRecentClicks: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      return db
        .select({
          id: affiliateClicks.id,
          productName: affiliateClicks.productName,
          productId: affiliateClicks.productId,
          sourceSlug: affiliateClicks.sourceSlug,
          clickType: affiliateClicks.clickType,
          createdAt: affiliateClicks.createdAt,
        })
        .from(affiliateClicks)
        .orderBy(desc(affiliateClicks.createdAt))
        .limit(input.limit);
    }),
});
