import { Request, Response, Router } from 'express';
import twilio from 'twilio';

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

const buildRecordingCallbackUrl = (req: Request): string => {
  const explicit = process.env.SMS_WEBHOOK_URL?.replace(/\/+$/, '');
  if (explicit) return `${explicit}/recording-complete`;
  const proto = req.protocol;
  const host = req.get('host');
  return `${proto}://${host}/webhooks/twilio/recording-complete`;
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
    recordingStatusCallback: buildRecordingCallbackUrl(req),
    recordingStatusCallbackMethod: 'POST',
  });
  twiml.say({ voice: 'Polly.Joanna' }, "We didn't receive a message. Goodbye.");
  twiml.hangup();

  res.type('text/xml');
  res.send(twiml.toString());
};

const handleRecordingComplete = (req: Request, res: Response) => {
  const {
    CallSid: callSid,
    From: from,
    RecordingSid: recordingSid,
    RecordingUrl: recordingUrl,
    RecordingDuration: durationSecs,
    RecordingStatus: status,
  } = req.body ?? {};

  console.log('[Voice Webhook] Recording complete', {
    callSid,
    from,
    recordingSid,
    recordingUrl,
    durationSecs,
    status,
  });

  res.status(204).end();
};

router.post('/voice', validateTwilioSignature, handleIncomingVoice);
router.post('/recording-complete', validateTwilioSignature, handleRecordingComplete);

export default router;
export { handleIncomingVoice, handleRecordingComplete, validateTwilioSignature };
