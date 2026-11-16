import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { stripe, STRIPE_WEBHOOK_SECRET } from "../_core/stripe";
import { getDb } from "../db";
import { products, orders, subscriptions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const stripeRouter = router({
  // Get all products
  getProducts: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return await db.select().from(products).where(eq(products.active, true));
  }),

  // Get single product
  getProduct: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const [product] = await db.select().from(products).where(eq(products.id, input.id));
      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found" });
      }
      return product;
    }),

  // Create checkout session
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        productId: z.number(),
        successUrl: z.string(),
        cancelUrl: z.string(),
        customerEmail: z.string().email().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const [product] = await db.select().from(products).where(eq(products.id, input.productId));
      
      if (!product || !product.active) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Product not found or inactive" });
      }

      if (!product.stripePriceId) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Product not configured for Stripe" });
      }

      const sessionConfig: any = {
        mode: product.type === "subscription" ? "subscription" : "payment",
        line_items: [
          {
            price: product.stripePriceId,
            quantity: 1,
          },
        ],
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: {
          productId: product.id.toString(),
          userId: ctx.user?.id?.toString() || "",
        },
      };

      if (input.customerEmail) {
        sessionConfig.customer_email = input.customerEmail;
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      // Create pending order
      await db.insert(orders).values({
        userId: ctx.user?.id,
        productId: product.id,
        stripeSessionId: session.id,
        amount: product.price,
        currency: product.currency,
        status: "pending",
        customerEmail: input.customerEmail,
      });

      return { sessionId: session.id, url: session.url };
    }),

  // Get user orders
  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return await db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id));
  }),

  // Get user orders with product details and download URLs
  getMyOrdersWithProducts: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const rows = await db
      .select({
        orderId: orders.id,
        amount: orders.amount,
        currency: orders.currency,
        status: orders.status,
        createdAt: orders.createdAt,
        customerEmail: orders.customerEmail,
        productName: products.name,
        productDescription: products.description,
        downloadUrl: products.downloadUrl,
        productId: products.id,
      })
      .from(orders)
      .innerJoin(products, eq(orders.productId, products.id))
      .where(eq(orders.userId, ctx.user.id));
    return rows;
  }),

  // Get user subscriptions
  getMySubscriptions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id));
  }),

  // Cancel subscription
  cancelSubscription: protectedProcedure
    .input(z.object({ subscriptionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.id, input.subscriptionId));

      if (!subscription || subscription.userId !== ctx.user.id) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Subscription not found" });
      }

      // Cancel at period end in Stripe
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Update in database
      await db
        .update(subscriptions)
        .set({ cancelAtPeriodEnd: true })
        .where(eq(subscriptions.id, input.subscriptionId));

      return { success: true };
    }),

  // Create customer portal session
  createPortalSession: protectedProcedure
    .input(z.object({ returnUrl: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      
      // Get user's Stripe customer ID from their subscriptions
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .limit(1);

      if (!subscription) {
        throw new TRPCError({ code: "NOT_FOUND", message: "No active subscription found" });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: input.returnUrl,
      });

      return { url: session.url };
    }),
});
