const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

const WORKING_HOURS = { start: 9, end: 18 };
const SLOT_DURATION = 60;

function generateTimeSlots(date) {
  const slots = [];
  const d = new Date(date);
  d.setHours(WORKING_HOURS.start, 0, 0, 0);
  const end = new Date(date);
  end.setHours(WORKING_HOURS.end, 0, 0, 0);
  while (d < end) {
    slots.push(new Date(d));
    d.setMinutes(d.getMinutes() + SLOT_DURATION);
  }
  return slots;
}

async function getAvailableSlots(req, res) {
  try {
    const dateStr = req.query.date;
    if (!dateStr) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const slots = generateTimeSlots(tomorrow);
      return res.json({ slots: slots.map(s => s.toISOString()), date: tomorrow.toISOString().split('T')[0] });
    }
    const date = new Date(dateStr);
    const allSlots = generateTimeSlots(date);
    const dateEnd = new Date(date);
    dateEnd.setDate(dateEnd.getDate() + 1);
    const { rows: booked } = await require('../config/database').query(
      "SELECT scheduled_at FROM appointments WHERE DATE(scheduled_at) = ? AND status NOT IN ('cancelled')",
      [dateStr]
    );
    const bookedTimes = new Set(booked.map(b => new Date(b.scheduled_at).getTime()));
    const available = allSlots.filter(s => !bookedTimes.has(s.getTime()));
    res.json({ slots: available.map(s => s.toISOString()), date: dateStr });
  } catch (err) {
    console.error('Get slots error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function bookAppointment(req, res) {
  try {
    const { service_id, scheduled_at, notes } = req.body;
    if (!scheduled_at) return res.status(400).json({ error: 'scheduled_at is required' });

    const service = service_id ? await Service.findById(service_id) : null;
    const crypto = require('crypto');
    const appointment = await Appointment.create({
      id: crypto.randomUUID(),
      user_id: req.user.id,
      service_id: service_id || null,
      prospect_name: `${req.user.first_name || ''} ${req.user.last_name || ''}`.trim() || 'Client',
      prospect_phone: req.user.phone || '',
      prospect_email: req.user.email || '',
      interested_program: service ? (service.title?.en || service.code) : null,
      scheduled_at,
      status: 'pending',
      raw_payload: JSON.stringify({ booked_by: req.user.id, notes, source: 'client_portal' }),
    });

    res.status(201).json({ appointment });
  } catch (err) {
    console.error('Book appointment error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function getMyAppointments(req, res) {
  try {
    const { rows } = await require('../config/database').query(
      `SELECT a.*, s.title AS service_title, s.code AS service_code
       FROM appointments a
       LEFT JOIN services s ON s.id = a.service_id
       WHERE a.user_id = ? OR a.prospect_phone = ?
       ORDER BY a.scheduled_at DESC`,
      [req.user.id, req.user.phone]
    );
    res.json({ appointments: rows });
  } catch (err) {
    console.error('Get my appointments error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function cancelAppointment(req, res) {
  try {
    const apt = await Appointment.findById(req.params.id);
    if (!apt) return res.status(404).json({ error: req.t('errors.not_found') });
    if (apt.user_id !== req.user.id && apt.prospect_phone !== req.user.phone && req.user.role !== 'admin') {
      return res.status(403).json({ error: req.t('errors.forbidden') });
    }
    const cancelled = await Appointment.updateStatus(req.params.id, 'cancelled');
    res.json({ appointment: cancelled });
  } catch (err) {
    console.error('Cancel appointment error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

module.exports = { getAvailableSlots, bookAppointment, getMyAppointments, cancelAppointment };
