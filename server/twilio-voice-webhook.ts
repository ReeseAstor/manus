import { Request, Response, Router } from 'express';
import twilio from 'twilio';
import { getDb } from './db';
import { voicemailRecordings, twilioCallLog } from '../drizzle/schema';
import { sendDirectSms } from './sms';

const router = Router();

const validateTwilioSignature = (req: Request, res: Response, next: Function) => {
  const twilioSignature = req.headers['x-twilio-signature'] as string;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!authToken) {
    console.error('[Voice Webhook] TWILIO_AUTH_TOKEN not configured');
    return res.status(500).send('Server configuration error');
  }

  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  if (process.env.NODE_ENV === 'development' || !twilioSignature) {
    console.log('[Voice Webhook] Skipping signature validation in development');
    return next();
  }

  const isValid = twilio.validateRequest(authToken, twilioSignature, url, req.body);

  if (!isValid) {
    console.error('[Voice Webhook] Invalid Twilio signature');
    return res.status(403).send('Invalid signature');
  }

  next();
};

const buildAbsoluteWebhookUrl = (req: Request, path: string): string => {
  const explicit = process.env.SMS_WEBHOOK_URL?.replace(/\/+$/, '');
  if (explicit) return `${explicit}/${path.replace(/^\/+/, '')}`;
  const proto = req.protocol;
  const host = req.get('host');
  return `${proto}://${host}/webhooks/twilio/${path.replace(/^\/+/, '')}`;
};

const handleIncomingVoice = (req: Request, res: Response) => {
  const from = req.body?.From ?? 'unknown';
  const callSid = req.body?.CallSid ?? 'unknown';
  console.log(`[Voice Webhook] Incoming call ${callSid} from ${from}`);

  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say(
    { voice: 'Polly.Joanna' },
    "Thanks for calling Reese Astor. For the fastest reply, please email support at reeseastor dot com, or visit reeseastor dot com. Please leave a message after the beep, and we'll get back to you soon."
  );
  twiml.record({
    maxLength: 120,
    playBeep: true,
    finishOnKey: '#',
    recordingStatusCallback: buildAbsoluteWebhookUrl(req, 'recording-complete'),
    recordingStatusCallbackMethod: 'POST',
  });
  twiml.say({ voice: 'Polly.Joanna' }, "We didn't receive a message. Goodbye.");
  twiml.hangup();

  res.type('text/xml');
  res.send(twiml.toString());
};

const HOME_CHANNEL = process.env.SMS_HOME_CHANNEL ?? '+19546778888';

const handleRecordingComplete = async (req: Request, res: Response) => {
  const {
    CallSid: callSid,
    From: from,
    To: to,
    RecordingSid: recordingSid,
    RecordingUrl: recordingUrl,
    RecordingDuration: durationRaw,
    RecordingStatus: status,
  } = req.body ?? {};

  const durationSeconds = durationRaw ? parseInt(durationRaw, 10) : null;

  console.log('[Voice Webhook] Recording complete', {
    callSid, from, to, recordingSid, recordingUrl, durationSeconds, status,
  });

  // Acknowledge to Twilio immediately; persistence + notification are best-effort.
  res.status(204).end();

  try {
    const db = await getDb();
    if (db && callSid && recordingSid) {
      await db.insert(voicemailRecordings).values({
        callSid,
        recordingSid,
        recordingUrl: recordingUrl ?? null,
        durationSeconds: Number.isFinite(durationSeconds) ? durationSeconds : null,
        fromPhoneNumber: from ?? null,
        toPhoneNumber: to ?? null,
        status: status ?? null,
      });
    }
  } catch (error: any) {
    console.error('[Voice Webhook] Failed to persist voicemail:', error?.message ?? error);
  }

  if (status && status !== 'completed') return;

  try {
    const durationLabel = Number.isFinite(durationSeconds) ? `${durationSeconds}s` : 'unknown duration';
    const body = `New voicemail from ${from ?? 'unknown'} (${durationLabel}). ${recordingUrl ?? ''}`.trim();
    await sendDirectSms(HOME_CHANNEL, body);
  } catch (error: any) {
    console.error('[Voice Webhook] Failed to notify home channel:', error?.message ?? error);
  }
};

const handleCallStatus = async (req: Request, res: Response) => {
  const {
    CallSid: callSid,
    From: from,
    To: to,
    CallStatus: callStatus,
    Direction: direction,
    CallDuration: durationRaw,
  } = req.body ?? {};

  const durationSeconds = durationRaw ? parseInt(durationRaw, 10) : null;

  console.log('[Voice Webhook] Call status', { callSid, from, to, callStatus, direction, durationSeconds });

  res.status(204).end();

  try {
    const db = await getDb();
    if (db && callSid) {
      await db.insert(twilioCallLog).values({
        callSid,
        fromPhoneNumber: from ?? null,
        toPhoneNumber: to ?? null,
        callStatus: callStatus ?? null,
        direction: direction ?? null,
        durationSeconds: Number.isFinite(durationSeconds) ? durationSeconds : null,
      });
    }
  } catch (error: any) {
    console.error('[Voice Webhook] Failed to persist call status:', error?.message ?? error);
  }
};

router.post('/voice', validateTwilioSignature, handleIncomingVoice);
router.post('/recording-complete', validateTwilioSignature, handleRecordingComplete);
router.post('/call-status', validateTwilioSignature, handleCallStatus);

export default router;
export {
  handleIncomingVoice,
  handleRecordingComplete,
  handleCallStatus,
  validateTwilioSignature,
};
