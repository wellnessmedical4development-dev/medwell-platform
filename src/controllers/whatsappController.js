const Service = require('../models/Service');
const { getWhatsappTemplate } = require('../config/i18n');
const { getWhatsAppUrl } = require('../config/whatsapp');

async function generateLink(req, res) {
  try {
    const { service_id } = req.params;
    const lang = req.language || 'en';
    const userName = req.user ? `${req.user.first_name || ''} ${req.user.last_name || ''}`.trim() : 'Guest';

    let serviceName = 'Wellness Program';
    if (service_id) {
      const service = await Service.findById(service_id);
      if (service) {
        serviceName = service.title?.[lang] || service.title?.en || service.code;
      }
    }

    const text = getWhatsappTemplate(lang, serviceName, userName || 'Guest');
    const url = getWhatsAppUrl(text);

    res.json({
      whatsapp_url: url,
      phone: process.env.WHATSAPP_NUMBER,
      prefilled_text: text,
      language: lang,
    });
  } catch (err) {
    console.error('WhatsApp link error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function generateInquiryLink(req, res) {
  try {
    const lang = req.language || 'en';
    const { name, service } = req.body;

    const text = getWhatsappTemplate(lang, service || 'Wellness Program', name || 'Guest');
    const url = getWhatsAppUrl(text);

    res.json({ whatsapp_url: url, text });
  } catch (err) {
    console.error('WhatsApp inquiry error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

module.exports = { generateLink, generateInquiryLink };
