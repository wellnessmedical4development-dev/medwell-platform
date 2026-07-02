import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import useTranslation from '../../hooks/useTranslation';

export default function Sidebar() {
  const { user, isAdmin, isClient, logout } = useAuth();
  const { mode, toggleMode, lang, setLang } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

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
