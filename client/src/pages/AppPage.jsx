import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AppSection from '../components/landing/DemoSection';
import PageNavigation from '../components/landing/PageNavigation';
import SEO from '../components/SEO';
import useTranslation from '../hooks/useTranslation';

export default function AppPage() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <SEO title={t('seo.app_title')} description={t('seo.app_desc')} />
      <AppSection />
      <div className="flex justify-center pt-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-dark-900 text-sm font-bold tracking-widest uppercase transition-all duration-300"
        >
          {t('nav.home')}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </Link>
      </div>
      <PageNavigation />
    </motion.div>
  );
}
