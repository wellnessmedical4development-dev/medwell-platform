const Appointment = require('../models/Appointment');
const User = require('../models/User');

const N8N_API_KEY = process.env.N8N_API_KEY || 'your_n8n_api_key';

async function webhookReceiver(req, res) {
  try {
    const apiKey = req.headers['x-n8n-api-key'] || req.query.api_key;
    if (apiKey !== N8N_API_KEY) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    const { name, phone, email, interested_program, n8n_workflow_id, n8n_execution_id, scheduled_at } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'name and phone are required' });
    }

    let userId = null;
    const existingUser = await User.findByPhone(phone);
    if (existingUser) {
      userId = existingUser.id;
    }

    const appointment = await Appointment.create({
      user_id: userId,
      prospect_name: name,
      prospect_phone: phone,
      prospect_email: email,
      interested_program,
      status: 'pending',
      n8n_workflow_id,
      n8n_execution_id,
      raw_payload: req.body,
      scheduled_at: scheduled_at || null,
    });

    res.status(201).json({
      success: true,
      appointment_id: appointment.id,
      message: 'Appointment logged successfully',
    });
  } catch (err) {
    console.error('n8n webhook error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function confirmAppointment(req, res) {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const updated = await Appointment.updateStatus(id, 'confirmed');
    res.json({ appointment: updated });
  } catch (err) {
    console.error('Confirm appointment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { webhookReceiver, confirmAppointment };
