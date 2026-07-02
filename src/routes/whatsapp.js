const { Router } = require('express');
const { generateLink, generateInquiryLink } = require('../controllers/whatsappController');
const { optionalAuth } = require('../middleware/auth');

const router = Router();

router.get('/link/:service_id?', optionalAuth, generateLink);
router.post('/inquiry', generateInquiryLink);

module.exports = router;
