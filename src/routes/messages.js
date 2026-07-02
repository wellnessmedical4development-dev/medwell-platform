const { Router } = require('express');
const { getMyMessages, markRead, getUnreadCount } = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/', authenticate, getMyMessages);
router.get('/unread-count', authenticate, getUnreadCount);
router.patch('/:id/read', authenticate, markRead);

module.exports = router;
