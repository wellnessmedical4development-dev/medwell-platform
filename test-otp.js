require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

const PHONE = '+212774929457';
const WHATSAPP_FROM = 'whatsapp:+14155238886';

async function generateAndSendOtp() {
  const code = String(10000000 + Math.floor(Math.random() * 90000000));

  console.log('========================================');
  console.log('  TEST INSCRIPTION CLIENT');
  console.log('========================================');
  console.log('');

  const message = `MedWell: Votre code de verification est ${code}. Valable 5 minutes. Ne partagez jamais ce code.`;

  console.log('Envoi du code', code, 'vers', PHONE, '...');

  try {
    const msg = await client.messages.create({
      body: message,
      from: WHATSAPP_FROM,
      to: `whatsapp:${PHONE.replace(/[^0-9]/g, '')}`,
    });
    console.log('✓ Message envoyé !');
    console.log('  SID:', msg.sid);
    console.log('');
    console.log('Le code', code, 'a été envoyé par WhatsApp à', PHONE);
    console.log('');
    console.log('Pour créer un compte, utilisez:');
    console.log('  Téléphone:', PHONE);
    console.log('  Code OTP :', code);
    console.log('  Prénom   : Votre prénom');
    console.log('  Nom      : Votre nom');
    console.log('  Mot de passe: Votre mot de passe (min 6 caractères)');
    console.log('');
    console.log('Ces appels API seront faits:');
    console.log('  POST /api/v1/auth/otp/send   → envoie le code');
    console.log('  POST /api/v1/auth/otp/verify → vérifie le code');
    console.log('  POST /api/v1/auth/register   → crée le compte');
    console.log('');
    console.log('(Note: Le serveur MySQL n\'est pas installé.');
    console.log(' Pour lancer le vrai serveur, installez MySQL');
    console.log(' et exécutez: npm start)');
  } catch (err) {
    console.error('ERREUR:', err.message);
  }
}

generateAndSendOtp();
