const { query } = require('../config/database');
const crypto = require('crypto');

const REFERRAL_BONUS = 50;

const ReferralReward = {
  async create(data) {
    const id = crypto.randomUUID();
    await query(`
      INSERT INTO referral_rewards (id, referrer_id, referred_id)
      VALUES (?, ?, ?)
    `, [id, data.referrer_id, data.referred_id]);
    return this.findById(id);
  },

  async findById(id) {
    const { rows } = await query('SELECT * FROM referral_rewards WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async findByReferrer(referrerId) {
    const { rows } = await query(
      'SELECT * FROM referral_rewards WHERE referrer_id = ? ORDER BY created_at DESC',
      [referrerId]
    );
    return rows;
  },

  async findPendingByReferred(referredId) {
    const { rows } = await query(
      "SELECT * FROM referral_rewards WHERE referred_id = ? AND status = 'pending'",
      [referredId]
    );
    return rows;
  },

  async award(rewardId) {
    const id = crypto.randomUUID();
    await query(
      "UPDATE referral_rewards SET status = 'awarded', reward_amount = ?, awarded_at = NOW() WHERE id = ?",
      [REFERRAL_BONUS, rewardId]
    );
    return this.findById(rewardId);
  },

  getBonusAmount() {
    return REFERRAL_BONUS;
  },
};

module.exports = ReferralReward;
