/**
 * Command Center Router - KDP Business Virtual Assistant
 * Admin-only endpoints for business metrics, goals, tool inventory, and daily briefings
 */
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import {
  businessMetrics,
  businessGoals,
  toolInventory,
  dailyBriefings,
  newsletterSubscribers,
  orders,
  blogPosts,
  books,
  users,
} from "../../drizzle/schema";
import { eq, desc, gte, lte, and, count, sql, between } from "drizzle-orm";

function requireAdmin(role: string | undefined) {
  if (role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
}

// ─── MailerLite Stats Helper ─────────────────────────────────────────────────

async function fetchMailerLiteStats() {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) return null;

  try {
    // Get subscriber count
    const subsResponse = await fetch("https://connect.mailerlite.com/api/subscribers?filter[status]=active&limit=0", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });
    const subsData = await subsResponse.json();
    const totalSubscribers = subsData?.meta?.total || 0;

    // Get recent stats from account
    const accountResponse = await fetch("https://connect.mailerlite.com/api/subscribers?filter[status]=active&limit=1&sort=-created_at", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });
    const accountData = await accountResponse.json();

    return {
      totalSubscribers,
      recentSubscriber: accountData?.data?.[0] || null,
    };
  } catch (error) {
    console.error("[CommandCenter] Failed to fetch MailerLite stats:", error);
    return null;
  }
}

export const commandCenterRouter = router({
  // ─── Dashboard Overview ──────────────────────────────────────────────────

  getOverview: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get subscriber count from DB
      const [subCount] = await db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.status, "active"));

      // Get recent orders
      const [orderCount] = await db.select({ count: count() }).from(orders).where(and(eq(orders.status, "completed"), gte(orders.createdAt, thirtyDaysAgo)));
      const [totalRevenue] = await db.select({ total: sql<number>`COALESCE(SUM(${orders.amount}), 0)` }).from(orders).where(and(eq(orders.status, "completed"), gte(orders.createdAt, thirtyDaysAgo)));

      // Get blog stats
      const [blogCount] = await db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.published, "published"));

      // Get book count
      const [bookCount] = await db.select({ count: count() }).from(books);

      // Get user count
      const [userCount] = await db.select({ count: count() }).from(users);

      // Get active goals
      const activeGoals = await db.select().from(businessGoals).where(eq(businessGoals.status, "active")).orderBy(businessGoals.endDate);

      // Get latest briefing
      const [latestBriefing] = await db.select().from(dailyBriefings).orderBy(desc(dailyBriefings.briefingDate)).limit(1);

      // Get latest metrics
      const [latestMetrics] = await db.select().from(businessMetrics).orderBy(desc(businessMetrics.date)).limit(1);

      // Fetch live MailerLite stats
      const mailerLiteStats = await fetchMailerLiteStats();

      return {
        subscribers: mailerLiteStats?.totalSubscribers || subCount?.count || 0,
        monthlyOrders: orderCount?.count || 0,
        monthlyRevenue: totalRevenue?.total || 0,
        publishedPosts: blogCount?.count || 0,
        totalBooks: bookCount?.count || 0,
        totalUsers: userCount?.count || 0,
        activeGoals,
        latestBriefing,
        latestMetrics,
        mailerLiteStats,
      };
    } catch (error) {
      console.error("[CommandCenter] Failed to get overview:", error);
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to load overview" });
    }
  }),

  // ─── Business Metrics ────────────────────────────────────────────────────

  getMetricsHistory: protectedProcedure
    .input(z.object({ days: z.number().default(30) }))
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      return db.select().from(businessMetrics).where(gte(businessMetrics.date, startDate)).orderBy(desc(businessMetrics.date));
    }),

  recordMetrics: protectedProcedure
    .input(z.object({
      totalSubscribers: z.number().optional(),
      newSubscribers: z.number().optional(),
      pageViews: z.number().optional(),
      uniqueVisitors: z.number().optional(),
      dailyRevenue: z.number().optional(),
      ordersCount: z.number().optional(),
      amazonRanking: z.number().optional(),
      reviewCount: z.number().optional(),
      averageRating: z.string().optional(),
      kdpRoyalties: z.number().optional(),
      pagesRead: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await db.insert(businessMetrics).values({
        date: today,
        ...input,
      });

      return { success: true };
    }),

  // ─── Collect Metrics (auto-fetch from APIs) ──────────────────────────────

  collectMetrics: protectedProcedure.mutation(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch MailerLite stats
    const mlStats = await fetchMailerLiteStats();

    // Count today's orders
    const [todayOrders] = await db.select({ count: count(), total: sql<number>`COALESCE(SUM(${orders.amount}), 0)` }).from(orders).where(and(eq(orders.status, "completed"), gte(orders.createdAt, today)));

    await db.insert(businessMetrics).values({
      date: today,
      totalSubscribers: mlStats?.totalSubscribers || 0,
      dailyRevenue: todayOrders?.total || 0,
      ordersCount: todayOrders?.count || 0,
    });

    return {
      success: true,
      collected: {
        subscribers: mlStats?.totalSubscribers || 0,
        orders: todayOrders?.count || 0,
        revenue: todayOrders?.total || 0,
      },
    };
  }),

  // ─── Business Goals ──────────────────────────────────────────────────────

  getGoals: protectedProcedure
    .input(z.object({ status: z.enum(["active", "completed", "missed", "paused"]).optional() }).optional())
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) return [];

      let query = db.select().from(businessGoals).orderBy(desc(businessGoals.endDate));
      if (input?.status) {
        query = query.where(eq(businessGoals.status, input.status)) as any;
      }
      return query;
    }),

  createGoal: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      category: z.enum(["subscribers", "revenue", "books", "content", "social", "launches", "other"]),
      targetValue: z.number().min(1),
      currentValue: z.number().default(0),
      unit: z.string().min(1),
      startDate: z.string(),
      endDate: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.insert(businessGoals).values({
        ...input,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
      });

      return { success: true };
    }),

  updateGoal: protectedProcedure
    .input(z.object({
      id: z.number(),
      currentValue: z.number().optional(),
      status: z.enum(["active", "completed", "missed", "paused"]).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const { id, ...updates } = input;
      await db.update(businessGoals).set(updates).where(eq(businessGoals.id, id));

      return { success: true };
    }),

  deleteGoal: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.delete(businessGoals).where(eq(businessGoals.id, input.id));
      return { success: true };
    }),

  // ─── Tool Inventory ──────────────────────────────────────────────────────

  getTools: protectedProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) return [];

      let query = db.select().from(toolInventory).orderBy(toolInventory.displayOrder);
      if (input?.category) {
        query = query.where(eq(toolInventory.category, input.category as any)) as any;
      }
      return query;
    }),

  createTool: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      url: z.string().url(),
      category: z.enum(["video", "audio", "design", "writing", "marketing", "analytics", "kdp", "social", "email", "other"]),
      plan: z.string().optional(),
      loginEmail: z.string().optional(),
      loginMethod: z.string().optional(),
      status: z.enum(["active", "needs_login", "expired", "pending"]).default("active"),
      description: z.string().optional(),
      kdpUseCases: z.string().optional(),
      features: z.string().optional(),
      usageLimits: z.string().optional(),
      iconEmoji: z.string().optional(),
      displayOrder: z.number().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.insert(toolInventory).values(input);
      return { success: true };
    }),

  updateTool: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      url: z.string().optional(),
      category: z.enum(["video", "audio", "design", "writing", "marketing", "analytics", "kdp", "social", "email", "other"]).optional(),
      plan: z.string().optional(),
      status: z.enum(["active", "needs_login", "expired", "pending"]).optional(),
      description: z.string().optional(),
      kdpUseCases: z.string().optional(),
      features: z.string().optional(),
      usageLimits: z.string().optional(),
      iconEmoji: z.string().optional(),
      displayOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const { id, ...updates } = input;
      await db.update(toolInventory).set(updates).where(eq(toolInventory.id, id));
      return { success: true };
    }),

  deleteTool: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.delete(toolInventory).where(eq(toolInventory.id, input.id));
      return { success: true };
    }),

  // Seed tools from audit data
  seedTools: protectedProcedure.mutation(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    // Check if tools already exist
    const existing = await db.select({ count: count() }).from(toolInventory);
    if (existing[0]?.count > 0) {
      return { success: true, message: "Tools already seeded", count: existing[0].count };
    }

    const tools = [
      {
        name: "SoundMadeSeen",
        url: "https://soundmadeseen.com/en-us/dashboard",
        category: "audio" as const,
        plan: "AppSumo Single",
        loginEmail: "info@yunglungchen.com",
        loginMethod: "email",
        status: "active" as const,
        description: "Audio-to-video converter with beat mode, TTS, transcription, and design editor",
        kdpUseCases: JSON.stringify(["Book trailer videos", "Audiogram promos", "TTS for excerpts", "Beat Mode atmospheric videos"]),
        features: JSON.stringify(["Beat Mode", "Upload files (audio to video)", "Podcasts", "Record audio", "Text to speech", "Design editor", "Transcription editing"]),
        usageLimits: JSON.stringify({ videoMinutes: 98, transcriptionMinutes: 93, ttsCharacters: 10000, imageCredits: 455, resetsDate: "2026-04-08" }),
        iconEmoji: "🎵",
        displayOrder: 1,
      },
      {
        name: "Bookclicker",
        url: "https://www.bookclicker.com",
        category: "marketing" as const,
        plan: "Unknown",
        loginEmail: "info@yunglungchen.com",
        loginMethod: "email",
        status: "needs_login" as const,
        description: "Newsletter cross-promotion between authors, book launch support",
        kdpUseCases: JSON.stringify(["Newsletter swaps", "Cross-promotion", "Book launch support", "Reader discovery"]),
        features: JSON.stringify(["Author networking", "Newsletter swaps", "Book promotion"]),
        iconEmoji: "📚",
        displayOrder: 2,
      },
      {
        name: "Digital Maker AI",
        url: "https://digitalmaker.ai/tools",
        category: "writing" as const,
        plan: "Premium",
        loginEmail: "sroy237@gmail.com",
        loginMethod: "google",
        status: "active" as const,
        description: "AI-powered content creation with ChatGPT, Claude, Gemini, prompt builder, and product research",
        kdpUseCases: JSON.stringify(["Book descriptions", "Ad copy", "Competitor analysis", "Product research", "AI prompts for marketing"]),
        features: JSON.stringify(["Chat (ChatGPT, Claude, Gemini)", "Prompt Builder", "Product Research", "Competitor Analyzer", "Image Maker", "Video Maker", "Ad Library"]),
        iconEmoji: "🤖",
        displayOrder: 3,
      },
      {
        name: "HumanPal 2.0",
        url: "https://app.humanpal.io/dashboard",
        category: "video" as const,
        plan: "AppSumo",
        loginEmail: "info@reeseastor.com",
        loginMethod: "email",
        status: "active" as const,
        description: "AI avatar video creator with singing, lip-sync, and text-to-speech",
        kdpUseCases: JSON.stringify(["Author avatar videos", "Book promo videos with AI spokesperson", "TTS narration", "Social media content"]),
        features: JSON.stringify(["Create Video", "AI Human Photo Generator", "Singing HumanPals", "Loom-style circle video", "Multi-language TTS", "Slide editing"]),
        iconEmoji: "🧑",
        displayOrder: 4,
      },
      {
        name: "TalkingPhotos 3.5",
        url: "https://app.talkingphotos.ai",
        category: "video" as const,
        plan: "AppSumo",
        loginEmail: "info@reeseastor.com",
        loginMethod: "email",
        status: "active" as const,
        description: "Photo-to-talking-video maker with 2D/3D cartoon, dancing, and motion poses",
        kdpUseCases: JSON.stringify(["Animated author photo videos", "Book character talking videos", "Social media promos with talking avatars"]),
        features: JSON.stringify(["Human Video", "2D/3D Cartoon Video", "Merge Videos", "Background removal", "Green screen", "Dancing/Motion poses", "Subtitles"]),
        iconEmoji: "🗣️",
        displayOrder: 5,
      },
      {
        name: "Artistly v6.0",
        url: "https://app.artistly.ai/dashboard",
        category: "kdp" as const,
        plan: "AppSumo",
        loginEmail: "info@reeseastor.com",
        loginMethod: "email",
        status: "active" as const,
        description: "#1 KDP Tool - coloring books, puzzle books, children's books, book covers, activity books, cookbooks from prompts",
        kdpUseCases: JSON.stringify(["Coloring books in bulk", "Multi-puzzle activity books with answer keys", "Children's books from keywords", "Book cover generation", "Cookbook creation", "Word search/crossword/maze books"]),
        features: JSON.stringify(["Coloring Pages in Bulk", "Cookbooks from recipes", "Multi-Puzzle Activity Books", "Consistent Character Storybooks", "Children's Books", "Book Covers", "Image upscaling", "Mockup creation", "Flipbook creation", "Art style transfer"]),
        iconEmoji: "🎨",
        displayOrder: 6,
      },
      {
        name: "Video Express 2.0",
        url: "https://app.videoexpress.ai",
        category: "video" as const,
        plan: "All Access",
        loginEmail: "info@reeseastor.com",
        loginMethod: "email",
        status: "active" as const,
        description: "Full AI video editor with prompt-to-video, face swap, consistent characters, and timeline editing",
        kdpUseCases: JSON.stringify(["Book trailers", "Social media promos", "TikTok/Reels content", "AI-generated book scenes"]),
        features: JSON.stringify(["Create Video From Prompt", "Image to Video", "Text to Video", "Stylize Character", "Consistent Character", "Human Talking Video", "AI Face Swap", "Replace Background", "Inpainting/Outpainting", "Object Removal", "AI Sound Maker", "Motion Brush", "Automatic Captions", "Audio Cutter"]),
        iconEmoji: "🎬",
        displayOrder: 7,
      },
      {
        name: "BookFunnel",
        url: "https://bookfunnel.com",
        category: "marketing" as const,
        plan: "Unknown",
        loginEmail: "unknown",
        loginMethod: "email",
        status: "pending" as const,
        description: "Book delivery platform for reader magnets and free book distribution",
        kdpUseCases: JSON.stringify(["Free book delivery", "Reader magnet distribution", "Newsletter building", "ARC distribution"]),
        features: JSON.stringify(["Book delivery", "Landing pages", "Reader magnet", "ARC distribution"]),
        iconEmoji: "📖",
        displayOrder: 8,
      },
      {
        name: "FlexiFunnels",
        url: "https://flexifunnels.com",
        category: "marketing" as const,
        loginEmail: "sroy237@gmail.com",
        loginMethod: "google",
        status: "pending" as const,
        description: "Funnel builder for sales pages and landing pages",
        kdpUseCases: JSON.stringify(["Book sales funnels", "Landing pages", "Lead capture"]),
        iconEmoji: "🔄",
        displayOrder: 9,
      },
      {
        name: "Marky",
        url: "https://marky.ai",
        category: "social" as const,
        loginEmail: "sroy237@gmail.com",
        loginMethod: "google",
        status: "pending" as const,
        description: "AI social media content creation and scheduling",
        kdpUseCases: JSON.stringify(["Social media posts", "Book promotion content", "Automated scheduling"]),
        iconEmoji: "📱",
        displayOrder: 10,
      },
      {
        name: "SendFox",
        url: "https://sendfox.com",
        category: "email" as const,
        loginEmail: "sroy237@gmail.com",
        loginMethod: "google",
        status: "pending" as const,
        description: "Email marketing platform (alternative to MailerLite)",
        kdpUseCases: JSON.stringify(["Email campaigns", "Newsletter management", "Automation sequences"]),
        iconEmoji: "📧",
        displayOrder: 11,
      },
      {
        name: "Dynamic Mockups",
        url: "https://dynamicmockups.com",
        category: "design" as const,
        loginEmail: "sroy237@gmail.com",
        loginMethod: "google",
        status: "pending" as const,
        description: "Product mockup generator for books and merchandise",
        kdpUseCases: JSON.stringify(["Book mockups", "3D book renders", "Marketing materials"]),
        iconEmoji: "📐",
        displayOrder: 12,
      },
    ];

    for (const tool of tools) {
      await db.insert(toolInventory).values(tool);
    }

    return { success: true, message: `Seeded ${tools.length} tools`, count: tools.length };
  }),

  // ─── Daily Briefings ─────────────────────────────────────────────────────

  getBriefings: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) return [];

      return db.select().from(dailyBriefings).orderBy(desc(dailyBriefings.briefingDate)).limit(input.limit);
    }),

  getBriefingById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [briefing] = await db.select().from(dailyBriefings).where(eq(dailyBriefings.id, input.id));
      if (!briefing) throw new TRPCError({ code: "NOT_FOUND" });
      return briefing;
    }),

  generateBriefing: protectedProcedure.mutation(async ({ ctx }) => {
    requireAdmin(ctx.user.role);
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Collect data for briefing
    const mlStats = await fetchMailerLiteStats();

    const [subCount] = await db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.status, "active"));
    const [orderStats] = await db.select({ count: count(), total: sql<number>`COALESCE(SUM(${orders.amount}), 0)` }).from(orders).where(and(eq(orders.status, "completed"), gte(orders.createdAt, yesterday)));
    const [blogCount] = await db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.published, "published"));
    const activeGoals = await db.select().from(businessGoals).where(eq(businessGoals.status, "active"));

    // Build data snapshot
    const dataSnapshot = {
      date: today.toISOString(),
      subscribers: mlStats?.totalSubscribers || subCount?.count || 0,
      orders24h: orderStats?.count || 0,
      revenue24h: orderStats?.total || 0,
      publishedPosts: blogCount?.count || 0,
      activeGoals: activeGoals.length,
    };

    // Generate briefing content
    const subscriberCount = dataSnapshot.subscribers;
    const goalSummaries = activeGoals.map(g => {
      const pct = g.targetValue > 0 ? Math.round((g.currentValue / g.targetValue) * 100) : 0;
      return `${g.title}: ${g.currentValue}/${g.targetValue} ${g.unit} (${pct}%)`;
    });

    const executiveSummary = `Good morning, Reese! Here's your daily business briefing for ${today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.\n\nYour email list has ${subscriberCount} active subscribers. ${orderStats?.count ? `You had ${orderStats.count} order(s) in the last 24 hours totaling $${((orderStats.total || 0) / 100).toFixed(2)}.` : "No new orders in the last 24 hours."} You have ${blogCount?.count || 0} published blog posts and ${activeGoals.length} active business goals.`;

    const subscriberUpdate = `Total active subscribers: ${subscriberCount}. ${mlStats?.recentSubscriber ? `Most recent subscriber joined recently.` : "No new subscriber data available."}`;

    const revenueUpdate = orderStats?.count
      ? `${orderStats.count} completed order(s) in the last 24 hours. Total revenue: $${((orderStats.total || 0) / 100).toFixed(2)}.`
      : "No completed orders in the last 24 hours. Consider running a promotion or social media campaign.";

    const goalProgress = goalSummaries.length > 0
      ? goalSummaries.join("\n")
      : "No active goals set. Consider setting monthly targets for subscribers, revenue, and content.";

    const actionItems = JSON.stringify([
      "Review and respond to any reader emails",
      "Check Amazon reviews for new feedback",
      "Post on social media (Instagram/TikTok)",
      activeGoals.length === 0 ? "Set monthly business goals in Command Center" : null,
      orderStats?.count === 0 ? "Consider running a limited-time promotion" : null,
    ].filter(Boolean));

    const alerts = JSON.stringify([
      subscriberCount < 100 ? "Subscriber count is below 100 - focus on list building" : null,
    ].filter(Boolean));

    // Save briefing
    const [result] = await db.insert(dailyBriefings).values({
      briefingDate: today,
      executiveSummary,
      subscriberUpdate,
      revenueUpdate,
      contentUpdate: `${blogCount?.count || 0} published blog posts. Keep creating valuable content for your readers.`,
      goalProgress,
      actionItems,
      alerts,
      dataSnapshot: JSON.stringify(dataSnapshot),
    }).$returningId();

    return {
      success: true,
      briefingId: result.id,
      summary: executiveSummary,
    };
  }),

  // Send briefing via email
  sendBriefingEmail: protectedProcedure
    .input(z.object({ briefingId: z.number(), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.role);
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [briefing] = await db.select().from(dailyBriefings).where(eq(dailyBriefings.id, input.briefingId));
      if (!briefing) throw new TRPCError({ code: "NOT_FOUND" });

      const { sendEmail } = await import("../email-service");

      const actionItems = briefing.actionItems ? JSON.parse(briefing.actionItems) : [];
      const alerts = briefing.alerts ? JSON.parse(briefing.alerts) : [];

      const html = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e8e0d4; padding: 40px;">
          <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px;">
            <h1 style="color: #d4af37; font-size: 24px; margin: 0;">Daily Executive Briefing</h1>
            <p style="color: #a0937d; margin: 5px 0 0 0;">${briefing.briefingDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>

          <div style="margin-bottom: 25px;">
            <h2 style="color: #d4af37; font-size: 18px; border-bottom: 1px solid #2a2a3a; padding-bottom: 8px;">Executive Summary</h2>
            <p style="line-height: 1.6; white-space: pre-line;">${briefing.executiveSummary}</p>
          </div>

          ${briefing.subscriberUpdate ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #d4af37; font-size: 18px; border-bottom: 1px solid #2a2a3a; padding-bottom: 8px;">Subscribers</h2>
            <p style="line-height: 1.6;">${briefing.subscriberUpdate}</p>
          </div>` : ""}

          ${briefing.revenueUpdate ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #d4af37; font-size: 18px; border-bottom: 1px solid #2a2a3a; padding-bottom: 8px;">Revenue</h2>
            <p style="line-height: 1.6;">${briefing.revenueUpdate}</p>
          </div>` : ""}

          ${briefing.goalProgress ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #d4af37; font-size: 18px; border-bottom: 1px solid #2a2a3a; padding-bottom: 8px;">Goal Progress</h2>
            <p style="line-height: 1.6; white-space: pre-line;">${briefing.goalProgress}</p>
          </div>` : ""}

          ${actionItems.length > 0 ? `
          <div style="margin-bottom: 25px;">
            <h2 style="color: #d4af37; font-size: 18px; border-bottom: 1px solid #2a2a3a; padding-bottom: 8px;">Action Items</h2>
            <ul style="padding-left: 20px;">
              ${actionItems.map((item: string) => `<li style="margin-bottom: 8px; line-height: 1.4;">${item}</li>`).join("")}
            </ul>
          </div>` : ""}

          ${alerts.length > 0 ? `
          <div style="margin-bottom: 25px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 8px; padding: 15px;">
            <h2 style="color: #d4af37; font-size: 18px; margin-top: 0;">Alerts</h2>
            <ul style="padding-left: 20px; margin-bottom: 0;">
              ${alerts.map((alert: string) => `<li style="margin-bottom: 8px; line-height: 1.4;">${alert}</li>`).join("")}
            </ul>
          </div>` : ""}

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #2a2a3a;">
            <p style="color: #a0937d; font-size: 12px;">Reese Astor Business Command Center</p>
          </div>
        </div>
      `;

      const sent = await sendEmail({
        to: input.email,
        subject: `Daily Briefing - ${briefing.briefingDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
        html,
      });

      if (sent) {
        await db.update(dailyBriefings).set({ emailSent: true, emailSentAt: new Date() }).where(eq(dailyBriefings.id, input.briefingId));
      }

      return { success: sent };
    }),
});
