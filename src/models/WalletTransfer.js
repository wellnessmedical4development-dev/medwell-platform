const { query } = require('../config/database');
const crypto = require('crypto');

const WalletTransfer = {
  async findById(id) {
    const { rows } = await query('SELECT * FROM wmc_transfers WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByUser(userId, limit = 50, offset = 0) {
    const { rows } = await query(
      `SELECT * FROM wmc_transfers WHERE sender_id = ? OR recipient_id = ?
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, userId, limit, offset]
    );
    return rows;
  },

  async create(data) {
    const id = crypto.randomUUID();
    const { rows } = await query(`
      INSERT INTO wmc_transfers (id, sender_id, recipient_id, amount, note, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, data.sender_id, data.recipient_id, data.amount, data.note || null, data.status || 'completed']);
    return this.findById(id);
  },
};

module.exports = WalletTransfer;
