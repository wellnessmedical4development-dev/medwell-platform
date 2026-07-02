import { useState, useEffect } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';

export default function PaymentForm({ amount, currency, onSubmit, loading }) {
  const { t } = useTranslation();
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});

  const formatCardNumber = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length > 2) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned;
  };

  const validate = () => {
    const errs = {};
    if (cardNumber.replace(/\s/g, '').length < 16) errs.cardNumber = true;
    if (!cardName.trim()) errs.cardName = true;
    if (expiry.length < 5) errs.expiry = true;
    if (cvv.length < 3) errs.cvv = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      card_number: cardNumber.replace(/\s/g, ''),
      card_holder: cardName,
      expiry,
      cvv,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-champagne-400" />
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {t('payment.card_details')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <Lock className="w-3 h-3" />
            {t('payment.secure')}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <input
              className={`form-input ${errors.cardNumber ? '!border-red-500' : ''}`}
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
            />
            {errors.cardNumber && (
              <p className="text-xs text-red-500 mt-1">{t('payment.invalid_card')}</p>
            )}
          </div>

          <div>
            <input
              className={`form-input ${errors.cardName ? '!border-red-500' : ''}`}
              placeholder={t('payment.card_holder')}
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                className={`form-input ${errors.expiry ? '!border-red-500' : ''}`}
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
              />
            </div>
            <div>
              <input
                className={`form-input ${errors.cvv ? '!border-red-500' : ''}`}
                placeholder="CVV"
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="py-3 px-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">{t('payment.total')}</span>
          <span className="text-xl font-bold text-[var(--text-primary)]">
            {parseFloat(amount).toLocaleString()} {currency || 'MAD'}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-br from-champagne-400 to-champagne-500 text-white rounded-full text-sm font-bold tracking-wider cursor-pointer shadow-lg shadow-champagne-400/30 hover:shadow-xl hover:shadow-champagne-400/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t('payment.processing')}
          </>
        ) : (
          `${t('payment.pay')} ${parseFloat(amount).toLocaleString()} ${currency || 'MAD'}`
        )}
      </button>
    </form>
  );
}
