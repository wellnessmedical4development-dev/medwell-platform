const { t } = require('i18next');

function validate(schema) {
  return (req, res, next) => {
    const errors = [];
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      for (const rule of rules) {
        if (rule === 'required' && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
        }
        if (rule === 'phone' && value && !/^\+?[0-9]{7,15}$/.test(value)) {
          errors.push(`${field} must be a valid phone number`);
        }
        if (rule === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field} must be a valid email`);
        }
        if (rule === 'password' && value && value.length < 6) {
          errors.push(`${field} must be at least 6 characters`);
        }
        if (typeof rule === 'object' && rule.minLength && value && value.length < rule.minLength) {
          errors.push(`${field} must be at least ${rule.minLength} characters`);
        }
      }
    }
    if (errors.length) {
      return res.status(400).json({ error: t('errors.validation_error', { lng: req.language }), details: errors });
    }
    next();
  };
}

module.exports = { validate };
