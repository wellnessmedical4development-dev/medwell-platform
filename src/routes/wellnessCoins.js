const { Router } = require('express');
const {
  getMyBalance,
  getLeaderboard,
  searchRecipients,
  sendTransfer,
  getTransferHistory,
} = require('../controllers/wellnessCoinController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/my-balance', authenticate, getMyBalance);
router.get('/leaderboard', getLeaderboard);

router.get('/transfer/search', authenticate, searchRecipients);
router.post('/transfer/send', authenticate, sendTransfer);
router.get('/transfer/history', authenticate, getTransferHistory);

module.exports = router;
