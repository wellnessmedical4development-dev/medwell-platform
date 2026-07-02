import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useTranslation from '../../hooks/useTranslation';

function AccordionItem({ item, isOpen, onToggle, index }) {
  return (
    <div className="border border-ivory-200/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-champagne-400/20">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-dark-800/30 hover:bg-dark-800/50 transition-colors duration-300"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-champagne-400/10 border border-champagne-400/20 flex items-center justify-center text-champagne-400 text-xs font-bold">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-display text-base sm:text-base font-semibold text-ivory-50">
            {item.q}
          </span>
        </span>
        <svg
          className={`w-5 h-5 flex-shrink-0 text-champagne-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-2 text-sm sm:text-sm leading-relaxed text-ivory-200/50 border-t border-ivory-200/5">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';
  const [openIndex, setOpenIndex] = useState(null);
  const items = t('faq.items');

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-950 to-dark-900 dark:from-dark-950 dark:via-black dark:to-dark-950" />
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,1) 0%, transparent 60%)',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-champagne-400/3 blur-[120px]" />

      <div className="relative z-10 w-full mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16" style={{ maxWidth: '48rem' }} dir={isRtl ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-champagne-400/10 border border-champagne-400/20 text-xs font-semibold tracking-[0.2em] uppercase text-champagne-400 mb-4 sm:mb-6">
            {t('faq.badge')}
          </span>
          <h2 className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ivory-50 leading-tight">
            {t('faq.title')}
          </h2>
          <p className="mt-4 text-base sm:text-base lg:text-lg leading-relaxed text-ivory-200/50 font-light max-w-2xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-4">
          {items?.map((item, i) => (
            <AccordionItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
