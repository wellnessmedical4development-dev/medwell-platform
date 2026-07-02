const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

async function runMigrations() {
  const client = await pool.getConnection();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const [rows] = await client.query(
        'SELECT id FROM _migrations WHERE filename = ?', [file]
      );
      if (rows.length > 0) {
        console.log(`SKIP  ${file} (already executed)`);
        continue;
      }
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      console.log(`RUN   ${file}`);
      const statements = sql.split(';').filter(s => s.trim());
      for (const stmt of statements) {
        await client.query(stmt);
      }
      await client.query(
        'INSERT INTO _migrations (filename) VALUES (?)', [file]
      );
    }
    console.log('Migrations complete.');
  } catch (err) {
    console.error('Migration failed:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function runMigrationsStandalone() {
  try {
    await runMigrations();
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrationsStandalone().catch(() => process.exit(1));
}

module.exports = { runMigrations };
