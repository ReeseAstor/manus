import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "../db";
import { mailerLiteWebhookEvents } from "../../drizzle/schema";
import { eq, and, like, desc, sql } from "drizzle-orm";

/**
 * Admin router for administrative functions
 * All procedures require authentication and admin role
 */
export const adminRouter = router({
  /**
   * Get webhook events with filtering
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
      // Check if user is admin
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Admin access required',
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Database not available',
        });
      }

      try {
        const conditions = [];

        // Filter by status
        if (input.filter === 'processed') {
          conditions.push(eq(mailerLiteWebhookEvents.processed, true));
        } else if (input.filter === 'failed') {
          conditions.push(sql`${mailerLiteWebhookEvents.error} IS NOT NULL`);
        }

        // Filter by email
        if (input.searchEmail) {
          conditions.push(like(mailerLiteWebhookEvents.subscriberEmail, `%${input.searchEmail}%`));
        }

        // Filter by event type
        if (input.eventType) {
          conditions.push(like(mailerLiteWebhookEvents.eventType, `%${input.eventType}%`));
        }

        let query = db
          .select()
          .from(mailerLiteWebhookEvents)
          .orderBy(desc(mailerLiteWebhookEvents.createdAt))
          .limit(input.limit);

        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as any;
        }

        const events = await query;

        return events;
      } catch (error) {
        console.error('[Admin] Failed to get webhook events:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch webhook events',
        });
      }
    }),

  /**
   * Get webhook statistics
   */
  getWebhookStats: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.user.role !== 'admin') {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Admin access required',
      });
    }

    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Database not available',
      });
    }

    try {
      // Get total count
      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(mailerLiteWebhookEvents);
      const total = Number(totalResult[0]?.count || 0);

      // Get processed count
      const processedResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(mailerLiteWebhookEvents)
        .where(eq(mailerLiteWebhookEvents.processed, true));
      const processed = Number(processedResult[0]?.count || 0);

      // Get failed count
      const failedResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(mailerLiteWebhookEvents)
        .where(sql`${mailerLiteWebhookEvents.error} IS NOT NULL`);
      const failed = Number(failedResult[0]?.count || 0);

      // Calculate pending
      const pending = total - processed;

      return {
        total,
        processed,
        failed,
        pending,
      };
    } catch (error) {
      console.error('[Admin] Failed to get webhook stats:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch webhook statistics',
      });
    }
  }),
});
