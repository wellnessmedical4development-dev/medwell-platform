import useTranslation from '../../hooks/useTranslation';

export default function ClientsTable({ clients, loading, onViewClient }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ padding: '3rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="text-center" style={{ padding: '3rem' }}>
        <p className="text-muted">{t('common.no_results')}</p>
      </div>
    );
  }

  const statusBadge = (status) => {
    const cls = status === 'active' ? 'badge-active'
              : status === 'expired' ? 'badge-expired'
              : 'badge-cancelled';
    const label = status === 'active' ? t('admin.active')
                : status === 'expired' ? t('admin.expired')
                : t('admin.cancelled');
    return <span className={`badge ${cls}`}>{label}</span>;
  };

  return (
    <div className="table-container table-responsive" style={{ border: 'none' }}>
      <table style={{ minWidth: '600px' }}>
        <thead>
          <tr>
            <th>{t('member_card.brand')} ID</th>
            <th>Name</th>
            <th>{t('auth.phone_label')}</th>
            <th>{t('admin.status')}</th>
            <th>{t('wellness_coins.coins')}</th>
            <th>{t('wellness_coins.total_paid')}</th>
            <th>{t('wellness_coins.amount_remaining')}</th>
            <th>{t('admin.view')}</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{client.unique_id}</td>
              <td>
                <strong>{client.first_name} {client.last_name}</strong>
                {client.email && <div className="text-muted" style={{ fontSize: '0.75rem' }}>{client.email}</div>}
              </td>
              <td>{client.phone}</td>
              <td>{statusBadge(client.subscription_status)}</td>
              <td>
                <span style={{ color: 'var(--gold-500)', fontWeight: 600 }}>
                  {parseFloat(client.wellness_coin_balance || 0).toFixed(2)}
                </span>
              </td>
              <td>{parseFloat(client.total_paid || 0).toFixed(2)} MAD</td>
              <td style={{
                color: parseFloat(client.amount_remaining || 0) > 0 ? '#f87171' : '#4ade80',
                fontWeight: 500,
              }}>
                {parseFloat(client.amount_remaining || 0).toFixed(2)} MAD
              </td>
              <td>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onViewClient(client.id)}
                >
                  {t('admin.view')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
