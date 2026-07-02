const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { getAvailableSlots, bookAppointment, getMyAppointments, cancelAppointment } = require('../controllers/appointmentController');

const router = Router();

router.get('/slots', getAvailableSlots);
router.get('/my', authenticate, getMyAppointments);
router.post('/', authenticate, bookAppointment);
router.post('/:id/cancel', authenticate, cancelAppointment);

module.exports = router;
