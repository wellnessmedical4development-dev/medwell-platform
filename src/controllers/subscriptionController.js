const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const WellnessCoinLedger = require('../models/WellnessCoinLedger');
const ReferralReward = require('../models/ReferralReward');

async function getMySubscriptions(req, res) {
  try {
    const subs = await Subscription.findByUser(req.user.id);
    res.json({ subscriptions: subs });
  } catch (err) {
    console.error('Get subscriptions error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function create(req, res) {
  try {
    const { service_id, interval, amount, currency } = req.body;
    const existingCount = await Subscription.getActiveCountByUser(req.user.id);

    const sub = await Subscription.create({
      user_id: req.user.id,
      service_id,
      interval: interval || 'monthly',
      amount,
      currency: currency || 'MAD',
      start_date: new Date(),
      end_date: calculateEndDate(interval || 'monthly'),
    });

    await User.update(req.user.id, {
      subscription_status: 'active',
      total_paid: Math.round((parseFloat(existingCount > 0 ? (await User.findById(req.user.id)).total_paid : 0) + parseFloat(amount)) * 100) / 100,
    });

    await Transaction.create({
      user_id: req.user.id,
      subscription_id: sub.id,
      type: 'payment',
      amount,
      currency: currency || 'MAD',
      description: `New subscription - ${sub.id}`,
    });

    const userData = await User.findById(req.user.id);
    if (userData && userData.referred_by) {
      const pendingRewards = await ReferralReward.findPendingByReferred(req.user.id);
      for (const reward of pendingRewards) {
        const awarded = await ReferralReward.award(reward.id);
        if (awarded && parseFloat(awarded.reward_amount) > 0) {
          const referrer = await User.findById(awarded.referrer_id);
          if (referrer) {
            const newBal = parseFloat(referrer.wellness_coin_balance) + parseFloat(awarded.reward_amount);
            await User.update(awarded.referrer_id, { wellness_coin_balance: newBal });
            await WellnessCoinLedger.create({
              user_id: awarded.referrer_id,
              operation: 'earned',
              amount: parseFloat(awarded.reward_amount),
              running_balance: newBal,
              reference_type: 'referral',
              reference_id: awarded.id,
              description: `Referral bonus - ${userData.first_name} ${userData.last_name} subscribed`,
            });
          }
        }
      }
    }

    res.status(201).json({ subscription: sub });
  } catch (err) {
    console.error('Create subscription error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function cancel(req, res) {
  try {
    const { id } = req.params;
    const sub = await Subscription.findById(id);

    if (!sub) return res.status(404).json({ error: req.t('errors.not_found') });
    if (sub.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: req.t('errors.forbidden') });
    }

    const { cancel_reason } = req.body;
    const cancelled = await Subscription.cancel(id, cancel_reason || 'User requested');

    await Transaction.create({
      user_id: req.user.id,
      subscription_id: id,
      type: 'subscription_cancellation',
      amount: 0,
      description: `Subscription cancelled. Reason: ${cancel_reason || 'User requested'}`,
    });

    const activeCount = await Subscription.getActiveCountByUser(req.user.id);
    if (activeCount === 0) {
      await User.update(req.user.id, { subscription_status: 'cancelled' });
    }

    res.json({ subscription: cancelled });
  } catch (err) {
    console.error('Cancel subscription error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function renew(req, res) {
  try {
    const { id } = req.params;
    const sub = await Subscription.findById(id);

    if (!sub) return res.status(404).json({ error: req.t('errors.not_found') });
    if (sub.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: req.t('errors.forbidden') });
    }

    const newEndDate = calculateEndDate(sub.interval, new Date());
    const renewed = await Subscription.renew(id, newEndDate);

    await User.update(req.user.id, {
      subscription_status: 'active',
      total_paid: Math.round((parseFloat((await User.findById(req.user.id)).total_paid) + parseFloat(sub.amount)) * 100) / 100,
    });

    await Transaction.create({
      user_id: req.user.id,
      subscription_id: id,
      type: 'subscription_renewal',
      amount: sub.amount,
      currency: sub.currency,
      description: `Subscription renewed - ${sub.id}`,
    });

    const coinReward = Math.floor(parseFloat(sub.amount) * 0.02); // 2% cashback as coins
    if (coinReward > 0) {
      const user = await User.findById(req.user.id);
      const newBalance = parseFloat(user.wellness_coin_balance) + coinReward;
      await User.update(req.user.id, { wellness_coin_balance: newBalance });

      await WellnessCoinLedger.create({
        user_id: req.user.id,
        operation: 'earned',
        amount: coinReward,
        running_balance: newBalance,
        reference_type: 'subscription',
        reference_id: id,
        description: `Renewal coin reward (${coinReward} coins)`,
      });
    }

    res.json({ subscription: renewed });
  } catch (err) {
    console.error('Renew subscription error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

function calculateEndDate(interval, from = new Date()) {
  const d = new Date(from);
  switch (interval) {
    case 'monthly': d.setMonth(d.getMonth() + 1); break;
    case 'quarterly': d.setMonth(d.getMonth() + 3); break;
    case 'annual': d.setFullYear(d.getFullYear() + 1); break;
    default: d.setMonth(d.getMonth() + 1);
  }
  return d;
}

async function getFinancialOverview(req, res) {
  try {
    const user = await User.findById(req.user.id);
    const transactions = user ? await Transaction.findByUser(req.user.id) : [];
    const coinLedger = user ? await WellnessCoinLedger.findByUser(req.user.id) : [];
    const subs = user ? await Subscription.findByUser(req.user.id, true) : [];

    res.json({
      financial: {
        wellness_coin_balance: user ? user.wellness_coin_balance : 0,
        subscription_status: user ? user.subscription_status : 'inactive',
        total_paid: user ? user.total_paid : 0,
        amount_remaining: user ? user.amount_remaining : 0,
      },
      transactions,
      coin_ledger: coinLedger,
      active_subscriptions: subs,
    });
  } catch (err) {
    console.error('Financial overview error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

module.exports = { getMySubscriptions, create, cancel, renew, getFinancialOverview };
