const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || `whatsapp:${twilioPhone}`;

let client = null;
if (accountSid && authToken && accountSid !== 'placeholder' && authToken !== 'placeholder') {
  client = twilio(accountSid, authToken);
}

async function sendSMS(phone, message) {
  if (client) {
    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: phone,
    });
  }
  console.log(`[DEV SMS] To: ${phone} | Body: ${message}`);
}

async function sendWhatsApp(phone, message) {
  const to = `whatsapp:${phone.startsWith('+') ? '' : '+'}${phone.replace(/[^0-9]/g, '')}`;

  if (client) {
    try {
      await client.messages.create({
        body: message,
        from: whatsappFrom,
        to,
      });
      return;
    } catch (err) {
      console.warn('WhatsApp send failed:', err.message);
    }
  }
  console.log(`[DEV WhatsApp] To: ${phone} | Body: ${message}`);
}

async function sendWhatsAppWithTemplate(phone, contentSid, variables) {
  const to = `whatsapp:${phone.startsWith('+') ? '' : '+'}${phone.replace(/[^0-9]/g, '')}`;

  if (client) {
    try {
      await client.messages.create({
        from: whatsappFrom,
        contentSid,
        contentVariables: JSON.stringify(variables),
        to,
      });
      return;
    } catch (err) {
      console.warn('WhatsApp template send failed:', err.message);
    }
  }
  console.log(`[DEV WhatsApp Template] To: ${phone} | SID: ${contentSid} | Vars:`, variables);
}

module.exports = { sendSMS, sendWhatsApp, sendWhatsAppWithTemplate };
