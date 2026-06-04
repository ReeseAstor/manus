import "dotenv/config";
import express, { type Express } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { handleStripeWebhook } from "../stripe-webhook";
import mailerLiteWebhookRouter from "../mailerlite.webhook";
import twilioSmsWebhookRouter from "../twilio-sms-webhook";
import twilioVoiceWebhookRouter, {
  handleIncomingVoice,
  validateTwilioSignature as validateTwilioVoiceSignature,
} from "../twilio-voice-webhook";
import { authCallback } from "../api.auth.callback";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../auth";
import { getDb } from "../db";
import { blogPosts } from "../../drizzle/schema";

/**
 * Build the configured Express app. Does NOT call listen — that's the caller's
 * job (local dev does it in index.ts; Vercel Functions wraps the app directly).
 */
export function createApp(): Express {
  const app = express();

  // Trust Vercel's reverse proxy so req.protocol / req.get('host') reflect the
  // original public URL (https + reeseastor.com). Without this, Twilio's signature
  // validation fails (the reconstructed URL doesn't match the signed URL), and
  // every inbound webhook returns 403 -- which is exactly what was happening on
  // both SMS (/webhooks/twilio) and Voice. See Twilio error code 11200.
  app.set("trust proxy", true);

  // Stripe webhook MUST be registered BEFORE any body parser middleware
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleStripeWebhook);

  // Better Auth must also be mounted BEFORE express.json(): toNodeHandler reads
  // and parses the raw request body itself. The legacy Supabase callback
  // (GET /api/auth/callback) is registered first so it keeps handling that exact
  // path; Better Auth's own routes (e.g. /api/auth/callback/github,
  // /api/auth/sign-in/email) fall through to the catch-all below.
  app.get("/api/auth/callback", authCallback);
  app.all("/api/auth/*", toNodeHandler(auth));

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  app.use("/api/mailerlite", mailerLiteWebhookRouter);
  app.use("/api/sms", twilioSmsWebhookRouter);

  // Twilio Console has both Voice "A call comes in" and Messaging "A message
  // comes in" pointed at https://reeseastor.com/webhooks/twilio. Dispatch by
  // payload: voice POSTs carry CallSid, SMS POSTs carry MessageSid.
  app.post("/webhooks/twilio", (req, res, next) => {
    const isVoice = req.body?.CallSid && !req.body?.MessageSid;
    if (!isVoice) return next();
    validateTwilioVoiceSignature(req, res, () => handleIncomingVoice(req, res));
  });
  app.use("/webhooks/twilio", twilioVoiceWebhookRouter);
  app.use("/webhooks/twilio", twilioSmsWebhookRouter);

  registerOAuthRoutes(app);

  app.post("/api/cron/daily-briefing", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.JWT_SECRET;
    if (authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { runDailyBriefing } = await import("../cron/dailyBriefing");
      const result = await runDailyBriefing();
      res.json(result);
    } catch (error) {
      console.error("[Cron] Daily briefing error:", error);
      res.status(500).json({ error: String(error) });
    }
  });

  app.post("/api/cron/publish-scheduled", async (req, res) => {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.JWT_SECRET;
    if (authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const { publishScheduledPosts } = await import("../cron/blogPublisher");
      const result = await publishScheduledPosts();
      res.json(result);
    } catch (error) {
      console.error("[Cron] Blog publisher error:", error);
      res.status(500).json({ error: String(error) });
    }
  });

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const baseUrl = "https://www.reeseastor.com";
      const today = new Date().toISOString().split("T")[0];

      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "weekly" },
        { url: "/books", priority: "0.9", changefreq: "weekly" },
        { url: "/books/audit-of-the-heart", priority: "0.9", changefreq: "monthly" },
        { url: "/books/hostile-tender", priority: "0.9", changefreq: "monthly" },
        { url: "/books/the-billionaire-s-executive-assistant", priority: "0.8", changefreq: "monthly" },
        { url: "/books/the-billionaire-s-fake-wife", priority: "0.8", changefreq: "monthly" },
        { url: "/books/the-billionaire-s-baby-secret", priority: "0.8", changefreq: "monthly" },
        { url: "/books/the-billionaires-forbidden-nanny", priority: "0.8", changefreq: "monthly" },
        { url: "/free-book", priority: "0.8", changefreq: "monthly" },
        { url: "/about", priority: "0.7", changefreq: "monthly" },
        { url: "/blog", priority: "0.8", changefreq: "daily" },
        { url: "/contact", priority: "0.6", changefreq: "yearly" },
        { url: "/quiz", priority: "0.7", changefreq: "monthly" },
        { url: "/shop", priority: "0.7", changefreq: "weekly" },
        { url: "/newsletter", priority: "0.6", changefreq: "monthly" },
        { url: "/privacy", priority: "0.3", changefreq: "yearly" },
        { url: "/terms", priority: "0.3", changefreq: "yearly" },
      ];

      const database = await getDb();
      const blogPostRows = database ? await database.select({ slug: blogPosts.slug }).from(blogPosts) : [];
      const blogUrls = blogPostRows.map((row: { slug: string }) => ({
        url: `/blog/${row.slug}`,
        priority: "0.7",
        changefreq: "monthly",
      }));

      const allUrls = [...staticPages, ...blogUrls];
      const urlEntries = allUrls
        .map(
          page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
        )
        .join("");

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`;
      res.header("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error) {
      console.error("[Sitemap] Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  app.get("/robots.txt", (_req, res) => {
    const baseUrl = "https://www.reeseastor.com";
    res.header("Content-Type", "text/plain");
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /auth/

Sitemap: ${baseUrl}/sitemap.xml
`);
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  return app;
}
