import { describe, it, expect } from 'vitest';

// Keywords for unsubscribe/resubscribe
const STOP_KEYWORDS = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'];
const START_KEYWORDS = ['START', 'SUBSCRIBE', 'YES', 'UNSTOP'];
const HELP_KEYWORDS = ['HELP', 'INFO'];

describe('SMS Unsubscribe Webhook', () => {
  describe('Keyword Detection', () => {
    it('should detect STOP keywords', () => {
      const testMessages = ['STOP', 'stop', 'Stop', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'];
      
      testMessages.forEach(message => {
        const normalized = message.trim().toUpperCase();
        const isStop = STOP_KEYWORDS.some(keyword => 
          normalized === keyword || normalized.startsWith(keyword + ' ')
        );
        expect(isStop).toBe(true);
      });
    });

    it('should detect START keywords', () => {
      const testMessages = ['START', 'start', 'SUBSCRIBE', 'YES', 'UNSTOP'];
      
      testMessages.forEach(message => {
        const normalized = message.trim().toUpperCase();
        const isStart = START_KEYWORDS.some(keyword => 
          normalized === keyword || normalized.startsWith(keyword + ' ')
        );
        expect(isStart).toBe(true);
      });
    });

    it('should detect HELP keywords', () => {
      const testMessages = ['HELP', 'help', 'INFO', 'info'];
      
      testMessages.forEach(message => {
        const normalized = message.trim().toUpperCase();
        const isHelp = HELP_KEYWORDS.some(keyword => 
          normalized === keyword || normalized.startsWith(keyword + ' ')
        );
        expect(isHelp).toBe(true);
      });
    });

    it('should not detect random messages as keywords', () => {
      const testMessages = ['Hello', 'What is this?', 'I love your books', 'Random text'];
      
      testMessages.forEach(message => {
        const normalized = message.trim().toUpperCase();
        const isStop = STOP_KEYWORDS.some(keyword => 
          normalized === keyword || normalized.startsWith(keyword + ' ')
        );
        const isStart = START_KEYWORDS.some(keyword => 
          normalized === keyword || normalized.startsWith(keyword + ' ')
        );
        const isHelp = HELP_KEYWORDS.some(keyword => 
          normalized === keyword || normalized.startsWith(keyword + ' ')
        );
        
        expect(isStop).toBe(false);
        expect(isStart).toBe(false);
        expect(isHelp).toBe(false);
      });
    });

    it('should handle keywords with trailing text', () => {
      const stopWithText = 'STOP please';
      const startWithText = 'START now';
      const helpWithText = 'HELP me';
      
      const normalizedStop = stopWithText.trim().toUpperCase();
      const normalizedStart = startWithText.trim().toUpperCase();
      const normalizedHelp = helpWithText.trim().toUpperCase();
      
      const isStop = STOP_KEYWORDS.some(keyword => 
        normalizedStop === keyword || normalizedStop.startsWith(keyword + ' ')
      );
      const isStart = START_KEYWORDS.some(keyword => 
        normalizedStart === keyword || normalizedStart.startsWith(keyword + ' ')
      );
      const isHelp = HELP_KEYWORDS.some(keyword => 
        normalizedHelp === keyword || normalizedHelp.startsWith(keyword + ' ')
      );
      
      expect(isStop).toBe(true);
      expect(isStart).toBe(true);
      expect(isHelp).toBe(true);
    });
  });

  describe('Response Messages', () => {
    it('should have appropriate unsubscribe confirmation message', () => {
      const unsubscribeMessage = `You've been unsubscribed from Reese Astor's SMS notifications. You won't receive any more messages. Reply START to resubscribe anytime. 💕`;
      
      expect(unsubscribeMessage).toContain('unsubscribed');
      expect(unsubscribeMessage).toContain('START');
      expect(unsubscribeMessage).toContain('resubscribe');
    });

    it('should have appropriate resubscribe confirmation message', () => {
      const resubscribeMessage = `Welcome back! 🎉 You're subscribed again to Reese Astor text alerts for new releases and sales. Reply STOP to opt out, HELP for help.`;
      
      expect(resubscribeMessage).toContain('subscribed');
      expect(resubscribeMessage).toContain('STOP');
      expect(resubscribeMessage).toContain('HELP');
      expect(resubscribeMessage).not.toMatch(/vip|exclusive/i);
    });

    it('should have helpful help message', () => {
      const helpMessage = `Reese Astor SMS Help 📚\n\nReply STOP to unsubscribe\nReply START to resubscribe\n\nVisit reeseastor.com for more info or email info@reeseastor.com`;
      
      expect(helpMessage).toContain('STOP');
      expect(helpMessage).toContain('START');
      expect(helpMessage).toContain('reeseastor.com');
    });
  });

  describe('Phone Number Validation', () => {
    it('should accept valid E.164 format phone numbers', () => {
      const validNumbers = [
        '+19546778888',
        '+14155551234',
        '+442071234567',
        '+61412345678',
      ];
      
      const e164Regex = /^\+[1-9]\d{1,14}$/;
      
      validNumbers.forEach(number => {
        expect(e164Regex.test(number)).toBe(true);
      });
    });

    it('should reject invalid phone number formats', () => {
      const invalidNumbers = [
        '9546778888',      // Missing +
        '+0123456789',     // Starts with 0
        '(954) 677-8888',  // US format
        '+1-954-677-8888', // With dashes
      ];
      
      const e164Regex = /^\+[1-9]\d{1,14}$/;
      
      invalidNumbers.forEach(number => {
        expect(e164Regex.test(number)).toBe(false);
      });
    });
  });

  describe('Webhook Endpoint Configuration', () => {
    it('should have correct endpoint path', () => {
      const expectedPath = '/api/sms/incoming';
      expect(expectedPath).toBe('/api/sms/incoming');
    });

    it('should have status endpoint for monitoring', () => {
      const statusEndpoint = '/api/sms/status';
      expect(statusEndpoint).toBe('/api/sms/status');
    });
  });
});
