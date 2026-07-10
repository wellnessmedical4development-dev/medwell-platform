import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Phone, MessageCircle } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

const WHATSAPP_NUMBER = '212666993030';
const PHONE_NUMBER = '+21253933333';

export default function ServiceMediaModal({ isOpen, onClose, service, getTitle }) {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';
  const scrollRef = useRef(null);

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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-[#FDFBF7] dark:bg-dark-900 border-2 border-[#D4AF37] rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/20 text-white hover:bg-black/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-champagne-400/10 border border-[#D4AF37] flex items-center justify-center mx-auto mb-3">
                  <Info className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-dark-900 dark:text-ivory-50">
                  {title}
                </h3>
                <p className="text-sm text-dark-500 dark:text-ivory-200/60 mt-1">
                  {t('services.see_details')}
                </p>
              </div>

              <div ref={scrollRef} className="space-y-6">
                {description ? (
                  <div className="bg-white dark:bg-dark-800/50 rounded-xl border border-ivory-200 dark:border-dark-700 p-5 sm:p-6">
                    <p className="text-sm sm:text-base text-dark-600 dark:text-ivory-200/80 leading-relaxed whitespace-pre-line">
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

                <div className="bg-champagne-400/5 border border-champagne-400/20 rounded-xl p-5 sm:p-6">
                  <h4 className="text-sm font-semibold text-dark-700 dark:text-ivory-200 mb-3 text-center">
                    {lang === 'fr' ? 'Contactez-nous' : lang === 'es' ? 'Contáctenos' : lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={`tel:${PHONE_NUMBER}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-champagne-400/10 transition-all text-sm font-semibold"
                    >
                      <Phone className="w-4 h-4" />
                      <span dir="ltr">+212 5 39 33 33 33</span>
                    </a>
                    <button
                      onClick={openWhatsApp}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-all text-sm font-semibold"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span dir="ltr">+212 666 99 30 30</span>
                    </button>
                  </div>
                  <p className="text-xs text-center text-dark-400 dark:text-ivory-200/40 mt-3">
                    {lang === 'fr' ? 'Réservez dès maintenant par téléphone ou WhatsApp' : lang === 'es' ? 'Reserve ahora por teléfono o WhatsApp' : lang === 'ar' ? 'احجز الآن عبر الهاتف أو واتساب' : 'Book now by phone or WhatsApp'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
