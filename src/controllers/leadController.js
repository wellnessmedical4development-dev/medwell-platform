const Prospect = require('../models/Prospect');

async function createLead(req, res) {
  try {
    const { full_name, phone, email } = req.body;

    if (!full_name || !phone) {
      return res.status(400).json({
        error: 'Validation failed',
        details: 'full_name and phone are required',
      });
    }

    const cleanedPhone = phone.replace(/[^0-9+]/g, '');

    const prospect = await Prospect.create({
      full_name,
      phone: cleanedPhone,
      email: email || null,
      source: 'app_preorder',
      status: 'new',
    });

    res.status(201).json({
      success: true,
      prospect_id: prospect.id,
      message: 'Pre-order registered successfully',
    });
  } catch (err) {
    console.error('Create lead error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
}

module.exports = { createLead };
