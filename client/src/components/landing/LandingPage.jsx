import SEO from '../SEO';
import StructuredData from '../StructuredData';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import BenefitsSection from './BenefitsSection';
import FAQSection from './FAQSection';
import AboutSection from './AboutSection';
import CTASection from './CTASection';
import AppSection from './DemoSection';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import ScrollProgress from '../ui/ScrollProgress';
import useTranslation from '../../hooks/useTranslation';

export default function LandingPage() {
  const { lang } = useTranslation();

  return (
    <div className="landing-page">
      <SEO
        lang={lang}
        title="Premium Medical Wellness Center — Tangier, Morocco"
        description="Medical Wellness à Tanger (Malabata) : centre de bien-être médical de luxe. Médecine préventive, kinésithérapie, nutrition, I-SLIM, SPA & hammam, amincissement, fitness, esthétique. Découvrez nos programmes personnalisés."
        keywords="medical wellness, bien-être médical, Tanger, centre de santé, kinésithérapie, nutrition, SPA, hammam, I-SLIM, amincissement, médecine préventive, Malabata, Dr Mernissi"
        ogImage="/hero-day.jpg"
      />
      <StructuredData />
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <BenefitsSection />
      <FAQSection />
      <AboutSection />
      <CTASection />
      <AppSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
}
