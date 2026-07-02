const { Router } = require('express');
const {
  n8nWebhookIntake,
  listProspects,
  getProspectById,
  updateProspectStatus,
  getProspectStats,
} = require('../controllers/prospectController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = Router();

router.post('/webhook', n8nWebhookIntake);

router.get('/stats', authenticate, requireAdmin, getProspectStats);
router.get('/', authenticate, requireAdmin, listProspects);
router.get('/:id', authenticate, requireAdmin, getProspectById);
router.patch('/:id/status', authenticate, requireAdmin, updateProspectStatus);

module.exports = router;
