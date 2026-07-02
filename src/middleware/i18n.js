const { SUPPORTED_LANGS, DEFAULT_LANG } = require('../config/i18n');

function setLang(req, res, next) {
  const lang = req.query.lang || req.cookies?.i18next || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || DEFAULT_LANG;
  req.language = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  next();
}

function rtlRedirect(req, res, next) {
  const rtlLangs = ['ar'];
  res.locals.isRtl = rtlLangs.includes(req.language);
  next();
}

module.exports = { setLang, rtlRedirect };
