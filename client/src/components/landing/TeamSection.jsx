import { motion } from 'framer-motion';
import useTranslation from '../../hooks/useTranslation';

const TEAM_MEMBERS = [
  {
    key: 'mernissi',
    image: '/mernissi.png',
    gradient: 'from-[#C59D5D]/20 to-[#C59D5D]/5',
  },
  {
    key: 'physio1',
    image: '/about-team.jpg',
    gradient: 'from-champagne-100/30 to-transparent dark:from-champagne-950/20',
  },
  {
    key: 'physio2',
    image: '/about-team.jpg',
    gradient: 'from-champagne-100/30 to-transparent dark:from-champagne-950/20',
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function TeamSection() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';

  return (
    <section id="team" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-white dark:bg-dark-900">
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-champagne-100/40 dark:bg-champagne-950/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-[300px] h-[300px] rounded-full bg-champagne-100/30 dark:bg-champagne-950/10 blur-[100px] pointer-events-none" />

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
          <span className="inline-block px-4 py-1.5 rounded-full bg-champagne-400/10 border border-champagne-400/20 text-xs font-semibold tracking-[0.2em] uppercase text-champagne-500 mb-4 sm:mb-6">
            {t('team.badge')}
          </span>
          <h2 className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 dark:text-ivory-50 leading-tight">
            {t('team.title')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-dark-500 dark:text-ivory-200/50 font-light max-w-2xl mx-auto">
            {t('team.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.key}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="group relative bg-ivory-50 dark:bg-dark-800 rounded-2xl border border-ivory-200 dark:border-dark-700 overflow-hidden hover:border-champagne-400/30 transition-all duration-500"
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${member.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              <div className="relative p-5 sm:p-6 lg:p-8">
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl overflow-hidden mx-auto mb-5 border-2 border-champagne-400/20 group-hover:border-champagne-400/50 transition-all duration-500 shadow-lg">
                  <img
                    src={member.image}
                    alt={t(`team.members.${member.key}.name`)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-dark-900 dark:text-ivory-50 mb-1">
                    {t(`team.members.${member.key}.name`)}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-champagne-500 tracking-wider uppercase mb-3">
                    {t(`team.members.${member.key}.role`)}
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed text-dark-500 dark:text-ivory-200/60 font-light">
                    {t(`team.members.${member.key}.desc`)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}