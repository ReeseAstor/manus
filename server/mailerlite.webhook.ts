import express from 'express';
import crypto from 'crypto';
import { getDb } from './db';
import { mailerLiteWebhookEvents, newsletterSubscribers } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from './email-service';
import { ENV } from './_core/env';

const router = express.Router();

/**
 * Send email alert for failed webhook processing
 */
async function sendWebhookErrorAlert(eventType: string, error: unknown, payload: any) {
  try {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    const emailBody = `
      <h2>Webhook Processing Failed</h2>
      <p>A MailerLite webhook event failed to process.</p>
      
      <h3>Event Details:</h3>
      <ul>
        <li><strong>Event Type:</strong> ${eventType}</li>
        <li><strong>Subscriber Email:</strong> ${payload.data?.subscriber?.email || 'N/A'}</li>
        <li><strong>Subscriber ID:</strong> ${payload.data?.subscriber?.id || 'N/A'}</li>
        <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
      </ul>
      
      <h3>Error Message:</h3>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${errorMessage}</pre>
      
      ${errorStack ? `
        <h3>Stack Trace:</h3>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">${errorStack}</pre>
      ` : ''}
      
      <h3>Full Payload:</h3>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px; max-height: 300px; overflow-y: auto;">${JSON.stringify(payload, null, 2)}</pre>
      
      <hr>
      <p style="color: #666; font-size: 12px;">This is an automated alert from your Reese Astor website webhook monitoring system.</p>
    `;
    
    // Send email to site owner
    const ownerEmail = process.env.OWNER_NAME;
    if (ownerEmail) {
      await sendEmail({
        to: ownerEmail,
        subject: `⚠️ Webhook Processing Failed: ${eventType}`,
        html: emailBody,
      });
      
      console.log('[MailerLite Webhook] Error alert email sent to:', ownerEmail);
    } else {
      console.warn('[MailerLite Webhook] No owner email configured for error alerts');
    }
  } catch (emailError) {
    console.error('[MailerLite Webhook] Failed to send error alert email:', emailError);
  }
}

/**
 * MailerLite Webhook Endpoint
 * Receives real-time notifications about subscriber events
 * 
 * Webhook URL: https://your-domain.com/api/mailerlite/webhook
 */
router.post('/webhook', express.json(), async (req, res) => {
  try {
    const payload = req.body;
    const signature = req.headers['signature'] as string;
    
    console.log('[MailerLite Webhook] Received event:', payload.type);
    
    // Verify webhook signature for security
    if (process.env.MAILERLITE_WEBHOOK_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', process.env.MAILERLITE_WEBHOOK_SECRET)
        .update(JSON.stringify(payload))
        .digest('hex');
      
      if (signature !== expectedSignature) {
        console.error('[MailerLite Webhook] Invalid signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
      
      console.log('[MailerLite Webhook] Signature verified');
    } else {
      console.warn('[MailerLite Webhook] No webhook secret configured - signature verification skipped');
    }
    
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
    }).returning();

    // Process the event based on type
    switch (payload.type) {
      case 'subscriber.created':
        await handleSubscriberCreated(payload, webhookEvent.id);
        break;
      
      case 'subscriber.updated':
        await handleSubscriberUpdated(payload, webhookEvent.id);
        break;
      
      case 'subscriber.unsubscribed':
        await handleSubscriberUnsubscribed(payload, webhookEvent.id);
        break;
      
      case 'subscriber.added_to_group':
        await handleSubscriberAddedToGroup(payload, webhookEvent.id);
        break;
      
      case 'subscriber.removed_from_group':
        await handleSubscriberRemovedFromGroup(payload, webhookEvent.id);
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
    
    // Send email alert for failed webhook processing
    await sendWebhookErrorAlert('subscriber.created', error, payload);
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
    
    await sendWebhookErrorAlert('subscriber.updated', error, payload);
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
    
    await sendWebhookErrorAlert('subscriber.unsubscribed', error, payload);
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
    
    await sendWebhookErrorAlert('subscriber.added_to_group', error, payload);
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
    
    await sendWebhookErrorAlert('subscriber.removed_from_group', error, payload);
  }
}

export default router;
