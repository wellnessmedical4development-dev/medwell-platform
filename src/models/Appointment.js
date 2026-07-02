const { query } = require('../config/database');

const Appointment = {
  async findById(id) {
    const { rows } = await query('SELECT * FROM appointments WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findAll(filters = {}) {
    let sql = 'SELECT * FROM appointments WHERE 1=1';
    const params = [];

    if (filters.status) {
      params.push(filters.status);
      sql += ' AND status = ?';
    }
    if (filters.phone) {
      params.push(filters.phone);
      sql += ' AND prospect_phone = ?';
    }
    sql += ' ORDER BY created_at DESC';
    const { rows } = await query(sql, params);
    return rows;
  },

  async create(data) {
    const crypto = require('crypto');
    const id = crypto.randomUUID();
    await query(`
      INSERT INTO appointments (id, user_id, prospect_id, service_id, prospect_name, prospect_phone, prospect_email, interested_program, scheduled_at, status, n8n_workflow_id, n8n_execution_id, raw_payload)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, data.user_id, data.prospect_id, data.service_id, data.prospect_name, data.prospect_phone, data.prospect_email, data.interested_program, data.scheduled_at, data.status || 'pending', data.n8n_workflow_id, data.n8n_execution_id, data.raw_payload ? JSON.stringify(data.raw_payload) : null]);
    return this.findById(id);
  },

  async updateStatus(id, status) {
    await query(`
      UPDATE appointments SET status = ?, updated_at = NOW()
      WHERE id = ?
    `, [status, id]);
    return this.findById(id);
  },
};

module.exports = Appointment;
