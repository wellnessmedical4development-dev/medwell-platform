import { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import useTranslation from '../hooks/useTranslation';
import { useToast } from '../contexts/ToastContext';
import SEO from '../components/SEO';

const isNativeApp = typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform();

function getDevice() {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  return 'desktop';
}

export default function DownloadPage() {
  const { t, lang } = useTranslation();
  const addToast = useToast();
  const device = useMemo(getDevice, []);
  const isRtl = lang === 'ar';

  const canDownloadApk = device === 'android' && !isNativeApp;

  const handleApk = useCallback(() => {
    addToast(t('download.apk_coming_soon'), 'success');
  }, [addToast, t]);

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-dark-950 flex flex-col items-center justify-center px-4 py-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <SEO
        titleKey="download.title"
        descriptionKey="download.desc"
        path="/download"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-champagne-400/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-champagne-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-dark-900 dark:text-ivory-50 mb-3">
          {t('download.title')}
        </h1>
        <p className="text-sm sm:text-base text-dark-500 dark:text-ivory-200/60 font-light mb-10 max-w-sm mx-auto">
          {t('download.desc')}
        </p>

        {device === 'android' && !isNativeApp && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleApk}
            className="inline-flex items-center gap-3 px-8 py-4 bg-dark-900 dark:bg-champagne-400 text-white dark:text-dark-900 rounded-2xl text-sm font-bold tracking-wider uppercase hover:bg-dark-800 dark:hover:bg-champagne-500 transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 14.082c-.332.772-.953 1.742-1.701 2.625-.64.756-1.301 1.512-2.244 1.526-.897.015-1.19-.529-2.225-.529-1.031 0-1.352.514-2.206.544-.887.029-1.563-.82-2.207-1.57-1.4-1.66-2.469-4.688-2.027-6.735.226-1.045.823-1.996 1.59-2.607.78-.621 1.687-.947 2.634-.958.822-.01 1.598.311 2.1.311.504 0 1.447-.384 2.44-.328a3.573 3.573 0 011.727.477c-.663.466-1.18 1.112-1.434 1.878-.267.798-.301 1.608-.036 2.357.353 1.007 1.104 1.784 2.086 2.345a4.72 4.72 0 01-.497.994zM14.313.278a2.302 2.302 0 01-.528 1.634 2.097 2.097 0 01-1.373.703 2.215 2.215 0 01.537-1.575A2.428 2.428 0 0114.313.278z"/>
            </svg>
            {t('download.android_btn')}
          </motion.button>
        )}

        {(device === 'android' && isNativeApp) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/10 border border-green-300/30 rounded-2xl text-sm text-green-600 dark:text-green-400 font-semibold">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Application installée
            </div>
          </motion.div>
        )}

        {device === 'ios' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-dark-200/30 dark:bg-dark-800 rounded-2xl text-sm font-bold tracking-wider uppercase text-dark-500 dark:text-ivory-200/40 cursor-not-allowed">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.67-.78 1.87-1.32 2.99-1.28.1 1.14-.35 2.28-1.01 3.1-.64.8-1.86 1.35-2.94 1.24-.11-1.1.37-2.21 1.02-3.06z"/>
              </svg>
              {t('download.ios_soon')}
            </div>
            <p className="text-xs text-dark-400 dark:text-ivory-200/30">
              {t('download.ios_note')}
            </p>
          </motion.div>
        )}

        {device === 'desktop' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-champagne-400/10 border border-champagne-400/20 rounded-2xl text-sm text-champagne-500 font-semibold">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {t('download.desktop_note')}
            </div>
            <p className="text-xs text-dark-400 dark:text-ivory-200/30">
              {t('download.desktop_scan')}
            </p>
          </motion.div>
        )}

        <div className="mt-12 flex items-center justify-center gap-3 text-[10px] text-dark-400 dark:text-ivory-200/20">
          <span>Android</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>iOS</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span>{t('download.mobile_only')}</span>
        </div>
      </motion.div>
    </div>
  );
}
