const { query } = require('../config/database');

const Payment = {
  async findById(id) {
    const { rows } = await query('SELECT * FROM payments WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByUser(userId, limit = 50, offset = 0) {
    const { rows } = await query(
      'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );
    return rows;
  },

  async create(data) {
    const crypto = require('crypto');
    const id = crypto.randomUUID();
    const reference = `PAY-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const { rows } = await query(`
      INSERT INTO payments (id, user_id, subscription_id, amount, currency, status, payment_method, reference, simulated, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, data.user_id, data.subscription_id || null, data.amount, data.currency || 'MAD', data.status || 'pending', data.payment_method || 'card', reference, true, data.metadata ? JSON.stringify(data.metadata) : null]);
    return this.findById(id);
  },

  async updateStatus(id, status) {
    await query(`
      UPDATE payments SET status = ?, paid_at = IF(? = 'completed', NOW(), paid_at), updated_at = NOW()
      WHERE id = ?
    `, [status, status, id]);
    return this.findById(id);
  },

  async getTotalPaidByUser(userId) {
    const { rows } = await query(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE user_id = ? AND status = 'completed'",
      [userId]
    );
    return parseFloat(rows[0].total);
  },

  async getAllCompleted(filters = {}) {
    let sql = "SELECT p.*, u.first_name, u.last_name, u.phone FROM payments p JOIN users u ON u.id = p.user_id WHERE p.status = 'completed'";
    const params = [];
    if (filters.startDate) { sql += ' AND p.created_at >= ?'; params.push(filters.startDate); }
    if (filters.endDate) { sql += ' AND p.created_at <= ?'; params.push(filters.endDate); }
    sql += ' ORDER BY p.created_at DESC';
    if (filters.limit) { sql += ' LIMIT ?'; params.push(parseInt(filters.limit, 10)); }
    const { rows } = await query(sql, params);
    return rows;
  },

  async getMonthlyRevenue(months = 6) {
    const { rows } = await query(`
      SELECT DATE_FORMAT(paid_at, '%Y-%m') AS month, COALESCE(SUM(amount), 0) AS revenue
      FROM payments WHERE status = 'completed' AND paid_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(paid_at, '%Y-%m') ORDER BY month ASC
    `, [months]);
    return rows;
  },
};

module.exports = Payment;
