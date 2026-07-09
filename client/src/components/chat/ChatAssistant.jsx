import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useTranslation from '../../hooks/useTranslation';
import { useTheme } from '../../contexts/ThemeContext';

const WELCOME_MSGS = {
  en: 'Hello! I am the Medical Wellness assistant. How can I help you?',
  fr: 'Bonjour ! Je suis l\'assistant Medical Wellness. Comment puis-je vous aider ?',
  es: '¡Hola! Soy el asistente de Medical Wellness. ¿Cómo puedo ayudarle?',
  ar: 'مرحباً! أنا مساعد ميديكال ويلنس. كيف يمكنني مساعدتك؟',
};

export default function ChatAssistant() {
  const { lang } = useTranslation();
  const { mode } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const msgKey = ['en', 'fr', 'es', 'ar'].includes(lang) ? lang : 'fr';

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', text: WELCOME_MSGS[msgKey] }]);
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.slice(-10).map((m) => ({ role: m.role, text: m.text }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, lang: msgKey, history }),
      });
      const data = await res.json();
      if (data.error === 'quota_exceeded') {
        setMessages((prev) => [...prev, { role: 'assistant', text: msgKey === 'fr' ? 'Désolé, le service IA est momentanément indisponible (quota dépassé). Veuillez réessayer plus tard ou nous contacter directement sur WhatsApp.' : msgKey === 'es' ? 'Lo siento, el servicio de IA no está disponible temporalmente (cuota excedida). Intente de nuevo más tarde o contáctenos directamente por WhatsApp.' : msgKey === 'ar' ? 'عذراً، خدمة الذكاء الاصطناعي غير متاحة مؤقتاً (تم تجاوز الحد المسموح). يرجى المحاولة لاحقاً أو الاتصال بنا مباشرة على واتساب.' : 'Sorry, the AI service is temporarily unavailable (quota exceeded). Please try again later or contact us directly on WhatsApp.' }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.reply || '...' }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: msgKey === 'fr' ? 'Désolé, une erreur est survenue. Veuillez réessayer.' : msgKey === 'es' ? 'Lo siento, ocurrió un error. Por favor intente de nuevo.' : msgKey === 'ar' ? 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.' : 'Sorry, an error occurred. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderText = useCallback((text) => {
    const phoneRegex = /(\+212\s*[\d\s]{6,})/g;
    const parts = text.split(phoneRegex);
    return parts.map((part, i) => {
      if (phoneRegex.test(part)) {
        const cleanNum = part.replace(/\s/g, '');
        return (
          <span key={i}>
            <a href={`tel:${cleanNum}`} className="text-[#D4AF37] underline hover:opacity-80">{part}</a>
            <a href={`https://wa.me/${cleanNum}`} className="inline-flex items-center ml-2 text-green-500 hover:opacity-80 text-xs" target="_blank" rel="noopener noreferrer">
              <svg className="w-3.5 h-3.5 mr-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462.953 2.875 1.09 3.074.136.198 1.88 2.868 4.553 3.978.636.252 1.134.402 1.52.514.636.173 1.21.149 1.666.09.507-.064 1.578-.645 1.8-1.27.222-.624.222-1.16.173-1.27-.05-.11-.174-.174-.471-.297Z"/></svg>
              WhatsApp
            </a>
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-28 sm:bottom-32 right-4 z-50 w-14 h-14 rounded-full bg-[#D4AF37] hover:bg-champagne-600 text-dark-900 shadow-[0_4px_20px_rgba(212,175,55,0.35)] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Chat"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-44 sm:bottom-48 right-4 z-50 w-[340px] sm:w-[380px] max-w-[calc(100vw-32px)] bg-white dark:bg-dark-900 border border-ivory-200 dark:border-dark-700 rounded-2xl shadow-2xl overflow-hidden"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#D4AF37] text-dark-900">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-bold tracking-wider uppercase">Medical Wellness</span>
              </div>
              <button onClick={() => setOpen(false)} className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-dark-900/10 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div ref={listRef} className="h-72 sm:h-80 overflow-y-auto px-4 py-3 space-y-3 bg-ivory-50/50 dark:bg-dark-950/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#D4AF37] text-dark-900 rounded-br-md'
                        : 'bg-white dark:bg-dark-800 border border-ivory-200 dark:border-dark-700 text-dark-700 dark:text-ivory-200/80 rounded-bl-md'
                    }`}
                  >
                    {msg.role === 'assistant' ? renderText(msg.text) : msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-dark-800 border border-ivory-200 dark:border-dark-700 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-champagne-400/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-champagne-400/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-champagne-400/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t border-ivory-200 dark:border-dark-700 bg-white dark:bg-dark-900">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={msgKey === 'fr' ? 'Écrivez votre message...' : msgKey === 'es' ? 'Escribe tu mensaje...' : msgKey === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-dark-200/30 dark:border-ivory-200/20 bg-transparent text-sm text-dark-900 dark:text-ivory-50 placeholder:text-dark-300 dark:placeholder:text-dark-500 focus:outline-none focus:border-champagne-400 transition-colors"
                  disabled={loading}
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-[#D4AF37] hover:bg-champagne-600 disabled:opacity-40 text-dark-900 flex items-center justify-center transition-all shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}