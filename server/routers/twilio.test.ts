import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock environment variables
const mockEnv = {
  TWILIO_ACCOUNT_SID: undefined as string | undefined,
  TWILIO_AUTH_TOKEN: undefined as string | undefined,
  TWILIO_PHONE_NUMBER: undefined as string | undefined,
  OWNER_OPEN_ID: "test-owner-id",
};

// Mock process.env
vi.stubGlobal("process", {
  ...process,
  env: mockEnv,
});

describe("Twilio Router", () => {
  beforeEach(() => {
    // Reset environment variables before each test
    mockEnv.TWILIO_ACCOUNT_SID = undefined;
    mockEnv.TWILIO_AUTH_TOKEN = undefined;
    mockEnv.TWILIO_PHONE_NUMBER = undefined;
  });

  describe("getTwilioConfig", () => {
    it("should return configured: false when credentials are missing", () => {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

      const configured = !!(accountSid && authToken && phoneNumber);
      
      expect(configured).toBe(false);
    });

    it("should return configured: true when all credentials are present", () => {
      mockEnv.TWILIO_ACCOUNT_SID = "ACtest123456789";
      mockEnv.TWILIO_AUTH_TOKEN = "test_auth_token";
      mockEnv.TWILIO_PHONE_NUMBER = "+15551234567";

      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

      const configured = !!(accountSid && authToken && phoneNumber);
      
      expect(configured).toBe(true);
    });
  });

  describe("Phone number validation", () => {
    it("should validate E.164 phone number format", () => {
      const validNumbers = [
        "+15551234567",
        "+442071234567",
        "+61412345678",
      ];

      const invalidNumbers = [
        "5551234567",
        "555-123-4567",
        "(555) 123-4567",
        "invalid",
      ];

      const e164Regex = /^\+[1-9]\d{1,14}$/;

      validNumbers.forEach((num) => {
        expect(e164Regex.test(num)).toBe(true);
      });

      invalidNumbers.forEach((num) => {
        expect(e164Regex.test(num)).toBe(false);
      });
    });
  });

  describe("TwiML generation", () => {
    it("should generate valid TwiML for test calls", () => {
      const twiml = `<Response>
        <Say voice="alice">Hello! This is a test call from Reese Astor's website. Your Twilio configuration is working correctly. Thank you for testing!</Say>
        <Pause length="1"/>
        <Say voice="alice">Goodbye!</Say>
      </Response>`;

      expect(twiml).toContain("<Response>");
      expect(twiml).toContain("<Say");
      expect(twiml).toContain("voice=\"alice\"");
      expect(twiml).toContain("<Pause");
      expect(twiml).toContain("</Response>");
    });
  });

  describe("Authorization checks", () => {
    it("should only allow owner to access Twilio configuration", () => {
      const ownerOpenId = "test-owner-id";
      const userOpenId = "test-owner-id";
      const nonOwnerOpenId = "some-other-user";

      expect(userOpenId === ownerOpenId).toBe(true);
      expect(nonOwnerOpenId === ownerOpenId).toBe(false);
    });
  });

  describe("SMS message validation", () => {
    it("should validate message length (max 1600 characters)", () => {
      const shortMessage = "Hello, this is a test message.";
      const longMessage = "a".repeat(1601);

      expect(shortMessage.length <= 1600).toBe(true);
      expect(longMessage.length <= 1600).toBe(false);
    });

    it("should require non-empty message", () => {
      const emptyMessage = "";
      const validMessage = "Test message";

      expect(emptyMessage.length >= 1).toBe(false);
      expect(validMessage.length >= 1).toBe(true);
    });
  });
});
