const { Router } = require('express');
const { authenticate } = require('../middleware/auth');

const router = Router();

const EXPUSH_URL = 'https://exp.host/--/api/v2/push/send';

router.post('/register-token', authenticate, async (req, res) => {
  try {
    const { pushToken } = req.body;
    if (!pushToken) return res.status(400).json({ error: 'pushToken required' });
    const db = req.app.locals.db || require('../config/database');
    if (!db) return res.status(500).json({ error: 'Database not available' });

    await db.query(
      `INSERT INTO push_tokens (user_id, token) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE updated_at = NOW()`,
      [req.user.id, pushToken]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Register push token error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/send', authenticate, async (req, res) => {
  try {
    const { title, body, userIds } = req.body;
    const db = req.app.locals.db || require('../config/database');
    if (!db) return res.status(500).json({ error: 'Database not available' });

    const tokens = userIds && userIds.length > 0
      ? await db.query('SELECT token FROM push_tokens WHERE user_id IN (?)', [userIds])
      : await db.query('SELECT token FROM push_tokens');

    const messages = tokens.map(t => ({
      to: t.token,
      sound: 'default',
      title: title || 'Medical Wellness',
      body: body || '',
      data: { type: 'notification' },
    }));

    const results = await Promise.allSettled(
      messages.map(msg =>
        fetch(EXPUSH_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msg),
        })
      )
    );

    res.json({ sent: results.filter(r => r.status === 'fulfilled').length, total: messages.length });
  } catch (err) {
    console.error('Send push error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
