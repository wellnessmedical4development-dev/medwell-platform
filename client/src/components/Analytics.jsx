import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = import.meta.env.VITE_GA_ID;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;

export default function Analytics() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!GA_ID && !CLARITY_ID) return;

    if (GA_ID && !window.ga_loaded) {
      window.ga_loaded = true;
      const s = document.createElement('script');
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      s.async = true;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_ID, { send_page_view: false });
    }

    if (CLARITY_ID && !window.clarity_loaded) {
      window.clarity_loaded = true;
      const s = document.createElement('script');
      s.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_ID}");`;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    if (window.gtag && GA_ID) {
      window.gtag('config', GA_ID, { page_path: pathname });
    }
  }, [pathname]);

  return null;
}
