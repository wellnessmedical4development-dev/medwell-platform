const crypto = require('crypto');
const { query } = require('../config/database');

const MAX_ATTEMPTS = 3;
const CODE_LENGTH = 8;

function generateSecureCode() {
  const max = Math.pow(10, CODE_LENGTH);
  const min = Math.pow(10, CODE_LENGTH - 1);
  const range = max - min;
  const numBytes = Math.ceil(Math.log2(range) / 8);
  const maxValid = Math.floor(256 ** numBytes / range) * range;

  let bytes, val;
  do {
    bytes = crypto.randomBytes(numBytes);
    val = bytes.reduce((acc, b, i) => acc + b * Math.pow(256, i), 0);
  } while (val >= maxValid);

  return String(min + (val % range));
}

const OtpCode = {
  async create(phone, purpose = 'registration') {
    const id = crypto.randomUUID();
    const code = generateSecureCode();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000);

    await query(`
      INSERT INTO otp_codes (id, phone, code, purpose, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `, [id, phone, code, purpose, expires_at]);

    return { id, code, expires_at };
  },

  async verify(phone, code, purpose = 'registration') {
    const { rows } = await query(`
      SELECT * FROM otp_codes
      WHERE phone = ? AND purpose = ? AND verified = FALSE
      ORDER BY created_at DESC LIMIT 1
    `, [phone, purpose]);

    if (!rows[0]) return null;
    if (new Date(rows[0].expires_at) < new Date()) return null;
    if (rows[0].attempts >= MAX_ATTEMPTS) return null;

    if (rows[0].code !== code) {
      await query('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?', [rows[0].id]);
      return null;
    }

    await query('UPDATE otp_codes SET verified = TRUE WHERE id = ?', [rows[0].id]);
    return rows[0];
  },

  async invalidateByPhone(phone) {
    await query('UPDATE otp_codes SET verified = TRUE WHERE phone = ? AND verified = FALSE', [phone]);
  },
};

module.exports = OtpCode;
