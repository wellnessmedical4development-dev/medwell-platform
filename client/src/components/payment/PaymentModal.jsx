import { useState } from 'react';
import { X, CreditCard, Building2, Coins, CheckCircle, XCircle, ArrowLeft, Clock } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';
import { paymentsAPI } from '../../services/api';
import PaymentForm from './PaymentForm';

const METHODS = [
  { id: 'card', icon: CreditCard, labelKey: 'payment.method_card' },
  { id: 'transfer', icon: Building2, labelKey: 'payment.method_transfer' },
  { id: 'wellness_coin', icon: Coins, labelKey: 'payment.method_coin' },
];

export default function PaymentModal({ amount, currency, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCardPayment = async (cardData) => {
    setLoading(true);
    try {
      const { data } = await paymentsAPI.initiate({
        amount,
        currency: currency || 'MAD',
        payment_method: 'card',
      });
      setResult(data);
      if (data.success) onSuccess?.(data);
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || t('payment.failed') });
    } finally {
      setLoading(false);
    }
  };

  const handleTransferPayment = async () => {
    setLoading(true);
    try {
      const { data } = await paymentsAPI.initiate({
        amount,
        currency: currency || 'MAD',
        payment_method: 'transfer',
      });
      setResult(data);
      if (data.success) onSuccess?.(data);
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || t('payment.failed') });
    } finally {
      setLoading(false);
    }
  };

  const handleCoinPayment = async () => {
    setLoading(true);
    try {
      const { data } = await paymentsAPI.initiate({
        amount,
        currency: currency || 'MAD',
        payment_method: 'wellness_coin',
      });
      setResult(data);
      if (data.success) onSuccess?.(data);
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || t('payment.failed') });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setMethod('card');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal !max-w-[480px]" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="font-display text-xl text-[var(--text-primary)]">{t('payment.title')}</h2>
          <button className="modal-close" onClick={onClose}><X className="w-5 h-5" /></button>
        </div>

        {result ? (
          <div className="text-center py-6">
            {result.success ? (
              <>
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)] mb-2">{t('payment.success_title')}</p>
                <p className="text-sm text-[var(--text-muted)] mb-1">{t('payment.success_desc')}</p>
                {result.payment?.reference && (
                  <p className="text-xs font-mono text-champagne-400 mb-4">
                    {t('payment.reference')}: {result.payment.reference}
                  </p>
                )}
                <button className="btn btn-primary mt-4" onClick={onClose}>
                  {t('common.close')}
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-xl font-bold text-[var(--text-primary)] mb-2">{t('payment.failed_title')}</p>
                <p className="text-sm text-[var(--text-muted)] mb-6">{result.message}</p>
                <button className="btn btn-primary" onClick={reset}>
                  <ArrowLeft className="w-4 h-4" />
                  {t('common.back')}
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="py-3 px-4 rounded-xl bg-champagne-50 dark:bg-champagne-900/10 border border-champagne-200/50 dark:border-champagne-700/20 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">{t('payment.amount_due')}</span>
                <span className="text-2xl font-extrabold text-champagne-500">
                  {parseFloat(amount).toLocaleString()} {currency || 'MAD'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border text-[10px] xs:text-xs font-medium transition-all duration-200 relative ${
                    method === m.id
                      ? 'border-champagne-400 bg-champagne-50 dark:bg-champagne-900/10 text-champagne-500'
                      : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-champagne-400/40'
                  }`}
                >
                  {m.id === 'card' && (
                    <span className="absolute -top-2 -right-2 bg-amber-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
                      <Clock className="w-2.5 h-2.5 inline-block -mt-0.5 mr-0.5" />
                      {t('payment.coming_soon')}
                    </span>
                  )}
                  <m.icon className="w-5 h-5" />
                  {t(m.labelKey)}
                </button>
              ))}
            </div>

            {method === 'card' && (
              <>
                <div className="py-3 px-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/20 mb-4 text-center">
                  <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">{t('payment.coming_soon')}</p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-300 mt-1">{t('payment.online_payment_note')}</p>
                </div>
                <PaymentForm
                  amount={amount}
                  currency={currency}
                  onSubmit={handleCardPayment}
                  loading={loading}
                />
              </>
            )}

            {method === 'transfer' && (
              <div className="text-center py-4">
                <Building2 className="w-12 h-12 text-champagne-400 mx-auto mb-3" />
                <p className="text-sm text-[var(--text-primary)] font-semibold mb-1">{t('payment.transfer_title')}</p>
                <p className="text-xs text-[var(--text-muted)] mb-4">{t('payment.transfer_desc')}</p>
                <div className="py-3 px-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] mb-4 text-left text-xs space-y-1">
                  <p><span className="text-[var(--text-muted)]">{t('payment.transfer_account')}:</span> <strong>123 456 7890</strong></p>
                  <p><span className="text-[var(--text-muted)]">IBAN:</span> <strong>MA64 1234 5678 9012 3456 7890</strong></p>
                  <p><span className="text-[var(--text-muted)]">{t('payment.transfer_holder')}:</span> <strong>Medical Wellness</strong></p>
                </div>
                <button
                  onClick={handleTransferPayment}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-br from-champagne-400 to-champagne-500 text-white rounded-full text-sm font-bold tracking-wider cursor-pointer shadow-lg shadow-champagne-400/30 hover:shadow-xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('payment.processing')}</>
                  ) : (
                    t('payment.confirm_transfer')
                  )}
                </button>
              </div>
            )}

            {method === 'wellness_coin' && (
              <div className="text-center py-4">
                <Coins className="w-12 h-12 text-champagne-400 mx-auto mb-3" />
                <p className="text-sm text-[var(--text-primary)] font-semibold mb-1">{t('payment.coin_title')}</p>
                <p className="text-xs text-[var(--text-muted)] mb-4">{t('payment.coin_desc')}</p>
                <button
                  onClick={handleCoinPayment}
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-br from-champagne-400 to-champagne-500 text-white rounded-full text-sm font-bold tracking-wider cursor-pointer shadow-lg shadow-champagne-400/30 hover:shadow-xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('payment.processing')}</>
                  ) : (
                    t('payment.pay_coins', { amount: parseFloat(amount).toLocaleString() })
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
