import { useState } from 'react';
import { motion } from 'framer-motion';
import useTranslation from '../hooks/useTranslation';
import SEO from '../components/SEO';
import { leadsAPI } from '../services/api';

export default function DownloadPage() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setSubmitting(true);
    try {
      await leadsAPI.preorder({ name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), source: 'app_preorder' });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-dark-950 flex flex-col items-center justify-center px-4 py-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO titleKey="download.preorder_title" descriptionKey="download.desc" path="/download" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-md mx-auto text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-champagne-400/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-champagne-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark-900 dark:text-ivory-50 mb-3">{t('download.preorder_title')}</h1>
        <p className="text-sm sm:text-base text-dark-500 dark:text-ivory-200/60 font-light mb-8 max-w-sm mx-auto">{t('download.preorder_desc')}</p>

        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-champagne-400/10 border border-champagne-400/20 rounded-full text-xs font-semibold text-champagne-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('download.preorder_coins')}
        </div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-50 dark:bg-green-900/10 border border-green-300/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-bold text-dark-900 dark:text-ivory-50">{t('download.preorder_success_title')}</h2>
            <p className="text-sm text-dark-500 dark:text-ivory-200/60">{t('download.preorder_success_desc')}</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-ivory-200/80 mb-1.5 uppercase tracking-wider">{t('download.preorder_form_name')} *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required maxLength={100} placeholder={t('download.preorder_form_name')} className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-sm text-dark-900 dark:text-ivory-50 placeholder:text-dark-300 dark:placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-champagne-400/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-ivory-200/80 mb-1.5 uppercase tracking-wider">{t('download.preorder_form_phone')} *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} required maxLength={20} placeholder="+212 XXX XXX XXX" className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-sm text-dark-900 dark:text-ivory-50 placeholder:text-dark-300 dark:placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-champagne-400/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-ivory-200/80 mb-1.5 uppercase tracking-wider">{t('download.preorder_form_email')}</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} maxLength={200} placeholder="email@example.com" className="w-full px-4 py-3 bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 rounded-xl text-sm text-dark-900 dark:text-ivory-50 placeholder:text-dark-300 dark:placeholder:text-dark-500 focus:outline-none focus:ring-2 focus:ring-champagne-400/50 transition-all" />
            </div>
            <button type="submit" disabled={submitting} className="w-full py-3.5 bg-[#D4AF37] hover:bg-champagne-600 disabled:opacity-50 text-dark-900 rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(212,175,55,0.2)]">
              {submitting ? '...' : t('download.preorder_submit')}
            </button>
          </form>
        )}

        <button onClick={() => setShowAbout(!showAbout)} className="mt-8 text-xs text-champagne-500 hover:text-champagne-600 font-semibold tracking-wider uppercase transition-all">
          {showAbout ? '- ' : '+ '}{t('download.preorder_learn')}
        </button>

        {showAbout && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-5 bg-white dark:bg-dark-800/50 rounded-2xl border border-dark-100 dark:border-dark-800 text-sm text-dark-500 dark:text-ivory-200/60 leading-relaxed text-left">
            {t('download.preorder_app_desc')}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
