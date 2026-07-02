import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import useTranslation from '../../hooks/useTranslation';
import { Link } from 'react-router-dom';

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const currentLang = LANG_OPTIONS.find((l) => l.code === lang) || LANG_OPTIONS[0];

  const navLinks = [
    { key: 'home', href: '#home' },
    { key: 'services', href: '#services' },
    { key: 'about', href: '#about' },
    { key: 'contact', href: '#contact' },
    { key: 'app', href: '#app' },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-dark-950/90 backdrop-blur-xl shadow-[0_1px_0_rgba(212,175,55,0.1)]'
          : 'bg-transparent'
      }`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="w-full mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16" style={{ maxWidth: '90rem' }}>
        <div className="flex items-center justify-between h-14 xs:h-16 sm:h-20">
          <a href="#home" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-xl xs:text-xl sm:text-2xl font-bold text-champagne-400 tracking-[0.15em]">
              Medical Wellness
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-6 xl:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-xs xl:text-sm font-medium text-dark-600 dark:text-ivory-200/70 hover:text-champagne-500 dark:hover:text-champagne-400 transition-colors duration-300 tracking-wider uppercase whitespace-nowrap"
              >
                {t(`nav.${link.key}`)}
              </a>
            ))}
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
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm font-medium text-dark-600 dark:text-ivory-200/70 hover:text-champagne-500 transition-colors tracking-wider uppercase py-2 sm:py-2.5"
                >
                  {t(`nav.${link.key}`)}
                </a>
              ))}
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
