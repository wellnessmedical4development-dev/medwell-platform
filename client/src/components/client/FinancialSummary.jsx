import useTranslation from '../../hooks/useTranslation';

export default function FinancialSummary({ financial, coinLedger }) {
  const { t } = useTranslation();

  if (!financial) return null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(parseFloat(val || 0));

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card gold">
          <div className="stat-label">{t('wellness_coins.balance')}</div>
          <div className="stat-value" style={{ color: 'var(--gold-500)' }}>
            {formatCurrency(financial.wellness_coin_balance)}
          </div>
          <div className="stat-sub">{t('wellness_coins.coins')}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">{t('wellness_coins.subscription_status')}</div>
          <div className="stat-value" style={{
            color: financial.subscription_status === 'active' ? '#4ade80'
                 : financial.subscription_status === 'expired' ? '#fbbf24'
                 : '#f87171',
            fontSize: '1.25rem',
          }}>
            {financial.subscription_status?.charAt(0).toUpperCase() + financial.subscription_status?.slice(1) || 'N/A'}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">{t('wellness_coins.total_paid')}</div>
          <div className="stat-value">{formatCurrency(financial.total_paid)}</div>
          <div className="stat-sub">MAD</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">{t('wellness_coins.amount_remaining')}</div>
          <div className="stat-value" style={{
            color: parseFloat(financial.amount_remaining) > 0 ? '#f87171' : '#4ade80',
          }}>
            {formatCurrency(financial.amount_remaining)}
          </div>
          <div className="stat-sub">
            {parseFloat(financial.amount_remaining) > 0 ? t('wellness_coins.outstanding') : t('wellness_coins.settled')}
          </div>
        </div>
      </div>

      {coinLedger && coinLedger.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <span className="card-title">{t('wellness_coins.ledger')}</span>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead>
                <tr>
                  <th>{t('wellness_coins.date')}</th>
                  <th>{t('wellness_coins.operation')}</th>
                  <th>{t('wellness_coins.amount')}</th>
                  <th>{t('wellness_coins.balance')}</th>
                  <th>{t('wellness_coins.description')}</th>
                </tr>
              </thead>
              <tbody>
                {coinLedger.map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${entry.operation === 'earned' || entry.operation === 'admin_adjustment' ? 'active' : 'cancelled'}`}>
                        {entry.operation}
                      </span>
                    </td>
                    <td style={{ color: parseFloat(entry.amount) >= 0 ? '#4ade80' : '#f87171' }}>
                      {parseFloat(entry.amount) >= 0 ? '+' : ''}{entry.amount}
                    </td>
                    <td>{entry.running_balance}</td>
                    <td className="text-muted" style={{ fontSize: '0.8rem' }}>{entry.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
