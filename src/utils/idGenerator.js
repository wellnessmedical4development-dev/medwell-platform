const crypto = require('crypto');

const SECRET = process.env.ID_ENCRYPTION_SECRET || 'medwell-secure-key-2026';

function generateEncryptedId(phone) {
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  const hash = crypto.createHmac('sha256', SECRET)
    .update(`${phone}:${Date.now()}:${random}`)
    .digest('hex')
    .substring(0, 8)
    .toUpperCase();
  return `MW-${hash}-${random.substring(0, 4)}`;
}

function hashPhoneForSearch(phone) {
  return crypto.createHmac('sha256', SECRET)
    .update(phone)
    .digest('hex')
    .substring(0, 16);
}

module.exports = { generateEncryptedId, hashPhoneForSearch };
