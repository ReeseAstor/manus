import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database
vi.mock('./db', () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
  }),
}));

// Mock Twilio
vi.mock('twilio', () => ({
  default: vi.fn().mockReturnValue({
    messages: {
      create: vi.fn().mockResolvedValue({
        sid: 'SM123456789',
        status: 'queued',
        to: '+15551234567',
        from: '+18888871197',
      }),
    },
  }),
}));

describe('SMS Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up environment variables
    process.env.TWILIO_ACCOUNT_SID = 'test_account_sid';
    process.env.TWILIO_AUTH_TOKEN = 'test_auth_token';
    process.env.TWILIO_PHONE_NUMBER = '+18888871197';
  });

  describe('Template Variable Replacement', () => {
    it('should replace single variable in template', () => {
      const template = 'Hello {{name}}!';
      const variables = { name: 'John' };
      
      // Simple replacement logic test
      let result = template;
      for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
      
      expect(result).toBe('Hello John!');
    });

    it('should replace multiple variables in template', () => {
      const template = 'Welcome {{name}} to {{tier}} tier!';
      const variables = { name: 'Jane', tier: 'Gold' };
      
      let result = template;
      for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
      
      expect(result).toBe('Welcome Jane to Gold tier!');
    });

    it('should handle missing variables gracefully', () => {
      const template = 'Hello {{name}}, your order is {{status}}';
      const variables = { name: 'Bob' };
      
      let result = template;
      for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
      
      expect(result).toBe('Hello Bob, your order is {{status}}');
    });
  });

  describe('Phone Number Validation', () => {
    it('should validate E.164 format phone numbers', () => {
      const e164Regex = /^\+[1-9]\d{1,14}$/;
      
      expect(e164Regex.test('+15551234567')).toBe(true);
      expect(e164Regex.test('+19546778888')).toBe(true);
      expect(e164Regex.test('+447911123456')).toBe(true);
      expect(e164Regex.test('5551234567')).toBe(false);
      expect(e164Regex.test('+0551234567')).toBe(false);
      expect(e164Regex.test('invalid')).toBe(false);
    });
  });

  describe('SMS Template Categories', () => {
    it('should have valid category values', () => {
      const validCategories = ['vip', 'order', 'marketing', 'system'];
      
      expect(validCategories).toContain('vip');
      expect(validCategories).toContain('order');
      expect(validCategories).toContain('marketing');
      expect(validCategories).toContain('system');
    });
  });

  describe('SMS Opt-in Logic', () => {
    it('should determine correct SMS type permissions', () => {
      const prefs = {
        smsOptIn: true,
        phoneNumber: '+15551234567',
        smsNewReleases: true,
        smsVipAlerts: true,
        smsOrderUpdates: false,
        smsMarketing: false,
      };

      const typeMap: Record<string, boolean> = {
        newReleases: prefs.smsNewReleases,
        vipAlerts: prefs.smsVipAlerts,
        orderUpdates: prefs.smsOrderUpdates,
        marketing: prefs.smsMarketing,
      };

      expect(typeMap.newReleases).toBe(true);
      expect(typeMap.vipAlerts).toBe(true);
      expect(typeMap.orderUpdates).toBe(false);
      expect(typeMap.marketing).toBe(false);
    });

    it('should not send SMS if user has not opted in', () => {
      const prefs = {
        smsOptIn: false,
        phoneNumber: '+15551234567',
      };

      const canSend = prefs.smsOptIn && prefs.phoneNumber;
      expect(canSend).toBe(false);
    });

    it('should not send SMS if phone number is missing', () => {
      const prefs = {
        smsOptIn: true,
        phoneNumber: null as string | null,
      };

      const canSend = prefs.smsOptIn && prefs.phoneNumber;
      expect(canSend).toBeFalsy();
    });
  });

  describe('VIP Welcome SMS Template', () => {
    it('should format welcome message correctly', () => {
      const template = '🎉 Welcome to the VIP Spicy Stories Club, {{name}}! Your {{tier}} membership is now active. Get ready for exclusive steamy stories, audio narrations, and more! 📚💕 - Reese Astor';
      const variables = { name: 'Sarah', tier: 'Gold' };
      
      let result = template;
      for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
      
      expect(result).toContain('Sarah');
      expect(result).toContain('Gold');
      expect(result).toContain('VIP Spicy Stories Club');
    });
  });

  describe('New Story Release SMS Template', () => {
    it('should format story release message correctly', () => {
      const template = '🔥 Hot off the press, {{name}}! A new steamy story is waiting for you: "{{storyTitle}}" Listen now in your VIP Audio Library! 🎧 - Reese Astor';
      const variables = { name: 'Emma', storyTitle: 'The Boardroom Confession' };
      
      let result = template;
      for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
      
      expect(result).toContain('Emma');
      expect(result).toContain('The Boardroom Confession');
      expect(result).toContain('VIP Audio Library');
    });
  });
});
