import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

async function sendTestSMS() {
  try {
    const message = await client.messages.create({
      body: "🎉 Hello from Reese Astor's website! Your Twilio SMS integration is working perfectly. Welcome to the VIP Spicy Stories Club! 📚💕",
      from: fromNumber,
      to: '+19546778888'
    });

    console.log('✅ SMS sent successfully!');
    console.log('Message SID:', message.sid);
    console.log('Status:', message.status);
    console.log('To:', message.to);
    console.log('From:', message.from);
  } catch (error) {
    console.error('❌ Error sending SMS:', error.message);
    process.exit(1);
  }
}

sendTestSMS();
