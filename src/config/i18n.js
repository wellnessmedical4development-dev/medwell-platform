const path = require('path');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware');

const SUPPORTED_LANGS = (process.env.SUPPORTED_LANGS || 'ar,fr,en,es').split(',');
const DEFAULT_LANG = process.env.DEFAULT_LANG || 'fr';

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: DEFAULT_LANG,
    preload: SUPPORTED_LANGS,
    supportedLngs: [...SUPPORTED_LANGS, 'de', 'it', 'ru', 'zh'],
    ns: ['common', 'services', 'auth', 'admin', 'client'],
    defaultNS: 'common',
    backend: {
      loadPath: path.join(__dirname, '..', 'locales', '{{lng}}', '{{ns}}.json'),
    },
    detection: {
      order: ['querystring', 'cookie', 'header'],
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      caches: ['cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
  });

const getWhatsappTemplate = (lang, serviceName, userName) => {
  const templates = {
    ar: `مرحباً! أنا ${userName}، أرغب في الاستفسار عن برنامج "${serviceName}" في MedWell.`,
    fr: `Bonjour! Je suis ${userName}, je souhaite me renseigner sur le programme "${serviceName}" chez MedWell.`,
    en: `Hello! I am ${userName}, I would like to inquire about the "${serviceName}" program at MedWell.`,
    es: `¡Hola! Soy ${userName}, me gustaría informarme sobre el programa "${serviceName}" en MedWell.`,
  };
  return templates[lang] || templates.en;
};

module.exports = { i18next, middleware, getWhatsappTemplate, SUPPORTED_LANGS, DEFAULT_LANG };
