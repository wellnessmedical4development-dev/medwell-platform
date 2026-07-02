const { Router } = require('express');
const { n8nWebhookIntake } = require('../controllers/prospectController');
const { confirmAppointment } = require('../controllers/n8nController');

const router = Router();

router.post('/webhook', n8nWebhookIntake);
router.post('/appointments/:id/confirm', confirmAppointment);

module.exports = router;
