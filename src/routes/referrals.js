const { Router } = require('express');
const { getMyReferralInfo, claimReferral } = require('../controllers/referralController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/my-info', authenticate, getMyReferralInfo);
router.post('/claim', authenticate, claimReferral);

module.exports = router;
