import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import { adminAPI, adminMessagesAPI } from '../../services/api';
import useTranslation from '../../hooks/useTranslation';
import { useToast } from '../../contexts/ToastContext';
import ClientsTable from './ClientsTable';
import QuickRequestsTable from './QuickRequestsTable';
import ClientDetailModal from './ClientDetailModal';
import AnalyticsCharts from './AnalyticsCharts';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User search for coin management
  const [userQuery, setUserQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [coinAmount, setCoinAmount] = useState('');
  const [coinReason, setCoinReason] = useState('');
  const [coinLoading, setCoinLoading] = useState(false);
  const [coinMessage, setCoinMessage] = useState(null);

  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState(null);
  const addToast = useToast();

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await adminAPI.dashboard();
      setStats(data);
    } catch (err) {
      console.error('Stats error:', err);
    }
  }, []);

  const fetchClients = useCallback(async (searchTerm, statusFilter) => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.subscription_status = statusFilter;
      const { data } = await adminAPI.clients(params);
      setClients(data.clients || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || t('common.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchStats();
    fetchClients();
  }, [fetchStats, fetchClients]);

  const handleSearch = () => fetchClients(search, filterStatus);

  const handleViewClient = async (clientId) => {
    try {
      const { data } = await adminAPI.clientDetail(clientId);
      setSelectedClient(data);
    } catch (err) {
      console.error('Client detail error:', err);
    }
  };

  const searchTimer = useRef(null);

  const handleUserSearch = useCallback((q) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!q || q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const { data } = await adminAPI.searchUsers({ q });
        setSearchResults(data.users || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setSearchResults([]);
    setUserQuery(`${u.first_name || ''} ${u.last_name || ''}`.trim());
    setCoinMessage(null);
  };

  const handleAdjustCoins = async (isCredit) => {
    const amount = parseFloat(coinAmount);
    if (isNaN(amount) || amount <= 0) {
      setCoinMessage({ type: 'error', text: t('admin.coin_amount') + ' ' + t('common.error') });
      return;
    }
    if (!coinReason.trim()) {
      setCoinMessage({ type: 'error', text: t('admin.reason_placeholder') + ' ' + t('common.error') });
      return;
    }
    setCoinLoading(true);
    setCoinMessage(null);
    try {
      const finalAmount = isCredit ? amount : -amount;
      const { data } = await adminAPI.adjustCoins(selectedUser.id, { amount: finalAmount, reason: coinReason });
      setCoinMessage({ type: 'success', text: `${t('wellness_coins.balance')}: ${data.wellness_coin_balance}` });
      setCoinAmount('');
      setCoinReason('');
      fetchStats();
    } catch (err) {
      setCoinMessage({ type: 'error', text: err.response?.data?.error || t('common.error') });
    } finally {
      setCoinLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('admin.dashboard')}</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="stats-grid"
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="stat-card gold">
            <div className="stat-label">{t('admin.total_clients')}</div>
            <div className="stat-value">{stats.total_clients}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card">
            <div className="stat-label">{t('admin.active_subscriptions')}</div>
            <div className="stat-value" style={{ color: '#4ade80' }}>{stats.active_subscriptions}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="stat-card">
            <div className="stat-label">{t('admin.total_revenue')}</div>
            <div className="stat-value">{parseFloat(stats.total_revenue).toLocaleString()}</div>
            <div className="stat-sub">MAD</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
            <div className="stat-label">{t('admin.total_wellness_coins')}</div>
            <div className="stat-value" style={{ color: 'var(--gold-500)' }}>{parseFloat(stats.total_wellness_coins).toLocaleString()}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="stat-card">
            <div className="stat-label">{t('admin.legacy_linked')}</div>
            <div className="stat-value" style={{ color: '#4ade80' }}>{stats.legacy_linked}</div>
            <div className="stat-sub">{t('admin.legacy_total')} {stats.legacy_total}</div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="stat-card">
            <div className="stat-label">{t('admin.legacy_pending')}</div>
            <div className="stat-value" style={{ color: '#fbbf24' }}>{stats.legacy_unlinked}</div>
            <div className="stat-sub">{t('admin.awaiting_registration')}</div>
          </motion.div>
        </motion.div>
      )}

      {/* Analytics Charts */}
      {stats?.monthly_revenue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ marginTop: '2rem' }}>
          <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mb-4">{t('admin.analytics_title')}</h2>
          <AnalyticsCharts
            monthlyRevenue={stats.monthly_revenue}
            clientGrowth={stats.client_growth}
            subscriptionBreakdown={stats.subscription_breakdown}
          />
        </motion.div>
      )}

      {/* Wellness Coin Management by Name/Phone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="card !p-4 sm:!p-6"
        style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <span className="card-title">{t('admin.wellness_coins_by_phone')}</span>
        </div>
        <div style={{ padding: '1rem 0' }}>
          <div className="flex items-center gap-3" style={{ position: 'relative' }}>
            <input
              className="form-input"
              style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
              placeholder={t('admin.search_user_placeholder')}
              value={userQuery}
              onChange={(e) => { setUserQuery(e.target.value); handleUserSearch(e.target.value); setSelectedUser(null); setCoinMessage(null); }}
            />
          </div>

          {searching && <div className="text-muted" style={{ padding: '0.5rem 0', fontSize: '0.85rem' }}>{t('common.loading')}</div>}

          {searchResults.length > 0 && (
            <div className="card" style={{ marginTop: '0.5rem', padding: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {searchResults.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleSelectUser(u)}
                  style={{
                    padding: '0.6rem 0.75rem',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    borderBottom: '1px solid var(--border-light)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong>{u.first_name} {u.last_name}</strong>
                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>{u.phone}</span>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>({u.unique_id})</span>
                    <span style={{ color: 'var(--gold-500)', fontWeight: 600, marginLeft: 'auto' }}>
                      {parseFloat(u.wellness_coin_balance || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedUser && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1" style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.9rem' }}>{selectedUser.first_name} {selectedUser.last_name}</strong>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>{selectedUser.phone}</span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>{t('member_card.status')}: {selectedUser.subscription_status}</span>
                <span style={{ color: 'var(--gold-500)', fontWeight: 600, fontSize: '0.85rem' }}>
                  {t('wellness_coins.balance')}: {parseFloat(selectedUser.wellness_coin_balance || 0).toFixed(2)}
                </span>
              </div>

              {coinMessage && (
                <div className={`alert alert-${coinMessage.type === 'success' ? 'success' : 'error'}`}>
                  {coinMessage.text}
                </div>
              )}

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
                <div className="form-group" style={{ flex: '1 1 100%', marginBottom: 0, minWidth: 0 }}>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    placeholder={t('admin.amount_placeholder')}
                    value={coinAmount}
                    onChange={(e) => setCoinAmount(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: '1 1 100%', marginBottom: 0, minWidth: 0 }}>
                  <input
                    className="form-input"
                    placeholder={t('admin.reason_placeholder')}
                    value={coinReason}
                    onChange={(e) => setCoinReason(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-success btn-sm w-full sm:w-auto"
                  onClick={() => handleAdjustCoins(true)}
                  disabled={coinLoading}
                >
                  {t('admin.credit_coins')}
                </button>
                <button
                  className="btn btn-danger btn-sm w-full sm:w-auto"
                  onClick={() => handleAdjustCoins(false)}
                  disabled={coinLoading}
                >
                  {t('admin.debit_coins')}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Clients Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        className="card !p-4 sm:!p-6"
        style={{ marginTop: '2rem' }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
            <span className="card-title shrink-0">{t('admin.clients_management')}</span>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto">
              <select
                className="form-input"
                style={{ width: '130px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); fetchClients(search, e.target.value); }}
              >
                <option value="">{t('admin.all_status')}</option>
                <option value="active">{t('admin.active')}</option>
                <option value="expired">{t('admin.expired')}</option>
                <option value="cancelled">{t('admin.cancelled')}</option>
              </select>
              <div className="flex items-center gap-2 flex-1" style={{ minWidth: 0 }}>
                <input
                  className="form-input"
                  style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.85rem', minWidth: 0 }}
                  placeholder={t('admin.search_placeholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="btn btn-primary btn-sm shrink-0" onClick={handleSearch}>{t('admin.search')}</button>
              </div>
            </div>
          </div>
        <ClientsTable
          clients={clients}
          loading={loading}
          onViewClient={handleViewClient}
        />
      </motion.div>

      {selectedClient && (
        <ClientDetailModal
          data={selectedClient}
          onClose={() => setSelectedClient(null)}
          onUpdated={() => { fetchStats(); fetchClients(); }}
        />
      )}

      {/* ════════════════════════════════════════════ */}
      {/* BROADCAST MESSAGE TO ALL CLIENTS             */}
      {/* ════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.75 }}
        className="card !p-4 sm:!p-6"
        style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <span className="card-title">
            <Mail className="w-4 h-4 inline-block -mt-0.5 mr-2 text-champagne-400" />
            {t('messages.broadcast_title')}
          </span>
        </div>
        <div style={{ padding: '1rem 0' }}>
          {broadcastMessage && (
            <div className={`alert alert-${broadcastMessage.type === 'success' ? 'success' : 'error'}`}>
              {broadcastMessage.text}
            </div>
          )}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1">{t('messages.subject_label')}</label>
              <input
                className="form-input"
                placeholder={t('messages.subject_label')}
                value={broadcastSubject}
                onChange={(e) => setBroadcastSubject(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1">{t('messages.body_label')}</label>
              <textarea
                className="form-input !resize-y"
                rows={4}
                placeholder={t('messages.body_label')}
                value={broadcastBody}
                onChange={(e) => setBroadcastBody(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              disabled={broadcastLoading || !broadcastSubject.trim() || !broadcastBody.trim()}
              onClick={async () => {
                setBroadcastLoading(true);
                setBroadcastMessage(null);
                try {
                  const { data } = await adminMessagesAPI.broadcast({
                    subject: broadcastSubject,
                    body: broadcastBody,
                  });
                  setBroadcastMessage({ type: 'success', text: t('messages.sent_success', { count: data.recipients }) });
                  addToast(t('messages.sent_success', { count: data.recipients }));
                  setBroadcastSubject('');
                  setBroadcastBody('');
                } catch (err) {
                  setBroadcastMessage({ type: 'error', text: err.response?.data?.error || t('common.error') });
                  addToast(err.response?.data?.error || t('common.error'), 'error');
                } finally {
                  setBroadcastLoading(false);
                }
              }}
            >
              {broadcastLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> {t('common.loading')}</>
              ) : (
                <><Send className="w-4 h-4 mr-1.5" /> {t('messages.send_btn')}</>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <QuickRequestsTable />
    </div>
  );
}
