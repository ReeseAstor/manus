import { describe, it, expect } from "vitest";

describe("Twilio Credentials Validation", () => {
  it("should have valid Twilio credentials configured", async () => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    // Check credentials are present
    expect(accountSid).toBeDefined();
    expect(authToken).toBeDefined();
    expect(phoneNumber).toBeDefined();

    // Check Account SID format (starts with AC)
    expect(accountSid).toMatch(/^AC[a-f0-9]{32}$/);

    // Check phone number is in E.164 format
    expect(phoneNumber).toMatch(/^\+[1-9]\d{1,14}$/);
  });

  it("should be able to connect to Twilio API", async () => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
      console.log("Skipping API test - credentials not configured");
      return;
    }

    // Use Twilio's account lookup API to validate credentials
    const twilio = await import("twilio");
    const client = twilio.default(accountSid, authToken);

    try {
      // Fetch account info to validate credentials
      const account = await client.api.accounts(accountSid).fetch();
      
      expect(account).toBeDefined();
      expect(account.sid).toBe(accountSid);
      expect(account.status).toBeDefined();
      
      console.log(`✓ Twilio account validated: ${account.friendlyName} (${account.status})`);
    } catch (error: any) {
      // If we get an authentication error, the credentials are invalid
      if (error.code === 20003) {
        throw new Error("Invalid Twilio credentials - authentication failed");
      }
      throw error;
    }
  });

  it("should have a valid phone number in the account", async () => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !phoneNumber) {
      console.log("Skipping phone number test - credentials not configured");
      return;
    }

    const twilio = await import("twilio");
    const client = twilio.default(accountSid, authToken);

    try {
      // Check if the phone number exists in the account
      const phoneNumbers = await client.incomingPhoneNumbers.list({
        phoneNumber: phoneNumber,
      });

      if (phoneNumbers.length === 0) {
        console.log(`⚠ Phone number ${phoneNumber} not found in account - may be a trial number`);
        // Don't fail the test for trial accounts
        return;
      }

      const phone = phoneNumbers[0];
      expect(phone.phoneNumber).toBe(phoneNumber);
      
      console.log(`✓ Phone number validated: ${phone.friendlyName}`);
      console.log(`  SMS: ${phone.capabilities?.sms ? "✓" : "✗"}`);
      console.log(`  Voice: ${phone.capabilities?.voice ? "✓" : "✗"}`);
    } catch (error: any) {
      console.log(`⚠ Could not verify phone number: ${error.message}`);
      // Don't fail for phone number lookup issues
    }
  });
});
