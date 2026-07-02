const { query } = require('../config/database');
const crypto = require('crypto');
const { generateEncryptedId, hashPhoneForSearch } = require('../utils/idGenerator');

function generateReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}

const User = {
  async findById(id) {
    const { rows } = await query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByPhone(phone) {
    const { rows } = await query('SELECT * FROM users WHERE phone = ?', [phone]);
    return rows[0] || null;
  },

  async findByReferralCode(code) {
    const { rows } = await query('SELECT * FROM users WHERE referral_code = ?', [code]);
    return rows[0] || null;
  },

  async findByEmail(email) {
    const { rows } = await query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findByFullName(firstName, lastName) {
    const { rows } = await query(
      'SELECT * FROM users WHERE first_name = ? AND last_name = ?',
      [firstName, lastName]
    );
    return rows[0] || null;
  },

  async findAll(filters = {}) {
    let sql = 'SELECT * FROM users WHERE 1=1';
    const params = [];
    const conditions = [];

    if (filters.role) {
      params.push(filters.role);
      conditions.push('role = ?');
    }
    if (filters.subscription_status) {
      params.push(filters.subscription_status);
      conditions.push('subscription_status = ?');
    }
    if (filters.search) {
      const s = `%${filters.search}%`;
      params.push(s, s, s, s);
      conditions.push('(first_name LIKE ? OR last_name LIKE ? OR phone LIKE ? OR unique_id LIKE ?)');
    }
    if (conditions.length) sql += ' AND ' + conditions.join(' AND ');
    sql += ' ORDER BY created_at DESC';

    if (filters.limit) {
      params.push(parseInt(filters.limit, 10));
      sql += ' LIMIT ?';
    }
    if (filters.offset) {
      params.push(parseInt(filters.offset, 10));
      sql += ' OFFSET ?';
    }
    const { rows } = await query(sql, params);
    return rows;
  },

  async create(data) {
    const id = crypto.randomUUID();
    const referralCode = generateReferralCode();
    const { rows } = await query(`
      INSERT INTO users (id, unique_id, role, first_name, last_name, email, phone, password_hash, preferred_lang, referral_code, referred_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, data.unique_id, data.role, data.first_name, data.last_name, data.email, data.phone, data.password_hash, data.preferred_lang || 'en', referralCode, data.referred_by || null]);
    return this.findById(id);
  },

  async update(id, data) {
    const fields = [];
    const params = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    }
    if (!fields.length) return null;
    fields.push('updated_at = NOW()');
    params.push(id);
    await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    return this.findById(id);
  },

  async generateUniqueId(phone) {
    return generateEncryptedId(phone || Date.now().toString());
  },

  async linkLegacyClient(userId, legacyId) {
    await query(`
      UPDATE users SET legacy_client_id = ?, updated_at = NOW()
      WHERE id = ?
    `, [legacyId, userId]);
    await query(`
      UPDATE legacy_clients SET matched_user_id = ?, matched_at = NOW()
      WHERE id = ?
    `, [userId, legacyId]);
    return this.findById(userId);
  },
};

module.exports = User;
