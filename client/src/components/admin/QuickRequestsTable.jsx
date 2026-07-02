import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, CheckCircle, AlertTriangle, Clock, Search, MessageSquare } from 'lucide-react';
import { quickRequestsAPI } from '../../services/api';
import socket from '../../services/socket';
import { useToast } from '../../contexts/ToastContext';
import useTranslation from '../../hooks/useTranslation';

const statusConfig = {
  pending_call: { label: 'En attente', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10', dot: 'bg-amber-400' },
  call_attempted: { label: 'Pas de réponse', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/10', dot: 'bg-orange-400' },
  confirmed: { label: 'Confirmé', color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/10', dot: 'bg-green-400' },
};

export default function QuickRequestsTable() {
  const { t } = useTranslation();
  const addToast = useToast();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [notesInput, setNotesInput] = useState({});
  const [newPulse, setNewPulse] = useState(null);
  const tableRef = useRef(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await quickRequestsAPI.list(params);
      setRequests(data.requests || []);
    } catch {} finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    const handleNew = (req) => {
      setRequests(prev => [req, ...prev]);
      setNewPulse(req.id);
      setTimeout(() => setNewPulse(null), 2000);
      addToast(`Nouvelle demande: ${req.name}`);
    };
    const handleUpdate = (updated) => {
      setRequests(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r));
    };
    socket.on('quick_request:new', handleNew);
    socket.on('quick_request:updated', handleUpdate);
    socket.emit('join:admin');
    return () => { socket.off('quick_request:new', handleNew); socket.off('quick_request:updated', handleUpdate); };
  }, [addToast]);

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      const payload = { status };
      if (notesInput[id] !== undefined) payload.internal_notes = notesInput[id];
      const { data } = await quickRequestsAPI.updateStatus(id, payload);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, ...data.request } : r));
      addToast(`Statut mis à jour: ${statusConfig[status]?.label || status}`);
    } catch { addToast('Erreur de mise à jour', 'error'); }
    finally { setUpdatingId(null); }
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <span className="card-title shrink-0">
          <Phone className="w-4 h-4 inline-block -mt-0.5 mr-2 text-champagne-400" />
          Fichier des prospects
        </span>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto">
          <select
            className="form-input" style={{ width: '130px', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="pending_call">En attente</option>
            <option value="call_attempted">Pas de réponse</option>
            <option value="confirmed">Confirmé</option>
          </select>
          <div className="flex items-center gap-2 flex-1" style={{ minWidth: 0 }}>
            <input className="form-input" style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.85rem', minWidth: 0 }}
              placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>
      <div ref={tableRef} style={{ overflowX: 'auto' }}>
        {loading ? (
          <div className="flex justify-center py-8"><div className="spinner" /></div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-sm text-[var(--text-muted)]">Aucune demande pour le moment</div>
        ) : (
          <table className="data-table" style={{ minWidth: '600px', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.6rem 0.75rem', fontSize: '0.8rem' }}>Nom</th>
                <th style={{ textAlign: 'left', padding: '0.6rem 0.75rem', fontSize: '0.8rem' }}>Téléphone</th>
                <th style={{ textAlign: 'left', padding: '0.6rem 0.75rem', fontSize: '0.8rem' }}>Service</th>
                <th style={{ textAlign: 'left', padding: '0.6rem 0.75rem', fontSize: '0.8rem' }}>Contact souhaité</th>
                <th style={{ textAlign: 'left', padding: '0.6rem 0.75rem', fontSize: '0.8rem' }}>Statut</th>
                <th style={{ textAlign: 'left', padding: '0.6rem 0.75rem', fontSize: '0.8rem' }}>Notes Internes</th>
                <th style={{ textAlign: 'left', padding: '0.6rem 0.75rem', fontSize: '0.8rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {requests.map((req) => {
                  const cfg = statusConfig[req.status] || statusConfig.pending_call;
                  const isNew = newPulse === req.id;
                  return (
                    <motion.tr
                      key={req.id}
                      initial={isNew ? { opacity: 0, y: -10 } : {}}
                      animate={{
                        opacity: 1, y: 0,
                        boxShadow: isNew ? ['0 0 0 0 rgba(212,175,55,0.4)', '0 0 20px 4px rgba(212,175,55,0.2)', '0 0 0 0 rgba(212,175,55,0)'] : undefined,
                      }}
                      transition={isNew ? { boxShadow: { duration: 2, repeat: Infinity } } : {}}
                      exit={{ opacity: 0, x: -20 }}
                      style={{ borderBottom: '1px solid var(--border-light)', background: isNew ? 'rgba(212,175,55,0.04)' : undefined }}
                    >
                      <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.85rem', fontWeight: 600 }}>{req.name}</td>
                      <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.85rem' }}>{req.phone}</td>
                      <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.service_requested || '—'}</td>
                      <td style={{ padding: '0.6rem 0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {req.preferred_call_date ? new Date(req.preferred_call_date).toLocaleDateString() : '—'}
                        {req.preferred_call_time ? ` ${req.preferred_call_time}` : ''}
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem', maxWidth: '150px' }}>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                          <input
                            className="form-input !border-0 !p-1 !text-xs !bg-transparent"
                            style={{ minWidth: '60px', width: '100%' }}
                            placeholder="Note..."
                            value={notesInput[req.id] ?? req.internal_notes ?? ''}
                            onChange={(e) => setNotesInput(prev => ({ ...prev, [req.id]: e.target.value }))}
                          />
                        </div>
                      </td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>
                        <div className="flex gap-1.5 flex-nowrap">
                          <button
                            onClick={() => handleStatusUpdate(req.id, 'confirmed')}
                            disabled={updatingId === req.id || req.status === 'confirmed'}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ background: req.status === 'confirmed' ? 'rgba(34,197,94,0.1)' : 'transparent', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}
                          >
                            <CheckCircle className="w-3 h-3" />
                            Confirmé
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(req.id, 'call_attempted')}
                            disabled={updatingId === req.id || req.status === 'call_attempted'}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ background: req.status === 'call_attempted' ? 'rgba(249,115,22,0.1)' : 'transparent', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)' }}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            Pas de réponse
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
