import { motion } from 'framer-motion';
import useTranslation from '../../hooks/useTranslation';
import SplitText from '../ui/SplitText';
import BlurImage from '../ui/BlurImage';

export default function AboutSection() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';

  return (
    <section id="about" className="relative py-16 sm:py-24 lg:py-32 xl:py-36 bg-white dark:bg-dark-900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-champagne-100 dark:bg-champagne-950/20 blur-[120px]" />
      </div>

      <div className="w-full mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16" style={{ maxWidth: '90rem' }} dir={isRtl ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 sm:mb-24"
        >
          <span className="inline-block px-4 sm:px-4 py-1.5 sm:py-1.5 rounded-full bg-champagne-400/10 border border-champagne-400/20 text-xs sm:text-xs font-semibold tracking-[0.2em] uppercase text-champagne-500 mb-4 sm:mb-6">
            {t('about_section.title')}
          </span>
          <SplitText
            text={t('about_section.title')}
            className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 dark:text-ivory-50"
          />
        </motion.div>

        <div className="space-y-24 sm:space-y-32 lg:space-y-40">
          {/* Subsection A: Qui sommes-nous ? */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-6"
            >
              <h3 className="font-display text-2xl sm:text-2xl md:text-3xl font-bold text-dark-900 dark:text-ivory-50 leading-tight relative">
                <span className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#D4AF37] rounded-full hidden sm:block" />
                {t('about_section.sub1_title')}
              </h3>
              <p className="text-base sm:text-base leading-relaxed text-dark-500 dark:text-ivory-200/60 font-light">
                {t('about_section.sub1_desc')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div className="relative rounded-2xl overflow-hidden border border-ivory-200 dark:border-dark-700 shadow-xl group">
                <div className="dark:hidden">
                  <BlurImage
                    src="/qui-sommes-nous.jpg"
                    alt="Medical Wellness"
                    className="w-full aspect-[1397/1126]"
                  />
                </div>
                <div className="hidden dark:block">
                  <BlurImage
                    src="/about-night.png"
                    alt="Medical Wellness Night"
                    className="w-full aspect-[1397/1126]"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/20 to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>

          {/* Subsection B: Le mot du Directeur */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 lg:order-last space-y-6"
            >
              <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-dark-900 dark:text-ivory-50 leading-tight">
                <span className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#D4AF37] rounded-full hidden sm:block" />
                {t('about_section.sub2_title')}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-dark-500 dark:text-ivory-200/60 font-light">
                {t('about_section.sub2_desc')}
              </p>

              <div className="pt-4 flex flex-wrap gap-4 items-center">
                <a
                  href="https://www.instagram.com/dr.mernissi?igsh=MWg0bHA2b2J0cGh0bw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-dark-900 transition-all duration-300 rounded-full text-xs font-semibold tracking-wider uppercase"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zM18.406 4.413a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
                  </svg>
                  <span>{t('contact_section.instagram_doctor')}</span>
                </a>
              </div>
            </motion.div>
 
            <motion.div
              initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <div className="relative rounded-2xl border border-ivory-200 dark:border-dark-700 shadow-xl group bg-white dark:bg-dark-800">
                <img
                  src="/mernissi.png"
                  alt="Dr. Abdelali Mernissi"
                  className="w-full max-h-[500px] object-contain transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
