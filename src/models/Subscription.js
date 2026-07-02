const { query } = require('../config/database');

const Subscription = {
  async findById(id) {
    const { rows } = await query('SELECT * FROM subscriptions WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByUser(userId, activeOnly = false) {
    let sql = 'SELECT s.*, sv.title, sv.code AS service_code FROM subscriptions s JOIN services sv ON sv.id = s.service_id WHERE s.user_id = ?';
    const params = [userId];
    if (activeOnly) {
      sql += " AND s.status = 'active'";
    }
    sql += ' ORDER BY s.created_at DESC';
    const { rows } = await query(sql, params);
    return rows;
  },

  async create(data) {
    const crypto = require('crypto');
    const id = crypto.randomUUID();
    await query(`
      INSERT INTO subscriptions (id, user_id, service_id, status, amount, currency, interval, start_date, end_date, auto_renew)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, data.user_id, data.service_id, data.status || 'active', data.amount, data.currency || 'MAD', data.interval || 'monthly', data.start_date || new Date(), data.end_date, data.auto_renew || false]);
    return this.findById(id);
  },

  async cancel(id, reason) {
    await query(`
      UPDATE subscriptions SET status = 'cancelled', cancelled_at = NOW(), notes = ?, updated_at = NOW()
      WHERE id = ?
    `, [reason, id]);
    return this.findById(id);
  },

  async renew(id, newEndDate) {
    await query(`
      UPDATE subscriptions SET status = 'active', end_date = ?, cancelled_at = NULL, notes = NULL, updated_at = NOW()
      WHERE id = ?
    `, [newEndDate, id]);
    return this.findById(id);
  },

  async getActiveCountByUser(userId) {
    const { rows } = await query(
      "SELECT COUNT(*) AS cnt FROM subscriptions WHERE user_id = ? AND status = 'active'",
      [userId]
    );
    return parseInt(rows[0].cnt, 10);
  },
};

module.exports = Subscription;
