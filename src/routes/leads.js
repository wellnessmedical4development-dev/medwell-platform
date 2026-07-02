const { Router } = require('express');
const { createLead } = require('../controllers/leadController');

const router = Router();

router.post('/', createLead);

module.exports = router;
