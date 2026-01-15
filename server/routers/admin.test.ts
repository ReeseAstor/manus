import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from '../db';
import { mailerLiteWebhookEvents } from '../../drizzle/schema';

describe('Admin Webhook Monitoring', () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
  });

  it('should have database connection available', () => {
    expect(db).toBeDefined();
    expect(db).not.toBeNull();
  });

  it('should have mailerlite_webhook_events table schema defined', () => {
    expect(mailerLiteWebhookEvents).toBeDefined();
    expect(mailerLiteWebhookEvents.eventType).toBeDefined();
    expect(mailerLiteWebhookEvents.subscriberEmail).toBeDefined();
    expect(mailerLiteWebhookEvents.subscriberId).toBeDefined();
    expect(mailerLiteWebhookEvents.processed).toBeDefined();
    expect(mailerLiteWebhookEvents.error).toBeDefined();
    expect(mailerLiteWebhookEvents.createdAt).toBeDefined();
  });

  it('should be able to query webhook events table', async () => {
    if (!db) {
      throw new Error('Database not available');
    }

    // Query should not throw an error even if table is empty
    const events = await db
      .select()
      .from(mailerLiteWebhookEvents)
      .limit(1);

    expect(Array.isArray(events)).toBe(true);
  });

  it('should have MAILERLITE_WEBHOOK_SECRET configured', () => {
    expect(process.env.MAILERLITE_WEBHOOK_SECRET).toBeDefined();
    expect(process.env.MAILERLITE_WEBHOOK_SECRET).not.toBe('');
  });

  it('should have OWNER_NAME configured for email alerts', () => {
    expect(process.env.OWNER_NAME).toBeDefined();
    expect(process.env.OWNER_NAME).not.toBe('');
  });
});
