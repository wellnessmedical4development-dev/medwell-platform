import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { appointmentsAPI, servicesAPI } from '../../services/api';
import useTranslation from '../../hooks/useTranslation';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function MyAppointments() {
  const { t, lang } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBook, setShowBook] = useState(false);
  const [step, setStep] = useState('list');

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookResult, setBookResult] = useState(null);
  const [calMonth, setCalMonth] = useState(new Date());

  useEffect(() => {
    async function fetch() {
      try {
        const [aptRes, svcRes] = await Promise.all([appointmentsAPI.my(), servicesAPI.list()]);
        setAppointments(aptRes.data.appointments || []);
        setServices(svcRes.data.services || []);
      } catch {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1).getDay();
  const calDays = [];
  for (let i = 0; i < firstDay; i++) calDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(calMonth.getFullYear(), calMonth.getMonth(), d);
    calDays.push(date);
  }

  const handleDateSelect = async (date) => {
    if (date <= today) return;
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlotsLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      const { data } = await appointmentsAPI.slots({ date: dateStr });
      setSlots(data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedSlot || !selectedDate) return;
    setBooking(true);
    try {
      const { data } = await appointmentsAPI.book({
        service_id: selectedService || undefined,
        scheduled_at: selectedSlot,
      });
      setBookResult({ success: true });
      const aptRes = await appointmentsAPI.my();
      setAppointments(aptRes.data.appointments || []);
    } catch (err) {
      setBookResult({ success: false, message: err.response?.data?.error || t('common.error') });
    } finally {
      setBooking(false);
    }
  };

  const formatSlotTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const statusBadge = (status) => {
    const styles = { pending: 'badge-pending', confirmed: 'badge-active', completed: 'badge-active', cancelled: 'badge-cancelled' };
    return <span className={`badge ${styles[status] || 'badge-pending'}`}>{t(`appointments.status_${status}`) || status}</span>;
  };

  const prevMonth = () => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1));
  const nextMonth = () => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1));

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div className="max-w-[960px] mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">{t('appointments.title')}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">{t('appointments.subtitle')}</p>
        </div>
        <button onClick={() => { setShowBook(!showBook); setStep('date'); setSelectedDate(null); setSelectedSlot(null); setBookResult(null); }} className="btn btn-primary">
          {t('appointments.book_new')}
        </button>
      </div>

      {showBook && !bookResult && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${step === 'date' ? 'bg-champagne-400 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>{t('appointments.step_date')}</span>
            <span className="text-[var(--text-muted)]">&rarr;</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${step === 'service' ? 'bg-champagne-400 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>{t('appointments.step_service')}</span>
            <span className="text-[var(--text-muted)]">&rarr;</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${step === 'confirm' ? 'bg-champagne-400 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'}`}>{t('appointments.step_confirm')}</span>
          </div>

          {step === 'date' && (
            <div>
              <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-4">{t('appointments.choose_date')}</h3>
              <div className="flex items-center justify-between mb-3">
                <button onClick={prevMonth} className="btn-icon"><ChevronLeft className="w-4 h-4" /></button>
                <span className="font-semibold text-sm">{MONTHS[calMonth.getMonth()]} {calMonth.getFullYear()}</span>
                <button onClick={nextMonth} className="btn-icon"><ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map(d => <span key={d} className="text-center text-[10px] font-semibold text-[var(--text-muted)] py-1">{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calDays.map((date, i) => (
                  <div key={i} className="aspect-square">
                    {date && (
                      <button
                        onClick={() => handleDateSelect(date)}
                        disabled={date <= today}
                        className={`w-full h-full rounded-lg text-xs font-medium transition-all ${
                          selectedDate && date.getTime() === selectedDate.getTime()
                            ? 'bg-champagne-400 text-white'
                            : date <= today
                              ? 'text-[var(--text-muted)] opacity-40 cursor-not-allowed'
                              : 'hover:bg-champagne-50 dark:hover:bg-champagne-900/10 text-[var(--text-primary)]'
                        }`}
                      >
                        {date.getDate()}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {selectedDate && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">{t('appointments.choose_time')}</p>
                  {slotsLoading ? (
                    <div className="flex justify-center py-4"><div className="spinner" /></div>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] py-2">{t('appointments.no_slots')}</p>
                  ) : (
                    <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2">
                      {slots.map((slot, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                            selectedSlot === slot
                              ? 'border-champagne-400 bg-champagne-50 dark:bg-champagne-900/10 text-champagne-500'
                              : 'border-[var(--border-color)] text-[var(--text-primary)] hover:border-champagne-400/40'
                          }`}
                        >
                          {formatSlotTime(slot)}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedSlot && (
                    <button className="btn btn-primary mt-4" onClick={() => setStep('service')}>
                      {t('common.next')}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 'service' && (
            <div>
              <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-4">{t('appointments.choose_program')}</h3>
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                    selectedService === null
                      ? 'border-champagne-400 bg-champagne-50 dark:bg-champagne-900/10'
                      : 'border-[var(--border-color)]'
                  }`}
                >
                  {t('appointments.general_consultation')}
                </button>
                {services.map((svc) => {
                  const title = typeof svc.title === 'string' ? (() => { try { return JSON.parse(svc.title)[lang] || JSON.parse(svc.title).en; } catch { return svc.title; } })() : (svc.title?.[lang] || svc.title?.en || svc.code);
                  return (
                    <button
                      key={svc.id}
                      onClick={() => setSelectedService(svc.id)}
                      className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                        selectedService === svc.id
                          ? 'border-champagne-400 bg-champagne-50 dark:bg-champagne-900/10'
                          : 'border-[var(--border-color)]'
                      }`}
                    >
                      {title}
                    </button>
                  );
                })}
              </div>
              <button className="btn btn-primary" onClick={() => setStep('confirm')}>
                {t('common.next')}
              </button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="text-center">
              <Calendar className="w-12 h-12 text-champagne-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                {selectedDate?.toLocaleDateString()} - {selectedSlot ? formatSlotTime(selectedSlot) : ''}
              </p>
              <p className="text-xs text-[var(--text-muted)] mb-6">{t('appointments.confirm_desc')}</p>
              <div className="flex gap-3 justify-center">
                <button className="btn btn-secondary" onClick={() => setStep('date')}>{t('common.back')}</button>
                <button className="btn btn-primary" onClick={handleBook} disabled={booking}>
                  {booking ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('common.loading')}</> : t('appointments.confirm_book')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {bookResult && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 mb-6 text-center">
          {bookResult.success ? (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="font-semibold text-[var(--text-primary)] mb-1">{t('appointments.book_success')}</p>
              <p className="text-xs text-[var(--text-muted)] mb-4">{t('appointments.book_success_desc')}</p>
            </>
          ) : (
            <>
              <X className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="font-semibold text-[var(--text-primary)] mb-1">{t('appointments.book_failed')}</p>
              <p className="text-xs text-[var(--text-muted)] mb-4">{bookResult.message}</p>
            </>
          )}
          <button className="btn btn-primary" onClick={() => { setShowBook(false); setBookResult(null); setStep('date'); setSelectedDate(null); setSelectedSlot(null); }}>
            {t('common.close')}
          </button>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">{t('appointments.no_appointments')}</div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 flex items-start justify-between gap-4 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-champagne-50 dark:bg-champagne-900/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-champagne-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{apt.interested_program || apt.service_code || apt.service_title || t('appointments.appointment')}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-muted)]">
                    {apt.scheduled_at && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(apt.scheduled_at).toLocaleDateString()} {new Date(apt.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {statusBadge(apt.status)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
