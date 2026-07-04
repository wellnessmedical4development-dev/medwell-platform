import { motion } from 'framer-motion';
import useTranslation from '../../hooks/useTranslation';

const PLACEHOLDER_CARDS = [
  { id: 'ba1', type: 'before-after' },
  { id: 'ba2', type: 'before-after' },
  { id: 'ba3', type: 'before-after' },
  { id: 'dt1', type: 'doctor-talk' },
  { id: 'dt2', type: 'doctor-talk' },
];

const PlayIcon = () => (
  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

function VideoCard() {
  return (
    <div className="group relative aspect-video rounded-2xl overflow-hidden bg-dark-800 dark:bg-dark-900 border border-dark-700 hover:border-champagne-400/30 transition-all duration-500 cursor-pointer">
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-champagne-400/20 border border-champagne-400/30 flex items-center justify-center group-hover:bg-champagne-400/30 group-hover:scale-110 transition-all duration-300">
          <PlayIcon />
        </div>
        <span className="text-xs sm:text-sm font-medium text-ivory-200/50 group-hover:text-ivory-200/80 transition-colors duration-300">
          Video coming soon
        </span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

export default function ReviewsSection() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';

  const beforeAfter = PLACEHOLDER_CARDS.filter((c) => c.type === 'before-after');
  const doctorTalks = PLACEHOLDER_CARDS.filter((c) => c.type === 'doctor-talk');

  return (
    <section id="reviews" className="relative py-16 sm:py-24 lg:py-32 xl:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-[#FDFBF7] dark:bg-dark-950" />
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,1) 0%, transparent 50%)',
        }}
      />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-champagne-400/5 blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[200px] h-[200px] rounded-full bg-champagne-400/5 blur-[80px]" />

      <div className="relative z-10 w-full mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16" style={{ maxWidth: '90rem' }} dir={isRtl ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-champagne-400/10 border border-champagne-400/20 text-xs font-semibold tracking-[0.2em] uppercase text-champagne-500 mb-4 sm:mb-6">
            {t('reviews.badge')}
          </span>
          <h2 className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 dark:text-ivory-50 leading-tight">
            {t('reviews.title')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-dark-500 dark:text-ivory-200/50 font-light max-w-2xl mx-auto">
            {t('reviews.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-16 sm:space-y-24">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-8 sm:mb-10"
            >
              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-dark-900 dark:text-ivory-50">
                {t('reviews.before_after_title')}
              </h3>
              <p className="mt-2 text-sm text-dark-500 dark:text-ivory-200/50 font-light">
                {t('reviews.before_after_desc')}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {beforeAfter.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <VideoCard />
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-8 sm:mb-10"
            >
              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-dark-900 dark:text-ivory-50">
                {t('reviews.doctor_talks_title')}
              </h3>
              <p className="mt-2 text-sm text-dark-500 dark:text-ivory-200/50 font-light">
                {t('reviews.doctor_talks_desc')}
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
              {doctorTalks.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <VideoCard />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
