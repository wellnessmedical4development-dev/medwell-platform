const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { i18next, middleware: i18nMiddleware } = require('./config/i18n');
const { setLang, rtlRedirect } = require('./middleware/i18n');

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const subscriptionRoutes = require('./routes/subscriptions');
const adminRoutes = require('./routes/admin');
const whatsappRoutes = require('./routes/whatsapp');
const n8nRoutes = require('./routes/n8n');
const wellnessCoinRoutes = require('./routes/wellnessCoins');
const prospectRoutes = require('./routes/prospects');
const paymentRoutes = require('./routes/payments');
const referralRoutes = require('./routes/referrals');
const messageRoutes = require('./routes/messages');
const appointmentRoutes = require('./routes/appointments');
const quickRequestRoutes = require('./routes/quickRequests');
const leadRoutes = require('./routes/leads');

const app = express();

app.use(compression());

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(i18nMiddleware.handle(i18next));
app.use(setLang);
app.use(rtlRedirect);

const oneYear = 365 * 24 * 60 * 60 * 1000;
app.use(express.static(path.join(__dirname, '..', 'client', 'dist'), {
  maxAge: oneYear,
  immutable: true,
  setHeaders(res, filePath) {
    if (filePath.endsWith('.webp') || filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.png') || filePath.endsWith('.svg')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
}));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { error: 'Too many OTP requests. Please wait before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const rtlLangs = ['ar'];
app.use((req, res, next) => {
  res.locals.isRtl = rtlLangs.includes(req.language);
  if (rtlLangs.includes(req.language)) {
    res.setHeader('Content-Language', 'ar');
  }
  next();
});

app.get('/', (_req, res) => {
  res.json({ name: 'MedWell API', version: '1.0.0', status: 'running' });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /login
Disallow: /client
Disallow: /admin
Disallow: /demo

Sitemap: https://medical-wellness.ma/sitemap.xml
`);
});

app.get('/sitemap.xml', (_req, res) => {
  res.type('application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://medical-wellness.ma/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="https://medical-wellness.ma/en" />
    <xhtml:link rel="alternate" hreflang="fr" href="https://medical-wellness.ma/fr" />
    <xhtml:link rel="alternate" hreflang="es" href="https://medical-wellness.ma/es" />
    <xhtml:link rel="alternate" hreflang="ar" href="https://medical-wellness.ma/ar" />
  </url>
</urlset>
`);
});

app.use('/api/v1/auth/otp', otpLimiter);
app.use('/api/v1/auth', authLimiter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/whatsapp', whatsappRoutes);
app.use('/api/v1/n8n', n8nRoutes);
app.use('/api/v1/wellness-coins', wellnessCoinRoutes);
app.use('/api/v1/prospects', prospectRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/referrals', referralRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/leads', leadRoutes);
app.use('/api/v1/quick-requests', quickRequestRoutes);

app.use((req, res) => {
  if (req.accepts('html') && !req.path.startsWith('/api/')) {
    return res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  }
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: 'Internal server error' });
});

module.exports = app;