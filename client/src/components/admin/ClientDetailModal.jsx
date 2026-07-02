import { useState } from 'react';
import { adminAPI } from '../../services/api';
import useTranslation from '../../hooks/useTranslation';
import MembershipCard from '../client/MembershipCard';
import FinancialSummary from '../client/FinancialSummary';

export default function ClientDetailModal({ data, onClose, onUpdated }) {
  const { t, lang } = useTranslation();
  const { user, subscriptions, transactions, coin_ledger } = data;

  const [coinAmount, setCoinAmount] = useState('');
  const [coinReason, setCoinReason] = useState('');
  const [coinLoading, setCoinLoading] = useState(false);
  const [coinError, setCoinError] = useState(null);
  const [coinSuccess, setCoinSuccess] = useState(null);

  // Edit user state
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subscription_status: user?.subscription_status || 'inactive',
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(null);

  const handleAdjustCoins = async () => {
    const amount = parseFloat(coinAmount);
    if (isNaN(amount) || amount === 0) {
      setCoinError(t('admin.amount_placeholder') + ' ' + t('common.error'));
      return;
    }
    if (!coinReason.trim()) {
      setCoinError(t('admin.reason_placeholder') + ' ' + t('common.error'));
      return;
    }
    setCoinLoading(true);
    setCoinError(null);
    setCoinSuccess(null);
    try {
      const { data: result } = await adminAPI.adjustCoins(user.id, {
        amount,
        reason: coinReason,
      });
      setCoinSuccess(`${t('wellness_coins.balance')}: ${result.wellness_coin_balance}`);
      setCoinAmount('');
      setCoinReason('');
      if (onUpdated) onUpdated();
    } catch (err) {
      setCoinError(err.response?.data?.error || t('common.error'));
    } finally {
      setCoinLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);
    try {
      await adminAPI.updateUser(user.id, editForm);
      setSaveSuccess(t('common.success'));
      setEditing(false);
      if (onUpdated) onUpdated();
    } catch (err) {
      setSaveError(err.response?.data?.error || t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  const financial = {
    wellness_coin_balance: user.wellness_coin_balance,
    subscription_status: user.subscription_status,
    total_paid: user.total_paid,
    amount_remaining: user.amount_remaining,
  };

  const isRtl = lang === 'ar';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }} dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="modal-header">
          <h2>{t('admin.client_detail')}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <MembershipCard user={user} />

        {/* Edit User */}
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-header">
            <span className="card-title">{t('admin.edit_user')}</span>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditing(!editing)}>
              {editing ? t('common.cancel') : t('common.edit')}
            </button>
          </div>

          {saveError && <div className="alert alert-error">{saveError}</div>}
          {saveSuccess && <div className="alert alert-success">{saveSuccess}</div>}

          {editing ? (
            <div style={{ paddingTop: '0.75rem' }}>
              <div className="flex gap-3" style={{ marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>{t('admin.first_name')}</label>
                  <input className="form-input" value={editForm.first_name}
                    onChange={(e) => setEditForm(p => ({ ...p, first_name: e.target.value }))} />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>{t('admin.last_name')}</label>
                  <input className="form-input" value={editForm.last_name}
                    onChange={(e) => setEditForm(p => ({ ...p, last_name: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3" style={{ marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>{t('admin.email')}</label>
                  <input className="form-input" value={editForm.email}
                    onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>{t('admin.phone')}</label>
                  <input className="form-input" value={editForm.phone}
                    onChange={(e) => setEditForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3" style={{ marginBottom: '0.75rem' }}>
                <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                  <label style={{ fontSize: '0.8rem' }}>{t('admin.status')}</label>
                  <select className="form-input" value={editForm.subscription_status}
                    onChange={(e) => setEditForm(p => ({ ...p, subscription_status: e.target.value }))}>
                    <option value="active">{t('admin.active')}</option>
                    <option value="expired">{t('admin.expired')}</option>
                    <option value="cancelled">{t('admin.cancelled')}</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary btn-sm" onClick={handleSaveEdit} disabled={saving}>
                {saving ? t('common.loading') : t('admin.save')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4" style={{ paddingTop: '0.75rem', fontSize: '0.9rem' }}>
              <span><strong>{t('admin.first_name')}:</strong> {user.first_name}</span>
              <span><strong>{t('admin.last_name')}:</strong> {user.last_name}</span>
              <span><strong>{t('admin.email')}:</strong> {user.email || '—'}</span>
              <span><strong>{t('admin.phone')}:</strong> {user.phone}</span>
            </div>
          )}
        </div>

        <FinancialSummary financial={financial} coinLedger={coin_ledger} />

        {subscriptions && subscriptions.length > 0 && (
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div className="card-header">
              <span className="card-title">{t('admin.subscriptions')}</span>
              <span className="card-subtitle">{subscriptions.length} {t('admin.total')}</span>
            </div>
            {subscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between" style={{
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--border-light)',
              }}>
                <div>
                  <strong>{sub.service_code || t('subscriptions.program')}</strong>
                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                    {sub.interval} · {parseFloat(sub.amount).toFixed(2)} {sub.currency}
                  </div>
                </div>
                <span className={`badge badge-${sub.status === 'active' ? 'active' : sub.status === 'expired' ? 'expired' : 'cancelled'}`}>
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* WellnessCoin Adjustment */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <span className="card-title">{t('admin.adjust_coins')}</span>
          </div>

          {coinError && <div className="alert alert-error">{coinError}</div>}
          {coinSuccess && <div className="alert alert-success">{coinSuccess}</div>}

          <div className="flex items-center gap-3">
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <input
                className="form-input"
                type="number"
                step="0.01"
                placeholder={t('admin.amount_placeholder')}
                value={coinAmount}
                onChange={(e) => setCoinAmount(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
              <input
                className="form-input"
                placeholder={t('admin.reason_placeholder')}
                value={coinReason}
                onChange={(e) => setCoinReason(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAdjustCoins}
              disabled={coinLoading}
            >
              {coinLoading ? t('common.loading') : t('admin.apply')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
