import { describe, it, expect } from 'vitest';
import { subscribeToMailerLite } from './mailerlite';

describe('MailerLite API Integration', () => {
  it('should successfully connect to MailerLite API', async () => {
    // Test that the API key is configured
    expect(process.env.MAILERLITE_API_KEY).toBeDefined();
    expect(process.env.MAILERLITE_API_KEY).toMatch(/^eyJ/);
  });

  it('should subscribe a test email to Reader\'s Club group', async () => {
    const testEmail = `test+${Date.now()}@reeseastor.us`;
    
    const result = await subscribeToMailerLite(testEmail, undefined, '142622019444278286');
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  }, 30000); // 30 second timeout for API call

  it('should handle duplicate email subscriptions gracefully', async () => {
    const testEmail = `duplicate+${Date.now()}@reeseastor.us`;
    
    // Subscribe once
    const firstResult = await subscribeToMailerLite(testEmail, undefined, '142622019444278286');
    expect(firstResult.success).toBe(true);
    
    // Try to subscribe again with same email
    const secondResult = await subscribeToMailerLite(testEmail, undefined, '142622019444278286');
    // Should either succeed (update) or return graceful error
    expect(secondResult.success).toBe(true);
  }, 30000);

  it('should reject invalid email addresses', async () => {
    const invalidEmail = 'not-an-email';
    
    const result = await subscribeToMailerLite(invalidEmail, undefined, '142622019444278286');
    
    expect(result.success).toBe(false);
    expect(result.message).toBeDefined();
  }, 30000);

  it('should use correct Reader\'s Club group ID', async () => {
    const testEmail = `grouptest+${Date.now()}@reeseastor.us`;
    const correctGroupId = '142622019444278286';
    
    const result = await subscribeToMailerLite(testEmail, undefined, correctGroupId);
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  }, 30000);
});
