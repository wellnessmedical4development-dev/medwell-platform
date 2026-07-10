import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Phone, MessageCircle } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

const WHATSAPP_NUMBER = '212666993030';
const PHONE_NUMBER = '+212531281283';

export default function ServiceMediaModal({ isOpen, onClose, service, getTitle }) {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const title = service ? (getTitle ? getTitle(service) : service.code) : '';
  const detailKey = service?.code ? `services.details.${service.code}` : null;
  const description = detailKey ? t(detailKey) : '';

  const openWhatsApp = () => {
    const msg = lang === 'fr'
      ? `Bonjour, je suis intéressé(e) par "${title}" chez Medical Wellness.`
      : lang === 'es'
        ? `Hola, estoy interesado(a) en "${title}" en Medical Wellness.`
        : lang === 'ar'
          ? `مرحباً، أنا مهتم(ة) ببرنامج "${title}" في ميديكال ويلنس.`
          : `Hello, I am interested in "${title}" at Medical Wellness.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#FDFBF7] dark:bg-dark-900 border-2 border-[#D4AF37] rounded-3xl shadow-2xl flex flex-col max-h-[85vh]"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between px-5 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-ivory-200 dark:border-dark-700 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-champagne-400/10 border border-[#D4AF37] flex items-center justify-center">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
                </div>
                <h3 className="font-display text-base sm:text-lg lg:text-xl font-bold text-dark-900 dark:text-ivory-50">
                  {title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-black/10 dark:bg-white/10 text-dark-600 dark:text-ivory-200 hover:bg-black/20 dark:hover:bg-white/20 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
              {description ? (
                <div className="bg-white dark:bg-dark-800/50 rounded-xl border border-ivory-200 dark:border-dark-700 p-4 sm:p-5">
                  <p className="text-sm sm:text-[15px] text-dark-600 dark:text-ivory-200/80 leading-relaxed sm:leading-7 whitespace-pre-line">
                    {description}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-dark-500 dark:text-ivory-200/60 text-sm font-light">
                    {t('services.media_coming_soon')}
                  </p>
                </div>
              )}
            </div>

            <div className="shrink-0 px-5 sm:px-6 pb-4 sm:pb-5 pt-3 border-t border-ivory-200 dark:border-dark-700">
              <div className="bg-champagne-400/5 border border-champagne-400/20 rounded-xl p-3 sm:p-4">
                <h4 className="text-[11px] sm:text-xs font-semibold text-dark-700 dark:text-ivory-200 mb-2 text-center uppercase tracking-wider">
                  {lang === 'fr' ? 'Contactez-nous' : lang === 'es' ? 'Contáctenos' : lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                </h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3 rounded-xl border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-champagne-400/10 transition-all text-xs sm:text-sm font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span dir="ltr">05 31 28 12 83</span>
                  </a>
                  <button
                    onClick={openWhatsApp}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all text-xs sm:text-sm font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span dir="ltr">06 66 99 30 30</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
