/**
 * Stripe Webhook Handler
 * 
 * Handles Stripe webhook events, particularly checkout.session.completed
 * to record purchases and send confirmation emails
 */

import type { Request, Response } from "express";
import Stripe from "stripe";
import { recordPurchase } from "./db";
import {
  sendPurchaseConfirmationEmail,
  generateDownloadLinks,
} from "./email-service";
import { upsertUserSmsPreferences, sendVipWelcomeSms } from "./sms";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("No Stripe signature found");
    return res.status(400).send("No signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    // Extract purchase details from session metadata
    const userId = session.metadata?.userId;
    const productId = session.metadata?.productId;
    const bookId = session.metadata?.bookId;
    const bookTitle = session.metadata?.bookTitle;
    const bookCover = session.metadata?.bookCover;
    
    // VIP subscription metadata
    const tierId = session.metadata?.tierId;
    const tierSlug = session.metadata?.tierSlug;
    const smsOptIn = session.metadata?.smsOptIn === "true";
    const phoneNumber = session.metadata?.phoneNumber;

    // Handle VIP subscription SMS opt-in
    if (userId && smsOptIn && phoneNumber && tierSlug) {
      try {
        // Save SMS preferences
        await upsertUserSmsPreferences(parseInt(userId), {
          phoneNumber,
          smsOptIn: true,
          smsVipAlerts: true,
          smsNewReleases: true,
        });
        
        // Send welcome SMS
        const customerName = session.customer_details?.name || "VIP Member";
        const tierName = tierSlug.charAt(0).toUpperCase() + tierSlug.slice(1);
        await sendVipWelcomeSms(parseInt(userId), customerName, tierName);
        
        console.log(`[Webhook] SMS opt-in processed for user ${userId}`);
      } catch (smsError) {
        console.error("[Webhook] Error processing SMS opt-in:", smsError);
      }
    }

    // Skip book purchase processing if this is a VIP subscription
    if (tierId && !productId) {
      console.log(`[Webhook] VIP subscription processed for tier ${tierSlug}`);
      return;
    }

    if (!userId || !productId) {
      console.error("Missing required metadata in checkout session");
      return;
    }

    // Record purchase in database
    const purchase = await recordPurchase({
      userId: parseInt(userId),
      productId: parseInt(productId),
      stripeSessionId: session.id,
      amount: session.amount_total! / 100, // Convert from cents
      currency: session.currency || "usd",
    });

    console.log("Purchase recorded:", purchase);

    // Send confirmation email if we have customer email
    if (session.customer_email && bookId && bookTitle) {
      const downloadLinks = generateDownloadLinks(parseInt(bookId));

      const emailSent = await sendPurchaseConfirmationEmail({
        customerName: session.customer_details?.name || "Reader",
        customerEmail: session.customer_email,
        orderNumber: purchase.id.toString(),
        purchaseDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        bookTitle: bookTitle,
        bookCover: bookCover || "/covers/default.jpg",
        purchasePrice: `$${(session.amount_total! / 100).toFixed(2)}`,
        downloadLinks,
      });

      if (emailSent) {
        console.log("Purchase confirmation email sent to:", session.customer_email);
      } else {
        console.error("Failed to send purchase confirmation email");
      }
    }
  } catch (error) {
    console.error("Error handling checkout completion:", error);
  }
}
