const Service = require('../models/Service');
const { getWhatsappTemplate } = require('../config/i18n');
const { getWhatsAppUrl } = require('../config/whatsapp');

async function getAll(req, res) {
  try {
    const services = await Service.findAll(true);
    const lang = req.language || 'en';

    const enriched = services.map(s => ({
      ...s,
      title_localized: s.title?.[lang] || s.title?.en,
      description_localized: s.description?.[lang] || s.description?.en,
      short_desc_localized: s.short_desc?.[lang] || s.short_desc?.en,
      whatsapp_url: getWhatsAppUrl(
        getWhatsappTemplate(lang, s.title?.[lang] || s.title?.en, 'Guest')
      ),
    }));

    res.json({ services: enriched });
  } catch (err) {
    console.error('Get services error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function getById(req, res) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: req.t('errors.not_found') });

    const lang = req.language || 'en';
    service.title_localized = service.title?.[lang] || service.title?.en;
    service.description_localized = service.description?.[lang] || service.description?.en;
    service.short_desc_localized = service.short_desc?.[lang] || service.short_desc?.en;
    service.whatsapp_url = getWhatsAppUrl(
      getWhatsappTemplate(lang, service.title?.[lang] || service.title?.en, 'Guest')
    );

    res.json({ service });
  } catch (err) {
    console.error('Get service error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function create(req, res) {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ service });
  } catch (err) {
    console.error('Create service error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const existing = await Service.findById(id);
    if (!existing) return res.status(404).json({ error: req.t('errors.not_found') });

    const service = await Service.update(id, req.body);
    res.json({ service });
  } catch (err) {
    console.error('Update service error:', err);
    res.status(500).json({ error: req.t('errors.server_error') });
  }
}

module.exports = { getAll, getById, create, update };
