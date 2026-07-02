import { motion } from 'framer-motion';
import useTranslation from '../../hooks/useTranslation';
import SplitText from '../ui/SplitText';
import RippleButton from '../ui/RippleButton';

export default function CTASection() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';

  return (
    <section id="about" className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-950 to-dark-900 dark:from-dark-950 dark:via-black dark:to-dark-950" />
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(212,175,55,1) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(212,175,55,1) 0%, transparent 50%)',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] rounded-full bg-champagne-400/5 blur-[60px] sm:blur-[80px] lg:blur-[100px]" />

      <div className="relative z-10 w-full mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16 text-center" style={{ maxWidth: '64rem' }} dir={isRtl ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block px-4 sm:px-4 py-1.5 sm:py-1.5 rounded-full bg-champagne-400/10 border border-champagne-400/20 text-xs sm:text-xs font-semibold tracking-[0.2em] uppercase text-champagne-400 mb-4 sm:mb-6">
            {t('cta_section.title')}
          </span>
          <SplitText
            text={t('cta_section.title')}
            className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ivory-50 leading-tight px-4 sm:px-0"
          />
          <p className="mt-4 sm:mt-6 text-base sm:text-base lg:text-lg leading-relaxed text-ivory-200/50 font-light max-w-2xl mx-auto px-4 sm:px-0">
            {t('cta_section.subtitle')}
          </p>
          <RippleButton
            as="a"
            href="#contact"
            className="inline-flex items-center gap-2 sm:gap-3 mt-8 sm:mt-10 px-6 sm:px-8 lg:px-10 py-3.5 sm:py-4 bg-champagne-400 text-dark-900 rounded-full text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-champagne-500 transition-all duration-300 shadow-[0_4px_24px_rgba(212,175,55,0.25)] hover:shadow-[0_8px_40px_rgba(212,175,55,0.35)]"
          >
            {t('cta_section.button')}
            <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </RippleButton>
        </motion.div>
      </div>
    </section>
  );
}
