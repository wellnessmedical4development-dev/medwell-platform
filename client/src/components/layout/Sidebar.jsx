import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Search, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import useTranslation from '../../hooks/useTranslation';
import { servicesAPI } from '../../services/api';
import BookingModal from '../ui/BookingModal';

export default function Sidebar() {
  const { user, isAdmin, isClient, logout } = useAuth();
  const { mode, toggleMode, lang, setLang } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingService, setBookingService] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    servicesAPI.list().then(({ data }) => setServices(data.services || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered([]); setShowResults(false); return; }
    const q = search.toLowerCase();
    const matches = services.filter(s => {
      const title = getTitle(s);
      return title.toLowerCase().includes(q) || (s.code || '').toLowerCase().includes(q);
    });
    setFiltered(matches);
    setShowResults(matches.length > 0);
  }, [search, services]);

  useEffect(() => {
    const close = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const getTitle = (svc) => {
    const title = svc.title;
    if (typeof title === 'string') { try { return JSON.parse(title)[lang] || JSON.parse(title).en || title; } catch { return title; } }
    if (typeof title === 'object') return title[lang] || title.en || svc.code;
    return svc.code;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: isAdmin ? '/admin' : '/client', icon: '◈', label: t('sidebar.dashboard') },
  ];

  if (isClient) {
    links.push(
      { to: '/client/services', icon: '✦', label: t('sidebar.services') },
      { to: '/client/appointments', icon: '◈', label: t('sidebar.appointments') },
    );
  }

  if (isAdmin) {
    links.push(
      { to: '/admin/services', icon: '✦', label: t('sidebar.services') },
    );
  }

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-logo">{t('member_card.brand')}</div>

      <div ref={searchRef} style={{ padding: '0 1rem', marginBottom: '1rem', position: 'relative' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
          <input
            className="form-input !pl-9 !pr-3 !py-2 !text-xs !w-full"
            placeholder={t('sidebar.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => { if (filtered.length > 0) setShowResults(true); }}
          />
        </div>
        {showResults && (
          <div style={{
            position: 'absolute', top: '100%', left: '1rem', right: '1rem', zIndex: 100,
            background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', maxHeight: '220px', overflowY: 'auto',
          }}>
            {filtered.slice(0, 6).map((svc) => (
              <button
                key={svc.id}
                onClick={() => { setBookingService(getTitle(svc)); setShowBooking(true); setShowResults(false); setSearch(''); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 0.75rem',
                  fontSize: '0.8rem', border: 'none', background: 'transparent', cursor: 'pointer',
                  color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {getTitle(svc)}
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{svc.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setShowBooking(true)}
        style={{
          margin: '0 1rem 1rem', padding: '0.6rem 1rem', width: 'calc(100% - 2rem)',
          background: 'linear-gradient(135deg, #d4af37, #c9a032)', color: '#fff', border: 'none',
          borderRadius: '999px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          boxShadow: '0 4px 16px rgba(212,175,55,0.3)',
        }}
      >
        <Phone style={{ width: '14px', height: '14px' }} />
        {t('sidebar.book_appointment')}
      </button>

      <ul className="sidebar-nav">
        {links.map((link) => (
          <li key={link.to} className="group">
            <NavLink to={link.to} className={({ isActive }) => isActive ? 'active' : ''} end>
              <span className="icon transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:-translate-y-0.5">{link.icon}</span>
              <span className="transition-all duration-300 ease-in-out">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} serviceTitle={bookingService} />

      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
        {user && (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', padding: '0 1rem' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{user.first_name} {user.last_name}</strong>
            <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.15rem' }}>
              {isAdmin ? t('sidebar.administrator') : `${t('sidebar.member')} · ${user.unique_id || ''}`}
            </div>
          </div>
        )}

        <div style={{ padding: '0 1rem' }}>
          <select
            className="form-input"
            style={{ width: '100%', padding: '0.35rem 0.65rem', fontSize: '0.8rem', marginBottom: '0.5rem' }}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="es">Español</option>
          </select>

          <button
            className="btn btn-secondary btn-sm w-full"
            onClick={toggleMode}
            style={{ marginBottom: '0.5rem' }}
          >
            {mode === 'light' ? `🌙 ${t('sidebar.dark_mode')}` : `☀️ ${t('sidebar.light_mode')}`}
          </button>

          <button
            className="btn btn-secondary btn-sm w-full"
            onClick={handleLogout}
          >
            {t('sidebar.sign_out')}
          </button>
        </div>
      </div>
    </aside>
  );
}
