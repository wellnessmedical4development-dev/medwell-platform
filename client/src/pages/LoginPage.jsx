import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';
import useTranslation from '../hooks/useTranslation';
import { Phone, KeyRound, Send, User, Lock, CheckCircle2, Clock } from 'lucide-react';

export default function LoginPage() {
  const { login, saveAuth } = useAuth();
  const { t, lang } = useTranslation();
  const navigate = useNavigate();

  const [tab, setTab] = useState('create');

  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [devCode, setDevCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [step, setStep] = useState('phone');
  const timerRef = useRef(null);

  const [regData, setRegData] = useState({
    first_name: '', last_name: '', email: '', phone: '', password: '', confirm_password: '',
  });

  const [loginName, setLoginName] = useState({ first_name: '', last_name: '' });
  const [loginPassword, setLoginPassword] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtpStep, setLoginOtpStep] = useState(false);

  const [forgotStep, setForgotStep] = useState(null);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotCode, setForgotCode] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirm, setForgotConfirm] = useState('');

  const isRtl = lang === 'ar';

  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    try {
      const resp = await authAPI.sendOtp(forgotPhone, 'password_reset');
      setDevCode(resp.data.dev_code || '');
      setSuccess(t('auth.otp_sent'));
      setForgotStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || t('errors.server_error'));
    } finally { setLoading(false); }
  };

  const handleForgotPasswordReset = async (e) => {
    e.preventDefault();
    if (forgotPassword !== forgotConfirm) { setError(t('auth.passwords_mismatch')); return; }
    setLoading(true); setError(null); setSuccess(null);
    try {
      await authAPI.resetPassword({ phone: forgotPhone, code: forgotCode, new_password: forgotPassword });
      setSuccess(t('auth.password_reset_success'));
      setForgotStep(null);
      setForgotPhone(''); setForgotCode(''); setForgotPassword(''); setForgotConfirm('');
    } catch (err) {
      setError(err.response?.data?.error || t('errors.server_error'));
    } finally { setLoading(false); }
  };

  const startResendTimer = () => {
    setResendTimer(30);
    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 7) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await authAPI.sendOtp(phone);
      setDevCode(resp.data.dev_code || '');
      setSuccess(t('auth.otp_sent') || 'Code envoy\u00e9');
      setStep('otp');
      startResendTimer();
    } catch (err) {
      setError(err.response?.data?.error || t('errors.server_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError(null);
    try {
      const resp = await authAPI.sendOtp(phone);
      setDevCode(resp.data.dev_code || '');
      setSuccess(t('auth.otp_sent') || 'Code renvoy\u00e9');
      startResendTimer();
    } catch (err) {
      setError(err.response?.data?.error || t('errors.server_error'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpCode.length < 8) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.verifyOtp(phone, otpCode);
      setOtpToken(data.otp_token);
      setSuccess(t('auth.otp_verified') || 'Code v\u00e9rifi\u00e9');
      setStep('register');
    } catch (err) {
      setError(err.response?.data?.error || t('errors.invalid_otp') || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regData.password !== regData.confirm_password) {
      setError(t('auth.passwords_mismatch'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.register({
        ...regData,
        phone,
        otp_token: otpToken,
      });
      if (data.token) saveAuth(data.user, data.token);
      navigate('/client');
    } catch (err) {
      setError(err.response?.data?.error || t('auth.registration_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRequest = async (e) => {
    e.preventDefault();
    if (!loginName.first_name || !loginName.last_name || !loginPassword) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { data } = await authAPI.loginRequest({
        first_name: loginName.first_name,
        last_name: loginName.last_name,
        password: loginPassword,
      });
      setLoginPhone(data.phone);
      setDevCode(data.dev_code || '');
      setSuccess('Code envoy\u00e9 par WhatsApp');
      setLoginOtpStep(true);
      setOtpCode('');
      startResendTimer();
    } catch (err) {
      setError(err.response?.data?.error || t('errors.invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginOtp = async (e) => {
    e.preventDefault();
    if (otpCode.length < 8) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.loginOtp({ phone: loginPhone, code: otpCode });
      saveAuth(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/client');
    } catch (err) {
      setError(err.response?.data?.error || t('errors.invalid_otp'));
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setStep('phone');
    setLoginOtpStep(false);
    setPhone('');
    setOtpCode('');
    setOtpToken('');
    setError(null);
    setSuccess(null);
    setDevCode('');
    setRegData({ first_name: '', last_name: '', email: '', phone: '', password: '', confirm_password: '' });
    setLoginName({ first_name: '', last_name: '' });
    setLoginPassword('');
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    resetAll();
  };

  return (
    <>
      <SEO
        lang={lang}
        title="Client Portal Login"
        description="Accédez à votre espace client Medical Wellness. Connectez-vous pour gérer vos abonnements, rendez-vous, wellness coins et carte de membre."
        noIndex
      />
      <div dir={isRtl ? 'rtl' : 'ltr'}
      className="flex-1 flex items-center justify-center min-h-screen p-3 xs:p-4"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="w-full max-w-md p-4 xs:p-5 sm:p-6 md:p-10" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-xl)' }}>
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl font-bold text-champagne-500 mb-1">
            Medical Wellness
          </h1>
        </div>

        <div className="flex mb-4 xs:mb-6 rounded-full p-0.5 xs:p-1" style={{ background: 'var(--bg-tertiary)' }}>
          <button
            className={`flex-1 py-1.5 xs:py-2 rounded-full font-bold transition-all border-none cursor-pointer text-[10px] xs:text-xs sm:text-sm ${tab === 'create' ? 'text-white' : 'text-[var(--text-muted)]'}`}
            style={tab === 'create' ? { background: 'linear-gradient(135deg, #d4af37, #b8962f)', boxShadow: '0 2px 8px rgba(212,175,55,0.3)' } : { background: 'transparent' }}
            onClick={() => handleTabChange('create')}
          >
            {t('auth.create_account')}
          </button>
          <button
            className={`flex-1 py-1.5 xs:py-2 rounded-full font-bold transition-all border-none cursor-pointer text-[10px] xs:text-xs sm:text-sm ${tab === 'login' ? 'text-white' : 'text-[var(--text-muted)]'}`}
            style={tab === 'login' ? { background: 'linear-gradient(135deg, #d4af37, #b8962f)', boxShadow: '0 2px 8px rgba(212,175,55,0.3)' } : { background: 'transparent' }}
            onClick={() => handleTabChange('login')}
          >
            {t('auth.sign_in')}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg text-sm font-medium"
            style={{ background: '#fee2e2', color: '#991b1b' }}>
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 mb-4 rounded-lg text-sm font-medium"
            style={{ background: '#dcfce7', color: '#166534' }}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {devCode && (
          <div className="p-3 mb-2 rounded-lg text-xs font-mono text-center tracking-wider"
            style={{ background: '#fef3c7', color: '#92400e', border: '1px dashed #f59e0b' }}>
            Code OTP: <strong className="text-lg">{devCode}</strong>
          </div>
        )}
        {devCode && (
          <div className="p-2 mb-4 rounded-lg text-[10px] text-center bg-blue-50 dark:bg-blue-900/10 border border-blue-200/50 dark:border-blue-700/20 text-blue-600 dark:text-blue-400">
            <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {t('otp.coming_soon_sms')}</span>
          </div>
        )}

        {tab === 'create' && (
          <>
            {step === 'phone' && (
              <form onSubmit={handlePhoneSubmit}>
                <div className="mb-4">
                  <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                    {t('auth.phone_label')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                      className="form-input !pl-10"
                      type="tel"
                      placeholder={t('auth.phone_placeholder')}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button
                  className="w-full py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 border-none cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #d4af37, #b8962f)', color: '#ffffff', boxShadow: '0 4px 16px rgba(212,175,55,0.25)' }}
                  type="submit"
                  disabled={loading || phone.length < 7}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ...
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      {t('auth.continue') || 'Continuer'}
                    </span>
                  )}
                </button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp}>
                <p className="text-xs text-[var(--text-muted)] mb-1">
                  {t('auth.otp_sent_to') || 'Code envoy\u00e9 \u00e0'}
                </p>
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-4">{phone}</p>
                <div className="mb-4">
                  <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                    {t('auth.otp_label') || 'Code de v\u00e9rification'}
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input
                      className="form-input !pl-10 !text-center !text-lg !tracking-widest !font-mono"
                      type="text"
                      inputMode="numeric"
                      maxLength={8}
                      placeholder="\u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  className="w-full py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 border-none cursor-pointer disabled:opacity-50"
                  style={{
                    background: otpCode.length >= 8 ? 'linear-gradient(135deg, #d4af37, #b8962f)' : 'var(--bg-tertiary)',
                    color: otpCode.length >= 8 ? '#ffffff' : 'var(--text-muted)',
                    boxShadow: otpCode.length >= 8 ? '0 4px 16px rgba(212,175,55,0.25)' : 'none',
                  }}
                  type="submit"
                  disabled={loading || otpCode.length < 8}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('auth.verifying') || 'V\u00e9rification...'}
                    </span>
                  ) : t('auth.verify') || 'V\u00e9rifier'}
                </button>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    className="text-xs text-champagne-500 hover:text-champagne-600 transition-colors bg-transparent border-none cursor-pointer disabled:text-[var(--text-muted)] disabled:cursor-not-allowed"
                  >
                    {resendTimer > 0
                      ? `${t('auth.resend_in') || 'Renvoyer dans'} ${resendTimer}s`
                      : t('auth.resend') || 'Renvoyer le code'}
                  </button>
                </div>
              </form>
            )}

            {step === 'register' && (
              <form onSubmit={handleRegister}>
                <p className="text-xs text-[var(--text-muted)] mb-4">
                  {t('auth.create_account_desc') || 'Cr\u00e9ez votre compte'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="flex-1 relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input className="form-input !pl-10" placeholder={t('auth.first_name')}
                      value={regData.first_name}
                      onChange={(e) => setRegData(p => ({ ...p, first_name: e.target.value }))} required />
                  </div>
                  <div className="flex-1 relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                    <input className="form-input !pl-10" placeholder={t('auth.last_name')}
                      value={regData.last_name}
                      onChange={(e) => setRegData(p => ({ ...p, last_name: e.target.value }))} required />
                  </div>
                </div>
                <div className="mb-4">
                  <input className="form-input" type="email" placeholder={t('auth.email_optional')}
                    value={regData.email}
                    onChange={(e) => setRegData(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="mb-4 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input className="form-input !pl-10" type="password" placeholder={t('auth.password_label')}
                    value={regData.password}
                    onChange={(e) => setRegData(p => ({ ...p, password: e.target.value }))} required />
                </div>
                <div className="mb-4 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input className="form-input !pl-10" type="password" placeholder={t('auth.confirm_password')}
                    value={regData.confirm_password}
                    onChange={(e) => setRegData(p => ({ ...p, confirm_password: e.target.value }))} required />
                </div>
                <button
                  className="w-full py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 border-none cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #d4af37, #b8962f)', color: '#ffffff', boxShadow: '0 4px 16px rgba(212,175,55,0.25)' }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('auth.creating_account')}
                    </span>
                  ) : t('auth.create_account')}
                </button>
              </form>
            )}
          </>
        )}

        {tab === 'login' && !loginOtpStep && (
          <form onSubmit={handleLoginRequest}>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              Entrez votre nom et mot de passe pour recevoir un code par WhatsApp
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input className="form-input !pl-10" placeholder={t('auth.first_name')}
                  value={loginName.first_name}
                  onChange={(e) => setLoginName(p => ({ ...p, first_name: e.target.value }))} required />
              </div>
              <div className="flex-1 relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input className="form-input !pl-10" placeholder={t('auth.last_name')}
                  value={loginName.last_name}
                  onChange={(e) => setLoginName(p => ({ ...p, last_name: e.target.value }))} required />
              </div>
            </div>
            <div className="mb-2 relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input className="form-input !pl-10" type="password" placeholder={t('auth.password_label')}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)} required />
            </div>
            <div className="text-right mb-4">
              <button type="button" onClick={() => setForgotStep('phone')}
                className="text-xs text-[var(--text-muted)] hover:text-champagne-500 transition-colors bg-transparent border-none cursor-pointer">
                {t('auth.forgot_password')}
              </button>
            </div>
            <button
              className="w-full py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 border-none cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #d4af37, #b8962f)', color: '#ffffff', boxShadow: '0 4px 16px rgba(212,175,55,0.25)' }}
              type="submit"
              disabled={loading || !loginName.first_name || !loginName.last_name || !loginPassword}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Recevoir le code
                </span>
              )}
            </button>
          </form>
        )}

        {tab === 'login' && loginOtpStep && (
          <form onSubmit={handleLoginOtp}>
            <p className="text-xs text-[var(--text-muted)] mb-1">
              Code envoy\u00e9 \u00e0
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              {loginName.first_name} {loginName.last_name}
            </p>
            <p className="text-xs text-[var(--text-muted)] mb-4">{loginPhone}</p>
            <div className="mb-4">
              <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">
                {t('auth.otp_label') || 'Code de v\u00e9rification'}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  className="form-input !pl-10 !text-center !text-lg !tracking-widest !font-mono"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  placeholder="\u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  autoFocus
                />
              </div>
            </div>
            <button
              className="w-full py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 border-none cursor-pointer disabled:opacity-50"
              style={{
                background: otpCode.length >= 8 ? 'linear-gradient(135deg, #d4af37, #b8962f)' : 'var(--bg-tertiary)',
                color: otpCode.length >= 8 ? '#ffffff' : 'var(--text-muted)',
                boxShadow: otpCode.length >= 8 ? '0 4px 16px rgba(212,175,55,0.25)' : 'none',
              }}
              type="submit"
              disabled={loading || otpCode.length < 8}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('auth.signing_in')}
                </span>
              ) : t('auth.sign_in')}
            </button>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => { setLoginOtpStep(false); setOtpCode(''); setError(null); }}
                className="text-xs text-[var(--text-muted)] hover:text-champagne-500 transition-colors bg-transparent border-none cursor-pointer"
              >
                {'\u2190'} Modifier mes informations
              </button>
            </div>
          </form>
        )}

        {!loginOtpStep && !forgotStep && tab === 'login' && (
          <div className="text-center mt-4 mb-2">
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/v1/auth/dev-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role: 'client' }),
                  });
                  const data = await res.json();
                  localStorage.setItem('token', data.token);
                  localStorage.setItem('user', JSON.stringify(data.user));
                  window.location.href = '/client';
                } catch (e) {
                  alert('Backend not running');
                }
              }}
              className="w-full py-2 rounded-full text-xs font-bold border border-dashed cursor-pointer transition-all"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)', background: 'transparent' }}
            >
              Demo Login (sans mot de passe)
            </button>
          </div>
        )}

        {forgotStep && (
          <div className="border-t border-[var(--border-color)] pt-4 mt-4">
            <h3 className="font-display text-base font-bold text-[var(--text-primary)] mb-3">{t('auth.reset_password')}</h3>

            {forgotStep === 'phone' && (
              <form onSubmit={handleForgotPasswordRequest}>
                <div className="mb-4 relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input className="form-input !pl-10" type="tel" placeholder={t('auth.phone_label')}
                    value={forgotPhone} onChange={(e) => setForgotPhone(e.target.value)} required />
                </div>
                <button className="w-full py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 border-none cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #d4af37, #b8962f)', color: '#ffffff' }} type="submit" disabled={loading}>
                  {loading ? t('common.loading') : t('auth.send_reset_code')}
                </button>
                <div className="mt-3 text-center">
                  <button type="button" onClick={() => setForgotStep(null)}
                    className="text-xs text-[var(--text-muted)] hover:text-champagne-500 transition-colors bg-transparent border-none cursor-pointer">
                    {t('common.back')}
                  </button>
                </div>
              </form>
            )}

            {forgotStep === 'otp' && (
              <form onSubmit={handleForgotPasswordReset}>
                <p className="text-xs text-[var(--text-muted)] mb-3">{t('auth.otp_sent_to', { phone: forgotPhone })}</p>
                <div className="mb-4">
                  <input className="form-input !text-center !text-lg !tracking-widest !font-mono" type="text"
                    inputMode="numeric" maxLength={8} placeholder="\u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022 \u2022"
                    value={forgotCode} onChange={(e) => setForgotCode(e.target.value.replace(/[^0-9]/g, ''))} required />
                </div>
                <div className="mb-3 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input className="form-input !pl-10" type="password" placeholder={t('auth.new_password')}
                    value={forgotPassword} onChange={(e) => setForgotPassword(e.target.value)} required />
                </div>
                <div className="mb-4 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input className="form-input !pl-10" type="password" placeholder={t('auth.confirm_password')}
                    value={forgotConfirm} onChange={(e) => setForgotConfirm(e.target.value)} required />
                </div>
                <button className="w-full py-3 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 border-none cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #d4af37, #b8962f)', color: '#ffffff' }} type="submit" disabled={loading}>
                  {loading ? t('common.loading') : t('auth.reset_password_button')}
                </button>
                <div className="mt-3 text-center">
                  <button type="button" onClick={() => setForgotStep('phone')}
                    className="text-xs text-[var(--text-muted)] hover:text-champagne-500 transition-colors bg-transparent border-none cursor-pointer">
                    {t('common.back')}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        <div className="text-center mt-6">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} Medical Wellness
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
