const { t } = require('i18next');

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: t('errors.forbidden', { lng: req.language }) });
  }
  next();
}

module.exports = { requireAdmin };
