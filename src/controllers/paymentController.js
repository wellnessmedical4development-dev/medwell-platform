const Payment = require('../models/Payment');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

async function initiatePayment(req, res) {
  try {
    const { amount, currency, payment_method, subscription_id } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: req.t('errors.invalid_input') });
    }

    const payment = await Payment.create({
      user_id: req.user.id,
      subscription_id,
      amount,
      currency: currency || 'MAD',
      payment_method: payment_method || 'card',
      status: 'pending',
      metadata: { initiated_by: req.user.id, method: payment_method },
    });

    const delay = payment_method === 'wellness_coin' ? 500 : 2000;
    await new Promise(resolve => setTimeout(resolve, delay));

    let success = true;
    let failReason = null;

    if (payment_method === 'wellness_coin') {
      const user = await User.findById(req.user.id);
      const coinBalance = parseFloat(user.wellness_coin_balance);
      if (coinBalance < parseFloat(amount)) {
        success = false;
        failReason = 'Insufficient WellnessCoin balance';
      } else {
        const newBalance = coinBalance - parseFloat(amount);
        await User.update(req.user.id, { wellness_coin_balance: newBalance });
        const WellnessCoinLedger = require('../models/WellnessCoinLedger');
        await WellnessCoinLedger.create({
          user_id: req.user.id,
          operation: 'spent',
          amount: parseFloat(amount),
          running_balance: newBalance,
          reference_type: 'payment',
          reference_id: payment.id,
          description: `Payment with WellnessCoins`,
        });
      }
    }

    if (success) {
      await Payment.updateStatus(payment.id, 'completed');
      const updatedPayment = await Payment.findById(payment.id);

      try {
        await Transaction.create({
          user_id: req.user.id,
          subscription_id,
          type: 'payment',
          amount: parseFloat(amount),
          currency: currency || 'MAD',
          description: `Payment via ${payment_method} - ref: ${updatedPayment.reference}`,
          reference: updatedPayment.reference,
        });
      } catch (txErr) {
        console.warn('Transaction logging skipped:', txErr.message);
      }

      const user = await User.findById(req.user.id);
      if (user) {
        const totalPaid = await Payment.getTotalPaidByUser(req.user.id);
        const newRemaining = Math.max(0, parseFloat(user.amount_remaining || 0) - parseFloat(amount));
        await User.update(req.user.id, {
          total_paid: totalPaid,
          amount_remaining: newRemaining,
          subscription_status: 'active',
        });
      }

      return res.json({
        success: true,
        payment: updatedPayment,
        message: 'Payment completed successfully',
      });
    }

    await Payment.updateStatus(payment.id, 'failed');
    const failedPayment = await Payment.findById(payment.id);
    return res.status(400).json({
      success: false,
      payment: failedPayment,
      message: failReason || 'Payment failed',
    });
  } catch (err) {
    console.error('Initiate payment error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function getMyPayments(req, res) {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;
    const payments = await Payment.findByUser(req.user.id, limit, offset);
    res.json({ payments });
  } catch (err) {
    console.error('Get payments error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function getPaymentDetail(req, res) {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: req.t('errors.not_found') });
    if (payment.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: req.t('errors.forbidden') });
    }
    res.json({ payment });
  } catch (err) {
    console.error('Get payment detail error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

module.exports = { initiatePayment, getMyPayments, getPaymentDetail };
