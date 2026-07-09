import { useNavigate, useLocation } from 'react-router-dom';
import useTranslation from '../../hooks/useTranslation';

const PAGES = [
  { path: '/', label: 'nav.home' },
  { path: '/services', label: 'nav.services' },
  { path: '/about', label: 'nav.about' },
  { path: '/contact', label: 'nav.contact' },
  { path: '/app', label: 'nav.app' },
];

export default function PageNavigation({ className = '' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = PAGES.findIndex((p) => p.path === location.pathname);
  if (currentIndex === -1) return null;

  const prevIndex = (currentIndex - 1 + PAGES.length) % PAGES.length;
  const nextIndex = (currentIndex + 1) % PAGES.length;

  return (
    <div className={`flex flex-col items-center gap-4 pt-12 pb-16 ${className}`}>
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        <button
          onClick={() => navigate(PAGES[prevIndex].path)}
          className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-dark-900 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300"
        >
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          {t(PAGES[prevIndex].label)}
        </button>

        <div className="flex items-center gap-1.5">
          {PAGES.map((p, i) => (
            <button
              key={p.path}
              onClick={() => navigate(p.path)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-[#D4AF37] scale-125'
                  : 'bg-[#D4AF37]/30 hover:bg-[#D4AF37]/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => navigate(PAGES[nextIndex].path)}
          className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-dark-900 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all duration-300"
        >
          {t(PAGES[nextIndex].label)}
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
