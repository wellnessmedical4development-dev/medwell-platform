import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LocationSection from '../components/landing/LocationSection';
import CTASection from '../components/landing/CTASection';
import PageNavigation from '../components/landing/PageNavigation';
import SEO from '../components/SEO';
import useTranslation from '../hooks/useTranslation';

export default function ContactPage() {
  const { t, lang } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    const whatsappMsg = `*${t('contact_section.form_title')}*%0A%0A${t('contact_section.form_name')}: ${encodeURIComponent(form.name)}%0A${t('contact_section.form_email')}: ${encodeURIComponent(form.email)}%0A${t('contact_section.form_phone')}: ${encodeURIComponent(form.phone)}%0A${t('contact_section.form_message')}: ${encodeURIComponent(form.message)}`;
    window.open(`https://wa.me/212666993030?text=${whatsappMsg}`, '_blank');
    setSubmitted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <SEO title={t('seo.contact_title')} description={t('seo.contact_desc')} />
      <LocationSection />

      <section className="relative py-16 sm:py-24 bg-[#FDFBF7] dark:bg-dark-950" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="w-full mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16" style={{ maxWidth: '90rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-lg mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-champagne-400/10 border border-champagne-400/20 text-xs font-semibold tracking-[0.2em] uppercase text-champagne-500 mb-4">
              {t('contact_section.form_title')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-dark-900 dark:text-ivory-50 mb-8">
              {t('contact_section.form_title')}
            </h2>

            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white dark:bg-dark-800/50 rounded-2xl border border-green-300/30 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-50 dark:bg-green-900/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-sm text-dark-500 dark:text-ivory-200/60">{t('contact_section.form_success')}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-dark-700 dark:text-ivory-200/80 mb-1.5 uppercase tracking-wider">{t('contact_section.form_name')} *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required maxLength={100} className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-sm text-dark-900 dark:text-ivory-50 placeholder:text-dark-300 dark:placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-champagne-400/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-700 dark:text-ivory-200/80 mb-1.5 uppercase tracking-wider">{t('contact_section.form_email')}</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} maxLength={200} className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-sm text-dark-900 dark:text-ivory-50 placeholder:text-dark-300 dark:placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-champagne-400/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-700 dark:text-ivory-200/80 mb-1.5 uppercase tracking-wider">{t('contact_section.form_phone')}</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} maxLength={20} className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-sm text-dark-900 dark:text-ivory-50 placeholder:text-dark-300 dark:placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-champagne-400/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-dark-700 dark:text-ivory-200/80 mb-1.5 uppercase tracking-wider">{t('contact_section.form_message')} *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required maxLength={2000} rows={4} className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-sm text-dark-900 dark:text-ivory-50 placeholder:text-dark-300 dark:placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-champagne-400/50 transition-all resize-none" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-[#D4AF37] hover:bg-champagne-600 text-dark-900 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(212,175,55,0.2)]">
                  {t('contact_section.form_submit')}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <CTASection />
      <div className="flex justify-center pt-8">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-dark-900 text-sm font-bold tracking-widest uppercase transition-all duration-300"
        >
          {t('nav.app')}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
      <PageNavigation />
    </motion.div>
  );
}
