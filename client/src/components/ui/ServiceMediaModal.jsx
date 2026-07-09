import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

const MEDIA_FILES = {
  'NUTRITION-ACCOMP': { images: [], videos: [] },
  'KINESITHERAPIE': { images: [], videos: [] },
  'I-SLIM': { images: [], videos: [] },
  'AMINCISSEMENT': { images: [], videos: [] },
  'FITNESS-PROG': { images: [], videos: ['/videos/fitness-see-more.MOV'] },
  'ESTHETIQUE': { images: [], videos: [] },
  'SPA-HAMMAM': { images: [], videos: ['/videos/spa-see-more.MOV'] },
  'WELLNESS-ASSESS': { images: [], videos: [] },
};

export default function ServiceMediaModal({ isOpen, onClose, service, getTitle }) {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';
  const scrollRef = useRef(null);

  const media = MEDIA_FILES[service?.code] || { images: [], videos: [] };
  const hasMedia = media.images.length > 0 || media.videos.length > 0;
  const title = service ? (getTitle ? getTitle(service) : service.code) : '';

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
                <h3 className="font-display text-xl sm:text-2xl font-bold text-dark-900 dark:text-ivory-50">
                  {title}
                </h3>
                <p className="text-sm text-dark-500 dark:text-ivory-200/60 mt-1">
                  {t('services.media_gallery')}
                </p>
              </div>

              {hasMedia ? (
                <div ref={scrollRef} className="space-y-6">
                  {media.images.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-dark-600 dark:text-ivory-200/80 mb-3 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        {t('services.photos')}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {media.images.map((src, i) => (
                          <div key={i} className="aspect-[4/3] rounded-xl overflow-hidden bg-ivory-100 dark:bg-dark-800 border border-ivory-200 dark:border-dark-700">
                            <img src={src} alt={`${title} ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {media.videos.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-dark-600 dark:text-ivory-200/80 mb-3 flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        {t('services.videos')}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {media.videos.map((src, i) => (
                          <div key={i} className="aspect-video rounded-xl overflow-hidden bg-black border border-ivory-200 dark:border-dark-700 relative group">
                            <video src={src} controls className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-champagne-400/10 border border-[#D4AF37] flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <p className="text-dark-500 dark:text-ivory-200/60 text-sm font-light">
                    {t('services.media_coming_soon')}
                  </p>
                  <p className="text-dark-400 dark:text-ivory-200/40 text-xs mt-1">
                    {t('services.media_coming_soon_desc')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
