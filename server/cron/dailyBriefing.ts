/**
 * Daily Briefing Cron Handler
 * 
 * This module provides the logic for automated daily metric collection
 * and briefing generation. It can be triggered via API endpoint.
 */
import { getDb } from "../db";
import {
  businessMetrics,
  businessGoals,
  dailyBriefings,
  newsletterSubscribers,
  orders,
  blogPosts,
  books,
  users,
} from "../../drizzle/schema";
import { eq, count, sql, gte, and, desc } from "drizzle-orm";
import { sendEmail } from "../email-service";

async function fetchMailerLiteStats() {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) return null;

  try {
    const subsResponse = await fetch("https://connect.mailerlite.com/api/subscribers?filter[status]=active&limit=0", {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });
    const subsData = await subsResponse.json();
    return { totalSubscribers: subsData?.meta?.total || 0 };
  } catch (error) {
    console.error("[DailyBriefing] Failed to fetch MailerLite stats:", error);
    return null;
  }
}

export async function runDailyBriefing(): Promise<{ success: boolean; briefingId?: number; error?: string }> {
  console.log("[DailyBriefing] Starting daily briefing generation...");

  const db = await getDb();
  if (!db) return { success: false, error: "Database not available" };

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 1. Collect metrics
    const mlStats = await fetchMailerLiteStats();
    const [subCount] = await db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.status, "active"));
    const [orderStats] = await db.select({
      count: count(),
      total: sql<number>`COALESCE(SUM(${orders.amount}), 0)`,
    }).from(orders).where(and(eq(orders.status, "completed"), gte(orders.createdAt, yesterday)));
    const [blogCount] = await db.select({ count: count() }).from(blogPosts).where(eq(blogPosts.published, "published"));
    const [bookCount] = await db.select({ count: count() }).from(books);
    const [userCount] = await db.select({ count: count() }).from(users);
    const activeGoals = await db.select().from(businessGoals).where(eq(businessGoals.status, "active"));

    // 2. Save metrics snapshot
    const subscriberCount = mlStats?.totalSubscribers || subCount?.count || 0;
    await db.insert(businessMetrics).values({
      date: today,
      totalSubscribers: subscriberCount,
      dailyRevenue: orderStats?.total || 0,
      ordersCount: orderStats?.count || 0,
    });

    // 3. Generate briefing content
    const dateStr = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const revenueStr = `$${((orderStats?.total || 0) / 100).toFixed(2)}`;

    const executiveSummary = `Good morning, Reese! Here's your daily business briefing for ${dateStr}.\n\nYour email list has ${subscriberCount} active subscribers. ${orderStats?.count ? `You had ${orderStats.count} order(s) in the last 24 hours totaling ${revenueStr}.` : "No new orders in the last 24 hours."} You have ${blogCount?.count || 0} published blog posts, ${bookCount?.count || 0} books in your catalog, and ${userCount?.count || 0} registered users. ${activeGoals.length} active business goals are being tracked.`;

    const subscriberUpdate = `Total active subscribers: ${subscriberCount}.`;

    const revenueUpdate = orderStats?.count
      ? `${orderStats.count} completed order(s) in the last 24 hours. Total revenue: ${revenueStr}.`
      : "No completed orders in the last 24 hours.";

    const goalProgress = activeGoals.length > 0
      ? activeGoals.map(g => {
          const pct = g.targetValue > 0 ? Math.round((g.currentValue / g.targetValue) * 100) : 0;
          return `${g.title}: ${g.currentValue}/${g.targetValue} ${g.unit} (${pct}%)`;
        }).join("\n")
      : "No active goals set.";

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

    const dataSnapshot = JSON.stringify({
      date: today.toISOString(),
      subscribers: subscriberCount,
      orders24h: orderStats?.count || 0,
      revenue24h: orderStats?.total || 0,
      publishedPosts: blogCount?.count || 0,
      totalBooks: bookCount?.count || 0,
      totalUsers: userCount?.count || 0,
      activeGoals: activeGoals.length,
    });

    // 4. Save briefing
    const [result] = await db.insert(dailyBriefings).values({
      briefingDate: today,
      executiveSummary,
      subscriberUpdate,
      revenueUpdate,
      contentUpdate: `${blogCount?.count || 0} published blog posts, ${bookCount?.count || 0} books in catalog.`,
      goalProgress,
      actionItems,
      alerts,
      dataSnapshot,
    }).returning();

    console.log(`[DailyBriefing] Briefing #${result.id} generated successfully.`);

    // 5. Send email to admin
    const adminEmail = "info@reeseastor.com";
    const actionItemsList = JSON.parse(actionItems);
    const alertsList = JSON.parse(alerts);

    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #e8e0d4; padding: 40px;">
        <div style="text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #d4af37; font-size: 24px; margin: 0;">Daily Executive Briefing</h1>
          <p style="color: #a0937d; margin: 5px 0 0 0;">${dateStr}</p>
        </div>
        <div style="margin-bottom: 25px;">
          <h2 style="color: #d4af37; font-size: 18px; border-bottom: 1px solid #2a2a3a; padding-bottom: 8px;">Executive Summary</h2>
          <p style="line-height: 1.6; white-space: pre-line;">${executiveSummary}</p>
        </div>
        <div style="margin-bottom: 25px;">
          <h2 style="color: #d4af37; font-size: 18px; border-bottom: 1px solid #2a2a3a; padding-bottom: 8px;">Subscribers</h2>
          <p style="line-height: 1.6;">${subscriberUpdate}</p>
        </div>
        <div style="margin-bottom: 25px;">
          <h2 style="color: #d4af37; font-size: 18px; border-bottom: 1px solid #2a2a3a; padding-bottom: 8px;">Revenue</h2>
          <p style="line-height: 1.6;">${revenueUpdate}</p>
        </div>
        <div style="margin-bottom: 25px;">
          <h2 style="color: #d4af37; font-size: 18px; border-bottom: 1px solid #2a2a3a; padding-bottom: 8px;">Goal Progress</h2>
          <p style="line-height: 1.6; white-space: pre-line;">${goalProgress}</p>
        </div>
        ${actionItemsList.length > 0 ? `
        <div style="margin-bottom: 25px;">
          <h2 style="color: #d4af37; font-size: 18px; border-bottom: 1px solid #2a2a3a; padding-bottom: 8px;">Action Items</h2>
          <ul style="padding-left: 20px;">
            ${actionItemsList.map((item: string) => `<li style="margin-bottom: 8px; line-height: 1.4;">${item}</li>`).join("")}
          </ul>
        </div>` : ""}
        ${alertsList.length > 0 ? `
        <div style="margin-bottom: 25px; background: rgba(212, 175, 55, 0.1); border: 1px solid #d4af37; border-radius: 8px; padding: 15px;">
          <h2 style="color: #d4af37; font-size: 18px; margin-top: 0;">Alerts</h2>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            ${alertsList.map((alert: string) => `<li style="margin-bottom: 8px; line-height: 1.4;">${alert}</li>`).join("")}
          </ul>
        </div>` : ""}
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #2a2a3a;">
          <p style="color: #a0937d; font-size: 12px;">Reese Astor Business Command Center</p>
        </div>
      </div>
    `;

    const emailSent = await sendEmail({
      to: adminEmail,
      subject: `Daily Briefing - ${today.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
      html,
    });

    if (emailSent) {
      await db.update(dailyBriefings).set({ emailSent: true, emailSentAt: new Date() }).where(eq(dailyBriefings.id, result.id));
      console.log(`[DailyBriefing] Email sent to ${adminEmail}`);
    }

    return { success: true, briefingId: result.id };
  } catch (error) {
    console.error("[DailyBriefing] Error:", error);
    return { success: false, error: String(error) };
  }
}
