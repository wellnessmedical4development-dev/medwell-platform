import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useTranslation from '../../hooks/useTranslation';
import BlurImage from '../ui/BlurImage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroSection() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-8%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.4]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen min-h-[100dvh] flex items-start lg:items-center bg-ivory-50 dark:bg-dark-950"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-[500px] sm:w-[700px] xl:w-[900px] h-[500px] sm:h-[700px] xl:h-[900px] rounded-full bg-champagne-400/5 dark:bg-champagne-400/[0.03] blur-[100px] xl:blur-[140px]" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[350px] sm:w-[600px] xl:w-[800px] h-[350px] sm:h-[600px] xl:h-[800px] rounded-full bg-champagne-400/5 dark:bg-champagne-400/[0.03] blur-[80px] xl:blur-[120px]" />
        <div className="hidden sm:block absolute top-1/4 sm:top-1/3 left-[15%] sm:left-1/4 w-40 lg:w-64 h-40 lg:h-64 border border-champagne-400/10 dark:border-champagne-400/5 rounded-full" />
        <div className="hidden sm:block absolute bottom-1/4 right-[15%] sm:right-1/4 w-32 lg:w-48 h-32 lg:h-48 border border-champagne-400/10 dark:border-champagne-400/5 rounded-full" />
      </div>

      <motion.div
        style={{ y: textY, opacity, maxWidth: '90rem' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16 flex flex-col-reverse lg:flex-row items-center gap-4 lg:gap-12 pt-14 lg:pt-0"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <motion.div style={{ y: textY }} className="flex-1 pt-6 sm:pt-32 lg:pt-40 pb-10 sm:pb-20 mx-auto sm:mx-0">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-champagne-400/10 dark:bg-champagne-400/10 border border-champagne-400/20 mb-3 sm:mb-8"
          >
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-champagne-400 animate-pulse-glow shrink-0" />
            <span className="text-xs sm:text-xs font-semibold tracking-[0.2em] uppercase text-champagne-500 whitespace-nowrap">
              {t('hero.badge')}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display text-[2.6rem] xs:text-[2.8rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight"
          >
            <span className="text-dark-900 dark:text-ivory-50 block">
              {t('hero.title_line1')}
            </span>
            <span className="text-champagne-400 block mt-0.5 sm:mt-2">
              {t('hero.title_line2')}
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-3 sm:mt-8 max-w-xl lg:max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-dark-500 dark:text-ivory-200/60 font-light"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-5 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 w-full sm:w-auto"
          >
            <a
              href="#services"
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 xl:px-10 py-4 sm:py-4 bg-dark-900 dark:bg-champagne-400 text-white dark:text-dark-900 rounded-full text-sm sm:text-sm font-bold tracking-widest uppercase overflow-hidden transition-all duration-500 hover:shadow-[0_8px_32px_rgba(212,175,55,0.3)] dark:hover:shadow-[0_8px_32px_rgba(212,175,55,0.25)] w-full sm:w-auto"
            >
              <span className="relative z-10 whitespace-nowrap">{t('hero.cta')}</span>
              <svg className="relative z-10 w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              <div className="absolute inset-0 bg-gradient-to-r from-champagne-500 to-champagne-600 dark:from-champagne-500 dark:to-champagne-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>

            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 xl:px-10 py-4 sm:py-4 border border-dark-200/40 dark:border-ivory-200/20 rounded-full text-sm sm:text-sm font-bold tracking-widest uppercase text-dark-600 dark:text-ivory-200 hover:border-champagne-400 hover:text-champagne-500 transition-all duration-300 w-full sm:w-auto"
            >
              <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border border-current flex items-center justify-center shrink-0">
                <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <span className="whitespace-nowrap">{t('hero.watch_video')}</span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: imageY }}
          variants={itemVariants}
          className="w-full lg:flex-1 lg:w-auto shrink-0 relative h-[280px] sm:h-[400px] lg:h-[550px] rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 dark:hidden">
            <BlurImage src="/wellness_morning.png" alt="Wellness Morning" className="w-full h-full" priority />
          </div>
          <div className="absolute inset-0 hidden dark:block">
            <BlurImage src="/wellness_night.png" alt="Wellness Night" className="w-full h-full" priority />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 sm:bottom-10 lg:bottom-16 left-1/2 -translate-x-1/2 pointer-events-none"
      >
        <svg className="w-5 sm:w-6 h-5 sm:h-6 text-champane-400/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}
