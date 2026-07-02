import { motion } from 'framer-motion';
import useTranslation from '../../hooks/useTranslation';

const icons = {
  health: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
    </svg>
  ),
  body: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v4" />
    </svg>
  ),
  leaf: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8V4m0 0L9 6.5M12 4l3 2.5M12 8v4m0 0a8 8 0 0 0 8-8M12 12a8 8 0 0 1-8-8" />
    </svg>
  ),
  heart: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  ),
  sparkle: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  ),
  shield: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  ),
};

export default function BenefitsSection() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';
  const benefits = t('benefits.items');

  return (
    <section id="benefits" className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-dark-950 dark:bg-black" />
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 75% 25%, rgba(212,175,55,1) 0%, transparent 40%)',
        }}
      />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-champagne-400/5 blur-[100px]" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] rounded-full bg-champagne-400/3 blur-[80px]" />

      <div className="relative z-10 w-full mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16" style={{ maxWidth: '80rem' }} dir={isRtl ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-champagne-400/10 border border-champagne-400/20 text-xs font-semibold tracking-[0.2em] uppercase text-champagne-400 mb-4 sm:mb-6">
            {t('benefits.badge')}
          </span>
          <h2 className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ivory-50 leading-tight px-4 sm:px-0">
            {t('benefits.title')}
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-base lg:text-lg leading-relaxed text-ivory-200/50 font-light max-w-3xl mx-auto">
            {t('benefits.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits?.map((item, i) => (
            <motion.div
              key={item.key}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: (i) => ({
                  opacity: 1, y: 0,
                  transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
                }),
              }}
              className="group relative p-6 sm:p-8 rounded-2xl bg-dark-800/50 dark:bg-dark-900/50 border border-ivory-200/5 hover:border-champagne-400/20 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-champagne-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-champagne-400/10 border border-champagne-400/20 flex items-center justify-center text-champagne-400 mb-5 group-hover:scale-110 transition-transform duration-500">
                  {icons[item.icon] || icons.health}
                </div>
                <h3 className="font-display text-xl sm:text-xl font-bold text-ivory-50 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-sm leading-relaxed text-ivory-200/40">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
