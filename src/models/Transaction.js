const { query } = require('../config/database');

const Transaction = {
  async findById(id) {
    const { rows } = await query('SELECT * FROM transactions WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByUser(userId, limit = 50, offset = 0) {
    const { rows } = await query(
      'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );
    return rows;
  },

  async create(data) {
    const crypto = require('crypto');
    const id = crypto.randomUUID();
    const { rows } = await query(`
      INSERT INTO transactions (id, user_id, subscription_id, type, amount, currency, description, reference, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, data.user_id, data.subscription_id, data.type, data.amount, data.currency || 'MAD', data.description, data.reference, data.metadata ? JSON.stringify(data.metadata) : null]);
    return this.findById(id);
  },

  async getFinancialSummary(userId) {
    const { rows } = await query(`
      SELECT
        COALESCE(SUM(CASE WHEN type IN ('payment', 'subscription_renewal') THEN amount ELSE 0 END), 0) AS total_paid,
        COALESCE(SUM(CASE WHEN type = 'wellness_coin_credit' THEN amount ELSE 0 END), 0) AS total_coins_earned
      FROM transactions WHERE user_id = ?
    `, [userId]);
    return rows[0];
  },
};

module.exports = Transaction;
