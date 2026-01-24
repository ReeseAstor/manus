import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "../db";
import { 
  mailerLiteWebhookEvents, 
  qaChecks, 
  qaIssues, 
  externalLinks, 
  bookCharacters,
  characterRelationships,
  bookStorylines,
  bookPricingHistory,
  dailyReports,
  adminReminders,
  contentAuditLog,
  books,
  blogPosts,
  newsletterSubscribers,
  users,
  orders
} from "../../drizzle/schema";
import { eq, and, like, desc, sql, gte, lte, count, isNull, ne } from "drizzle-orm";

/**
 * Admin router for administrative functions
 * All procedures require authentication and admin role
 */
export const adminRouter = router({
  /**
   * Get dashboard statistics
   */
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // QA Stats
      const [qaPassedToday] = await db
        .select({ count: count() })
        .from(qaChecks)
        .where(and(gte(qaChecks.checkDate, today), eq(qaChecks.status, 'passed')));
      
      const [openIssues] = await db
        .select({ count: count() })
        .from(qaIssues)
        .where(eq(qaIssues.status, 'open'));

      // Link Stats
      const [totalLinks] = await db.select({ count: count() }).from(externalLinks);
      const [brokenLinks] = await db
        .select({ count: count() })
        .from(externalLinks)
        .where(eq(externalLinks.lastStatus, 'broken'));

      // Blog Stats
      const [totalPosts] = await db.select({ count: count() }).from(blogPosts);
      const [publishedPosts] = await db
        .select({ count: count() })
        .from(blogPosts)
        .where(eq(blogPosts.published, 'published'));

      // Book Stats
      const [totalBooks] = await db.select({ count: count() }).from(books);

      // Newsletter Stats
      const [totalSubscribers] = await db
        .select({ count: count() })
        .from(newsletterSubscribers)
        .where(eq(newsletterSubscribers.status, 'active'));

      // Reminders
      const [pendingReminders] = await db
        .select({ count: count() })
        .from(adminReminders)
        .where(eq(adminReminders.status, 'pending'));

      return {
        qaStats: {
          passedToday: qaPassedToday?.count || 0,
          openIssues: openIssues?.count || 0,
        },
        linkStats: {
          totalLinks: totalLinks?.count || 0,
          brokenLinks: brokenLinks?.count || 0,
        },
        blogStats: {
          total: totalPosts?.count || 0,
          published: publishedPosts?.count || 0,
        },
        bookStats: {
          total: totalBooks?.count || 0,
        },
        newsletterStats: {
          subscribers: totalSubscribers?.count || 0,
        },
        remindersCount: pendingReminders?.count || 0,
      };
    } catch (error) {
      console.error('[Admin] Failed to get dashboard stats:', error);
      return {
        qaStats: { passedToday: 0, openIssues: 0 },
        linkStats: { totalLinks: 0, brokenLinks: 0 },
        blogStats: { total: 0, published: 0 },
        bookStats: { total: 0 },
        newsletterStats: { subscribers: 0 },
        remindersCount: 0,
      };
    }
  }),

  /**
   * Get recent QA issues
   */
  getRecentQaIssues: protectedProcedure
    .input(z.object({ limit: z.number().default(5) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) return [];

      try {
        const issues = await db
          .select()
          .from(qaIssues)
          .where(eq(qaIssues.status, 'open'))
          .orderBy(desc(qaIssues.createdAt))
          .limit(input.limit);
        return issues;
      } catch (error) {
        console.error('[Admin] Failed to get QA issues:', error);
        return [];
      }
    }),

  /**
   * Get pending reminders
   */
  getPendingReminders: protectedProcedure
    .input(z.object({ limit: z.number().default(5) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) return [];

      try {
        const reminders = await db
          .select()
          .from(adminReminders)
          .where(eq(adminReminders.status, 'pending'))
          .orderBy(desc(adminReminders.priority), adminReminders.dueDate)
          .limit(input.limit);
        return reminders;
      } catch (error) {
        console.error('[Admin] Failed to get reminders:', error);
        return [];
      }
    }),

  /**
   * Get all QA checks
   */
  getQaChecks: protectedProcedure
    .input(z.object({ 
      limit: z.number().default(20),
      checkType: z.enum(['pricing', 'links', 'content', 'characters', 'full_audit']).optional()
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) return [];

      try {
        let query = db.select().from(qaChecks).orderBy(desc(qaChecks.checkDate)).limit(input.limit);
        if (input.checkType) {
          query = query.where(eq(qaChecks.checkType, input.checkType)) as any;
        }
        return await query;
      } catch (error) {
        console.error('[Admin] Failed to get QA checks:', error);
        return [];
      }
    }),

  /**
   * Get all QA issues
   */
  getQaIssues: protectedProcedure
    .input(z.object({ 
      limit: z.number().default(50),
      status: z.enum(['open', 'resolved', 'ignored']).optional(),
      severity: z.enum(['critical', 'warning', 'info']).optional()
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) return [];

      try {
        const conditions = [];
        if (input.status) conditions.push(eq(qaIssues.status, input.status));
        if (input.severity) conditions.push(eq(qaIssues.severity, input.severity));

        let query = db.select().from(qaIssues).orderBy(desc(qaIssues.createdAt)).limit(input.limit);
        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as any;
        }
        return await query;
      } catch (error) {
        console.error('[Admin] Failed to get QA issues:', error);
        return [];
      }
    }),

  /**
   * Create QA issue
   */
  createQaIssue: protectedProcedure
    .input(z.object({
      checkId: z.number().optional(),
      issueType: z.enum(['pricing_mismatch', 'broken_link', 'content_error', 'character_inconsistency', 'missing_data']),
      severity: z.enum(['critical', 'warning', 'info']).default('warning'),
      location: z.string(),
      description: z.string(),
      expectedValue: z.string().optional(),
      actualValue: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      try {
        await db.insert(qaIssues).values(input);
        return { success: true };
      } catch (error) {
        console.error('[Admin] Failed to create QA issue:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create issue' });
      }
    }),

  /**
   * Update QA issue status
   */
  updateQaIssue: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(['open', 'resolved', 'ignored']),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      try {
        const updateData: any = { status: input.status };
        if (input.status === 'resolved') {
          updateData.resolvedAt = new Date();
          updateData.resolvedBy = ctx.user.id;
        }
        await db.update(qaIssues).set(updateData).where(eq(qaIssues.id, input.id));
        return { success: true };
      } catch (error) {
        console.error('[Admin] Failed to update QA issue:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update issue' });
      }
    }),

  /**
   * Get all external links
   */
  getExternalLinks: protectedProcedure
    .input(z.object({ 
      limit: z.number().default(100),
      status: z.enum(['active', 'broken', 'redirected', 'unknown']).optional(),
      linkType: z.enum(['amazon', 'social', 'affiliate', 'resource', 'other']).optional()
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) return [];

      try {
        const conditions = [];
        if (input.status) conditions.push(eq(externalLinks.lastStatus, input.status));
        if (input.linkType) conditions.push(eq(externalLinks.linkType, input.linkType));

        let query = db.select().from(externalLinks).orderBy(desc(externalLinks.updatedAt)).limit(input.limit);
        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as any;
        }
        return await query;
      } catch (error) {
        console.error('[Admin] Failed to get external links:', error);
        return [];
      }
    }),

  /**
   * Add external link
   */
  addExternalLink: protectedProcedure
    .input(z.object({
      url: z.string().url(),
      displayText: z.string().optional(),
      linkType: z.enum(['amazon', 'social', 'affiliate', 'resource', 'other']).default('other'),
      location: z.string(),
      componentPath: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      try {
        await db.insert(externalLinks).values(input);
        return { success: true };
      } catch (error) {
        console.error('[Admin] Failed to add external link:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to add link' });
      }
    }),

  /**
   * Check link status
   */
  checkLinkStatus: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      try {
        const [link] = await db.select().from(externalLinks).where(eq(externalLinks.id, input.id));
        if (!link) throw new TRPCError({ code: 'NOT_FOUND', message: 'Link not found' });

        const startTime = Date.now();
        let status: 'active' | 'broken' | 'redirected' = 'active';
        let httpStatus = 200;

        try {
          const response = await fetch(link.url, { method: 'HEAD', redirect: 'manual' });
          httpStatus = response.status;
          if (response.status >= 300 && response.status < 400) {
            status = 'redirected';
          } else if (response.status >= 400) {
            status = 'broken';
          }
        } catch {
          status = 'broken';
          httpStatus = 0;
        }

        const responseTime = Date.now() - startTime;

        await db.update(externalLinks).set({
          lastChecked: new Date(),
          lastStatus: status,
          httpStatus,
          responseTime,
          checkCount: sql`${externalLinks.checkCount} + 1`,
          failCount: sql`${externalLinks.failCount} + ${status === 'broken' ? 1 : 0}`,
        }).where(eq(externalLinks.id, input.id));

        return { status, httpStatus, responseTime };
      } catch (error) {
        console.error('[Admin] Failed to check link:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to check link' });
      }
    }),

  /**
   * Get book characters
   */
  getBookCharacters: protectedProcedure
    .input(z.object({ bookId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) return [];

      try {
        let query = db.select().from(bookCharacters).orderBy(bookCharacters.displayOrder);
        if (input.bookId) {
          query = query.where(eq(bookCharacters.bookId, input.bookId)) as any;
        }
        return await query;
      } catch (error) {
        console.error('[Admin] Failed to get characters:', error);
        return [];
      }
    }),

  /**
   * Create book character
   */
  createBookCharacter: protectedProcedure
    .input(z.object({
      bookId: z.number(),
      fullName: z.string(),
      nickname: z.string().optional(),
      role: z.enum(['protagonist', 'love_interest', 'antagonist', 'supporting', 'minor']),
      description: z.string().optional(),
      physicalDescription: z.string().optional(),
      personality: z.string().optional(),
      backstory: z.string().optional(),
      occupation: z.string().optional(),
      age: z.string().optional(),
      displayOrder: z.number().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      try {
        await db.insert(bookCharacters).values(input);
        return { success: true };
      } catch (error) {
        console.error('[Admin] Failed to create character:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create character' });
      }
    }),

  /**
   * Update book character
   */
  updateBookCharacter: protectedProcedure
    .input(z.object({
      id: z.number(),
      fullName: z.string().optional(),
      nickname: z.string().optional(),
      role: z.enum(['protagonist', 'love_interest', 'antagonist', 'supporting', 'minor']).optional(),
      description: z.string().optional(),
      physicalDescription: z.string().optional(),
      personality: z.string().optional(),
      backstory: z.string().optional(),
      occupation: z.string().optional(),
      age: z.string().optional(),
      displayOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      try {
        const { id, ...updateData } = input;
        await db.update(bookCharacters).set(updateData).where(eq(bookCharacters.id, id));
        return { success: true };
      } catch (error) {
        console.error('[Admin] Failed to update character:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update character' });
      }
    }),

  /**
   * Get character relationships
   */
  getCharacterRelationships: protectedProcedure
    .input(z.object({ bookId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) return [];

      try {
        let query = db.select().from(characterRelationships);
        if (input.bookId) {
          query = query.where(eq(characterRelationships.bookId, input.bookId)) as any;
        }
        return await query;
      } catch (error) {
        console.error('[Admin] Failed to get relationships:', error);
        return [];
      }
    }),

  /**
   * Create character relationship
   */
  createCharacterRelationship: protectedProcedure
    .input(z.object({
      character1Id: z.number(),
      character2Id: z.number(),
      relationshipType: z.enum(['romantic', 'family', 'friend', 'rival', 'colleague', 'enemy']),
      description: z.string().optional(),
      bookId: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      try {
        await db.insert(characterRelationships).values(input);
        return { success: true };
      } catch (error) {
        console.error('[Admin] Failed to create relationship:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create relationship' });
      }
    }),

  /**
   * Get book storylines
   */
  getBookStorylines: protectedProcedure
    .input(z.object({ bookId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) return [];

      try {
        let query = db.select().from(bookStorylines).orderBy(bookStorylines.displayOrder);
        if (input.bookId) {
          query = query.where(eq(bookStorylines.bookId, input.bookId)) as any;
        }
        return await query;
      } catch (error) {
        console.error('[Admin] Failed to get storylines:', error);
        return [];
      }
    }),

  /**
   * Create book storyline
   */
  createBookStoryline: protectedProcedure
    .input(z.object({
      bookId: z.number(),
      title: z.string(),
      storylineType: z.enum(['main_plot', 'subplot', 'romance_arc', 'character_arc', 'mystery']),
      description: z.string(),
      keyEvents: z.string().optional(),
      resolution: z.string().optional(),
      displayOrder: z.number().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      try {
        await db.insert(bookStorylines).values(input);
        return { success: true };
      } catch (error) {
        console.error('[Admin] Failed to create storyline:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create storyline' });
      }
    }),

  /**
   * Get book pricing history
   */
  getBookPricingHistory: protectedProcedure
    .input(z.object({ bookId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) return [];

      try {
        return await db
          .select()
          .from(bookPricingHistory)
          .where(eq(bookPricingHistory.bookId, input.bookId))
          .orderBy(desc(bookPricingHistory.verifiedAt));
      } catch (error) {
        console.error('[Admin] Failed to get pricing history:', error);
        return [];
      }
    }),

  /**
   * Add pricing record
   */
  addPricingRecord: protectedProcedure
    .input(z.object({
      bookId: z.number(),
      platform: z.enum(['amazon', 'apple', 'kobo', 'barnes_noble', 'google_play', 'direct']),
      price: z.string(),
      priceInCents: z.number().optional(),
      currency: z.string().default('USD'),
      verificationSource: z.string().optional(),
      previousPrice: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      try {
        await db.insert(bookPricingHistory).values({
          ...input,
          verifiedAt: new Date(),
        });
        return { success: true };
      } catch (error) {
        console.error('[Admin] Failed to add pricing record:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to add pricing record' });
      }
    }),

  /**
   * Get daily reports
   */
  getDailyReports: protectedProcedure
    .input(z.object({ limit: z.number().default(30) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) return [];

      try {
        return await db
          .select()
          .from(dailyReports)
          .orderBy(desc(dailyReports.reportDate))
          .limit(input.limit);
      } catch (error) {
        console.error('[Admin] Failed to get daily reports:', error);
        return [];
      }
    }),

  /**
   * Generate daily report
   */
  generateDailyReport: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Gather stats
      const [subscriberCount] = await db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.status, 'active'));
      const [postCount] = await db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.published, 'published'));
      const [openIssueCount] = await db.select({ count: count() }).from(qaIssues).where(eq(qaIssues.status, 'open'));
      const [brokenLinkCount] = await db.select({ count: count() }).from(externalLinks).where(eq(externalLinks.lastStatus, 'broken'));

      await db.insert(dailyReports).values({
        reportDate: today,
        reportType: 'daily_overview',
        newSubscribers: 0,
        blogPostViews: 0,
        openIssues: openIssueCount?.count || 0,
        brokenLinksFound: brokenLinkCount?.count || 0,
        summary: `Daily report generated. ${subscriberCount?.count || 0} active subscribers, ${postCount?.count || 0} published posts.`,
      });

      return { success: true };
    } catch (error) {
      console.error('[Admin] Failed to generate report:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to generate report' });
    }
  }),

  /**
   * Get all reminders
   */
  getReminders: protectedProcedure
    .input(z.object({ 
      limit: z.number().default(50),
      status: z.enum(['pending', 'completed', 'dismissed', 'snoozed']).optional()
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) return [];

      try {
        let query = db.select().from(adminReminders).orderBy(desc(adminReminders.priority), adminReminders.dueDate).limit(input.limit);
        if (input.status) {
          query = query.where(eq(adminReminders.status, input.status)) as any;
        }
        return await query;
      } catch (error) {
        console.error('[Admin] Failed to get reminders:', error);
        return [];
      }
    }),

  /**
   * Create reminder
   */
  createReminder: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      reminderType: z.enum(['broken_link', 'pricing_check', 'content_review', 'qa_issue', 'custom']),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
      relatedEntityType: z.string().optional(),
      relatedEntityId: z.number().optional(),
      dueDate: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      try {
        await db.insert(adminReminders).values({
          ...input,
          userId: ctx.user.id,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
        });
        return { success: true };
      } catch (error) {
        console.error('[Admin] Failed to create reminder:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create reminder' });
      }
    }),

  /**
   * Update reminder status
   */
  updateReminder: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(['pending', 'completed', 'dismissed', 'snoozed']),
      snoozedUntil: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      try {
        const updateData: any = { status: input.status };
        if (input.status === 'completed') {
          updateData.completedAt = new Date();
        }
        if (input.snoozedUntil) {
          updateData.snoozedUntil = new Date(input.snoozedUntil);
        }
        await db.update(adminReminders).set(updateData).where(eq(adminReminders.id, input.id));
        return { success: true };
      } catch (error) {
        console.error('[Admin] Failed to update reminder:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to update reminder' });
      }
    }),

  /**
   * Get webhook events with filtering (existing)
   */
  getWebhookEvents: protectedProcedure
    .input(
      z.object({
        filter: z.enum(['all', 'processed', 'failed']).default('all'),
        searchEmail: z.string().optional(),
        eventType: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
      }

      try {
        const conditions = [];
        if (input.filter === 'processed') {
          conditions.push(eq(mailerLiteWebhookEvents.processed, true));
        } else if (input.filter === 'failed') {
          conditions.push(sql`${mailerLiteWebhookEvents.error} IS NOT NULL`);
        }
        if (input.searchEmail) {
          conditions.push(like(mailerLiteWebhookEvents.subscriberEmail, `%${input.searchEmail}%`));
        }
        if (input.eventType) {
          conditions.push(like(mailerLiteWebhookEvents.eventType, `%${input.eventType}%`));
        }

        let query = db.select().from(mailerLiteWebhookEvents).orderBy(desc(mailerLiteWebhookEvents.createdAt)).limit(input.limit);
        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as any;
        }
        return await query;
      } catch (error) {
        console.error('[Admin] Failed to get webhook events:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch webhook events' });
      }
    }),

  /**
   * Get webhook statistics (existing)
   */
  getWebhookStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });
    }

    try {
      const totalResult = await db.select({ count: sql<number>`count(*)` }).from(mailerLiteWebhookEvents);
      const total = Number(totalResult[0]?.count || 0);

      const processedResult = await db.select({ count: sql<number>`count(*)` }).from(mailerLiteWebhookEvents).where(eq(mailerLiteWebhookEvents.processed, true));
      const processed = Number(processedResult[0]?.count || 0);

      const failedResult = await db.select({ count: sql<number>`count(*)` }).from(mailerLiteWebhookEvents).where(sql`${mailerLiteWebhookEvents.error} IS NOT NULL`);
      const failed = Number(failedResult[0]?.count || 0);

      return { total, processed, failed, pending: total - processed };
    } catch (error) {
      console.error('[Admin] Failed to get webhook stats:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch webhook statistics' });
    }
  }),

  /**
   * Run full QA check
   */
  runQaCheck: protectedProcedure
    .input(z.object({
      checkType: z.enum(['pricing', 'links', 'content', 'characters', 'full_audit']).default('full_audit')
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      try {
        let itemsChecked = 0;
        let issuesFound = 0;
        const details: any = {};

        // Check books
        const allBooks = await db.select().from(books);
        itemsChecked += allBooks.length;
        
        for (const book of allBooks) {
          // Check for missing required fields
          if (!book.amazonUrl) {
            issuesFound++;
            await db.insert(qaIssues).values({
              issueType: 'missing_data',
              severity: 'warning',
              location: `Book: ${book.title}`,
              description: 'Missing Amazon URL',
            });
          }
          if (!book.description || book.description.length < 100) {
            issuesFound++;
            await db.insert(qaIssues).values({
              issueType: 'content_error',
              severity: 'info',
              location: `Book: ${book.title}`,
              description: 'Book description is too short (less than 100 characters)',
            });
          }
        }

        // Check external links
        if (input.checkType === 'links' || input.checkType === 'full_audit') {
          const links = await db.select().from(externalLinks).where(eq(externalLinks.isActive, true));
          itemsChecked += links.length;
          
          for (const link of links) {
            if (link.lastStatus === 'broken') {
              issuesFound++;
            }
          }
        }

        // Record the check
        const status = issuesFound === 0 ? 'passed' : issuesFound > 5 ? 'failed' : 'warning';
        await db.insert(qaChecks).values({
          checkDate: new Date(),
          checkType: input.checkType,
          status,
          itemsChecked,
          issuesFound,
          details: JSON.stringify(details),
        });

        return { 
          success: true, 
          itemsChecked, 
          issuesFound, 
          status 
        };
      } catch (error) {
        console.error('[Admin] Failed to run QA check:', error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to run QA check' });
      }
    }),

  /**
   * Scan all links
   */
  scanAllLinks: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
    }

    const db = await getDb();
    if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

    try {
      const links = await db.select().from(externalLinks).where(eq(externalLinks.isActive, true));
      let checked = 0;
      let broken = 0;

      for (const link of links) {
        try {
          const startTime = Date.now();
          const response = await fetch(link.url, { method: 'HEAD', redirect: 'manual' });
          const responseTime = Date.now() - startTime;
          
          let status: 'active' | 'broken' | 'redirected' = 'active';
          if (response.status >= 300 && response.status < 400) {
            status = 'redirected';
          } else if (response.status >= 400) {
            status = 'broken';
            broken++;
          }

          await db.update(externalLinks).set({
            lastChecked: new Date(),
            lastStatus: status,
            httpStatus: response.status,
            responseTime,
            checkCount: sql`${externalLinks.checkCount} + 1`,
            failCount: sql`${externalLinks.failCount} + ${status === 'broken' ? 1 : 0}`,
          }).where(eq(externalLinks.id, link.id));

          checked++;
        } catch {
          broken++;
          await db.update(externalLinks).set({
            lastChecked: new Date(),
            lastStatus: 'broken',
            httpStatus: 0,
            checkCount: sql`${externalLinks.checkCount} + 1`,
            failCount: sql`${externalLinks.failCount} + 1`,
          }).where(eq(externalLinks.id, link.id));
          checked++;
        }
      }

      return { success: true, checked, broken };
    } catch (error) {
      console.error('[Admin] Failed to scan links:', error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to scan links' });
    }
  }),
});
