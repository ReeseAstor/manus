import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { vipTiers, vipMembers, steamyStories, customStoryRequests, storyLikes, storyPlayHistory, users } from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import Stripe from "stripe";
import { ENV } from "../_core/env";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-11-17.clover",
});

export const vipRouter = router({
  // Get all VIP tiers
  getTiers: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    
    const tiers = await db
      .select()
      .from(vipTiers)
      .where(eq(vipTiers.active, true))
      .orderBy(vipTiers.displayOrder);
    return tiers;
  }),

  // Get user's VIP membership
  getMembership: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    
    const membership = await db
      .select({
        id: vipMembers.id,
        status: vipMembers.status,
        currentPeriodStart: vipMembers.currentPeriodStart,
        currentPeriodEnd: vipMembers.currentPeriodEnd,
        customStoriesUsed: vipMembers.customStoriesUsed,
        tier: {
          id: vipTiers.id,
          name: vipTiers.name,
          slug: vipTiers.slug,
          features: vipTiers.features,
          storiesPerMonth: vipTiers.storiesPerMonth,
          customStoriesAllowed: vipTiers.customStoriesAllowed,
          personalizedMessages: vipTiers.personalizedMessages,
        },
      })
      .from(vipMembers)
      .innerJoin(vipTiers, eq(vipMembers.tierId, vipTiers.id))
      .where(eq(vipMembers.userId, ctx.user.id))
      .limit(1);

    return membership[0] || null;
  }),

  // Get featured stories for preview
  getFeaturedStories: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const stories = await db
      .select({
        id: steamyStories.id,
        title: steamyStories.title,
        slug: steamyStories.slug,
        description: steamyStories.description,
        excerpt: steamyStories.excerpt,
        coverImage: steamyStories.coverImage,
        category: steamyStories.category,
        heatLevel: steamyStories.heatLevel,
        audioDuration: steamyStories.audioDuration,
        playCount: steamyStories.playCount,
        previewAudioUrl: steamyStories.previewAudioUrl,
      })
      .from(steamyStories)
      .where(and(eq(steamyStories.featured, true), eq(steamyStories.published, true)))
      .orderBy(desc(steamyStories.publishedAt))
      .limit(6);
    return stories;
  }),

  // Real listening stats for the member dashboard. Empty history is zero, not a placeholder.
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const membership = await db
      .select({
        status: vipMembers.status,
        joinedAt: vipMembers.joinedAt,
        currentPeriodEnd: vipMembers.currentPeriodEnd,
      })
      .from(vipMembers)
      .where(eq(vipMembers.userId, ctx.user.id))
      .limit(1);

    const likes = await db
      .select({
        id: steamyStories.id,
        title: steamyStories.title,
        category: steamyStories.category,
        excerpt: steamyStories.excerpt,
        heatLevel: steamyStories.heatLevel,
      })
      .from(storyLikes)
      .innerJoin(steamyStories, eq(storyLikes.storyId, steamyStories.id))
      .where(eq(storyLikes.userId, ctx.user.id))
      .orderBy(desc(storyLikes.createdAt));

    const history = await db
      .select({
        id: storyPlayHistory.id,
        title: steamyStories.title,
        heatLevel: steamyStories.heatLevel,
        progress: storyPlayHistory.progress,
        playedAt: storyPlayHistory.playedAt,
      })
      .from(storyPlayHistory)
      .innerJoin(steamyStories, eq(storyPlayHistory.storyId, steamyStories.id))
      .where(eq(storyPlayHistory.userId, ctx.user.id))
      .orderBy(desc(storyPlayHistory.playedAt))
      .limit(20);

    const totals = await db
      .select({
        seconds: sql<number>`COALESCE(SUM(${storyPlayHistory.progress}), 0)`,
        stories: sql<number>`COUNT(DISTINCT ${storyPlayHistory.storyId})`,
      })
      .from(storyPlayHistory)
      .where(eq(storyPlayHistory.userId, ctx.user.id));

    return {
      storiesPlayed: Number(totals[0]?.stories ?? 0),
      minutesPlayed: Math.floor(Number(totals[0]?.seconds ?? 0) / 60),
      favorites: likes,
      memberSince: membership[0]?.joinedAt ?? null,
      subscriptionStatus: membership[0]?.status ?? null,
      currentPeriodEnd: membership[0]?.currentPeriodEnd ?? null,
      history,
    };
  }),

  // Get welcome story for new members (doesn't require active membership yet)
  getWelcomeStory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    
    // Just return the first published story for welcome page
    // Don't check membership since webhook may not have processed yet
    const stories = await db
      .select()
      .from(steamyStories)
      .where(eq(steamyStories.published, true))
      .orderBy(desc(steamyStories.publishedAt))
      .limit(1);

    return stories[0] || null;
  }),

  // Get all stories for VIP members
  getStories: protectedProcedure
    .input(
      z.object({
        category: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Check membership
      const membership = await db
        .select()
        .from(vipMembers)
        .where(eq(vipMembers.userId, ctx.user.id))
        .limit(1);

      if (!membership[0] || membership[0].status !== "active") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "VIP membership required to access stories",
        });
      }

      const tier = await db
        .select()
        .from(vipTiers)
        .where(eq(vipTiers.id, membership[0].tierId))
        .limit(1);

      const tierLevel = tier[0]?.displayOrder || 1;

      const conditions = [
        eq(steamyStories.published, true),
        sql`${steamyStories.minTier} <= ${tierLevel}`
      ];

      if (input.category) {
        conditions.push(eq(steamyStories.category, input.category as any));
      }

      const stories = await db
        .select()
        .from(steamyStories)
        .where(and(...conditions))
        .orderBy(desc(steamyStories.publishedAt))
        .limit(input.limit)
        .offset(input.offset);

      return stories;
    }),

  // Get single story with full content
  getStory: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Check membership
      const membership = await db
        .select()
        .from(vipMembers)
        .where(eq(vipMembers.userId, ctx.user.id))
        .limit(1);

      if (!membership[0] || membership[0].status !== "active") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "VIP membership required",
        });
      }

      const story = await db
        .select()
        .from(steamyStories)
        .where(eq(steamyStories.slug, input.slug))
        .limit(1);

      if (!story[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Story not found",
        });
      }

      // Increment play count
      await db
        .update(steamyStories)
        .set({ playCount: sql`${steamyStories.playCount} + 1` })
        .where(eq(steamyStories.id, story[0].id));

      return story[0];
    }),

  // Subscribe to VIP tier
  subscribe: protectedProcedure
    .input(z.object({
      tierSlug: z.string(),
      smsOptIn: z.boolean().optional(),
      phoneNumber: z.string().optional(),
      /**
       * Checkout UI mode. "redirect" returns a hosted-Stripe checkoutUrl
       * (legacy default). "embedded" returns a client_secret the SPA
       * mounts inline via <EmbeddedCheckoutProvider>, keeping the user
       * on reeseastor.com.
       */
      mode: z.enum(["redirect", "embedded"]).default("redirect"),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const tier = await db
        .select()
        .from(vipTiers)
        .where(eq(vipTiers.slug, input.tierSlug))
        .limit(1);

      if (!tier[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tier not found",
        });
      }

      // Check if user already has a membership
      const existingMembership = await db
        .select()
        .from(vipMembers)
        .where(eq(vipMembers.userId, ctx.user.id))
        .limit(1);

      if (existingMembership[0]?.status === "active") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You already have an active VIP membership",
        });
      }

      // Get user email
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      // Create or get Stripe price
      let stripePriceId = tier[0].stripePriceId;
      
      if (!stripePriceId) {
        // Create product and price in Stripe
        const product = await stripe.products.create({
          name: `VIP ${tier[0].name} Membership`,
          description: tier[0].description,
        });

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: tier[0].price,
          currency: "usd",
          recurring: { interval: "month" },
        });

        stripePriceId = price.id;

        // Update tier with Stripe IDs
        await db
          .update(vipTiers)
          .set({
            stripeProductId: product.id,
            stripePriceId: price.id,
          })
          .where(eq(vipTiers.id, tier[0].id));
      }

      const baseSession = {
        mode: "subscription" as const,
        payment_method_types: ["card"] as Stripe.Checkout.SessionCreateParams["payment_method_types"],
        customer_email: user[0]?.email || undefined,
        line_items: [
          {
            price: stripePriceId,
            quantity: 1,
          },
        ],
        metadata: {
          userId: ctx.user.id.toString(),
          tierId: tier[0].id.toString(),
          tierSlug: tier[0].slug,
          smsOptIn: input.smsOptIn ? "true" : "false",
          phoneNumber: input.phoneNumber || "",
        },
      };

      if (input.mode === "embedded") {
        const session = await stripe.checkout.sessions.create({
          ...baseSession,
          ui_mode: "embedded",
          redirect_on_completion: "never",
        });

        if (!session.client_secret) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Stripe did not return a client_secret",
          });
        }

        return { mode: "embedded" as const, clientSecret: session.client_secret };
      }

      const session = await stripe.checkout.sessions.create({
        ...baseSession,
        success_url: `https://reeseastor.com/vip-club/welcome?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://reeseastor.com/vip-club`,
      });

      return { mode: "redirect" as const, checkoutUrl: session.url };
    }),

  // Like/unlike a story
  toggleLike: protectedProcedure
    .input(z.object({ storyId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const existingLike = await db
        .select()
        .from(storyLikes)
        .where(
          and(
            eq(storyLikes.userId, ctx.user.id),
            eq(storyLikes.storyId, input.storyId)
          )
        )
        .limit(1);

      if (existingLike[0]) {
        // Unlike
        await db
          .delete(storyLikes)
          .where(eq(storyLikes.id, existingLike[0].id));
        
        await db
          .update(steamyStories)
          .set({ likeCount: sql`${steamyStories.likeCount} - 1` })
          .where(eq(steamyStories.id, input.storyId));

        return { liked: false };
      } else {
        // Like
        await db.insert(storyLikes).values({
          userId: ctx.user.id,
          storyId: input.storyId,
        });

        await db
          .update(steamyStories)
          .set({ likeCount: sql`${steamyStories.likeCount} + 1` })
          .where(eq(steamyStories.id, input.storyId));

        return { liked: true };
      }
    }),

  // Track play progress
  updatePlayProgress: protectedProcedure
    .input(
      z.object({
        storyId: z.number().int(),
        progress: z.number().int().min(0).max(6 * 60 * 60),
        completed: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // One row per member and story. Progress is the furthest position, so a
      // later SUM does not add every checkpoint together.
      await db
        .insert(storyPlayHistory)
        .values({
          userId: ctx.user.id,
          storyId: input.storyId,
          progress: input.progress,
          completed: input.completed,
        })
        .onConflictDoUpdate({
          target: [storyPlayHistory.userId, storyPlayHistory.storyId],
          set: {
            progress: sql`GREATEST(COALESCE(${storyPlayHistory.progress}, 0), ${input.progress})`,
            playedAt: new Date(),
            completed: sql`${storyPlayHistory.completed} OR ${input.completed}`,
          },
        });

      return { success: true };
    }),

  // Request custom story (Gold tier only)
  requestCustomStory: protectedProcedure
    .input(
      z.object({
        prompt: z.string().min(20, "Please provide more details about your story"),
        characters: z.string().optional(),
        setting: z.string().optional(),
        heatLevel: z.number().min(1).max(5).default(4),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Check Gold membership
      const membership = await db
        .select({
          tier: vipTiers,
          member: vipMembers,
        })
        .from(vipMembers)
        .innerJoin(vipTiers, eq(vipMembers.tierId, vipTiers.id))
        .where(eq(vipMembers.userId, ctx.user.id))
        .limit(1);

      if (!membership[0] || membership[0].member.status !== "active") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "VIP membership required",
        });
      }

      if (!membership[0].tier.customStoriesAllowed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Custom stories are only available for Gold members",
        });
      }

      // Check monthly limit (2 per month for Gold)
      if ((membership[0].member.customStoriesUsed || 0) >= 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You've reached your monthly custom story limit",
        });
      }

      // Create request
      await db.insert(customStoryRequests).values({
        userId: ctx.user.id,
        prompt: input.prompt,
        characters: input.characters,
        setting: input.setting,
        heatLevel: input.heatLevel,
        status: "pending",
      });

      // Increment usage counter
      await db
        .update(vipMembers)
        .set({
          customStoriesUsed: sql`${vipMembers.customStoriesUsed} + 1`,
        })
        .where(eq(vipMembers.userId, ctx.user.id));

      return { success: true, message: "Your custom story request has been submitted!" };
    }),

  // Get user's custom story requests
  getMyCustomRequests: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    
    const requests = await db
      .select()
      .from(customStoryRequests)
      .where(eq(customStoryRequests.userId, ctx.user.id))
      .orderBy(desc(customStoryRequests.createdAt));

    return requests;
  }),
});
