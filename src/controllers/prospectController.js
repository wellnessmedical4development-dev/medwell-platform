const Prospect = require('../models/Prospect');
const User = require('../models/User');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

const N8N_API_KEY = process.env.N8N_API_KEY || 'your_n8n_api_key';

async function n8nWebhookIntake(req, res) {
  try {
    const apiKey = req.headers['x-n8n-api-key'] || req.query.api_key;
    if (!apiKey || apiKey !== N8N_API_KEY) {
      return res.status(401).json({ error: 'Invalid or missing API key' });
    }

    const {
      full_name, name, phone, email,
      interested_service, interested_program, service_code,
      n8n_workflow_id, n8n_execution_id,
      conversation_text, conversation_log,
      scheduled_at, notes,
    } = req.body;

    const prospectName = full_name || name || req.body.prospect_name;
    const prospectPhone = phone || req.body.prospect_phone;
    const prospectEmail = email || req.body.prospect_email;
    const program = interested_service || interested_program || req.body.interested_program;

    if (!prospectName || !prospectPhone) {
      return res.status(400).json({
        error: 'Validation failed',
        details: 'full_name (or name) and phone are required',
      });
    }

    let serviceId = null;
    if (service_code) {
      const svc = await Service.findByCode(service_code);
      if (svc) serviceId = svc.id;
    }

    const rawPayload = req.body;

    const prospect = await Prospect.create({
      full_name: prospectName,
      phone: prospectPhone.replace(/[^0-9+]/g, ''),
      email: prospectEmail,
      interested_service: program,
      service_id: serviceId,
      source: 'whatsapp',
      status: 'new',
      n8n_workflow_id: n8n_workflow_id || rawPayload.workflow_id,
      n8n_execution_id: n8n_execution_id || rawPayload.execution_id,
      conversation_log: conversation_log || (conversation_text ? { text: conversation_text } : null),
      raw_payload: rawPayload,
      notes,
    });

    if (scheduled_at) {
      await Appointment.create({
        prospect_id: prospect.id,
        prospect_name: prospectName,
        prospect_phone: prospectPhone,
        prospect_email: prospectEmail,
        interested_program: program,
        service_id: serviceId,
        status: 'pending',
        n8n_workflow_id: n8n_workflow_id,
        n8n_execution_id: n8n_execution_id,
        raw_payload: rawPayload,
        scheduled_at: new Date(scheduled_at),
      });
    }

    res.status(201).json({
      success: true,
      prospect_id: prospect.id,
      message: 'Prospect captured successfully',
      appointment_scheduled: !!scheduled_at,
    });
  } catch (err) {
    console.error('n8n webhook intake error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

async function listProspects(req, res) {
  try {
    const { status, search, limit, offset } = req.query;
    const prospects = await Prospect.findAll({
      status, search,
      limit: parseInt(limit, 10) || 50,
      offset: parseInt(offset, 10) || 0,
    });
    res.json({ prospects, count: prospects.length });
  } catch (err) {
    console.error('List prospects error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getProspectById(req, res) {
  try {
    const prospect = await Prospect.findById(req.params.id);
    if (!prospect) return res.status(404).json({ error: 'Prospect not found' });
    res.json({ prospect });
  } catch (err) {
    console.error('Get prospect error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateProspectStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, notes, assigned_to } = req.body;

    const prospect = await Prospect.findById(id);
    if (!prospect) return res.status(404).json({ error: 'Prospect not found' });

    const validStatuses = ['new', 'contacted', 'qualified', 'converted', 'lost'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (assigned_to) updateData.assigned_to = assigned_to;
    if (status === 'contacted' && !prospect.first_contacted_at) {
      updateData.first_contacted_at = new Date();
    }

    const updated = await Prospect.update(id, updateData);
    res.json({ prospect: updated });
  } catch (err) {
    console.error('Update prospect error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getProspectStats(req, res) {
  try {
    const stats = await Prospect.getStats();
    res.json(stats);
  } catch (err) {
    console.error('Prospect stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  n8nWebhookIntake,
  listProspects,
  getProspectById,
  updateProspectStatus,
  getProspectStats,
};
