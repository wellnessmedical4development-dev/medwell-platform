import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Calendar, Clock, User, Users } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';
import { quickRequestsAPI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

export default function BookingModal({ isOpen, onClose, serviceTitle }) {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';
  const addToast = useToast();
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ name: '', phone: '+212', gender: 'homme', call_date: '', call_time: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || form.phone.length < 10) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        gender: form.gender,
        service_requested: serviceTitle,
        preferred_call_date: form.call_date || null,
        preferred_call_time: form.call_time || null,
      };
      await quickRequestsAPI.create(payload);
      setStep('success');
      addToast(t('booking_modal.success_message') || 'Votre demande a été envoyée !');
    } catch {
      addToast('Erreur lors de l\'envoi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep('form');
    setForm({ name: '', phone: '+212', gender: 'homme', call_date: '', call_time: '' });
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={reset}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative bg-[#FDFBF7] dark:bg-dark-900 border-2 border-[#D4AF37] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            <button onClick={reset} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center border border-dark-200/20 text-dark-500 hover:text-champagne-500 transition-colors">
              <X className="w-4 h-4" />
            </button>

            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center mb-2">
                  <div className="mx-auto w-14 h-14 rounded-full bg-champagne-400/10 border border-[#D4AF37] flex items-center justify-center mb-4">
                    <Phone className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-dark-900 dark:text-ivory-50">
                    {serviceTitle || t('services.title')}
                  </h3>
                  <p className="text-sm text-dark-500 dark:text-ivory-200/60 font-light mt-1">
                    {t('booking_modal.title')}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-dark-600 dark:text-ivory-200/80 uppercase tracking-wider mb-1.5">
                      <User className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
                      {t('contact_form.name')}
                    </label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-ivory-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-ivory-50 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark-600 dark:text-ivory-200/80 uppercase tracking-wider mb-1.5">
                      <Phone className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
                      {t('contact_form.phone')}
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-ivory-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-ivory-50 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                      placeholder="+212 6XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark-600 dark:text-ivory-200/80 uppercase tracking-wider mb-1.5">
                      <Users className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
                      {t('contact_form.gender')}
                    </label>
                    <div className="flex gap-3">
                      {['homme', 'femme'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setForm({ ...form, gender: g })}
                          className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                            form.gender === g
                              ? 'border-[#D4AF37] bg-champagne-400/10 text-[#D4AF37]'
                              : 'border-ivory-200 dark:border-dark-700 text-dark-500 dark:text-ivory-200/60 hover:border-[#D4AF37]/40'
                          }`}
                        >
                          {g === 'homme' ? 'Homme' : 'Femme'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-dark-600 dark:text-ivory-200/80 uppercase tracking-wider mb-1.5">
                      <Calendar className="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
                      {t('booking_modal.preferred_call_time') || "Quand souhaitez-vous être contacté(e) ?"}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="date"
                        value={form.call_date}
                        min={today}
                        onChange={(e) => setForm({ ...form, call_date: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-ivory-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-ivory-50 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                      />
                      <input
                        type="time"
                        value={form.call_time}
                        onChange={(e) => setForm({ ...form, call_time: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-ivory-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-dark-900 dark:text-ivory-50 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !form.name || !form.phone}
                  className="w-full py-3.5 bg-[#D4AF37] hover:bg-champagne-600 text-dark-900 font-bold tracking-widest uppercase rounded-full text-sm transition-all duration-300 shadow-[0_4px_16px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('common.loading') : (t('booking_modal.submit') || 'Envoyer ma demande')}
                </button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-5 border border-green-200 dark:border-green-700/30">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-bold text-[#D4AF37] mb-2">
                  {t('booking_modal.success_title') || 'Demande envoyée !'}
                </h3>
                <p className="text-sm text-dark-500 dark:text-ivory-200/60 font-light mb-6 leading-relaxed">
                  {t('booking_modal.success_message') || 'Nous vous contacterons bientôt à la date et heure indiquées.'}
                </p>
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center px-8 py-3 bg-[#D4AF37] hover:bg-champagne-600 text-dark-900 font-bold tracking-widest uppercase rounded-full text-xs transition-all duration-300 shadow-[0_4px_16px_rgba(212,175,55,0.2)]"
                >
                  {t('booking_modal.close')}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
