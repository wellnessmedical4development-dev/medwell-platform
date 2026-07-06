import { motion } from 'framer-motion';
import useTranslation from '../../hooks/useTranslation';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function LocationSection() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';

  return (
    <section id="location" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] rounded-full bg-[#C59D5D]/5 blur-[140px] pointer-events-none" />

      <div
        className="relative z-10 w-full mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16"
        style={{ maxWidth: '90rem' }}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 lg:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#C59D5D]/10 border border-[#C59D5D]/20 text-xs font-semibold tracking-[0.2em] uppercase text-[#C59D5D] mb-4 sm:mb-6">
            {t('location.badge')}
          </span>
          <h2 className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ivory-50 leading-tight">
            {t('location.title')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ivory-200/50 font-light max-w-2xl mx-auto">
            {t('location.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: isRtl ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden border border-dark-700 shadow-xl h-[300px] sm:h-[400px] lg:h-full min-h-[300px]"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2583.368102314259!2d-5.795293684220739!3d35.77331252798315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0c41c6d1e7c1f7%3A0x8c0a3e5c7b2f1a0!2sVilla%20Mernissi!5e0!3m2!1sfr!2sma!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Medical Wellness Location"
              className="w-full h-full"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: isRtl ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center space-y-6 sm:space-y-8"
          >
            <div className="space-y-2">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-ivory-50">
                {t('location.address_title')}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-ivory-200/60 font-light">
                {t('location.address_value')}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-ivory-50">
                {t('location.hours_title')}
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-ivory-200/60 font-light whitespace-pre-line">
                {t('location.hours_value')}
              </p>
            </div>

            <div className="pt-4">
              <a
                href="https://maps.app.goo.gl/pz5dHW8xQWyZXGmk7?g_st=ac"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 border-2 border-[#C59D5D] hover:bg-[#C59D5D] text-[#C59D5D] hover:text-dark-900 font-bold tracking-widest uppercase rounded-full text-xs transition-all duration-300 shadow-[0_4px_16px_rgba(197,157,93,0.1)]"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{t('location.map_button')}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}