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
                  href="https://wa.me/212666993030"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white hover:bg-[#20BD5A] transition-all duration-300 rounded-full text-xs font-semibold tracking-wider uppercase"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:+212531281283"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-dark-900 transition-all duration-300 rounded-full text-xs font-semibold tracking-wider uppercase"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  <span>05 31 28 12 83</span>
                </a>
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
