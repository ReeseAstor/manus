import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { 
  smsMessageLog, 
  smsOptEvents, 
  smsIncomingMessages,
  userSmsPreferences,
  users
} from "../../drizzle/schema";
import { eq, desc, sql, gte, and, count } from "drizzle-orm";

const timeRangeSchema = z.enum(["7d", "30d", "90d", "all"]);

function getDateFromRange(range: string): Date | null {
  const now = new Date();
  switch (range) {
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "90d":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:
      return null;
  }
}

export const smsAnalyticsRouter = router({
  // Get main analytics metrics
  getAnalytics: protectedProcedure
    .input(z.object({ timeRange: timeRangeSchema }))
    .query(async ({ input, ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const startDate = getDateFromRange(input.timeRange);
      
      // Get message stats
      const messageStats = await db.select({
        totalSent: count(),
        totalDelivered: sql<number>`SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END)`,
        totalFailed: sql<number>`SUM(CASE WHEN status IN ('failed', 'undelivered') THEN 1 ELSE 0 END)`,
      })
      .from(smsMessageLog)
      .where(startDate ? gte(smsMessageLog.sentAt, startDate) : undefined);

      // Get opt-in/opt-out stats
      const optStats = await db.select({
        totalOptIns: sql<number>`SUM(CASE WHEN eventType = 'opt_in' OR eventType = 'resubscribe' THEN 1 ELSE 0 END)`,
        totalOptOuts: sql<number>`SUM(CASE WHEN eventType = 'opt_out' THEN 1 ELSE 0 END)`,
      })
      .from(smsOptEvents)
      .where(startDate ? gte(smsOptEvents.createdAt, startDate) : undefined);

      // Get response stats (incoming messages)
      const responseStats = await db.select({
        totalResponses: count(),
      })
      .from(smsIncomingMessages)
      .where(startDate ? gte(smsIncomingMessages.createdAt, startDate) : undefined);

      // Get active subscribers count
      const activeSubscribers = await db.select({
        count: count(),
      })
      .from(userSmsPreferences)
      .where(eq(userSmsPreferences.smsOptIn, true));

      // Get today's sent count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaySent = await db.select({
        count: count(),
      })
      .from(smsMessageLog)
      .where(gte(smsMessageLog.sentAt, today));

      // Get this week's opt-ins
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const thisWeekOptIns = await db.select({
        count: count(),
      })
      .from(smsOptEvents)
      .where(and(
        gte(smsOptEvents.createdAt, weekAgo),
        sql`${smsOptEvents.eventType} IN ('opt_in', 'resubscribe')`
      ));

      const stats = messageStats[0];
      const opts = optStats[0];
      const responses = responseStats[0];

      const totalSent = stats?.totalSent || 0;
      const totalDelivered = Number(stats?.totalDelivered) || 0;
      const totalFailed = Number(stats?.totalFailed) || 0;

      return {
        totalSent,
        totalDelivered,
        totalFailed,
        deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
        totalOptIns: Number(opts?.totalOptIns) || 0,
        totalOptOuts: Number(opts?.totalOptOuts) || 0,
        totalResponses: responses?.totalResponses || 0,
        responseRate: totalSent > 0 ? ((responses?.totalResponses || 0) / totalSent) * 100 : 0,
        activeSubscribers: activeSubscribers[0]?.count || 0,
        todaySent: todaySent[0]?.count || 0,
        thisWeekOptIns: thisWeekOptIns[0]?.count || 0,
        avgDeliveryTime: 0, // Would need timestamps to calculate
      };
    }),

  // Get recent messages
  getRecentMessages: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(10) }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const messages = await db.select({
        id: smsMessageLog.id,
        toPhoneNumber: smsMessageLog.toPhoneNumber,
        messageBody: smsMessageLog.messageBody,
        status: smsMessageLog.status,
        sentAt: smsMessageLog.sentAt,
        twilioSid: smsMessageLog.twilioSid,
      })
      .from(smsMessageLog)
      .orderBy(desc(smsMessageLog.sentAt))
      .limit(input.limit);

      return messages;
    }),

  // Get opt-in/opt-out trends by day
  getOptTrends: protectedProcedure
    .input(z.object({ timeRange: timeRangeSchema }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const startDate = getDateFromRange(input.timeRange);

      const trends = await db.select({
        date: sql<string>`DATE(${smsOptEvents.createdAt})`,
        optIns: sql<number>`SUM(CASE WHEN eventType IN ('opt_in', 'resubscribe') THEN 1 ELSE 0 END)`,
        optOuts: sql<number>`SUM(CASE WHEN eventType = 'opt_out' THEN 1 ELSE 0 END)`,
      })
      .from(smsOptEvents)
      .where(startDate ? gte(smsOptEvents.createdAt, startDate) : undefined)
      .groupBy(sql`DATE(${smsOptEvents.createdAt})`)
      .orderBy(desc(sql`DATE(${smsOptEvents.createdAt})`))
      .limit(30);

      return trends.map(t => ({
        date: t.date,
        optIns: Number(t.optIns) || 0,
        optOuts: Number(t.optOuts) || 0,
      }));
    }),

  // Get incoming messages (responses)
  getIncomingMessages: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const messages = await db.select()
        .from(smsIncomingMessages)
        .orderBy(desc(smsIncomingMessages.createdAt))
        .limit(input.limit);

      return messages;
    }),

  // Get subscriber list
  getSubscribers: protectedProcedure
    .input(z.object({ 
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
      optedIn: z.boolean().optional(),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      let query = db.select({
        id: userSmsPreferences.id,
        phoneNumber: userSmsPreferences.phoneNumber,
        smsOptIn: userSmsPreferences.smsOptIn,
        smsNewReleases: userSmsPreferences.smsNewReleases,
        smsVipAlerts: userSmsPreferences.smsVipAlerts,
        smsMarketing: userSmsPreferences.smsMarketing,
        createdAt: userSmsPreferences.createdAt,
        updatedAt: userSmsPreferences.updatedAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(userSmsPreferences)
      .leftJoin(users, eq(userSmsPreferences.userId, users.id))
      .orderBy(desc(userSmsPreferences.createdAt))
      .limit(input.limit)
      .offset(input.offset);

      if (input.optedIn !== undefined) {
        query = query.where(eq(userSmsPreferences.smsOptIn, input.optedIn)) as typeof query;
      }

      const subscribers = await query;
      return subscribers;
    }),
});
