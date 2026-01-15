import { describe, it, expect } from 'vitest';
import crypto from 'crypto';

describe('MailerLite Webhook Signature Verification', () => {
  it('should have MAILERLITE_WEBHOOK_SECRET configured', () => {
    expect(process.env.MAILERLITE_WEBHOOK_SECRET).toBeDefined();
    expect(process.env.MAILERLITE_WEBHOOK_SECRET).not.toBe('');
  });

  it('should generate valid HMAC SHA256 signature', () => {
    const secret = process.env.MAILERLITE_WEBHOOK_SECRET!;
    const testPayload = {
      type: 'subscriber.created',
      data: {
        subscriber: {
          id: 123,
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    };

    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(testPayload))
      .digest('hex');

    // Signature should be a 64-character hex string
    expect(signature).toMatch(/^[a-f0-9]{64}$/);
    expect(signature.length).toBe(64);
  });

  it('should produce consistent signatures for same payload', () => {
    const secret = process.env.MAILERLITE_WEBHOOK_SECRET!;
    const testPayload = { test: 'data' };
    const payloadString = JSON.stringify(testPayload);

    const signature1 = crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');

    const signature2 = crypto
      .createHmac('sha256', secret)
      .update(payloadString)
      .digest('hex');

    expect(signature1).toBe(signature2);
  });

  it('should produce different signatures for different payloads', () => {
    const secret = process.env.MAILERLITE_WEBHOOK_SECRET!;
    
    const payload1 = { type: 'subscriber.created' };
    const payload2 = { type: 'subscriber.updated' };

    const signature1 = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload1))
      .digest('hex');

    const signature2 = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload2))
      .digest('hex');

    expect(signature1).not.toBe(signature2);
  });
});
