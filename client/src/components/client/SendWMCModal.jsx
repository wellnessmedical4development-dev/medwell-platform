import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Search, User, ArrowUpRight, ArrowDownLeft, CheckCircle } from 'lucide-react';
import { wellnessCoinAPI } from '../../services/api';
import useTranslation from '../../hooks/useTranslation';

export default function SendWMCModal({ balance, onClose, onSuccess }) {
  const { t } = useTranslation();
  const searchRef = useRef(null);

  const [step, setStep] = useState('send');
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [transfersLoading, setTransfersLoading] = useState(false);

  useEffect(() => {
    if (searchRef.current) searchRef.current.focus();
  }, []);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await wellnessCoinAPI.searchRecipients(query);
        setSearchResults(data.users || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const loadTransfers = useCallback(async () => {
    setTransfersLoading(true);
    try {
      const { data } = await wellnessCoinAPI.transferHistory();
      setTransfers(data.transfers || []);
    } catch {
      setTransfers([]);
    } finally {
      setTransfersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (step === 'history') loadTransfers();
  }, [step, loadTransfers]);

  const handleSend = async () => {
    setError(null);
    if (!selectedUser) { setError(t('wellness_coins.send_no_recipient')); return; }
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError(t('wellness_coins.send_invalid_amount')); return; }
    if (amt > balance) { setError(t('wellness_coins.send_insufficient')); return; }

    setSending(true);
    try {
      const { data } = await wellnessCoinAPI.sendTransfer({
        recipient_id: selectedUser.id,
        amount: amt,
        note: note.trim() || undefined,
      });
      setSuccess({ amount: amt, name: `${selectedUser.first_name} ${selectedUser.last_name}` });
      setStep('success');
      if (onSuccess) onSuccess(data.new_balance);
    } catch (err) {
      setError(err.response?.data?.error || t('common.error'));
    } finally {
      setSending(false);
    }
  };

  const formatCurrency = (val) => {
    const n = parseFloat(val || 0);
    return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal !max-w-[480px]" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex gap-2">
            <button
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                step === 'send' ? 'bg-champagne-400 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
              }`}
              onClick={() => { setStep('send'); setError(null); setSuccess(null); }}
            >
              {t('wellness_coins.send_title')}
            </button>
            <button
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                step === 'history' ? 'bg-champagne-400 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
              }`}
              onClick={() => setStep('history')}
            >
              {t('wellness_coins.history_title')}
            </button>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'success' && success && (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-lg font-bold text-[var(--text-primary)] mb-1">{t('wellness_coins.send_success')}</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              {t('wellness_coins.send_success_desc', { amount: formatCurrency(success.amount), name: success.name })}
            </p>
            <button className="btn btn-primary" onClick={() => { setStep('send'); setSelectedUser(null); setAmount(''); setNote(''); setSuccess(null); setError(null); }}>
              {t('wellness_coins.send_btn')}
            </button>
          </div>
        )}

        {step === 'send' && !success && (
          <div className="py-4 space-y-4">
            <div className="mb-3 p-3 rounded-xl bg-gradient-to-br from-champagne-50 to-champagne-100 dark:from-champagne-900/15 dark:to-champagne-900/5 border border-champagne-200/50 dark:border-champagne-700/20 text-center">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-medium">{t('wellness_coins.balance')}</p>
              <p className="text-xl font-extrabold text-amber-800 dark:text-champagne-300">{formatCurrency(balance)} WMC</p>
            </div>

            {selectedUser ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-champagne-400 to-champagne-300 flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {(selectedUser.first_name?.[0] || '?').toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{selectedUser.phone || selectedUser.unique_id}</p>
                </div>
                <button
                  className="text-xs text-[var(--text-muted)] hover:text-red-500 transition-colors p-1"
                  onClick={() => { setSelectedUser(null); setQuery(''); setSearchResults([]); }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  ref={searchRef}
                  className="form-input !pl-9 !text-sm"
                  placeholder={t('wellness_coins.send_search_placeholder')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {searching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="spinner !w-4 !h-4" />
                  </div>
                )}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-lg z-10 max-h-[200px] overflow-y-auto">
                    {searchResults.map((u) => (
                      <button
                        key={u.id}
                        className="w-full flex items-center gap-3 p-3 hover:bg-[var(--bg-secondary)] transition-colors text-left"
                        onClick={() => { setSelectedUser(u); setQuery(''); setSearchResults([]); }}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-champagne-400 to-champagne-300 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {(u.first_name?.[0] || '?').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                            {u.first_name} {u.last_name}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] truncate">{u.phone || u.unique_id}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {query.length >= 2 && !searching && searchResults.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] mt-1.5 text-center">{t('common.no_results')}</p>
                )}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                {t('wellness_coins.send_amount')}
              </label>
              <input
                className="form-input !text-sm"
                type="number"
                min="0"
                step="1"
                placeholder="100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                {t('wellness_coins.send_note')}
              </label>
              <input
                className="form-input !text-sm"
                placeholder={t('wellness_coins.send_note_placeholder')}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={200}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            )}

            <button
              className="w-full py-3 bg-champagne-400 text-white border-none rounded-full text-sm font-bold cursor-pointer shadow-lg shadow-champagne-400/30 hover:shadow-xl hover:shadow-champagne-400/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleSend}
              disabled={sending || !selectedUser || !amount}
            >
              {sending ? (
                <><div className="spinner !w-4 !h-4 !border-2" /> {t('wellness_coins.send_sending')}</>
              ) : (
                <><Send className="w-4 h-4" /> {t('wellness_coins.send_confirm')}</>
              )}
            </button>
          </div>
        )}

        {step === 'history' && (
          <div className="py-4 max-h-[400px] overflow-y-auto">
            {transfersLoading ? (
              <div className="flex justify-center py-8"><div className="spinner" /></div>
            ) : transfers.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-8">{t('wellness_coins.history_empty')}</p>
            ) : (
              <div className="space-y-2">
                {transfers.map((tr) => {
                  const isSent = tr.is_sent;
                  const other = isSent ? tr.recipient : tr.sender;
                  return (
                    <div key={tr.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)]">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isSent ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : 'bg-green-100 dark:bg-green-900/20 text-green-600'
                      }`}>
                        {isSent ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                          {isSent ? t('wellness_coins.history_sent') : t('wellness_coins.history_received')}
                          {' '}{isSent ? t('wellness_coins.history_to') : t('wellness_coins.history_from')}{' '}
                          {other ? `${other.first_name} ${other.last_name}` : 'Unknown'}
                        </p>
                        {tr.note && <p className="text-xs text-[var(--text-muted)] truncate">{tr.note}</p>}
                      </div>
                      <span className={`font-bold text-sm shrink-0 ${isSent ? 'text-red-600' : 'text-green-600'}`}>
                        {isSent ? '-' : '+'}{formatCurrency(tr.amount)} WMC
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
