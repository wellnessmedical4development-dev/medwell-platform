import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { subscriptionsAPI } from '../../services/api';
import useTranslation from '../../hooks/useTranslation';
import { useToast } from '../../contexts/ToastContext';
import MembershipCard from './MembershipCard';
import {
  LogOut, Info, X, CircleDollarSign, Plus, Gift, Send,
  Edit, ClipboardCheck, CalendarDays, CalendarCheck,
  Wallet, Mail, MessageCircle, Copy, ExternalLink, Clock, Users, ArrowLeft,
} from 'lucide-react';
import PaymentModal from '../payment/PaymentModal';
import SendWMCModal from './SendWMCModal';
import { messagesAPI, referralAPI } from '../../services/api';
import OnboardingTour from '../ui/OnboardingTour';
import MesDemandesRapides from './MesDemandesRapides';
import { connectSocket } from '../../services/socket';

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const { mode, lang, toggleMode, setLang } = useTheme();
  const { t } = useTranslation();

  const [financial, setFinancial] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [coinLedger, setCoinLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [legacyBanner, setLegacyBanner] = useState(true);

  const [showCoinModal, setShowCoinModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [referralInfo, setReferralInfo] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const addToast = useToast();

  const isRtl = lang === 'ar';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await subscriptionsAPI.financialOverview();
      setFinancial(data.financial);
      setSubscriptions(data.active_subscriptions || []);
      setCoinLedger(data.coin_ledger || []);
    } catch {
      setFinancial(null);
      setSubscriptions([]);
      setCoinLedger([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await messagesAPI.my();
      setMessages(data.messages || []);
      setUnreadCount(data.unread || 0);
    } catch {}
  }, []);

  const fetchReferralInfo = useCallback(async () => {
    try {
      const { data } = await referralAPI.myInfo();
      setReferralInfo(data);
    } catch {}
  }, []);

  useEffect(() => { fetchData(); fetchMessages(); fetchReferralInfo(); }, [fetchData, fetchMessages, fetchReferralInfo]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) connectSocket(token);
  }, []);

  const langNames = { en: 'English', fr: 'Français', ar: 'العربية', es: 'Español' };

  const formatCurrency = (val) => {
    const n = parseFloat(val || 0);
    return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const getServiceTitle = (service) => {
    if (!service) return '\u2014';
    const title = service.title || service.service_name || '';
    if (typeof title === 'string') {
      try {
        const parsed = JSON.parse(title);
        return parsed[lang] || parsed.en || title;
      } catch { return title; }
    }
    if (typeof title === 'object') return title[lang] || title.en || '';
    return service.code || service.service_code || '\u2014';
  };

  const handleLogout = () => {
    logout();
    window.location.hash = '#/login';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  const activeSub = subscriptions && subscriptions.length > 0 ? subscriptions[0] : null;
  const balance = financial?.wellness_coin_balance || 120;
  const totalPaid = financial?.total_paid || 8500;
  const remaining = financial?.amount_remaining || 4000;
  const subStatus = financial?.subscription_status || (activeSub ? 'active' : 'inactive');

  const hardcodedCoinHistory = [
    { id: 1, amount: 100, type: 'earned', label: "Activation du Pack Amincissement & Minceur" },
    { id: 2, amount: 50, type: 'earned', label: "Bonus de Bienvenue Nouveau Syst\u00e8me" },
    { id: 3, amount: -30, type: 'spent', label: "S\u00e9ance SPA & Hammam consomm\u00e9e" },
  ];

  const displayLedger = (coinLedger && coinLedger.length > 0) ? coinLedger : hardcodedCoinHistory;

  const syncCards = [
    {
      icon: ClipboardCheck,
      title: 'Mes Diagnostics & Devis',
      value: '3 diagnostics pr\u00eats',
      accent: 'text-champagne-400',
      bg: 'bg-champagne-50 dark:bg-champagne-900/10',
    },
    {
      icon: CalendarDays,
      title: 'Suivi Global des S\u00e9ances',
      value: '8 s\u00e9ances restantes',
      accent: 'text-champagne-400',
      bg: 'bg-champagne-50 dark:bg-champagne-900/10',
      progress: { used: 12, total: 20 },
    },
    {
      icon: CalendarCheck,
      title: 'Mon Agenda VIP',
      value: 'Vendredi 18 Juillet 2026 \u00e0 10h30',
      accent: 'text-champagne-400',
      bg: 'bg-champagne-50 dark:bg-champagne-900/10',
    },
  ];

  const vouchCode = `WMC-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 900) + 100)}`;

  return (
    <div className="w-full max-w-md mx-auto md:max-w-[960px]" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ─── BACK TO HOME ─── */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4 sm:mb-6">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-champagne-400/30 text-champagne-600 dark:text-champagne-400 text-[11px] sm:text-xs font-semibold bg-transparent hover:bg-champagne-50 dark:hover:bg-champagne-900/10 transition-all duration-200 shrink-0"
        >
          <ArrowLeft className="w-3 h-3" />
          {lang === 'fr' ? 'Retour' : lang === 'ar' ? 'العودة' : lang === 'es' ? 'Volver' : 'Back'}
        </a>
      </div>

      {/* ─── TOP BAR ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{t('client.my_dashboard')}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {t('client.welcome_back', { name: user?.first_name || '' })}
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <button
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--border-color)] bg-transparent text-[var(--text-secondary)] cursor-pointer hover:border-champagne-400 hover:text-champagne-400 transition-all duration-200"
            onClick={() => setShowInbox(true)}
            title={t('messages.title')}
          >
            <Mail className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center px-1 shadow-md">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <select
            className="form-input !w-auto !py-1.5 !px-2 !text-xs"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            {Object.entries(langNames).map(([c, n]) => (
              <option key={c} value={c}>{n}</option>
            ))}
          </select>
          <button className="btn-icon !text-base" onClick={toggleMode}>
            {mode === 'light' ? '\uD83C\uDF19' : '\u2600\uFE0F'}
          </button>
          <button
            className="inline-flex items-center gap-1.5 py-1.5 px-3 border border-[var(--border-color)] rounded-lg bg-transparent text-[var(--text-secondary)] text-xs font-medium cursor-pointer transition-all duration-200 hover:border-champagne-400 hover:text-champagne-400"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="w-3.5 h-3.5" />
            {t('nav.logout')}
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════ */}
      {/* LEGACY BANNER                              */}
      {/* ════════════════════════════════════════════ */}
      {legacyBanner && (
        <div className="relative flex items-start gap-3 p-4 mb-6 rounded-2xl border border-[var(--border-color)]"
          style={{ background: 'linear-gradient(135deg, #FDF8ED 0%, #F9EDCC 100%)' }}>
          <div className="w-9 h-9 rounded-full bg-champagne-400 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4.5 h-4.5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800 mb-1 leading-tight">
              {t('client.legacy_welcome')}
            </p>
            <p className="text-xs text-amber-700 leading-relaxed">
              {t('client.legacy_description')}
            </p>
          </div>
          <button
            className="bg-transparent border-none cursor-pointer text-amber-700 p-1 leading-none shrink-0 hover:opacity-70"
            onClick={() => setLegacyBanner(false)}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <MesDemandesRapides />

      {/* ════════════════════════════════════════════ */}
      {/* PROFILE + MEMBERSHIP CARD                  */}
      {/* ════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-champagne-400 to-champagne-300 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-lg shadow-champagne-400/25">
                {(user?.first_name?.[0] || user?.last_name?.[0] || 'C').toUpperCase()}
              </div>
              <div>
                <div className="text-lg font-bold text-[var(--text-primary)]">
                  {user?.first_name || 'Client'} {user?.last_name || ''}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5 ltr text-left">
                  {user?.phone || '+2126XXXXXXXX'}
                </div>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider ${
              subStatus === 'active'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
            }`}>
              {subStatus === 'active' ? t('subscriptions.status_active') : t('subscriptions.status_expired')}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold text-champagne-400 uppercase tracking-widest mb-3 text-center">
              {t('client.digital_member_card')}
            </p>
            <MembershipCard user={user} />
          </div>
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════ */}
      {/* COLLECTIVE SYNC SECTION                     */}
      {/* ════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6">
        <h2 className="font-display text-lg font-bold text-[var(--text-primary)] mb-3">
          Synchronisation Collective
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {syncCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(212,175,55,0.08)] transition-all duration-300 ease-in-out cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}>
                  <card.icon className={`w-5 h-5 ${card.accent}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--text-muted)] mb-1 leading-tight">{card.title}</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">{card.value}</p>
                  {card.progress && (
                    <div className="mt-2.5">
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
                        <span>{card.progress.used}/{card.progress.total} utilis\u00e9es</span>
                        <span>{Math.round((card.progress.used / card.progress.total) * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-champagne-400 to-champagne-300 transition-all duration-500"
                          style={{ width: `${(card.progress.used / card.progress.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════ */}
      {/* REFERRAL PROGRAM                           */}
      {/* ════════════════════════════════════════════ */}
      {referralInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 mb-6 overflow-hidden relative">
          <div className="absolute -top-8 -left-8 w-30 h-30 rounded-full opacity-[0.06] pointer-events-none"
            style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }} />
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">
              <Users className="w-5 h-5 inline-block -mt-0.5 mr-2 text-champagne-400" />
              {t('referral.title')}
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[var(--text-muted)]">{t('referral.total_earned')}: <strong className="text-champagne-500">{referralInfo.total_rewards} WMC</strong></span>
              {referralInfo.pending_rewards > 0 && (
                <span className="text-amber-500">{t('referral.pending')}: {referralInfo.pending_rewards} WMC</span>
              )}
            </div>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-4">{t('referral.desc')}</p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-0">
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1">{t('referral.your_code')}</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 py-2.5 px-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] font-mono text-sm font-bold text-champagne-500 tracking-wider">
                  {referralInfo.referral_code}
                </code>
                <button
                  className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-lg border border-champagne-400 text-champagne-500 text-xs font-semibold cursor-pointer hover:bg-champagne-50 dark:hover:bg-champagne-900/10 transition-all duration-200"
                  onClick={() => {
                    navigator.clipboard.writeText(referralInfo.referral_link);
                    setCopySuccess(true);
                    addToast(t('referral.link_copied'));
                    setTimeout(() => setCopySuccess(false), 2000);
                  }}
                >
                  {copySuccess ? (
                    <>{t('referral.link_copied')}</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> {t('referral.share_link')}</>
                  )}
                </button>
              </div>
            </div>
          </div>
          {referralInfo.referrals?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
              <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">{t('referral.friend')}</p>
              <div className="space-y-1.5">
                {referralInfo.referrals.map((r, i) => (
                  <div key={r.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[var(--bg-secondary)] text-xs">
                    <span className="text-[var(--text-muted)]">#{i + 1}</span>
                    <span className={`font-semibold ${r.status === 'awarded' ? 'text-green-600' : 'text-amber-500'}`}>
                      {r.status === 'awarded' ? `+${r.reward_amount} WMC` : t('referral.pending')}
                    </span>
                    <span className="text-[var(--text-muted)]">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ════════════════════════════════════════════ */}
      {/* WELLNESSCOIN WALLET                        */}
      {/* ════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 mb-6 overflow-hidden relative">
        <div className="absolute -top-8 -right-8 w-30 h-30 rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }} />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">{t('wellness_coins.wallet_title')}</h2>
        </div>

        <div className="bg-gradient-to-br from-champagne-50 to-champagne-100 dark:from-champagne-900/15 dark:to-champagne-900/5 rounded-xl p-5 border border-champagne-200/50 dark:border-champagne-700/20 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(212,175,55,0.1)] transition-all duration-300 ease-in-out flex items-center justify-between flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-champagne-400 via-champagne-300 to-champagne-500 flex items-center justify-center shrink-0 shadow-lg shadow-champagne-400/30">
              <CircleDollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">
                {t('wellness_coins.balance')}
              </p>
              <p className="text-3xl font-extrabold text-amber-800 dark:text-champagne-300 leading-none">
                {balance} <span className="text-sm font-semibold text-amber-600 dark:text-champagne-400">WMC</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-transparent border border-champagne-400 text-champagne-600 dark:text-champagne-400 rounded-full text-sm font-bold tracking-wider cursor-pointer hover:bg-champagne-50 dark:hover:bg-champagne-900/10 transition-all duration-300 flex-1 sm:flex-none"
              onClick={() => setShowSendModal(true)}
            >
              <Send className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('wellness_coins.send_btn')}</span>
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-br from-champagne-400 to-champagne-500 text-white border-none rounded-full text-sm font-bold tracking-wider cursor-pointer shadow-lg shadow-champagne-400/30 hover:shadow-xl hover:shadow-champagne-400/40 hover:-translate-y-0.5 transition-all duration-300 flex-1 sm:flex-none"
              onClick={() => setShowCoinModal(true)}
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span className="truncate">{t('wellness_coins.use_coins')}</span>
            </button>
          </div>
        </div>

        <p className="text-sm font-semibold text-[var(--text-secondary)] mb-2.5">
          {t('wellness_coins.history')}
        </p>
        <div className="flex flex-col gap-2">
          {displayLedger.slice(0, 8).map((entry) => {
            const amt = parseFloat(entry.amount || 0);
            const isPositive = amt >= 0;
            return (
              <div key={entry.id} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[var(--bg-secondary)] gap-2.5">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-bold text-xs ${
                    isPositive ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                  }`}>
                    {isPositive ? '+' : '\u2212'}
                  </div>
                  <span className="text-xs font-medium text-[var(--text-primary)] truncate">
                    {entry.description || entry.label || entry.operation || t('wellness_coins.entry')}
                  </span>
                </div>
                <span className={`font-bold text-sm shrink-0 ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {isPositive ? '+' : ''}{amt} WMC
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ════════════════════════════════════════════ */}
      {/* SUBSCRIPTION + FINANCIAL LEDGER             */}
      {/* ════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 sm:p-6 mb-6">
        <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mb-4">{t('client.subscription_title')}</h2>

        {activeSub ? (
          <div className="mb-5">
            <div className="flex items-center justify-between flex-wrap gap-2.5 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)]">
              <div>
                <p className="text-base font-bold text-[var(--text-primary)]">
                  {getServiceTitle(activeSub)}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
                    activeSub.status === 'active'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${
                      activeSub.status === 'active' ? 'bg-green-500' : 'bg-amber-500'
                    }`} />
                    {activeSub.status === 'active' ? t('subscriptions.status_active') : t('subscriptions.status_expired')}
                  </span>
                  {activeSub.end_date && (
                    <span className="text-xs text-[var(--text-muted)]">
                      {t('subscriptions.until')} {new Date(activeSub.end_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-[var(--bg-secondary)] text-center mb-5 text-sm text-[var(--text-muted)]">
            {t('client.no_subscriptions')}
          </div>
        )}

        <p className="text-sm font-semibold text-[var(--text-secondary)] mb-3">
          {t('client.financial_ledger')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4">
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-center hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(212,175,55,0.06)] transition-all duration-300 ease-in-out">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium mb-1">
              {t('client.total_contract')}
            </p>
            <p className="text-xl font-extrabold text-[var(--text-primary)]">
              {formatCurrency(financial?.total_contract || activeSub?.amount || 12500)} {t('client.mad')}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] text-center hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(212,175,55,0.06)] transition-all duration-300 ease-in-out">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium mb-1">
              {t('client.amount_paid')}
            </p>
            <p className="text-xl font-extrabold text-green-600 dark:text-green-400">
              {formatCurrency(totalPaid)} {t('client.mad')}
            </p>
          </div>
          <div className="p-4 rounded-xl text-center relative overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(212,175,55,0.06)] transition-all duration-300 ease-in-out"
            style={{ background: 'linear-gradient(135deg, #fef2f2 0%, var(--bg-card) 100%)' }}>
            <div className="absolute -top-5 -right-5 w-15 h-15 rounded-full opacity-[0.06] pointer-events-none"
              style={{ background: 'radial-gradient(circle, #dc2626 0%, transparent 70%)' }} />
            <p className="text-xs text-red-700 dark:text-red-400 uppercase tracking-wider font-semibold mb-1">
              {t('client.remaining')}
            </p>
            <p className="text-xl font-extrabold text-red-600 dark:text-red-400">
              {formatCurrency(remaining)} {t('client.mad')}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            className="inline-flex items-center gap-2 py-2.5 px-5 bg-champagne-400 text-white border-none rounded-full text-sm font-semibold cursor-pointer shadow-md shadow-champagne-400/20 hover:shadow-lg hover:shadow-champagne-400/30 hover:-translate-y-0.5 transition-all duration-300"
            onClick={() => setShowPaymentModal(true)}
          >
            <Wallet className="w-4 h-4" />
            Renouveler ou R\u00e9gler mon solde en ligne
          </button>
          <button
            className="inline-flex items-center gap-2 py-2.5 px-5 bg-transparent border border-[var(--border-color)] rounded-full text-sm font-semibold text-[var(--text-secondary)] cursor-pointer transition-all duration-300 hover:border-champagne-400 hover:text-champagne-400"
            onClick={() => setShowModifyModal(true)}
          >
            <Edit className="w-4 h-4" />
            {t('client.modify_button')}
          </button>
        </div>
      </motion.div>

      {/* ─── COIN VOUCHER MODAL ─── */}
      {showCoinModal && (
        <div className="modal-overlay" onClick={() => setShowCoinModal(false)}>
          <div className="modal !max-w-[440px]" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="font-display text-xl text-[var(--text-primary)]">{t('wellness_coins.voucher_title')}</h2>
              <button className="modal-close" onClick={() => setShowCoinModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center py-5">
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-champagne-400 to-champagne-300 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-champagne-400/30">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-extrabold text-amber-800 dark:text-champagne-300 mb-1">
                {balance} WMC
              </p>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                {t('wellness_coins.voucher_desc')}
              </p>
              <div className="py-3.5 px-4 rounded-xl bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] mb-4">
                <p className="text-xs text-[var(--text-muted)] mb-1.5">
                  {t('wellness_coins.voucher_code')}
                </p>
                <p className="font-mono text-lg font-bold tracking-widest text-champagne-400">
                  {vouchCode}
                </p>
              </div>
              <button
                className="py-3 px-8 bg-champagne-400 text-white border-none rounded-full text-sm font-bold cursor-pointer shadow-lg shadow-champagne-400/30 hover:shadow-xl hover:shadow-champagne-400/40 transition-all duration-300"
                onClick={() => setShowCoinModal(false)}
              >
                {t('wellness_coins.voucher_close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── SEND WMC MODAL ─── */}
      {showSendModal && (
        <SendWMCModal
          balance={balance}
          onClose={() => setShowSendModal(false)}
          onSuccess={(newBalance) => {
            setFinancial(prev => prev ? { ...prev, wellness_coin_balance: newBalance } : prev);
          }}
        />
      )}

      {/* ─── PAYMENT MODAL ─── */}
      {showPaymentModal && (
        <PaymentModal
          amount={remaining}
          currency="MAD"
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => fetchData()}
        />
      )}

      {/* ─── MODIFY MODAL ─── */}
      {showModifyModal && (
        <div className="modal-overlay" onClick={() => setShowModifyModal(false)}>
          <div className="modal !max-w-[440px]" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="font-display text-xl text-[var(--text-primary)]">{t('client.modify_title')}</h2>
              <button className="modal-close" onClick={() => setShowModifyModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4">
              <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                {t('client.modify_description')}
              </p>
              <div className="mb-3">
                <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                  {t('client.modify_message_label')}
                </label>
                <textarea
                  className="form-input !resize-y !text-sm"
                  rows={3}
                  placeholder={t('client.modify_placeholder')}
                />
              </div>
              <button
                className="py-3 px-8 bg-champagne-400 text-white border-none rounded-full text-sm font-bold cursor-pointer w-full transition-all duration-300 hover:bg-champagne-500"
                onClick={() => setShowModifyModal(false)}
              >
                {t('client.modify_send')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── INBOX MODAL ─── */}
      {showInbox && (
        <div className="modal-overlay" onClick={() => setShowInbox(false)}>
          <div className="modal !max-w-[520px]" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="font-display text-xl text-[var(--text-primary)]">
                <Mail className="w-5 h-5 inline-block -mt-0.5 mr-2 text-champagne-400" />
                {t('messages.title')}
              </h2>
              <button className="modal-close" onClick={() => setShowInbox(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-sm text-[var(--text-muted)]">
                  <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  {t('messages.no_messages')}
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl border transition-all duration-200 ${
                        !msg.read_at
                          ? 'border-champagne-400/30 bg-champagne-50 dark:bg-champagne-900/10'
                          : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">{msg.subject}</h3>
                        {!msg.read_at && (
                          <button
                            className="shrink-0 text-[10px] font-semibold text-champagne-500 bg-transparent border border-champagne-400/30 rounded-full px-2.5 py-0.5 cursor-pointer hover:bg-champagne-50 dark:hover:bg-champagne-900/10 transition-all"
                            onClick={async () => {
                              await messagesAPI.markRead(msg.id);
                              setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read_at: new Date().toISOString() } : m));
                              setUnreadCount(prev => Math.max(0, prev - 1));
                            }}
                          >
                            {t('messages.mark_read')}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{msg.body}</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-2">
                        {t('messages.sent_at')}: {new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── LOGOUT CONFIRM MODAL ─── */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal !max-w-[380px] text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-lg font-semibold mb-2 text-[var(--text-primary)]">
              {t('client.logout_confirm')}
            </p>
            <p className="text-sm text-[var(--text-muted)] mb-5">
              {t('client.logout_message')}
            </p>
            <div className="flex gap-2.5 justify-center">
              <button
                className="btn btn-secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                {t('common.back')}
              </button>
              <button
                className="btn btn-danger"
                onClick={handleLogout}
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      )}

      <OnboardingTour />
    </div>
  );
}
