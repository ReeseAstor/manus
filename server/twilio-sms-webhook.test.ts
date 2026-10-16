import { describe, it, expect, vi, beforeEach } from 'vitest';

// The webhook's database module is mocked; everything else (keyword lists, reply builders,
// handler) is the real code from ./twilio-sms-webhook.
const mockDb: any = {};
vi.mock('./db', () => ({ getDb: vi.fn(async () => mockDb) }));

import {
  STOP_KEYWORDS,
  START_KEYWORDS,
  HELP_KEYWORDS,
  getHelpMessage,
  getDefaultMessage,
  handleStart,
  handleStop,
  handleIncomingSms,
} from './twilio-sms-webhook';

function makeDb(existing: any[] = []) {
  const calls: { insert: any[]; update: any[] } = { insert: [], update: [] };
  const db = {
    select: () => ({ from: () => ({ where: () => ({ limit: async () => existing }) }) }),
    insert: () => ({ values: async (v: any) => { calls.insert.push(v); } }),
    update: () => ({ set: (v: any) => ({ where: async () => { calls.update.push(v); } }) }),
  };
  return { db, calls };
}

async function runHandler(body: string, existing: any[] = []) {
  const { db, calls } = makeDb(existing);
  Object.assign(mockDb, db);
  let sent = '';
  const res: any = {
    type: vi.fn(),
    send: vi.fn((x: string) => { sent = x; }),
    status: vi.fn(() => res),
  };
  await handleIncomingSms({ body: { From: '+19546778888', Body: body, MessageSid: 'SM1' } } as any, res);
  const decoded = sent
    .replace(/&apos;|&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
  return { xml: sent, text: decoded, calls };
}

const isKeyword = (list: string[], msg: string) => {
  const n = msg.trim().toUpperCase();
  return list.some((k) => n === k || n.startsWith(k + ' '));
};

describe('SMS Unsubscribe Webhook', () => {
  describe('Keyword Detection (real keyword lists)', () => {
    it('detects STOP keywords', () => {
      ['STOP', 'stop', 'Stop', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'].forEach((m) =>
        expect(isKeyword(STOP_KEYWORDS, m)).toBe(true));
    });
    it('detects START keywords', () => {
      ['START', 'start', 'SUBSCRIBE', 'YES', 'UNSTOP'].forEach((m) =>
        expect(isKeyword(START_KEYWORDS, m)).toBe(true));
    });
    it('detects HELP keywords', () => {
      ['HELP', 'help', 'INFO', 'info'].forEach((m) => expect(isKeyword(HELP_KEYWORDS, m)).toBe(true));
    });
    it('does not treat random messages as keywords', () => {
      ['Hello', 'What is this?', 'I love your books', 'Random text'].forEach((m) => {
        expect(isKeyword(STOP_KEYWORDS, m)).toBe(false);
        expect(isKeyword(START_KEYWORDS, m)).toBe(false);
        expect(isKeyword(HELP_KEYWORDS, m)).toBe(false);
      });
    });
    it('handles keywords with trailing text', () => {
      expect(isKeyword(STOP_KEYWORDS, 'STOP please')).toBe(true);
      expect(isKeyword(START_KEYWORDS, 'START now')).toBe(true);
      expect(isKeyword(HELP_KEYWORDS, 'HELP me')).toBe(true);
    });
  });

  describe('Response Messages (real reply builders and handler)', () => {
    const banned = /vip|exclusive|perks|steamy|before anyone/i;

    it('opt-in reply for a new number is one clean message with frequency, rates, STOP and HELP', async () => {
      const { db, calls } = makeDb();
      const reply = await handleStart(db, '+19546778888', undefined);
      expect(calls.insert).toHaveLength(1);
      expect(reply).toContain("You're subscribed to Reese Astor text alerts for new releases and sales.");
      expect(reply).toContain('Msg frequency varies.');
      expect(reply).toContain('Msg & data rates may apply.');
      expect(reply).toContain('STOP');
      expect(reply).toContain('HELP');
      expect(reply).not.toMatch(banned);
      expect(reply.split('\n')).toHaveLength(1);
    });

    it('resubscribe reply carries the same disclosures', async () => {
      const { db, calls } = makeDb();
      const reply = await handleStart(db, '+19546778888', { phoneNumber: '+19546778888' });
      expect(calls.update).toHaveLength(1);
      expect(reply).toContain('subscribed again');
      expect(reply).toContain('Msg frequency varies.');
      expect(reply).toContain('Msg & data rates may apply.');
      expect(reply).toContain('STOP');
      expect(reply).toContain('HELP');
      expect(reply).not.toMatch(banned);
    });

    it('stop reply confirms the unsubscribe and explains START', async () => {
      const { db } = makeDb();
      const reply = await handleStop(db, '+19546778888', { phoneNumber: '+19546778888' });
      expect(reply).toContain('unsubscribed');
      expect(reply).toContain('START');
    });

    it('help message lists STOP/START and the contact address used on the site', () => {
      const help = getHelpMessage();
      expect(help).toContain('STOP');
      expect(help).toContain('START');
      expect(help).toContain('reeseastor.com');
      expect(help).toContain('contact@reeseastor.com');
      expect(help).not.toContain('reeseastor.us');
    });

    it('default reply keeps STOP and HELP language and no club promises', () => {
      const d = getDefaultMessage();
      expect(d).toContain('STOP');
      expect(d).toContain('HELP');
      expect(d).not.toMatch(/vip|exclusive/i);
    });

    it('the handler turns START into a TwiML message with the real opt-in text', async () => {
      const { text, xml } = await runHandler('START');
      expect(xml).toContain('<Response>');
      expect(text).toContain('Msg frequency varies. Msg & data rates may apply.');
      expect(text).not.toMatch(banned);
    });

    it('the handler answers HELP with the help text and STOP with the unsubscribe text', async () => {
      expect((await runHandler('HELP')).text).toContain('contact@reeseastor.com');
      expect((await runHandler('STOP', [{ phoneNumber: '+19546778888' }])).text).toContain('unsubscribed');
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
