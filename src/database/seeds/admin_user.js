require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '..', '.env') });
const { pool, query } = require('../../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function seed() {
  try {
    const phone = process.env.ADMIN_PHONE || '+212600000000';
    const email = process.env.ADMIN_EMAIL || 'admin@medwell.ma';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const hash = await bcrypt.hash(password, 12);
    const id = crypto.randomUUID();

    const { rows } = await query(`
      INSERT INTO users (id, unique_id, role, first_name, last_name, email, phone, password_hash, preferred_lang, subscription_status)
      VALUES (?, ?, 'admin', 'MedWell', 'Administrator', ?, ?, ?, 'en', 'active')
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)
    `, [id, 'MW-ADMIN-001', email, phone, hash]);

    console.log('Admin user ready:', email);
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await pool.end();
  }
}

if (require.main === module) seed();
