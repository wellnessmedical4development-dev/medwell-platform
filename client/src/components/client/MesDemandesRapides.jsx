import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Phone, X, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import useTranslation from '../../hooks/useTranslation';
import { quickRequestsAPI } from '../../services/api';
import socket from '../../services/socket';

const statusConfig = {
  pending_call: {
    icon: Clock,
    label: 'En attente d\'appel',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    border: 'border-amber-200 dark:border-amber-700/30',
    dot: 'bg-amber-400',
  },
  call_attempted: {
    icon: AlertTriangle,
    label: 'Tentative d\'appel infructueuse',
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/10',
    border: 'border-orange-200 dark:border-orange-700/30',
    dot: 'bg-orange-400',
  },
  confirmed: {
    icon: CheckCircle,
    label: 'Statut: Confirmé',
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/10',
    border: 'border-green-200 dark:border-green-700/30',
    dot: 'bg-green-400',
  },
};

export default function MesDemandesRapides() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';
  const [requests, setRequests] = useState([]);
  const [counts, setCounts] = useState({ pending_call: 0, call_attempted: 0, confirmed: 0 });
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const { data } = await quickRequestsAPI.my();
      setRequests(data.requests || []);
      setCounts(data.counts || {});
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    socket.on('quick_request:updated', (updated) => {
      setRequests(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r));
    });
    return () => { socket.off('quick_request:updated'); };
  }, []);

  if (loading) return <div className="flex justify-center py-8"><Loader className="w-6 h-6 animate-spin text-champagne-400" /></div>;
  if (!requests.length) return null;

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 mb-6 overflow-hidden relative">
      <div className="absolute -top-8 -left-8 w-30 h-30 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }} />

      <h2 className="font-display text-xl font-bold text-[var(--text-primary)] mb-4">
        <Clock className="w-5 h-5 inline-block -mt-0.5 mr-2 text-champagne-400" />
        Mes Demandes Rapides
      </h2>

      <div className="flex flex-wrap gap-2 mb-5">
        {Object.entries(counts).filter(([, v]) => v > 0).map(([key]) => {
          const cfg = statusConfig[key];
          if (!cfg) return null;
          return (
            <span key={key} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color} ${cfg.border} border`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label} ({counts[key]})
            </span>
          );
        })}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {requests.map((req, idx) => {
            const cfg = statusConfig[req.status] || statusConfig.pending_call;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex items-start gap-3 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}
              >
                <div className={`w-9 h-9 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4.5 h-4.5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[var(--text-primary)]">{req.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} ${cfg.border} border`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    <Phone className="w-3 h-3 inline -mt-0.5 mr-1" />
                    {req.phone}
                    {req.service_requested && (
                      <> &middot; {req.service_requested}</>
                    )}
                  </p>
                  {req.preferred_call_date && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Contact souhaité: {new Date(req.preferred_call_date).toLocaleDateString()} {req.preferred_call_time ? `à ${req.preferred_call_time}` : ''}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
