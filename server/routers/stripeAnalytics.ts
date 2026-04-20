import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { stripe } from "../_core/stripe";

/**
 * Stripe Analytics Router
 * Fetches real-time metrics directly from the Stripe API for the admin dashboard.
 */
export const stripeAnalyticsRouter = router({
  /**
   * Get overview metrics: balance, total revenue, payment count, customer count
   */
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }

    try {
      // Fetch balance, recent charges, and customer count in parallel
      const [balance, recentCharges, customerCount, subscriptionsList] = await Promise.all([
        stripe.balance.retrieve(),
        stripe.charges.list({ limit: 100 }),
        stripe.customers.list({ limit: 1 }), // just to get total_count-like info
        stripe.subscriptions.list({ limit: 100, status: "all" }),
      ]);

      // Calculate total revenue from successful charges
      const successfulCharges = recentCharges.data.filter((c) => c.status === "succeeded");
      const totalRevenue = successfulCharges.reduce((sum, c) => sum + c.amount, 0);
      const totalRefunded = successfulCharges.reduce((sum, c) => sum + (c.amount_refunded || 0), 0);
      const netRevenue = totalRevenue - totalRefunded;

      // Average order value
      const avgOrderValue = successfulCharges.length > 0 ? Math.round(netRevenue / successfulCharges.length) : 0;

      // Balance available and pending
      const availableBalance = balance.available.reduce((sum, b) => sum + b.amount, 0);
      const pendingBalance = balance.pending.reduce((sum, b) => sum + b.amount, 0);

      // Subscription breakdown
      const activeSubscriptions = subscriptionsList.data.filter((s) => s.status === "active").length;
      const canceledSubscriptions = subscriptionsList.data.filter((s) => s.status === "canceled").length;
      const pastDueSubscriptions = subscriptionsList.data.filter((s) => s.status === "past_due").length;

      // Count all customers by paginating
      let totalCustomers = 0;
      let hasMore = true;
      let startingAfter: string | undefined;
      while (hasMore) {
        const params: any = { limit: 100 };
        if (startingAfter) params.starting_after = startingAfter;
        const batch = await stripe.customers.list(params);
        totalCustomers += batch.data.length;
        hasMore = batch.has_more;
        if (batch.data.length > 0) {
          startingAfter = batch.data[batch.data.length - 1].id;
        }
      }

      return {
        totalRevenue: netRevenue,
        totalCharges: recentCharges.data.length,
        successfulCharges: successfulCharges.length,
        avgOrderValue,
        availableBalance,
        pendingBalance,
        totalCustomers,
        subscriptions: {
          active: activeSubscriptions,
          canceled: canceledSubscriptions,
          pastDue: pastDueSubscriptions,
          total: subscriptionsList.data.length,
        },
        currency: balance.available[0]?.currency || "usd",
      };
    } catch (error: any) {
      console.error("[StripeAnalytics] Failed to get overview:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch Stripe analytics",
      });
    }
  }),

  /**
   * Get revenue over time (daily aggregation from charges)
   */
  getRevenueTimeline: protectedProcedure
    .input(
      z.object({
        days: z.number().min(7).max(90).default(30),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const days = input?.days || 30;
      const since = Math.floor(Date.now() / 1000) - days * 86400;

      try {
        // Fetch all charges within the time range
        const allCharges: any[] = [];
        let hasMore = true;
        let startingAfter: string | undefined;

        while (hasMore) {
          const params: any = { limit: 100, created: { gte: since } };
          if (startingAfter) params.starting_after = startingAfter;
          const batch = await stripe.charges.list(params);
          allCharges.push(...batch.data);
          hasMore = batch.has_more;
          if (batch.data.length > 0) {
            startingAfter = batch.data[batch.data.length - 1].id;
          }
        }

        // Group by date
        const dailyMap = new Map<string, { revenue: number; count: number; refunded: number }>();

        // Initialize all days
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (days - 1 - i));
          const key = date.toISOString().split("T")[0];
          dailyMap.set(key, { revenue: 0, count: 0, refunded: 0 });
        }

        // Populate with charge data
        for (const charge of allCharges) {
          const date = new Date(charge.created * 1000).toISOString().split("T")[0];
          const existing = dailyMap.get(date) || { revenue: 0, count: 0, refunded: 0 };
          if (charge.status === "succeeded") {
            existing.revenue += charge.amount - (charge.amount_refunded || 0);
            existing.count += 1;
            existing.refunded += charge.amount_refunded || 0;
          }
          dailyMap.set(date, existing);
        }

        // Convert to sorted array
        const timeline = Array.from(dailyMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, data]) => ({
            date,
            revenue: data.revenue,
            count: data.count,
            refunded: data.refunded,
          }));

        return timeline;
      } catch (error: any) {
        console.error("[StripeAnalytics] Failed to get revenue timeline:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to fetch revenue timeline",
        });
      }
    }),

  /**
   * Get payment status breakdown for pie/donut chart
   */
  getPaymentBreakdown: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }

    try {
      const charges = await stripe.charges.list({ limit: 100 });

      const breakdown = {
        succeeded: 0,
        pending: 0,
        failed: 0,
        refunded: 0,
      };

      for (const charge of charges.data) {
        if (charge.refunded) {
          breakdown.refunded += 1;
        } else if (charge.status === "succeeded") {
          breakdown.succeeded += 1;
        } else if (charge.status === "pending") {
          breakdown.pending += 1;
        } else if (charge.status === "failed") {
          breakdown.failed += 1;
        }
      }

      return breakdown;
    } catch (error: any) {
      console.error("[StripeAnalytics] Failed to get payment breakdown:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch payment breakdown",
      });
    }
  }),

  /**
   * Get recent transactions list
   */
  getRecentTransactions: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const limit = input?.limit || 10;

      try {
        const charges = await stripe.charges.list({ limit });

        return charges.data.map((charge) => ({
          id: charge.id,
          amount: charge.amount,
          amountRefunded: charge.amount_refunded,
          currency: charge.currency,
          status: charge.refunded ? "refunded" : charge.status,
          description: charge.description || "Payment",
          customerEmail: charge.billing_details?.email || charge.receipt_email || null,
          customerName: charge.billing_details?.name || null,
          created: charge.created,
          paymentMethod: charge.payment_method_details?.type || null,
          receiptUrl: charge.receipt_url || null,
        }));
      } catch (error: any) {
        console.error("[StripeAnalytics] Failed to get recent transactions:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to fetch recent transactions",
        });
      }
    }),

  /**
   * Get top products by revenue
   */
  getTopProducts: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }

    try {
      // Get all products from Stripe
      const stripeProducts = await stripe.products.list({ limit: 100, active: true });
      const prices = await stripe.prices.list({ limit: 100, active: true });

      // Get checkout sessions to count sales per product
      const sessions = await stripe.checkout.sessions.list({
        limit: 100,
        status: "complete",
      });

      const productSales = new Map<string, { name: string; revenue: number; count: number }>();

      for (const session of sessions.data) {
        if (session.amount_total && session.amount_total > 0) {
          // Try to get line items
          try {
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
            for (const item of lineItems.data) {
              const productId = (item.price as any)?.product as string;
              const product = stripeProducts.data.find((p) => p.id === productId);
              const name = product?.name || item.description || "Unknown Product";
              const existing = productSales.get(productId || name) || { name, revenue: 0, count: 0 };
              existing.revenue += item.amount_total || 0;
              existing.count += item.quantity || 1;
              productSales.set(productId || name, existing);
            }
          } catch {
            // If line items not available, use session total
            const name = "Checkout Session";
            const existing = productSales.get(session.id) || { name, revenue: 0, count: 0 };
            existing.revenue += session.amount_total;
            existing.count += 1;
            productSales.set(session.id, existing);
          }
        }
      }

      return Array.from(productSales.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);
    } catch (error: any) {
      console.error("[StripeAnalytics] Failed to get top products:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to fetch top products",
      });
    }
  }),
});
