import express from 'express';
import { getDb } from './db';
import { mailerLiteWebhookEvents, newsletterSubscribers } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

/**
 * MailerLite Webhook Endpoint
 * Receives real-time notifications about subscriber events
 * 
 * Webhook URL: https://your-domain.com/api/mailerlite/webhook
 */
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const payload = req.body;
    
    console.log('[MailerLite Webhook] Received event:', payload.type);
    
    const db = await getDb();
    if (!db) {
      console.error('[MailerLite Webhook] Database not available');
      return res.status(500).json({ error: 'Database not available' });
    }
    
    // Log the webhook event to database
    const [webhookEvent] = await db.insert(mailerLiteWebhookEvents).values({
      eventType: payload.type,
      subscriberId: payload.data?.subscriber?.id?.toString(),
      subscriberEmail: payload.data?.subscriber?.email,
      groupId: payload.data?.group?.id?.toString(),
      groupName: payload.data?.group?.name,
      payload: JSON.stringify(payload),
      processed: false,
    });

    // Process the event based on type
    switch (payload.type) {
      case 'subscriber.created':
        await handleSubscriberCreated(payload, webhookEvent.insertId);
        break;
      
      case 'subscriber.updated':
        await handleSubscriberUpdated(payload, webhookEvent.insertId);
        break;
      
      case 'subscriber.unsubscribed':
        await handleSubscriberUnsubscribed(payload, webhookEvent.insertId);
        break;
      
      case 'subscriber.added_to_group':
        await handleSubscriberAddedToGroup(payload, webhookEvent.insertId);
        break;
      
      case 'subscriber.removed_from_group':
        await handleSubscriberRemovedFromGroup(payload, webhookEvent.insertId);
        break;
      
      default:
        console.log('[MailerLite Webhook] Unhandled event type:', payload.type);
    }

    // Respond with 200 OK to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[MailerLite Webhook] Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Handle subscriber.created event
 * Creates or updates subscriber in local database
 */
async function handleSubscriberCreated(payload: any, eventId: number) {
  try {
    const db = await getDb();
    if (!db) return;
    
    const subscriber = payload.data.subscriber;
    
    // Check if subscriber already exists
    const existing = await db.select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, subscriber.email))
      .limit(1);
    
    if (existing.length > 0) {
      // Update existing subscriber
      await db.update(newsletterSubscribers)
        .set({
          name: subscriber.fields?.name || subscriber.name,
          status: 'active',
          mailerLiteId: subscriber.id.toString(),
        })
        .where(eq(newsletterSubscribers.email, subscriber.email));
    } else {
      // Create new subscriber
      await db.insert(newsletterSubscribers).values({
        email: subscriber.email,
        name: subscriber.fields?.name || subscriber.name,
        status: 'active',
        source: 'mailerlite',
        mailerLiteId: subscriber.id.toString(),
      });
    }
    
    // Mark event as processed
    await db.update(mailerLiteWebhookEvents)
      .set({ 
        processed: true, 
        processedAt: new Date() 
      })
      .where(eq(mailerLiteWebhookEvents.id, eventId));
    
    console.log('[MailerLite Webhook] Subscriber created:', subscriber.email);
  } catch (error) {
    console.error('[MailerLite Webhook] Error handling subscriber.created:', error);
    
    // Log error to database
    const db = await getDb();
    if (!db) return;
    await db.update(mailerLiteWebhookEvents)
      .set({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
      .where(eq(mailerLiteWebhookEvents.id, eventId));
  }
}

/**
 * Handle subscriber.updated event
 * Updates subscriber information in local database
 */
async function handleSubscriberUpdated(payload: any, eventId: number) {
  try {
    const db = await getDb();
    if (!db) return;
    
    const subscriber = payload.data.subscriber;
    
    await db.update(newsletterSubscribers)
      .set({
        name: subscriber.fields?.name || subscriber.name,
        mailerLiteId: subscriber.id.toString(),
      })
      .where(eq(newsletterSubscribers.email, subscriber.email));
    
    // Mark event as processed
    await db.update(mailerLiteWebhookEvents)
      .set({ 
        processed: true, 
        processedAt: new Date() 
      })
      .where(eq(mailerLiteWebhookEvents.id, eventId));
    
    console.log('[MailerLite Webhook] Subscriber updated:', subscriber.email);
  } catch (error) {
    console.error('[MailerLite Webhook] Error handling subscriber.updated:', error);
    
    const db = await getDb();
    if (!db) return;
    await db.update(mailerLiteWebhookEvents)
      .set({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
      .where(eq(mailerLiteWebhookEvents.id, eventId));
  }
}

/**
 * Handle subscriber.unsubscribed event
 * Marks subscriber as unsubscribed in local database
 */
async function handleSubscriberUnsubscribed(payload: any, eventId: number) {
  try {
    const db = await getDb();
    if (!db) return;
    
    const subscriber = payload.data.subscriber;
    
    await db.update(newsletterSubscribers)
      .set({
        status: 'unsubscribed',
        unsubscribedAt: new Date(),
      })
      .where(eq(newsletterSubscribers.email, subscriber.email));
    
    // Mark event as processed
    await db.update(mailerLiteWebhookEvents)
      .set({ 
        processed: true, 
        processedAt: new Date() 
      })
      .where(eq(mailerLiteWebhookEvents.id, eventId));
    
    console.log('[MailerLite Webhook] Subscriber unsubscribed:', subscriber.email);
  } catch (error) {
    console.error('[MailerLite Webhook] Error handling subscriber.unsubscribed:', error);
    
    const db = await getDb();
    if (!db) return;
    await db.update(mailerLiteWebhookEvents)
      .set({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
      .where(eq(mailerLiteWebhookEvents.id, eventId));
  }
}

/**
 * Handle subscriber.added_to_group event
 * Logs group membership changes
 */
async function handleSubscriberAddedToGroup(payload: any, eventId: number) {
  try {
    const db = await getDb();
    if (!db) return;
    
    const subscriber = payload.data.subscriber;
    const group = payload.data.group;
    
    console.log('[MailerLite Webhook] Subscriber added to group:', subscriber.email, '→', group.name);
    
    // Mark event as processed
    await db.update(mailerLiteWebhookEvents)
      .set({ 
        processed: true, 
        processedAt: new Date() 
      })
      .where(eq(mailerLiteWebhookEvents.id, eventId));
  } catch (error) {
    console.error('[MailerLite Webhook] Error handling subscriber.added_to_group:', error);
    
    const db = await getDb();
    if (!db) return;
    await db.update(mailerLiteWebhookEvents)
      .set({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
      .where(eq(mailerLiteWebhookEvents.id, eventId));
  }
}

/**
 * Handle subscriber.removed_from_group event
 * Logs group membership changes
 */
async function handleSubscriberRemovedFromGroup(payload: any, eventId: number) {
  try {
    const db = await getDb();
    if (!db) return;
    
    const subscriber = payload.data.subscriber;
    const group = payload.data.group;
    
    console.log('[MailerLite Webhook] Subscriber removed from group:', subscriber.email, '→', group.name);
    
    // Mark event as processed
    await db.update(mailerLiteWebhookEvents)
      .set({ 
        processed: true, 
        processedAt: new Date() 
      })
      .where(eq(mailerLiteWebhookEvents.id, eventId));
  } catch (error) {
    console.error('[MailerLite Webhook] Error handling subscriber.removed_from_group:', error);
    
    const db = await getDb();
    if (!db) return;
    await db.update(mailerLiteWebhookEvents)
      .set({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      })
      .where(eq(mailerLiteWebhookEvents.id, eventId));
  }
}

export default router;
