const { query } = require('../config/database');
const crypto = require('crypto');

const QuickRequest = {
  async findById(id) {
    const { rows } = await query('SELECT * FROM quick_requests WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByPhone(phone) {
    const { rows } = await query('SELECT * FROM quick_requests WHERE phone = ? ORDER BY created_at DESC', [phone]);
    return rows;
  },

  async findByUser(userId) {
    const { rows } = await query('SELECT * FROM quick_requests WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
  },

  async findAll(filters = {}) {
    let sql = 'SELECT * FROM quick_requests WHERE 1=1';
    const params = [];
    if (filters.status) { params.push(filters.status); sql += ' AND status = ?'; }
    if (filters.search) { params.push(`%${filters.search}%`); sql += ' AND (name LIKE ? OR phone LIKE ?)'; }
    sql += ' ORDER BY created_at DESC';
    if (filters.limit) { params.push(parseInt(filters.limit, 10)); sql += ' LIMIT ?'; }
    if (filters.offset) { params.push(parseInt(filters.offset, 10)); sql += ' OFFSET ?'; }
    const { rows } = await query(sql, params);
    return rows;
  },

  async create(data) {
    const id = crypto.randomUUID();
    await query(`
      INSERT INTO quick_requests (id, user_id, name, phone, gender, service_requested, preferred_call_date, preferred_call_time, status, internal_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, data.user_id || null, data.name, data.phone, data.gender || 'homme',
      data.service_requested, data.preferred_call_date || null,
      data.preferred_call_time || null, data.status || 'pending_call', data.internal_notes || null,
    ]);
    return this.findById(id);
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) { fields.push(`${key} = ?`); params.push(value); }
    }
    if (!fields.length) return null;
    fields.push('updated_at = NOW()');
    params.push(id);
    await query(`UPDATE quick_requests SET ${fields.join(', ')} WHERE id = ?`, params);
    return this.findById(id);
  },

  async updateStatus(id, status) {
    await query('UPDATE quick_requests SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    return this.findById(id);
  },
};

module.exports = QuickRequest;
