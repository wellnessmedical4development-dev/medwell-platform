const { query } = require('../config/database');

const Service = {
  async findById(id) {
    const { rows } = await query('SELECT * FROM services WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByCode(code) {
    const { rows } = await query('SELECT * FROM services WHERE code = ?', [code]);
    return rows[0] || null;
  },

  async findAll(activeOnly = true) {
    let sql = 'SELECT * FROM services';
    const params = [];
    if (activeOnly) {
      sql += ' WHERE is_active = TRUE';
    }
    sql += " ORDER BY category, JSON_UNQUOTE(JSON_EXTRACT(title, '$.en')) ASC";
    const { rows } = await query(sql, params);
    return rows;
  },

  async create(data) {
    const crypto = require('crypto');
    const id = crypto.randomUUID();
    await query(`
      INSERT INTO services (id, code, title, description, short_desc, category, price, currency, duration_days, image_url, wellness_coin_reward, whatsapp_template_key)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, data.code, JSON.stringify(data.title), JSON.stringify(data.description), JSON.stringify(data.short_desc), data.category, data.price, data.currency, data.duration_days, data.image_url, data.wellness_coin_reward, data.whatsapp_template_key]);
    return this.findById(id);
  },

  async update(id, data) {
    const fields = [];
    const params = [];

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        const val = typeof value === 'object' && !Array.isArray(value) ? JSON.stringify(value) : value;
        fields.push(`${key} = ?`);
        params.push(val);
      }
    }
    if (!fields.length) return null;
    fields.push('updated_at = NOW()');
    params.push(id);
    await query(
      `UPDATE services SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    return this.findById(id);
  },
};

module.exports = Service;
