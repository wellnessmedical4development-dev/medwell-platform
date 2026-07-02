const { Router } = require('express');
const {
  getMySubscriptions,
  create,
  cancel,
  renew,
  getFinancialOverview,
} = require('../controllers/subscriptionController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

router.use(authenticate);

router.get('/', getMySubscriptions);
router.get('/financial-overview', getFinancialOverview);
router.post('/', validate({
  service_id: ['required'],
  amount: ['required'],
}), create);
router.post('/:id/cancel', cancel);
router.post('/:id/renew', renew);

module.exports = router;
