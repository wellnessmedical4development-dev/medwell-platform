import useTranslation from '../../hooks/useTranslation';

export default function Footer() {
  const { t, lang } = useTranslation();
  const isRtl = lang === 'ar';

  return (
    <footer id="contact" className="relative py-16 sm:py-20 lg:py-24 bg-[#FDFBF7] dark:bg-dark-950 border-t border-[#D4AF37]/20" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="w-full mx-auto px-4 xs:px-5 sm:px-8 lg:px-12 xl:px-16" style={{ maxWidth: '90rem' }}>
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 lg:gap-16 xl:gap-24 mb-16">
          
          {/* Column 1: Brand and address */}
          <div className="md:col-span-6 space-y-6">
            <div>
              <span className="font-display text-2xl sm:text-2xl lg:text-3xl font-bold text-champagne-400 tracking-[0.15em] uppercase">
                Medical Wellness
              </span>
              <p className="mt-2 text-sm sm:text-sm text-dark-500 dark:text-ivory-200/50 font-light max-w-md leading-relaxed">
                {t('footer.tagline')} — Center of elite preventive medicine, physical therapy, and aesthetic harmony in Tangier.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                {t('contact_section.address_label')}
              </h4>
              <p className="text-xs sm:text-sm text-dark-600 dark:text-ivory-100 font-light leading-relaxed max-w-sm">
                {t('contact_section.address_value')}
              </p>
            </div>
          </div>

          {/* Column 2: Direct Contact numbers and Map CTA */}
          <div className="md:col-span-6 space-y-6">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                {t('contact_section.phone')}
              </h4>
              <div className="space-y-1.5">
                <a
                  href="https://wa.me/212666993030"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base sm:text-base font-semibold text-dark-900 dark:text-ivory-50 hover:text-champagne-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  06 66 99 30 30
                </a>
                <a
                  href="tel:+212531281283"
                  className="inline-flex items-center gap-2 text-base sm:text-base font-semibold text-dark-900 dark:text-ivory-50 hover:text-champagne-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  05 31 28 12 83
                </a>
              </div>
            </div>

            {/* Google Maps locate button */}
            <div className="pt-2">
              <a
                href="https://www.google.com/maps/place/MEDICAL+WELLNESS/@35.7731077,-5.7712984,17z/data=!4m6!3m5!1s0xd0b819d5390d345:0x90f3fffebc5f0bf0!8m2!3d35.7731077!4d-5.7712984!16s%2Fg%2F11kpz0rq1r?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 border-2 border-[#D4AF37] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-dark-900 font-bold tracking-widest uppercase rounded-full text-xs transition-all duration-300 shadow-[0_4px_16px_rgba(212,175,55,0.1)]"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{t('contact_section.maps_button')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-dark-200/10 dark:bg-ivory-200/5 mb-8" />

        {/* Footer Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-[10px] sm:text-xs text-dark-500 dark:text-ivory-200/30 tracking-wider">
              &copy; {new Date().getFullYear()} Medical Wellness. {t('footer.rights')}
            </p>
          </div>

          {/* Social media links */}
          <div className="flex items-center justify-center sm:justify-end gap-5 sm:gap-6 flex-wrap">
            <a
              href="https://www.facebook.com/share/1ELeeuJxAB/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-dark-500 dark:text-ivory-200/40 hover:text-champagne-400 transition-colors"
              aria-label="Dr. Mernissi Facebook"
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase hidden sm:inline group-hover:text-champagne-400 transition-colors">
                {t('contact_section.facebook_doctor')}
              </span>
            </a>

            <a
              href="https://www.tiktok.com/@medical.wellness01?_r=1&_t=ZS-97fSLFntDwO"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-dark-500 dark:text-ivory-200/40 hover:text-champagne-400 transition-colors"
              aria-label="Medical Wellness TikTok"
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase hidden sm:inline group-hover:text-champagne-400 transition-colors">
                {t('contact_section.tiktok_clinic')}
              </span>
            </a>

            <a
              href="https://www.instagram.com/medical.wellness.ma?igsh=bnJhOWNhbGp0dGs0"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-dark-500 dark:text-ivory-200/40 hover:text-champagne-400 transition-colors"
              aria-label="Official Clinic Instagram"
            >
              <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zM18.406 4.413a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
              </svg>
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase hidden sm:inline group-hover:text-champagne-400 transition-colors">
                {t('contact_section.instagram_clinic')}
              </span>
            </a>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="https://instagram.com/jassyai1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] sm:text-[10px] text-dark-400/40 dark:text-ivory-200/20 hover:text-champagne-400/60 dark:hover:text-champagne-400/60 transition-colors tracking-wider"
          >
            Created by Jassir Boutaffah
          </a>
        </div>

      </div>
    </footer>
  );
}