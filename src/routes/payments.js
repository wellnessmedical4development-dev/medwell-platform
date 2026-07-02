const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { initiatePayment, getMyPayments, getPaymentDetail } = require('../controllers/paymentController');

const router = Router();

router.use(authenticate);

router.post('/initiate', initiatePayment);
router.get('/', getMyPayments);
router.get('/:id', getPaymentDetail);

module.exports = router;
