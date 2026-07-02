import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import es from '../locales/es.json';
import ar from '../locales/ar.json';

const ALL_LOCALES = { en, fr, es, ar };

export default function useTranslation() {
  const { lang } = useTheme();

  const translations = useMemo(() => ALL_LOCALES[lang] || ALL_LOCALES.en, [lang]);

  const t = (path, params = {}) => {
    const keys = path.split('.');
    let value = translations;
    for (const key of keys) {
      if (value && typeof value === 'object') value = value[key];
      else return path;
    }
    if (typeof value !== 'string') return value;
    return value.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || `{{${key}}}`);
  };

  return { t, lang };
}
