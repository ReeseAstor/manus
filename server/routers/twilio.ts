import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

// Check if Twilio is configured
function getTwilioConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  return {
    configured: !!(accountSid && authToken && phoneNumber),
    accountSid,
    authToken,
    phoneNumber,
  };
}

// Lazy load Twilio client
async function getTwilioClient() {
  const config = getTwilioConfig();
  if (!config.configured) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Twilio is not configured. Please add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to your environment variables.",
    });
  }

  // Dynamic import to avoid loading Twilio if not configured
  const twilio = await import("twilio");
  return twilio.default(config.accountSid, config.authToken);
}

export const twilioRouter = router({
  // Get Twilio configuration status
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    // Only allow owner to view Twilio status
    const ownerOpenId = process.env.OWNER_OPEN_ID;
    if (ctx.user.openId !== ownerOpenId) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only the site owner can access Twilio configuration",
      });
    }

    const config = getTwilioConfig();

    if (!config.configured) {
      return {
        configured: false,
        accountSid: null,
        phoneNumber: null,
        smsEnabled: false,
        voiceEnabled: false,
      };
    }

    try {
      const client = await getTwilioClient();
      
      // Get account info
      const account = await client.api.accounts(config.accountSid!).fetch();
      
      // Check phone number capabilities
      let smsEnabled = false;
      let voiceEnabled = false;
      
      if (config.phoneNumber) {
        try {
          const phoneNumbers = await client.incomingPhoneNumbers.list({
            phoneNumber: config.phoneNumber,
          });
          
          if (phoneNumbers.length > 0) {
            const phone = phoneNumbers[0];
            smsEnabled = phone.capabilities?.sms || false;
            voiceEnabled = phone.capabilities?.voice || false;
          }
        } catch (e) {
          // Phone number lookup failed, assume basic capabilities
          smsEnabled = true;
          voiceEnabled = true;
        }
      }

      return {
        configured: true,
        accountSid: config.accountSid?.slice(0, 8) + "..." + config.accountSid?.slice(-4),
        phoneNumber: config.phoneNumber,
        smsEnabled,
        voiceEnabled,
        accountStatus: account.status,
      };
    } catch (error: any) {
      console.error("[Twilio] Error fetching status:", error);
      return {
        configured: true,
        accountSid: config.accountSid?.slice(0, 8) + "..." + config.accountSid?.slice(-4),
        phoneNumber: config.phoneNumber,
        smsEnabled: true,
        voiceEnabled: true,
        error: error.message,
      };
    }
  }),

  // Send test SMS
  testSms: protectedProcedure
    .input(
      z.object({
        to: z.string().min(10, "Phone number must be at least 10 digits"),
        message: z.string().min(1, "Message is required").max(1600, "Message too long"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only allow owner to send test SMS
      const ownerOpenId = process.env.OWNER_OPEN_ID;
      if (ctx.user.openId !== ownerOpenId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the site owner can send test messages",
        });
      }

      const config = getTwilioConfig();
      const client = await getTwilioClient();

      try {
        const message = await client.messages.create({
          body: input.message,
          from: config.phoneNumber!,
          to: input.to,
        });

        console.log("[Twilio] Test SMS sent:", message.sid);

        return {
          success: true,
          message: `SMS sent successfully! Message SID: ${message.sid}`,
          sid: message.sid,
        };
      } catch (error: any) {
        console.error("[Twilio] Error sending test SMS:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to send SMS",
        });
      }
    }),

  // Make test voice call
  testVoice: protectedProcedure
    .input(
      z.object({
        to: z.string().min(10, "Phone number must be at least 10 digits"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only allow owner to make test calls
      const ownerOpenId = process.env.OWNER_OPEN_ID;
      if (ctx.user.openId !== ownerOpenId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the site owner can make test calls",
        });
      }

      const config = getTwilioConfig();
      const client = await getTwilioClient();

      try {
        const call = await client.calls.create({
          twiml: `<Response>
            <Say voice="alice">Hello! This is a test call from Reese Astor's website. Your Twilio configuration is working correctly. Thank you for testing!</Say>
            <Pause length="1"/>
            <Say voice="alice">Goodbye!</Say>
          </Response>`,
          from: config.phoneNumber!,
          to: input.to,
        });

        console.log("[Twilio] Test call initiated:", call.sid);

        return {
          success: true,
          message: `Call initiated successfully! Call SID: ${call.sid}`,
          sid: call.sid,
        };
      } catch (error: any) {
        console.error("[Twilio] Error making test call:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to make call",
        });
      }
    }),

  // Send SMS to a subscriber (for future use)
  sendSms: protectedProcedure
    .input(
      z.object({
        to: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Only allow owner
      const ownerOpenId = process.env.OWNER_OPEN_ID;
      if (ctx.user.openId !== ownerOpenId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the site owner can send messages",
        });
      }

      const config = getTwilioConfig();
      const client = await getTwilioClient();

      const message = await client.messages.create({
        body: input.message,
        from: config.phoneNumber,
        to: input.to,
      });

      return {
        success: true,
        sid: message.sid,
      };
    }),
});
