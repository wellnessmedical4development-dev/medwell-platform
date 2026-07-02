const User = require('../models/User');
const WellnessCoinLedger = require('../models/WellnessCoinLedger');
const WalletTransfer = require('../models/WalletTransfer');
const Transaction = require('../models/Transaction');

async function getMyBalance(req, res) {
  try {
    const user = await User.findById(req.user.id);
    const ledger = await WellnessCoinLedger.findByUser(req.user.id);

    res.json({
      balance: user.wellness_coin_balance,
      ledger,
    });
  } catch (err) {
    console.error('Coin balance error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function getLeaderboard(req, res) {
  try {
    const { query } = require('../config/database');
    const { rows } = await query(`
      SELECT id, first_name, last_name, wellness_coin_balance
      FROM users
      WHERE role = 'client' AND wellness_coin_balance > 0
      ORDER BY wellness_coin_balance DESC
      LIMIT 20
    `);
    res.json({ leaderboard: rows });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function searchRecipients(req, res) {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ users: [] });
    }
    const users = await User.findAll({
      role: 'client',
      search: q,
      limit: 20,
    });
    const sanitized = users
      .filter(u => u.id !== req.user.id)
      .map(u => ({
        id: u.id,
        unique_id: u.unique_id,
        first_name: u.first_name,
        last_name: u.last_name,
        phone: u.phone,
        avatar_url: u.avatar_url,
      }));
    res.json({ users: sanitized });
  } catch (err) {
    console.error('Search recipients error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function sendTransfer(req, res) {
  try {
    const { recipient_id, amount, note } = req.body;
    const senderId = req.user.id;

    if (!recipient_id || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid recipient and positive amount are required' });
    }

    if (recipient_id === senderId) {
      return res.status(400).json({ error: 'Cannot send WMC to yourself' });
    }

    const [sender, recipient] = await Promise.all([
      User.findById(senderId),
      User.findById(recipient_id),
    ]);

    if (!sender) return res.status(404).json({ error: 'Sender not found' });
    if (!recipient) return res.status(404).json({ error: 'Recipient not found' });

    const amountNum = parseFloat(amount);
    const senderBalance = parseFloat(sender.wellness_coin_balance);

    if (senderBalance < amountNum) {
      return res.status(400).json({ error: 'Insufficient WMC balance' });
    }

    const newSenderBalance = senderBalance - amountNum;
    const newRecipientBalance = parseFloat(recipient.wellness_coin_balance) + amountNum;

    await Promise.all([
      User.update(senderId, { wellness_coin_balance: newSenderBalance }),
      User.update(recipient_id, { wellness_coin_balance: newRecipientBalance }),
    ]);

    const transfer = await WalletTransfer.create({
      sender_id: senderId,
      recipient_id,
      amount: amountNum,
      note: note || null,
    });

    await Promise.all([
      WellnessCoinLedger.create({
        user_id: senderId,
        operation: 'transferred',
        amount: amountNum,
        running_balance: newSenderBalance,
        reference_type: 'wmc_transfer',
        reference_id: transfer.id,
        description: note
          ? `Sent ${amountNum} WMC to ${recipient.first_name} ${recipient.last_name} — ${note}`
          : `Sent ${amountNum} WMC to ${recipient.first_name} ${recipient.last_name}`,
      }),
      WellnessCoinLedger.create({
        user_id: recipient_id,
        operation: 'earned',
        amount: amountNum,
        running_balance: newRecipientBalance,
        reference_type: 'wmc_transfer',
        reference_id: transfer.id,
        description: note
          ? `Received ${amountNum} WMC from ${sender.first_name} ${sender.last_name} — ${note}`
          : `Received ${amountNum} WMC from ${sender.first_name} ${sender.last_name}`,
      }),
    ]);

    const { query } = require('../config/database');
    await query(`
      UPDATE users SET updated_at = NOW() WHERE id IN (?, ?)
    `, [senderId, recipient_id]);

    res.json({
      transfer: {
        id: transfer.id,
        amount: amountNum,
        recipient: { id: recipient_id, first_name: recipient.first_name, last_name: recipient.last_name },
        note: note || null,
        created_at: transfer.created_at,
      },
      new_balance: newSenderBalance,
    });
  } catch (err) {
    console.error('Send transfer error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function getTransferHistory(req, res) {
  try {
    const transfers = await WalletTransfer.findByUser(req.user.id);
    const userIds = new Set();
    transfers.forEach(t => { userIds.add(t.sender_id); userIds.add(t.recipient_id); });

    const { query } = require('../config/database');
    const { rows: users } = userIds.size
      ? await query(`SELECT id, first_name, last_name, phone FROM users WHERE id IN (${Array.from(userIds).map(() => '?').join(',')})`, Array.from(userIds))
      : { rows: [] };

    const userMap = {};
    users.forEach(u => { userMap[u.id] = u; });

    const enriched = transfers.map(t => ({
      ...t,
      is_sent: t.sender_id === req.user.id,
      sender: userMap[t.sender_id] || null,
      recipient: userMap[t.recipient_id] || null,
    }));

    res.json({ transfers: enriched });
  } catch (err) {
    console.error('Transfer history error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

module.exports = { getMyBalance, getLeaderboard, searchRecipients, sendTransfer, getTransferHistory };
