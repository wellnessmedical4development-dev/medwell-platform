import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { servicesAPI } from '../../services/api';
import useTranslation from '../../hooks/useTranslation';

export default function ServiceManager() {
  const { t, lang } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    code: '', price: '', duration_days: 30, currency: 'MAD', is_active: true,
    title_en: '', title_fr: '', title_es: '', title_ar: '',
    desc_en: '', desc_fr: '', desc_es: '', desc_ar: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const { data } = await servicesAPI.list();
      setServices(data.services || []);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  function resetForm(svc) {
    if (svc) {
      const title = typeof svc.title === 'string' ? JSON.parse(svc.title) : (svc.title || {});
      const desc = typeof svc.description === 'string' ? JSON.parse(svc.description) : (svc.description || {});
      setForm({
        code: svc.code || '',
        price: svc.price || '',
        duration_days: svc.duration_days || 30,
        currency: svc.currency || 'MAD',
        is_active: svc.is_active !== false,
        title_en: title.en || '', title_fr: title.fr || '', title_es: title.es || '', title_ar: title.ar || '',
        desc_en: desc.en || '', desc_fr: desc.fr || '', desc_es: desc.es || '', desc_ar: desc.ar || '',
      });
      setEditing(svc.id);
    } else {
      setForm({ code: '', price: '', duration_days: 30, currency: 'MAD', is_active: true,
        title_en: '', title_fr: '', title_es: '', title_ar: '',
        desc_en: '', desc_fr: '', desc_es: '', desc_ar: '',
      });
      setEditing(null);
    }
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      code: form.code,
      price: parseFloat(form.price),
      duration_days: parseInt(form.duration_days, 10),
      currency: form.currency,
      is_active: form.is_active,
      title: JSON.stringify({ en: form.title_en, fr: form.title_fr, es: form.title_es, ar: form.title_ar }),
      description: JSON.stringify({ en: form.desc_en, fr: form.desc_fr, es: form.desc_es, ar: form.desc_ar }),
    };
    try {
      if (editing) {
        await servicesAPI.update(editing, payload);
      } else {
        await servicesAPI.create(payload);
      }
      setShowForm(false);
      fetchServices();
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  }

  const langLabel = { en: 'EN', fr: 'FR', es: 'ES', ar: 'AR' };

  if (loading) return <div className="flex justify-center py-20"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>{t('admin.services_title')}</h1>
        <button className="btn btn-primary" onClick={() => resetForm(null)}>
          <Plus className="w-4 h-4" /> {t('admin.add_service')}
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal !max-w-[600px]" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? t('admin.edit_service') : t('admin.add_service')}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="form-group">
                  <label>{t('admin.service_code')}</label>
                  <input className="form-input" value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>{t('admin.service_price')}</label>
                  <input className="form-input" type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="form-group">
                  <label>{t('admin.service_duration')}</label>
                  <input className="form-input" type="number" value={form.duration_days} onChange={(e) => setForm({...form, duration_days: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>{t('admin.service_currency')}</label>
                  <input className="form-input" value={form.currency} onChange={(e) => setForm({...form, currency: e.target.value})} />
                </div>
              </div>
              <div className="form-group mb-3">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({...form, is_active: e.target.checked})} />
                  {t('admin.service_active')}
                </label>
              </div>
              <div className="border-t border-[var(--border-color)] pt-3 mb-3">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{t('admin.service_titles')}</p>
                <div className="grid grid-cols-2 gap-3">
                  {['en','fr','es','ar'].map((l) => (
                    <div key={l} className="form-group">
                      <label>{langLabel[l]}</label>
                      <input className="form-input" value={form[`title_${l}`]} onChange={(e) => setForm({...form, [`title_${l}`]: e.target.value})} placeholder={t('admin.service_title_placeholder')} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[var(--border-color)] pt-3 mb-4">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">{t('admin.service_descriptions')}</p>
                <div className="grid grid-cols-2 gap-3">
                  {['en','fr','es','ar'].map((l) => (
                    <div key={l} className="form-group">
                      <label>{langLabel[l]}</label>
                      <textarea className="form-input !resize-y" rows={2} value={form[`desc_${l}`]} onChange={(e) => setForm({...form, [`desc_${l}`]: e.target.value})} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>{t('common.cancel')}</button>
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? t('common.loading') : (editing ? t('common.save') : t('common.create'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>{t('admin.service_code')}</th>
              <th>{t('admin.service_title')}</th>
              <th>{t('admin.service_price')}</th>
              <th>{t('admin.service_duration')}</th>
              <th>{t('admin.service_status')}</th>
              <th>{t('admin.service_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {services.map((svc) => {
              const title = typeof svc.title === 'string' ? (() => { try { return JSON.parse(svc.title)[lang] || JSON.parse(svc.title).en; } catch { return svc.title; } })() : (svc.title?.[lang] || svc.title?.en || svc.code);
              return (
                <tr key={svc.id}>
                  <td className="font-mono text-xs">{svc.code}</td>
                  <td className="font-medium">{title}</td>
                  <td>{parseFloat(svc.price || 0).toLocaleString()} {svc.currency}</td>
                  <td>{svc.duration_days || '-'} {t('services.days')}</td>
                  <td>{svc.is_active ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}</td>
                  <td>
                    <button className="btn-icon" onClick={() => resetForm(svc)} title={t('common.edit')}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {services.length === 0 && (
              <tr><td colSpan={6} className="text-center text-[var(--text-muted)] py-8">{t('common.no_results')}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
