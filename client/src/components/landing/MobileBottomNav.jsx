import { useNavigate, useLocation } from 'react-router-dom';
import useTranslation from '../../hooks/useTranslation';

const NAV_ITEMS = [
  { key: 'home', path: '/', icon: 'home' },
  { key: 'services', path: '/services', icon: 'services' },
  { key: 'about', path: '/about', icon: 'about' },
  { key: 'contact', path: '/contact', icon: 'contact' },
  { key: 'app', path: '/app', icon: 'app' },
];

function NavIcon({ name, className }) {
  const icons = {
    home: (
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    ),
    services: (
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    ),
    about: (
      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
    contact: (
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
    app: (
      <path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    ),
  };

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
}

export default function MobileBottomNav() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';
  const navigate = useNavigate();
  const location = useLocation();
  const activeKey = NAV_ITEMS.find((item) => item.path === location.pathname)?.key || 'home';

  const handleClick = (item) => {
    navigate(item.path);
  };

  return (
    <>
      <div className="block lg:hidden h-16 sm:h-20" />
      <nav
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        className="fixed bottom-0 left-0 right-0 z-50 block lg:hidden bg-white/95 dark:bg-dark-950/95 backdrop-blur-xl border-t border-ivory-200 dark:border-dark-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center justify-around h-16 sm:h-20 px-2 max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeKey === item.key;

            return (
              <button
                key={item.key}
                onClick={() => handleClick(item)}
                className="flex flex-col items-center justify-center gap-0.5 py-1 px-2 min-w-0"
              >
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[#C59D5D]/15 text-[#C59D5D]'
                    : 'text-dark-400 dark:text-ivory-200/40'
                }`}>
                  <NavIcon name={item.icon} className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5" />
                </div>
                <span className={`text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-colors duration-300 ${
                  isActive
                    ? 'text-[#C59D5D]'
                    : 'text-dark-400 dark:text-ivory-200/40'
                }`}>
                  {t(`nav.${item.key}`)}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}