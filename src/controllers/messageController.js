const Message = require('../models/Message');
const User = require('../models/User');

async function getMyMessages(req, res) {
  try {
    const messages = await Message.getUserMessages(req.user.id);
    const unread = await Message.getUnreadCount(req.user.id);
    res.json({ messages, unread });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function markRead(req, res) {
  try {
    await Message.markAsRead(req.params.id, req.user.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function getUnreadCount(req, res) {
  try {
    const count = await Message.getUnreadCount(req.user.id);
    res.json({ unread: count });
  } catch (err) {
    console.error('Unread count error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function broadcastMessage(req, res) {
  try {
    const { subject, body } = req.body;
    if (!subject || !body) {
      return res.status(400).json({ error: 'Subject and body are required' });
    }

    const message = await Message.create({
      subject,
      body,
      created_by: req.user.id,
    });

    const clients = await User.findAll({ role: 'client' });
    for (const client of clients) {
      await Message.addRecipient(message.id, client.id);
    }

    res.json({ success: true, message, recipients: clients.length });
  } catch (err) {
    console.error('Broadcast error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function getSentMessages(req, res) {
  try {
    const stats = await Message.getStats();
    const messages = await Message.findAll();
    res.json({ messages, stats });
  } catch (err) {
    console.error('Get sent messages error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

module.exports = { getMyMessages, markRead, getUnreadCount, broadcastMessage, getSentMessages };
