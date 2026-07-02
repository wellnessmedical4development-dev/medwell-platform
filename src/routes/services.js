const { Router } = require('express');
const { getAll, getById, create, update } = require('../controllers/serviceController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);

router.post('/', authenticate, requireAdmin, create);
router.put('/:id', authenticate, requireAdmin, update);

module.exports = router;
