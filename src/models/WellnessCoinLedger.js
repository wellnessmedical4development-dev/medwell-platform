const { query } = require('../config/database');

const WellnessCoinLedger = {
  async findByUser(userId, limit = 50, offset = 0) {
    const { rows } = await query(
      'SELECT * FROM wellness_coin_ledger WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );
    return rows;
  },

  async create(data) {
    const crypto = require('crypto');
    const id = crypto.randomUUID();
    await query(`
      INSERT INTO wellness_coin_ledger (id, user_id, operation, amount, running_balance, reference_type, reference_id, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, data.user_id, data.operation, data.amount, data.running_balance, data.reference_type, data.reference_id, data.description]);
    return this.findByUser(data.user_id, 1);
  },

  async getBalance(userId) {
    const { rows } = await query(
      'SELECT running_balance FROM wellness_coin_ledger WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    return rows.length ? parseFloat(rows[0].running_balance) : 0;
  },
};

module.exports = WellnessCoinLedger;
