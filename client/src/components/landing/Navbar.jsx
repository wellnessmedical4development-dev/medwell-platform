import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import useTranslation from '../../hooks/useTranslation';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { servicesAPI } from '../../services/api';

const FALLBACK_SEARCH = [
  { id: 'nutrition', code: 'NUTRITION-ACCOMP', title: { en: 'Nutrition & Guidance', fr: 'Nutrition & Accompagnement', es: 'Nutrición y Acompañamiento', ar: 'التغذية والمرافقة' }, keywords: { en: ['diet','food','meal','health','wellness','eating','dietary','alimentation'], fr: ['régime','alimentation','repas','santé','diététique','manger'], es: ['dieta','alimentación','comida','salud','nutrición'], ar: ['نظام غذائي','طعام','صحة','تغذية'] } },
  { id: 'kine', code: 'KINESITHERAPIE', title: { en: 'Physiotherapy & Recovery', fr: 'Kinésithérapie', es: 'Fisioterapia', ar: 'العلاج الطبيعي' }, keywords: { en: ['massage','rehab','rehabilitation','physical therapy','recovery','physio','back pain','remise en forme'], fr: ['massage','rééducation','réadaptation','physiothérapie','dos','douleur','remise en forme'], es: ['masaje','rehabilitación','fisio','dolor','recuperación'], ar: ['تدليك','علاج طبيعي','تأهيل','علاج فيزيائي'] } },
  { id: 'islim', code: 'I-SLIM', title: { en: 'I-SLIM Electro-Stimulation', fr: 'I-SLIM Électro-stimulation', es: 'I-SLIM Electroestimulación', ar: 'تحفيز العضلات الكهربائي I-SLIM' }, keywords: { en: ['electro','muscle','stimulation','ems','slimming','toning','electric'], fr: ['électro','muscle','stimulation','ems','amincissant','tonification','électrique'], es: ['electro','músculo','estimulación','adelgazante','tonificación'], ar: ['تحفيز','عضلات','تنحيف','كهربائي'] } },
  { id: 'amincissement', code: 'AMINCISSEMENT', title: { en: 'Slimming & Body Contouring', fr: 'Amincissement & Minceur', es: 'Adelgazamiento y Moldeo', ar: 'التخسيس والتنحيف' }, keywords: { en: ['weight loss','fat','slimming','body shaping','contouring','minceur','lose weight','thin'], fr: ['perte de poids','graisse','minceur','modelage','maigrir'], es: ['pérdida de peso','grasa','adelgazamiento','moldear'], ar: ['تخسيس','وزن','دهون','إنقاص وزن'] } },
  { id: 'fitness', code: 'FITNESS-PROG', title: { en: 'Fitness', fr: 'Fitness', ar: 'اللياقة البدنية', es: 'Fitness' }, keywords: { en: ['gym','workout','exercise','training','cardio','strength','club','sport','condition physique','musculation'], fr: ['salle de sport','exercice','entraînement','cardio','force','club','sport','condition physique','musculation'], es: ['gimnasio','ejercicio','entrenamiento','cardio','fuerza','club','deporte'], ar: ['نادي رياضي','تمرين','لياقة','رياضة','جيم'] } },
  { id: 'esthetique', code: 'ESTHETIQUE', title: { en: 'Aesthetics & Anti-Aging', fr: 'Esthétique', es: 'Estética', ar: 'العناية بالجمال' }, keywords: { en: ['beauty','skincare','facial','anti-aging','rejuvenation','aesthetic','skin','young'], fr: ['beauté','soin visage','anti-âge','rajeunissement','esthétique','peau'], es: ['belleza','cuidado facial','anti-envejecimiento','rejuvenecimiento','piel'], ar: ['جمال','عناية بالبشرة','مضاد للشيخوخة','بشرة'] } },
  { id: 'spa-hammam', code: 'SPA-HAMMAM', title: { en: 'Luxury SPA & Hammam', fr: 'SPA & Hammam', es: 'SPA y Hammam', ar: 'السبا والحمام المغربي' }, keywords: { en: ['spa','hammam','massage','relaxation','sauna','steam','jacuzzi','wellness','pool'], fr: ['spa','hammam','massage','relaxation','sauna','vapeur','jacuzzi','bien-être'], es: ['spa','hammam','masaje','relajación','sauna','vapor','bienestar'], ar: ['سبا','حمام','مساج','استرخاء','ساونا','جاكوزي'] } },
  { id: 'wellness-assess', code: 'WELLNESS-ASSESS', title: { en: 'Wellness Assessment', fr: 'Bilan Bien-être', es: 'Evaluación de Bienestar', ar: 'تقييم الصحة' }, keywords: { en: ['checkup','evaluation','bilan','assessment','health check','diagnostic','test','exam'], fr: ['bilan','évaluation','check-up','diagnostic','santé','examen'], es: ['evaluación','chequeo','diagnóstico','salud','examen'], ar: ['تقييم','فحص','تشخيص','كشف'] } },
  { id: 'piscine', code: 'PISCINE', title: { en: 'Swimming Pool', fr: 'Piscine', es: 'Piscina', ar: 'المسبح' }, keywords: { en: ['swim','pool','swimming','water','piscine','natation','lap'], fr: ['piscine','natation','nager','eau','baignade'], es: ['piscina','natación','nadar','agua'], ar: ['مسبح','سباحة','ماء','بركة'] } },
];

const LANG_OPTIONS = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
  { code: 'ar', label: 'AR' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { mode, toggleMode, lang, setLang } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [allServices, setAllServices] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    servicesAPI.list().then(({ data }) => setAllServices(data.services || FALLBACK_SEARCH)).catch(() => setAllServices(FALLBACK_SEARCH));
  }, []);

  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); setShowSearch(false); return; }
    const q = search.toLowerCase();
    const results = allServices.filter(s => {
      const title = (() => {
        const t = s.title;
        if (typeof t === 'string') { try { return JSON.parse(t)[lang] || JSON.parse(t).en || t; } catch { return t; } }
        if (typeof t === 'object') return t[lang] || t.en || s.code;
        return s.code;
      })();
      if (title.toLowerCase().includes(q) || (s.code || '').toLowerCase().includes(q)) return true;
      const kw = s.keywords;
      if (kw) {
        const langKw = kw[lang] || kw.en || [];
        const enKw = kw.en || [];
        const allKw = [...new Set([...langKw, ...enKw])];
        if (allKw.some(k => k.toLowerCase().includes(q))) return true;
      }
      return false;
    });
    setSearchResults(results);
    setShowSearch(results.length > 0);
  }, [search, allServices, lang]);

  useEffect(() => {
    const close = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) { setShowSearch(false); setSearchOpen(false); } };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    setSearch('');
    setShowSearch(false);
  };

  const nav = useNavigate();

  const navigateToService = (serviceId) => {
    setSearch('');
    setSearchOpen(false);
    setShowSearch(false);
    nav(`/services#${serviceId}`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentLang = LANG_OPTIONS.find((l) => l.code === lang) || LANG_OPTIONS[0];
  const location = useLocation();

  const navLinks = [
    { key: 'home', path: '/' },
    { key: 'services', path: '/services' },
    { key: 'about', path: '/about' },
    { key: 'contact', path: '/contact' },
    { key: 'app', path: '/app' },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-dark-950/90 backdrop-blur-xl shadow-[0_1px_0_rgba(212,175,55,0.1)]'
          : 'bg-transparent'
      }`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="w-full mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16" style={{ maxWidth: '90rem' }}>
        <div className="flex items-center justify-between h-14 xs:h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-xl xs:text-xl sm:text-2xl font-bold text-champagne-400 tracking-[0.15em]">
              Medical Wellness
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.key}
                  to={link.path}
                  className={`relative text-xs xl:text-sm font-medium tracking-wider uppercase whitespace-nowrap transition-colors duration-300 ${
                    isActive
                      ? 'text-champagne-500 dark:text-champagne-400'
                      : 'text-dark-600 dark:text-ivory-200/70 hover:text-champagne-500 dark:hover:text-champagne-400'
                  }`}
                >
                  {t(`nav.${link.key}`)}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-champagne-500 dark:bg-champagne-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          <div ref={searchRef} className="relative hidden lg:block">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dark-200/30 dark:border-ivory-200/20 text-xs font-semibold text-dark-600 dark:text-ivory-200 hover:border-champagne-400 transition-colors tracking-wider uppercase"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t('services.search_placeholder')}</span>
            </button>
            {searchOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', width: '320px',
                background: 'var(--bg-card, #fff)', border: '1px solid var(--border-color, #e5e7eb)',
                borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', overflow: 'hidden', zIndex: 100,
              }}>
                <div style={{ padding: '0.75rem' }}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                    <input
                      autoFocus
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-ivory-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-sm focus:outline-none focus:border-champagne-400"
                      placeholder={t('services.search_placeholder')}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                {showSearch && (
                  <div style={{ maxHeight: '240px', overflowY: 'auto', borderTop: '1px solid var(--border-color, #e5e7eb)' }}>
                    {searchResults.slice(0, 6).map((svc) => {
                      const title = (() => {
                        const t = svc.title;
                        if (typeof t === 'string') { try { return JSON.parse(t)[lang] || JSON.parse(t).en || t; } catch { return t; } }
                        if (typeof t === 'object') return t[lang] || t.en || svc.code;
                        return svc.code;
                      })();
                      return (
                        <button
                          key={svc.id}
                          onClick={() => { navigateToService(svc.id || svc.code); }}
                          style={{
                            display: 'block', width: '100%', textAlign: 'left', padding: '0.6rem 0.75rem',
                            fontSize: '0.8rem', border: 'none', background: 'transparent', cursor: 'pointer',
                            color: 'var(--text-primary, #111)', borderBottom: '1px solid var(--border-color, #e5e7eb)',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f4'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {title}
                          <span style={{ fontSize: '0.65rem', color: '#9ca3af', marginLeft: '0.5rem' }}>{svc.code}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {search.trim() && !showSearch && (
                  <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#9ca3af', borderTop: '1px solid var(--border-color, #e5e7eb)' }}>
                    {t('common.no_results')}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2 xs:px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-dark-200/30 dark:border-ivory-200/20 text-[11px] xs:text-[11px] sm:text-xs font-semibold text-dark-600 dark:text-ivory-200 hover:border-champagne-400 transition-colors tracking-wider uppercase"
              >
                <span className="hidden xs:inline">{currentLang.label}</span>
                <span className="xs:hidden">{currentLang.code}</span>
                <svg className={`w-2 xs:w-2.5 sm:w-3 h-2 xs:h-2.5 sm:h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute ${lang === 'ar' ? 'left-0' : 'right-0'} mt-2 bg-white dark:bg-dark-900 border border-ivory-200 dark:border-dark-700 rounded-xl shadow-xl overflow-hidden min-w-[70px] xs:min-w-[80px] sm:min-w-[100px]`}
                  >
                    {LANG_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => { setLang(opt.code); setLangOpen(false); }}
                        className={`w-full px-3 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-left transition-colors ${
                          lang === opt.code
                            ? 'bg-champagne-400/10 text-champagne-500'
                            : 'text-dark-600 dark:text-ivory-200/70 hover:bg-ivory-100 dark:hover:bg-dark-800'
                        }`}
                      >
                        {opt.code === 'ar' ? 'العربية' : opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={toggleMode}
              className="w-7 xs:w-8 sm:w-9 h-7 xs:h-8 sm:h-9 rounded-full flex items-center justify-center border border-dark-200/30 dark:border-ivory-200/20 hover:border-champagne-400 transition-colors text-dark-600 dark:text-ivory-200 shrink-0"
              aria-label="Toggle theme"
            >
              {mode === 'light' ? (
                <svg className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>

            <Link
              to="/download"
              className="hidden xs:inline-flex items-center gap-1.5 sm:gap-2 px-3 xs:px-3 sm:px-5 py-1.5 sm:py-2 bg-dark-900 dark:bg-champagne-400 text-white dark:text-dark-900 rounded-full text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-wider uppercase hover:bg-dark-800 dark:hover:bg-champagne-500 transition-all duration-300 whitespace-nowrap"
            >
              <svg className="w-3 xs:w-3 sm:w-3.5 h-3 xs:h-3 sm:h-3.5 hidden xs:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              {t('download.download_app')}
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-7 xs:w-8 sm:w-9 h-7 xs:h-8 sm:h-9 flex items-center justify-center rounded-full border border-dark-200/30 dark:border-ivory-200/20 text-dark-600 dark:text-ivory-200 shrink-0"
              aria-label="Toggle menu"
            >
              <svg className="w-3 xs:w-3.5 sm:w-4 h-3 xs:h-3.5 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 dark:bg-dark-950/95 backdrop-blur-lg border-t border-ivory-200 dark:border-dark-800 overflow-hidden"
          >
            <div className="px-4 xs:px-5 sm:px-8 py-3 sm:py-4 space-y-1 sm:space-y-2">
              <div className="relative mb-3 sm:mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
                <input
                  placeholder={t('services.search_placeholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-dark-200/30 dark:border-ivory-200/20 bg-transparent text-sm text-dark-900 dark:text-ivory-50 placeholder:text-dark-300 dark:placeholder:text-dark-500 focus:outline-none focus:border-champagne-400 transition-colors"
                />
                {search.trim() && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-xl shadow-xl overflow-hidden z-50" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {searchResults.slice(0, 5).map((svc) => {
                      const st = (() => {
                        const t = svc.title;
                        if (typeof t === 'string') { try { return JSON.parse(t)[lang] || JSON.parse(t).en || t; } catch { return t; } }
                        if (typeof t === 'object') return t[lang] || t.en || svc.code;
                        return svc.code;
                      })();
                      return (
                        <button
                          key={svc.id}
                          onClick={() => { navigateToService(svc.id || svc.code); setMobileOpen(false); }}
                          className="w-full text-left px-3 py-2.5 text-sm text-dark-700 dark:text-ivory-200/80 hover:bg-ivory-100 dark:hover:bg-dark-800 border-b border-dark-100 dark:border-dark-800 last:border-0 transition-colors"
                        >
                          {st}
                          <span className="text-[10px] text-dark-400 dark:text-ivory-200/40 ml-2">{svc.code}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {search.trim() && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-xl shadow-xl p-3 text-center text-xs text-dark-400 dark:text-ivory-200/40">
                    {t('common.no_results')}
                  </div>
                )}
              </div>
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.key}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block text-sm font-medium tracking-wider uppercase py-2 sm:py-2.5 transition-colors ${
                      isActive
                        ? 'text-champagne-500 dark:text-champagne-400'
                        : 'text-dark-600 dark:text-ivory-200/70 hover:text-champagne-500 dark:hover:text-champagne-400'
                    }`}
                  >
                    {t(`nav.${link.key}`)}
                  </Link>
                );
              })}
              <Link
                to="/download"
                onClick={() => setMobileOpen(false)}
                className="block text-center mt-2 sm:mt-3 px-5 py-2.5 sm:py-3 bg-dark-900 dark:bg-champagne-400 text-white dark:text-dark-900 rounded-full text-xs font-semibold tracking-wider uppercase lg:hidden"
              >
                {t('download.download_app')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
