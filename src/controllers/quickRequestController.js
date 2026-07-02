const QuickRequest = require('../models/QuickRequest');
const User = require('../models/User');

const N8N_NEW_LEAD_WEBHOOK = process.env.N8N_NEW_LEAD_WEBHOOK || 'http://localhost:5678/webhook/medwell-lead';
const N8N_STATUS_UPDATE_WEBHOOK = process.env.N8N_STATUS_UPDATE_WEBHOOK || 'http://localhost:5678/webhook/medwell-status';
const axios = require('axios');

async function triggerN8nWebhook(url, payload) {
  try {
    await axios.post(url, payload, { timeout: 5000 });
  } catch (err) {
    console.error('n8n webhook error:', err.message);
  }
}

let io = null;
function setIo(socketIo) { io = socketIo; }

async function createQuickRequest(req, res) {
  try {
    const { name, phone, gender, service_requested, preferred_call_date, preferred_call_time } = req.body;
    if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

    let userId = null;
    if (req.user) userId = req.user.id;

    const request = await QuickRequest.create({
      user_id: userId, name, phone: phone.replace(/[^0-9+]/g, ''),
      gender: gender || 'homme', service_requested, preferred_call_date, preferred_call_time,
    });

    const timestamp = new Date().toISOString();
    if (io) io.emit('quick_request:new', request);

    triggerN8nWebhook(N8N_NEW_LEAD_WEBHOOK, {
      event: 'new_lead',
      id: request.id, name, phone, gender, service_requested,
      preferred_call_date, preferred_call_time, timestamp,
    });

    res.status(201).json({ success: true, request });
  } catch (err) {
    console.error('Create quick request error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function listQuickRequests(req, res) {
  try {
    const { status, search, limit, offset } = req.query;
    const requests = await QuickRequest.findAll({
      status, search,
      limit: parseInt(limit, 10) || 50,
      offset: parseInt(offset, 10) || 0,
    });
    res.json({ requests, count: requests.length });
  } catch (err) {
    console.error('List quick requests error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMyQuickRequests(req, res) {
  try {
    const requests = await QuickRequest.findByUser(req.user.id);
    const pendingCall = requests.filter(r => r.status === 'pending_call').length;
    const callAttempted = requests.filter(r => r.status === 'call_attempted').length;
    const confirmed = requests.filter(r => r.status === 'confirmed').length;
    res.json({ requests, counts: { pending_call: pendingCall, call_attempted: callAttempted, confirmed } });
  } catch (err) {
    console.error('My quick requests error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateQuickRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, internal_notes } = req.body;
    if (!['pending_call', 'call_attempted', 'confirmed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const request = await QuickRequest.findById(id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const updateData = { status };
    if (internal_notes !== undefined) updateData.internal_notes = internal_notes;
    const updated = await QuickRequest.update(id, updateData);

    if (io) io.emit('quick_request:updated', updated);

    triggerN8nWebhook(N8N_STATUS_UPDATE_WEBHOOK, {
      event: 'status_update',
      id: updated.id, name: updated.name, phone: updated.phone,
      previous_status: request.status, new_status: status, internal_notes, timestamp: new Date().toISOString(),
    });

    res.json({ request: updated });
  } catch (err) {
    console.error('Update quick request error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { createQuickRequest, listQuickRequests, getMyQuickRequests, updateQuickRequestStatus, setIo };
