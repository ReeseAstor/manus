import { Request, Response, Router } from 'express';
import twilio from 'twilio';
import { getDb } from './db';
import { userSmsPreferences } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// Keywords for unsubscribe/resubscribe
const STOP_KEYWORDS = ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'];
const START_KEYWORDS = ['START', 'SUBSCRIBE', 'YES', 'UNSTOP', 'JOIN', 'CLUB'];
const HELP_KEYWORDS = ['HELP', 'INFO'];

// Twilio signature validation middleware
const validateTwilioSignature = (req: Request, res: Response, next: Function) => {
  const twilioSignature = req.headers['x-twilio-signature'] as string;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!authToken) {
    console.error('[SMS Webhook] TWILIO_AUTH_TOKEN not configured');
    return res.status(500).send('Server configuration error');
  }

  // Get the full URL for validation
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  
  // In development, skip signature validation
  if (process.env.NODE_ENV === 'development') {
    console.log('[SMS Webhook] Skipping signature validation in development');
    return next();
  }

  // Fail closed: an unsigned request is never from Twilio.
  if (!twilioSignature) {
    console.error('[SMS Webhook] Missing Twilio signature');
    return res.status(403).send('Missing signature');
  }

  const isValid = twilio.validateRequest(
    authToken,
    twilioSignature,
    url,
    req.body
  );

  if (!isValid) {
    console.error('[SMS Webhook] Invalid Twilio signature');
    return res.status(403).send('Invalid signature');
  }

  next();
};

// Main incoming SMS handler
const handleIncomingSms = async (req: Request, res: Response) => {
  try {
    const {
      From: fromNumber,
      Body: messageBody,
      MessageSid: messageSid,
    } = req.body;

    console.log(`[SMS Webhook] Received message from ${fromNumber}: "${messageBody}"`);

    if (!fromNumber || !messageBody) {
      console.error('[SMS Webhook] Missing required fields');
      return res.status(400).send('Missing required fields');
    }

    // Normalize the message body
    const normalizedMessage = messageBody.trim().toUpperCase();

    // Determine the action based on keywords
    let action: 'stop' | 'start' | 'help' | 'unknown' = 'unknown';

    if (STOP_KEYWORDS.some(keyword => normalizedMessage === keyword || normalizedMessage.startsWith(keyword + ' '))) {
      action = 'stop';
    } else if (START_KEYWORDS.some(keyword => normalizedMessage === keyword || normalizedMessage.startsWith(keyword + ' '))) {
      action = 'start';
    } else if (HELP_KEYWORDS.some(keyword => normalizedMessage === keyword || normalizedMessage.startsWith(keyword + ' '))) {
      action = 'help';
    }

    // Get database connection
    const db = await getDb();
    if (!db) {
      console.error('[SMS Webhook] Database not available');
      return res.status(500).send('Database error');
    }

    // Find user by phone number
    const userPrefs = await db.select()
      .from(userSmsPreferences)
      .where(eq(userSmsPreferences.phoneNumber, fromNumber))
      .limit(1);

    let responseMessage = '';

    switch (action) {
      case 'stop':
        responseMessage = await handleStop(db, fromNumber, userPrefs[0]);
        break;
      case 'start':
        responseMessage = await handleStart(db, fromNumber, userPrefs[0]);
        break;
      case 'help':
        responseMessage = getHelpMessage();
        break;
      default:
        responseMessage = getDefaultMessage();
        break;
    }

    // Log the interaction
    console.log(`[SMS Webhook] Action: ${action}, Response: "${responseMessage}"`);

    // Send TwiML response
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(responseMessage);

    res.type('text/xml');
    res.send(twiml.toString());

  } catch (error) {
    console.error('[SMS Webhook] Error processing incoming SMS:', error);

    // Send a generic error response
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Sorry, we encountered an error. Please try again later or contact support.');

    res.type('text/xml');
    res.send(twiml.toString());
  }
};

router.post('/incoming', validateTwilioSignature, handleIncomingSms);
// Alias so Twilio's configured webhook URL (https://.../webhooks/twilio) hits
// the same handler when this router is mounted at /webhooks/twilio.
router.post('/', validateTwilioSignature, handleIncomingSms);

// Handle STOP/unsubscribe request
async function handleStop(db: any, phoneNumber: string, existingPrefs: any): Promise<string> {
  try {
    if (existingPrefs) {
      // Update existing preferences to opt out
      await db.update(userSmsPreferences)
        .set({
          smsOptIn: false,
          updatedAt: new Date(),
        })
        .where(eq(userSmsPreferences.phoneNumber, phoneNumber));

      console.log(`[SMS Webhook] User ${phoneNumber} unsubscribed from SMS`);
      
      return `You've been unsubscribed from Reese Astor's SMS notifications. You won't receive any more messages. Reply START to resubscribe anytime. 💕`;
    } else {
      // No existing preferences, create one with opt-out
      await db.insert(userSmsPreferences).values({
        phoneNumber: phoneNumber,
        smsOptIn: false,
        marketingOptIn: false,
        storyReleasesOptIn: false,
        promoOptIn: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`[SMS Webhook] Created opt-out record for ${phoneNumber}`);
      
      return `You've been unsubscribed from Reese Astor's SMS notifications. Reply START if you'd like to subscribe in the future. 💕`;
    }
  } catch (error) {
    console.error('[SMS Webhook] Error handling STOP:', error);
    throw error;
  }
}

// Handle START/resubscribe request
async function handleStart(db: any, phoneNumber: string, existingPrefs: any): Promise<string> {
  try {
    if (existingPrefs) {
      // Update existing preferences to opt back in
      await db.update(userSmsPreferences)
        .set({
          smsOptIn: true,
          marketingOptIn: true,
          storyReleasesOptIn: true,
          promoOptIn: true,
          updatedAt: new Date(),
        })
        .where(eq(userSmsPreferences.phoneNumber, phoneNumber));

      console.log(`[SMS Webhook] User ${phoneNumber} resubscribed to SMS`);
      
      return `Welcome back! 🎉 You're now subscribed to Reese Astor's SMS notifications. You'll receive updates about new steamy stories, exclusive offers, and VIP perks. Reply STOP to unsubscribe anytime.`;
    } else {
      // Create new preferences with opt-in
      await db.insert(userSmsPreferences).values({
        phoneNumber: phoneNumber,
        smsOptIn: true,
        marketingOptIn: true,
        storyReleasesOptIn: true,
        promoOptIn: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`[SMS Webhook] Created opt-in record for ${phoneNumber}`);
      
      return `Welcome! 🎉 You're now subscribed to Reese Astor's SMS notifications. Get ready for updates about new steamy stories and exclusive VIP content. Reply STOP to unsubscribe anytime.`;
    }
  } catch (error) {
    console.error('[SMS Webhook] Error handling START:', error);
    throw error;
  }
}

// Help message
function getHelpMessage(): string {
  return `Reese Astor SMS Help 📚\n\nReply STOP to unsubscribe\nReply START to resubscribe\n\nVisit reeseastor.com for more info or email support@reeseastor.com`;
}

// Default message for unrecognized commands
function getDefaultMessage(): string {
  return `Thanks for your message! 💕\n\nReply STOP to unsubscribe\nReply HELP for assistance\n\nVisit reeseastor.com to explore our steamy romance collection!`;
}

// Status endpoint to check webhook configuration
router.get('/status', (req: Request, res: Response) => {
  res.json({
    status: 'active',
    endpoints: {
      incoming: '/api/sms/incoming',
    },
    supportedKeywords: {
      stop: STOP_KEYWORDS,
      start: START_KEYWORDS,
      help: HELP_KEYWORDS,
    },
    twilioConfigured: !!process.env.TWILIO_AUTH_TOKEN,
  });
});

export default router;
