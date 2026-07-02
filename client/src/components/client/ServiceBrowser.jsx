import { useState, useEffect } from 'react';
import { Search, CreditCard, CheckCircle } from 'lucide-react';
import { servicesAPI, subscriptionsAPI } from '../../services/api';
import useTranslation from '../../hooks/useTranslation';
import PaymentModal from '../payment/PaymentModal';

const SERVICE_IMAGES = {
  'NUTRITION-ACCOMP': '/nutrition.jpg',
  'KINESITHERAPIE': '/kinesitherapie.jpg',
  'I-SLIM': '/image_islim.png',
  'AMINCISSEMENT': '/amincissement.jpg',
  'FITNESS-PROG': '/image_fitness.png',
  'ESTHETIQUE': '/image_beauty.jpg',
  'SPA-HAMMAM': '/spa-hammam.jpg',
  'WELLNESS-ASSESS': '/assessment.jpg',
};

const PLANS = [
  { interval: 'monthly', labelKey: 'services.plan_monthly', multiplier: 1 },
  { interval: 'quarterly', labelKey: 'services.plan_quarterly', multiplier: 2.7 },
  { interval: 'annual', labelKey: 'services.plan_annual', multiplier: 10 },
];

export default function ServiceBrowser() {
  const { t, lang } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(PLANS[0]);
  const [step, setStep] = useState('browse');
  const [subResult, setSubResult] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    async function fetch() {
      try {
        const { data } = await servicesAPI.list();
        setServices(data.services || []);
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const getTitle = (svc) => {
    const t = svc.title;
    if (typeof t === 'string') { try { return JSON.parse(t)[lang] || JSON.parse(t).en || t; } catch { return t; } }
    if (typeof t === 'object') return t[lang] || t.en || svc.code;
    return svc.code;
  };

  const getDesc = (svc) => {
    const d = svc.short_desc || svc.description;
    if (typeof d === 'string') { try { return JSON.parse(d)[lang] || JSON.parse(d).en || d; } catch { return d; } }
    if (typeof d === 'object') return d[lang] || d.en || '';
    return '';
  };

  const filtered = services.filter(s =>
    getTitle(s).toLowerCase().includes(search.toLowerCase()) ||
    (s.code || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = selectedService ? (parseFloat(selectedService.price) * selectedPlan.multiplier) : 0;

  const handleSubscribe = async (payWithCoin) => {
    setSubLoading(true);
    try {
      const method = payWithCoin ? 'wellness_coin' : 'card';
      const { data: payData } = await subscriptionsAPI.create({
        service_id: selectedService.id,
        interval: selectedPlan.interval,
        amount: totalAmount,
        currency: selectedService.currency || 'MAD',
        payment_method: method,
      });
      setSubResult({ success: true, subscription: payData.subscription });
      setStep('result');
    } catch (err) {
      setSubResult({ success: false, message: err.response?.data?.error || t('common.error') });
      setStep('result');
    } finally {
      setSubLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setSubLoading(true);
    try {
      const { data } = await subscriptionsAPI.create({
        service_id: selectedService.id,
        interval: selectedPlan.interval,
        amount: totalAmount,
        currency: selectedService.currency || 'MAD',
      });
      setSubResult({ success: true, subscription: data.subscription });
      setStep('result');
    } catch (err) {
      setSubResult({ success: false, message: err.response?.data?.error || t('common.error') });
      setStep('result');
    } finally {
      setSubLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="spinner" /></div>;
  }

  if (step === 'result') {
    return (
      <div className="max-w-[600px] mx-auto py-10 text-center">
        {subResult?.success ? (
          <>
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-2">{t('services.subscribe_success')}</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">{t('services.subscribe_success_desc')}</p>
            <button className="btn btn-primary" onClick={() => { setStep('browse'); setSelectedService(null); setSubResult(null); }}>
              {t('services.browse_more')}
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-2">{t('services.subscribe_failed')}</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">{subResult?.message}</p>
            <button className="btn btn-primary" onClick={() => setStep('browse')}>{t('common.back')}</button>
          </>
        )}
      </div>
    );
  }

  if (step === 'plan' && selectedService) {
    return (
      <div className="max-w-[600px] mx-auto py-6">
        <button className="text-xs text-[var(--text-muted)] hover:text-champagne-400 mb-4 transition-colors" onClick={() => setStep('browse')}>
          &larr; {t('common.back')}
        </button>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 mb-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-ivory-100 dark:bg-dark-800 shrink-0 overflow-hidden">
              <img src={SERVICE_IMAGES[selectedService.code] || selectedService.image_url} alt={getTitle(selectedService)} className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">{getTitle(selectedService)}</h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">{selectedService.code}</p>
            </div>
          </div>

          <p className="text-sm text-[var(--text-secondary)] mb-6">{getDesc(selectedService)}</p>

          <div className="space-y-2 mb-6">
            {PLANS.map((plan) => {
              const amount = parseFloat(selectedService.price) * plan.multiplier;
              const selected = selectedPlan.interval === plan.interval;
              return (
                <button
                  key={plan.interval}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    selected
                      ? 'border-champagne-400 bg-champagne-50 dark:bg-champagne-900/10'
                      : 'border-[var(--border-color)] hover:border-champagne-400/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selected ? 'border-champagne-400' : 'border-[var(--border-color)]'
                    }`}>
                      {selected && <div className="w-2.5 h-2.5 rounded-full bg-champagne-400" />}
                    </div>
                    <span className={`text-sm font-medium ${selected ? 'text-champagne-500' : 'text-[var(--text-primary)]'}`}>
                      {t(plan.labelKey)}
                    </span>
                  </div>
                  <span className={`font-bold ${selected ? 'text-champagne-500' : 'text-[var(--text-primary)]'}`}>
                    {amount.toLocaleString()} MAD
                  </span>
                </button>
              );
            })}
          </div>

          <div className="py-3 px-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-muted)]">{t('services.total')}</span>
              <span className="text-xl font-bold text-champagne-500">{totalAmount.toLocaleString()} MAD</span>
            </div>
          </div>

          <button
            onClick={() => setShowPayment(true)}
            disabled={subLoading}
            className="w-full py-3 bg-gradient-to-br from-champagne-400 to-champagne-500 text-white rounded-full text-sm font-bold tracking-wider cursor-pointer shadow-lg shadow-champagne-400/30 hover:shadow-xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {subLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('common.loading')}</> : t('services.subscribe_now')}
          </button>
        </div>

        {showPayment && (
          <PaymentModal
            amount={totalAmount}
            currency={selectedService.currency || 'MAD'}
            onClose={() => setShowPayment(false)}
            onSuccess={handlePaymentSuccess}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[960px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">{t('services.browse_title')}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">{t('services.browse_subtitle')}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
          <input
            className="form-input !pl-9 !w-full sm:!w-[240px] !py-2 !text-sm"
            placeholder={t('services.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">{t('common.no_results')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((svc) => {
            const title = getTitle(svc);
            const price = parseFloat(svc.price || 0);
            return (
              <div
                key={svc.id}
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(212,175,55,0.08)] transition-all duration-300 cursor-pointer group"
                onClick={() => { setSelectedService(svc); setSelectedPlan(PLANS[0]); setStep('plan'); }}
              >
                <div className="relative bg-ivory-100 dark:bg-dark-800" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={SERVICE_IMAGES[svc.code] || svc.image_url}
                    alt={title}
                    className="w-full h-full object-contain transition-all duration-500 group-hover:scale-105"
                  />

                </div>
                <div className="p-4">
                  <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-1 group-hover:text-champagne-500 transition-colors">{title}</h3>
                  {price > 0 && (
                    <p className="text-sm font-semibold text-champagne-500">
                      {t('services.from')} {price.toLocaleString()} MAD
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
