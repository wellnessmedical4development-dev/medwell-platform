import { Helmet } from 'react-helmet-async';
import { useTheme } from '../contexts/ThemeContext';

const SITE_URL = 'https://medicalwellnes.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/wellness_morning.png`;
const DEFAULT_TITLE = 'Medical Wellness — Premium Medical Wellness Center in Tangier';
const DEFAULT_DESC = 'Centre de bien-être médical de luxe à Tanger (Malabata). Médecine préventive, kinésithérapie, nutrition, SPA & hammam, I-SLIM, amincissement, fitness, esthétique.';

export default function SEO({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  ogLocale = 'en_US',
  canonical,
  noIndex = false,
  lang,
}) {
  const { lang: contextLang } = useTheme();
  const currentLang = lang || contextLang;
  const pageTitle = title ? `${title} | Medical Wellness` : DEFAULT_TITLE;
  const pageDesc = description || DEFAULT_DESC;
  const pageCanonical = canonical || SITE_URL;

  const langAlternates = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'ar', label: 'العربية' },
  ];

  return (
    <Helmet>
      <html lang={currentLang} dir={currentLang === 'ar' ? 'rtl' : 'ltr'} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={pageCanonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={pageCanonical} />
      <meta property="og:site_name" content="Medical Wellness" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:image" content={ogImage || DEFAULT_OG_IMAGE} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={ogImage || DEFAULT_OG_IMAGE} />

      {langAlternates.map((alt) => (
        <link key={alt.code} rel="alternate" hrefLang={alt.code} href={`${SITE_URL}/${alt.code}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
    </Helmet>
  );
}
