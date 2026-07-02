const User = require('../models/User');
const ReferralReward = require('../models/ReferralReward');

async function getMyReferralInfo(req, res) {
  try {
    const user = await User.findById(req.user.id);
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
    const link = `${baseUrl}/register?ref=${user.referral_code}`;

    const rewards = await ReferralReward.findByReferrer(req.user.id);

    res.json({
      referral_code: user.referral_code,
      referral_link: link,
      total_rewards: rewards.reduce((sum, r) => sum + parseFloat(r.reward_amount), 0),
      pending_rewards: rewards.filter(r => r.status === 'pending').reduce((sum, r) => sum + parseFloat(r.reward_amount), 0),
      referrals: rewards,
    });
  } catch (err) {
    console.error('Referral info error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function claimReferral(req, res) {
  try {
    const { referral_code } = req.body;
    if (!referral_code) {
      return res.status(400).json({ error: 'Referral code is required' });
    }

    const referrer = await User.findByReferralCode(referral_code);
    if (!referrer) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    if (referrer.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot refer yourself' });
    }

    await User.update(req.user.id, { referred_by: referrer.id });
    await ReferralReward.create({
      referrer_id: referrer.id,
      referred_id: req.user.id,
    });

    res.json({ success: true, message: 'Referral linked successfully' });
  } catch (err) {
    console.error('Claim referral error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

module.exports = { getMyReferralInfo, claimReferral };
