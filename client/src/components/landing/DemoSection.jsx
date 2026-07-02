import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useTranslation from '../../hooks/useTranslation';
import BlurImage from '../ui/BlurImage';

export default function AppSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-champagne-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      title: t('app_section.feature1_title'),
      desc: t('app_section.feature1_desc'),
    },
    {
      icon: (
        <svg className="w-6 h-6 text-champagne-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: t('app_section.feature2_title'),
      desc: t('app_section.feature2_desc'),
    },
    {
      icon: (
        <svg className="w-6 h-6 text-champagne-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: t('app_section.feature3_title'),
      desc: t('app_section.feature3_desc'),
    },
  ];

  return (
    <section id="app" className="relative py-16 xs:py-20 sm:py-28 bg-dark-900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-champagne-400/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16" style={{ maxWidth: '90rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-champagne-400/10 border border-champagne-400/20 text-xs font-semibold tracking-[0.2em] uppercase text-champagne-500 mb-4">
            {t('app_section.badge')}
          </span>
          <h2 className="font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-ivory-50 leading-tight">
            {t('app_section.title')}
          </h2>
          <p className="mt-3 xs:mt-4 text-sm xs:text-base leading-relaxed text-ivory-200/50 font-light max-w-2xl mx-auto">
            {t('app_section.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-[500px]">
              <div className="relative rounded-2xl border border-dark-700 shadow-2xl shadow-champagne-400/5 overflow-hidden bg-dark-800">
                <BlurImage
                  src="/image-app-horizontal.jpeg"
                  alt="My Wellness App"
                  className="w-full block"
                  style={{ aspectRatio: '16/10' }}
                />
              </div>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-dark-700 rounded-full blur-sm" />
            </div>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-champagne-400/10 flex items-center justify-center shrink-0 mt-0.5">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-ivory-50 mb-1">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ivory-200/40 font-light leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <button
                onClick={() => navigate('/download')}
                className="inline-flex items-center gap-3 px-7 py-3.5 bg-champagne-400 hover:bg-champagne-500 text-dark-900 font-bold tracking-widest uppercase rounded-full text-xs transition-all duration-300 shadow-[0_4px_24px_rgba(212,175,55,0.2)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.35)]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {t('app_section.cta')}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
