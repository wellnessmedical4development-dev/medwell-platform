const { query } = require('../config/database');
const crypto = require('crypto');

const LegacyClient = {
  async findById(id) {
    const { rows } = await query('SELECT * FROM legacy_clients WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByPhone(phone) {
    const { rows } = await query('SELECT * FROM legacy_clients WHERE phone = ?', [phone]);
    return rows[0] || null;
  },

  async findUnlinked() {
    const { rows } = await query('SELECT * FROM legacy_clients WHERE matched_user_id IS NULL ORDER BY created_at DESC');
    return rows;
  },

  async bulkCreate(records) {
    if (!records.length) return [];
    const inserted = [];
    const batchId = `BATCH-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    for (const rec of records) {
      const id = crypto.randomUUID();
      const nameParts = (rec.full_name || '').trim().split(/\s+/);
      const firstName = nameParts[0] || 'Unknown';
      const lastName = nameParts.slice(1).join(' ') || 'Client';
      try {
        await query(`
          INSERT INTO legacy_clients (id, first_name, last_name, phone, email, past_membership, membership_start, membership_end, total_spent, notes, import_batch, raw_data)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [id, firstName, lastName, rec.phone, rec.email || null, rec.past_membership || null, rec.membership_start || null, rec.membership_end || null, rec.total_spent || 0, rec.notes || null, batchId, rec.raw_data ? JSON.stringify(rec.raw_data) : null]);
        inserted.push({ id, ...rec });
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') continue;
        throw err;
      }
    }
    return inserted;
  },

  async getStats() {
    const { rows } = await query(`
      SELECT
        CAST(COUNT(*) AS SIGNED) AS total,
        CAST(SUM(CASE WHEN matched_user_id IS NOT NULL THEN 1 ELSE 0 END) AS SIGNED) AS linked,
        CAST(SUM(CASE WHEN matched_user_id IS NULL THEN 1 ELSE 0 END) AS SIGNED) AS unlinked
      FROM legacy_clients
    `);
    return rows[0];
  },
};

module.exports = LegacyClient;
