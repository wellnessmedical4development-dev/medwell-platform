const { Router } = require('express');
const {
  getDashboardStats,
  getClients,
  getClientDetail,
  adjustWellnessCoins,
  updateClient,
  searchUsers,
  getAppointments,
} = require('../controllers/adminController');
const { broadcastMessage, getSentMessages } = require('../controllers/messageController');
const { importCsv, previewImport, getStats, getUnlinked } = require('../controllers/legacyController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { upload } = require('../middleware/upload');

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', getDashboardStats);

router.get('/clients', getClients);
router.get('/clients/:id', getClientDetail);
router.patch('/clients/:id', updateClient);
router.post('/clients/:id/wellness-coins', adjustWellnessCoins);

router.get('/users/search', searchUsers);

router.get('/legacy/stats', getStats);
router.get('/legacy/unlinked', getUnlinked);
router.post('/legacy/import', upload.single('file'), importCsv);
router.post('/legacy/preview', upload.single('file'), previewImport);

router.get('/appointments', getAppointments);

router.post('/messages/broadcast', broadcastMessage);
router.get('/messages', getSentMessages);

module.exports = router;
