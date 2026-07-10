import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';
import { servicesAPI } from '../../services/api';
import SplitText from '../ui/SplitText';
import BlurImage from '../ui/BlurImage';
import RippleButton from '../ui/RippleButton';
import ServiceMediaModal from '../ui/ServiceMediaModal';

const FALLBACK_SERVICES = [
  {
    id: 'nutrition', code: 'NUTRITION-ACCOMP',
    title: { en: 'Nutrition & Guidance', fr: 'Nutrition & Accompagnement', es: 'Nutrición y Acompañamiento', ar: 'التغذية والمرافقة' },
    duration_days: 30, image: '/nutrition.jpg',
  },
  {
    id: 'kine', code: 'KINESITHERAPIE',
    title: { en: 'Physiotherapy & Recovery', fr: 'Kinésithérapie', es: 'Fisioterapia', ar: 'العلاج الطبيعي' },
    duration_days: 15, image: '/kinesitherapie.jpg',
  },
  {
    id: 'islim', code: 'I-SLIM',
    title: { en: 'I-SLIM Electro-Stimulation', fr: 'I-SLIM Électro-stimulation', es: 'I-SLIM Electroestimulación', ar: 'تحفيز العضلات الكهربائي I-SLIM' },
    duration_days: 30, image: '/image_islim.png',
  },
  {
    id: 'amincissement', code: 'AMINCISSEMENT',
    title: { en: 'Slimming & Body Contouring', fr: 'Amincissement & Minceur', es: 'Adelgazamiento y Moldeo', ar: 'التخسيس والتنحيف' },
    duration_days: 30, image: '/amincissement.jpg',
  },
  {
    id: 'fitness', code: 'FITNESS-PROG',
    title: { en: 'Fitness', fr: 'Fitness', ar: 'اللياقة البدنية', es: 'Fitness' },
    duration_days: 30, image: '/image_fitness.png',
  },
  {
    id: 'esthetique', code: 'ESTHETIQUE',
    title: { en: 'Aesthetics & Anti-Aging', fr: 'Esthétique', es: 'Estética', ar: 'العناية بالجمال' },
    duration_days: 30, image: '/image_beauty.jpg',
  },
  {
    id: 'spa-hammam', code: 'SPA-HAMMAM',
    title: { en: 'Luxury SPA & Hammam', fr: 'SPA & Hammam', es: 'SPA y Hammam', ar: 'السبا والحمام المغربي' },
    duration_days: 1, image: '/spa-hammam.png',
  },
  {
    id: 'wellness-assess', code: 'WELLNESS-ASSESS',
    title: { en: 'Wellness Assessment', fr: 'Bilan Bien-être', es: 'Evaluación de Bienestar', ar: 'تقييم الصحة' },
    duration_days: 1, image: '/assessment.jpg',
  },
  {
    id: 'piscine', code: 'PISCINE',
    title: { en: 'Swimming Pool', fr: 'Piscine', es: 'Piscina', ar: 'المسبح' },
    duration_days: 1, image: '/piscine.png',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const WHATSAPP_NUMBER = '212666993030';
const PHONE_NUMBER = '+212531281283';

const WHATSAPP_MSG = {
  en: (s) => `Hello, I am interested in the "${s}" program at Medical Wellness.`,
  fr: (s) => `Bonjour, je suis intéressé(e) par le programme "${s}" chez Medical Wellness.`,
  es: (s) => `Hola, estoy interesado(a) en el programa "${s}" en Medical Wellness.`,
  ar: (s) => `مرحباً، أنا مهتم(ة) ببرنامج "${s}" في ميديكال ويلنس.`,
};

export default function ServicesSection() {
  const { t, lang } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mediaService, setMediaService] = useState(null);
  const [showMedia, setShowMedia] = useState(false);
  const isRtl = lang === 'ar';

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data } = await servicesAPI.list();
        if (data.services && data.services.length > 0) {
          const merged = data.services.map(s => {
            const fallback = FALLBACK_SERVICES.find(f => f.code === s.code);
            return {
              ...s, price: undefined,
              image: fallback ? fallback.image : (s.image_url || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80&fit=crop')
            };
          });
          setServices(merged);
        } else { setServices(FALLBACK_SERVICES); }
      } catch { setServices(FALLBACK_SERVICES); }
      finally { setLoading(false); }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    if (loading) return;
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [loading]);

  const getServiceTitle = (service) => {
    if (typeof service.title === 'string') {
      try { const parsed = JSON.parse(service.title); return parsed[lang] || parsed.en || service.title; }
      catch { return service.title; }
    }
    if (typeof service.title === 'object') return service.title[lang] || service.title.en || '';
    return service.code || '';
  };

  const openWhatsApp = (serviceTitle) => {
    const msgFn = WHATSAPP_MSG[lang] || WHATSAPP_MSG.en;
    const text = encodeURIComponent(msgFn(serviceTitle));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  if (loading) return (
    <section className="relative py-16 sm:py-24 lg:py-32 xl:py-36 bg-[#FDFBF7] dark:bg-dark-950">
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-champagne-400/30 border-t-champagne-400 rounded-full animate-spin" />
      </div>
    </section>
  );
  const displayServices = services.length > 0 ? services : FALLBACK_SERVICES;

  return (
    <section id="services" className="relative py-16 sm:py-24 lg:py-32 xl:py-36 bg-[#FDFBF7] dark:bg-dark-950">
      <div className="w-full mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16" style={{ maxWidth: '90rem' }} dir={isRtl ? 'rtl' : 'ltr'}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-18 xl:mb-20"
        >
          <span className="inline-block px-4 sm:px-4 py-1.5 sm:py-1.5 rounded-full bg-champagne-400/10 border border-champagne-400/20 text-xs sm:text-xs font-semibold tracking-[0.2em] uppercase text-champagne-500 mb-4 sm:mb-6">
            {t('services.title')}
          </span>
          <SplitText
            text={t('services.title')}
            className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-dark-900 dark:text-ivory-50"
          />
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-4 sm:mt-5 text-base sm:text-base leading-relaxed text-dark-400 dark:text-ivory-200/50 font-light max-w-2xl mx-auto px-2 sm:px-0"
          >
            {t('services.subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">
          {displayServices.map((service, index) => {
            const title = getServiceTitle(service);
            return (
              <motion.div
                key={service.id || service.code || index}
                id={service.id || service.code}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className={`group relative bg-white dark:bg-dark-800/50 rounded-2xl overflow-hidden border border-ivory-200 dark:border-dark-700 hover:border-champagne-400/40 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(212,175,55,0.12)] transition-all duration-500 ease-in-out flex flex-col ${window.location.hash === `#${service.id || service.code}` ? 'ring-2 ring-champagne-400 shadow-[0_0_24px_rgba(212,175,55,0.3)]' : ''}`}
              >
                <div className="relative shrink-0 bg-ivory-100 dark:bg-dark-800 cursor-pointer" style={{ aspectRatio: '16 / 9' }} onClick={() => { setMediaService(service); setShowMedia(true); }}>
                  <BlurImage src={service.image || service.image_url} alt={title} className="w-full h-full" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#D4AF37]/90 flex items-center justify-center">
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-dark-900" />
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 lg:p-6 xl:p-7 flex flex-col flex-1">
                  <h3 className="font-display text-lg sm:text-lg lg:text-xl font-bold text-dark-900 dark:text-ivory-50 mb-2 group-hover:text-champagne-500 transition-colors duration-300">
                    {title}
                  </h3>

                  <p className="text-xs text-dark-400 dark:text-ivory-200/40 font-light mb-4 leading-relaxed flex-1">
                    {t('services.learn_more_desc') || 'Découvrez nos formules adaptées à vos besoins.'}
                  </p>

                  <div className="flex flex-col gap-2 mt-auto">
                    <button
                      onClick={() => { setMediaService(service); setShowMedia(true); }}
                      className="group/btn inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-champagne-400/10 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all duration-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t('services.see_details')}</span>
                    </button>
                    <RippleButton
                      onClick={() => openWhatsApp(title)}
                      className="group/btn inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#D4AF37] hover:bg-champagne-600 text-dark-900 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(212,175,55,0.2)]"
                    >
                      <span>{t('services.inquire')}</span>
                      <svg className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </RippleButton>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ServiceMediaModal
        isOpen={showMedia}
        onClose={() => setShowMedia(false)}
        service={mediaService}
        getTitle={getServiceTitle}
      />
    </section>
  );
}
