const { query } = require('../config/database');

const Prospect = {
  async findById(id) {
    const { rows } = await query('SELECT * FROM prospects WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByPhone(phone) {
    const { rows } = await query('SELECT * FROM prospects WHERE phone = ? ORDER BY created_at DESC', [phone]);
    return rows;
  },

  async findRecentByPhone(phone) {
    const { rows } = await query(
      'SELECT * FROM prospects WHERE phone = ? AND status != ? ORDER BY created_at DESC LIMIT 1',
      [phone, 'lost']
    );
    return rows[0] || null;
  },

  async findAll(filters = {}) {
    let sql = 'SELECT * FROM prospects WHERE 1=1';
    const params = [];

    if (filters.status) {
      params.push(filters.status);
      sql += ' AND status = ?';
    }
    if (filters.search) {
      params.push(`%${filters.search}%`);
      sql += ' AND (full_name LIKE ? OR phone LIKE ?)';
    }
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
    const crypto = require('crypto');
    const id = crypto.randomUUID();
    await query(`
      INSERT INTO prospects (id, full_name, phone, email, interested_service, service_id, source, status, n8n_workflow_id, n8n_execution_id, conversation_log, raw_payload, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, data.full_name, data.phone, data.email, data.interested_service,
      data.service_id, data.source || 'whatsapp', data.status || 'new',
      data.n8n_workflow_id, data.n8n_execution_id,
      data.conversation_log ? JSON.stringify(data.conversation_log) : null,
      data.raw_payload ? JSON.stringify(data.raw_payload) : null,
      data.notes,
    ]);
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
      `UPDATE prospects SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    return this.findById(id);
  },

  async updateStatus(id, status) {
    await query(`
      UPDATE prospects SET status = ?, updated_at = NOW()
      WHERE id = ?
    `, [status, id]);
    return this.findById(id);
  },

  async getStats() {
    const { rows } = await query(`
      SELECT
        CAST(COUNT(*) AS SIGNED) AS total,
        CAST(SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS SIGNED) AS new,
        CAST(SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) AS SIGNED) AS contacted,
        CAST(SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END) AS SIGNED) AS qualified,
        CAST(SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) AS SIGNED) AS converted,
        CAST(SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) AS SIGNED) AS lost,
        CAST(COUNT(DISTINCT DATE(created_at)) AS SIGNED) AS active_days
      FROM prospects
    `);
    return rows[0];
  },

  async convertToUser(prospectId, userId) {
    await query(`
      UPDATE prospects SET status = 'converted', matched_user_id = ?, converted_at = NOW(), updated_at = NOW()
      WHERE id = ?
    `, [userId, prospectId]);
    return this.findById(prospectId);
  },
};

module.exports = Prospect;
