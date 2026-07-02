const { query } = require('../config/database');
const crypto = require('crypto');

const Message = {
  async create(data) {
    const id = crypto.randomUUID();
    await query(
      'INSERT INTO admin_messages (id, subject, body, created_by) VALUES (?, ?, ?, ?)',
      [id, data.subject, data.body, data.created_by]
    );
    return this.findById(id);
  },

  async findById(id) {
    const { rows } = await query('SELECT * FROM admin_messages WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findAll() {
    const { rows } = await query('SELECT * FROM admin_messages ORDER BY created_at DESC');
    return rows;
  },

  async addRecipient(messageId, userId) {
    const id = crypto.randomUUID();
    await query(
      'INSERT INTO message_recipients (id, message_id, user_id) VALUES (?, ?, ?)',
      [id, messageId, userId]
    );
  },

  async getUnreadCount(userId) {
    const { rows } = await query(
      'SELECT COUNT(*) AS count FROM message_recipients WHERE user_id = ? AND read_at IS NULL',
      [userId]
    );
    return rows[0].count;
  },

  async getUserMessages(userId) {
    const { rows } = await query(`
      SELECT m.id, m.subject, m.body, m.created_at, mr.read_at
      FROM admin_messages m
      JOIN message_recipients mr ON mr.message_id = m.id
      WHERE mr.user_id = ?
      ORDER BY m.created_at DESC
    `, [userId]);
    return rows;
  },

  async markAsRead(messageId, userId) {
    await query(
      'UPDATE message_recipients SET read_at = NOW() WHERE message_id = ? AND user_id = ?',
      [messageId, userId]
    );
  },

  async getStats() {
    const { rows } = await query(`
      SELECT COUNT(*) AS total, SUM(CASE WHEN read_at IS NULL THEN 1 ELSE 0 END) AS unread
      FROM message_recipients
    `);
    return rows[0];
  },
};

module.exports = Message;
