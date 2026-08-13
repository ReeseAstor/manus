/**
 * AI Usage Admin Router
 * Admin-only procedures for viewing AI rate-limit and cost tracking stats
 */
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getAiUsageStats } from "../ai-usage";

export const aiUsageRouter = router({
  /** Admin: current rate-limit + cost stats (today, last 7 days, recent interactions) */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    return getAiUsageStats();
  }),
});
