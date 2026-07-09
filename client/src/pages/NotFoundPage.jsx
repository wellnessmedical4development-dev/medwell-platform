import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useTranslation from '../hooks/useTranslation';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  const { t, lang } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <SEO title="404 — Page Not Found | Medical Wellness" description="The page you are looking for does not exist." />
      <div className="w-24 h-24 mb-6 rounded-full bg-champagne-400/10 flex items-center justify-center">
        <svg className="w-12 h-12 text-champagne-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 className="font-display text-5xl sm:text-6xl font-bold text-dark-900 dark:text-ivory-50 mb-3">404</h1>
      <p className="text-base sm:text-lg text-dark-400 dark:text-ivory-200/60 font-light mb-8 max-w-md">
        {lang === 'ar' ? 'عذراً، الصفحة التي تبحث عنها غير موجودة' :
         lang === 'fr' ? "Désolé, la page que vous recherchez n'existe pas." :
         lang === 'es' ? 'Lo sentimos, la página que buscas no existe.' :
         'Sorry, the page you are looking for does not exist.'}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D4AF37] hover:bg-champagne-600 text-dark-900 text-sm font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(212,175,55,0.2)]"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        {t('nav.home')}
      </Link>
    </motion.div>
  );
}