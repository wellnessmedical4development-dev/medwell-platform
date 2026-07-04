import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import useTranslation from '../../hooks/useTranslation';

const VIDEOS = {
  doctorTalk: {
    src: '/videos/doctor_talk.mp4',
    poster: '/mernissi.png',
    caption: { name: 'Dr. Mernissi', specialty: 'Médecine Esthétique & Bien-être' },
    aspect: 'aspect-[21/9] lg:aspect-[21/9]',
  },
  case1: {
    src: '/videos/video_1.mp4',
    poster: '/image_islim.png',
    caption: { result: 'Perte de 15 kg', service: 'Programme I-SLIM' },
    aspect: 'aspect-[3/4]',
  },
  case2: {
    src: '/videos/video_2.mp4',
    poster: '/image_beauty.jpg',
    caption: { result: 'Rajeunissement 10 ans', service: 'Médecine Esthétique' },
    aspect: 'aspect-video',
  },
  case3: {
    src: '/videos/video_3.mp4',
    poster: '/spa-hammam.jpg',
    caption: { result: 'Détente profonde', service: 'SPA & Hammam' },
    aspect: 'aspect-[4/5]',
  },
};

function useLazyLoad(rootMargin = '300px') {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, isInView];
}

function LazyVideo({ video, index }) {
  const [ref, isInView] = useLazyLoad('300px');
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => setHasError(true), []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl bg-dark-800 border border-dark-700 hover:border-[#C59D5D]/30 group transition-all duration-500
        ${index === 0
          ? 'shadow-[0_0_30px_rgba(197,157,93,0.08)] hover:shadow-[0_0_50px_rgba(197,157,93,0.18)]'
          : 'shadow-[0_0_15px_rgba(197,157,93,0.05)] hover:shadow-[0_0_35px_rgba(197,157,93,0.15)]'
        }`}
    >
      <div className={`relative w-full ${video.aspect}`}>
        {isInView && !hasError ? (
          <video
            src={video.src}
            poster={video.poster}
            preload="none"
            controls
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            onError={handleError}
          />
        ) : (
          <img
            src={video.poster}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C59D5D]/20 border border-[#C59D5D]/30 flex items-center justify-center group-hover:bg-[#C59D5D]/30 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/20 to-transparent pointer-events-none" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 pointer-events-none">
        {'name' in video.caption ? (
          <div>
            <p className="text-ivory-50 font-bold text-sm sm:text-base">{video.caption.name}</p>
            <p className="text-[#C59D5D] text-xs sm:text-sm font-medium">{video.caption.specialty}</p>
          </div>
        ) : (
          <div>
            <p className="text-[#C59D5D] font-bold text-sm sm:text-base">{video.caption.result}</p>
            <p className="text-ivory-200/70 text-xs sm:text-sm">{video.caption.service}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function ReviewsSection() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';

  return (
    <section id="reviews" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-[#C59D5D]/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-[#C59D5D]/5 blur-[120px] pointer-events-none" />

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
            {t('reviews.badge')}
          </span>
          <h2 className="font-display text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ivory-50 leading-tight">
            {t('reviews.title')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ivory-200/50 font-light max-w-2xl mx-auto">
            {t('reviews.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div
            className="lg:col-span-3"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <LazyVideo video={VIDEOS.doctorTalk} index={0} />
          </motion.div>

          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <LazyVideo video={VIDEOS.case1} index={1} />
          </motion.div>

          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <LazyVideo video={VIDEOS.case2} index={2} />
          </motion.div>

          <motion.div
            custom={3}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <LazyVideo video={VIDEOS.case3} index={3} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
