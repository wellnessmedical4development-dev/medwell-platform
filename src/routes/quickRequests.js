const { Router } = require('express');
const {
  createQuickRequest, listQuickRequests, getMyQuickRequests, updateQuickRequestStatus,
} = require('../controllers/quickRequestController');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = Router();

router.post('/', optionalAuth, createQuickRequest);
router.get('/my', authenticate, getMyQuickRequests);
router.get('/', authenticate, requireAdmin, listQuickRequests);
router.patch('/:id/status', authenticate, requireAdmin, updateQuickRequestStatus);

module.exports = router;
