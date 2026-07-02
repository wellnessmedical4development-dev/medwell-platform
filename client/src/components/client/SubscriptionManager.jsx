import { useState } from 'react';
import { subscriptionsAPI } from '../../services/api';
import useTranslation from '../../hooks/useTranslation';

export default function SubscriptionManager({ subscriptions, onUpdate }) {
  const { t } = useTranslation();
  const [actionLoading, setActionLoading] = useState(null);
  const [cancelReason, setCancelReason] = useState({});
  const [confirmCancel, setConfirmCancel] = useState(null);

  const handleCancel = async (id) => {
    setActionLoading(id);
    try {
      await subscriptionsAPI.cancel(id, cancelReason[id] || '');
      setConfirmCancel(null);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Cancel failed:', err.response?.data || err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRenew = async (id) => {
    setActionLoading(id);
    try {
      await subscriptionsAPI.renew(id);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Renew failed:', err.response?.data || err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="card text-center" style={{ padding: '3rem' }}>
        <p className="text-muted" style={{ fontSize: '1rem' }}>
          {t('client.no_subscriptions')}
        </p>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
          {t('client.browse_programs')}
        </p>
      </div>
    );
  }

  const statusBadge = (status) => {
    const cls = status === 'active' ? 'badge-active'
              : status === 'expired' ? 'badge-expired'
              : 'badge-cancelled';
    const label = status === 'active' ? t('subscriptions.status_active')
                : status === 'expired' ? t('subscriptions.status_expired')
                : t('subscriptions.status_cancelled');
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  return (
    <div>
      {subscriptions.map((sub) => (
        <div key={sub.id} className="card" style={{ marginBottom: '1rem' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                {sub.title?.['en'] || sub.service_code || t('subscriptions.program')}
              </h3>
              <div className="flex items-center gap-3" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>{statusBadge(sub.status)}</span>
                <span>{sub.interval}</span>
                <span>{parseFloat(sub.amount).toFixed(2)} {sub.currency || 'MAD'}</span>
                {sub.end_date && (
                  <span>{t('subscriptions.until')} {new Date(sub.end_date).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {sub.status === 'active' && (
                <>
                  {confirmCancel === sub.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="form-input"
                        style={{ width: '160px', padding: '0.3rem 0.5rem', fontSize: '0.8rem' }}
                        placeholder={t('subscriptions.cancel_reason_placeholder')}
                        value={cancelReason[sub.id] || ''}
                        onChange={(e) => setCancelReason(p => ({ ...p, [sub.id]: e.target.value }))}
                      />
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(sub.id)}
                        disabled={actionLoading === sub.id}
                      >
                        {t('subscriptions.confirm_cancel')}
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setConfirmCancel(null)}>
                        {t('common.back')}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setConfirmCancel(sub.id)}
                    >
                      {t('subscriptions.cancel')}
                    </button>
                  )}
                </>
              )}
              {sub.status === 'expired' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleRenew(sub.id)}
                  disabled={actionLoading === sub.id}
                >
                  {t('subscriptions.renew')}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
