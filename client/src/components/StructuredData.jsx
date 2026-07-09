import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://medical-wellness.ma';
const ADDRESS = 'Villa Mernissi, Bella Vista, à côté de Malabata Mall, en face Tanja Balia - Tanger';
const PHONE = '+212666993030';
const PHONE2 = '+212531281283';
const COORDS = { lat: 35.7714, lng: -5.7998 };

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'HealthAndBeautyBusiness'],
  '@id': `${SITE_URL}/#organization`,
  name: 'Medical Wellness',
  alternateName: 'Medical Wellness — Premium Medical Wellness Center',
  url: SITE_URL,
  telephone: [PHONE, PHONE2],
  email: 'contact@medical-wellness.ma',
  description: 'Centre de bien-être médical de luxe à Tanger (Malabata). Médecine préventive, kinésithérapie, nutrition, SPA & hammam, I-SLIM, amincissement, fitness, esthétique.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Villa Mernissi, Bella Vista, Malabata',
    addressLocality: 'Tangier',
    addressRegion: 'Tanger-Tetouan-Al Hoceima',
    addressCountry: 'MA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: COORDS.lat,
    longitude: COORDS.lng,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:30', closes: '22:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Sunday', opens: '00:00', closes: '00:00' },
  ],
  sameAs: [
    'https://www.instagram.com/medical.wellness.ma',
    'https://maps.app.goo.gl/pz5dHW8xQWyZXGmk7',
  ],
  priceRange: '$$$',
  areaServed: { '@type': 'City', name: 'Tangier' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Wellness Programs',
    itemListElement: [
      { '@type': 'Offer', name: 'Nutrition & Accompagnement' },
      { '@type': 'Offer', name: 'Kinésithérapie' },
      { '@type': 'Offer', name: 'I-SLIM Électro-stimulation' },
      { '@type': 'Offer', name: 'Amincissement & Minceur' },
      { '@type': 'Offer', name: 'Fitness' },
      { '@type': 'Offer', name: 'Esthétique & Anti-âge' },
      { '@type': 'Offer', name: 'SPA & Hammam' },
      { '@type': 'Offer', name: 'Bilan Bien-être' },
    ],
  },
  medicalSpecialty: ['PreventiveMedicine', 'Physiotherapy', 'Nutrition', 'CosmeticSurgery'],
  founder: { '@type': 'Person', name: 'Dr. Abdelali Mernissi' },
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'Medical Wellness',
  description: 'Premium Medical Wellness Center in Tangier, Morocco',
  inLanguage: ['en', 'fr', 'es', 'ar'],
  publisher: { '@id': `${SITE_URL}/#organization` },
};

export default function StructuredData() {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(localBusiness)}</script>
      <script type="application/ld+json">{JSON.stringify(website)}</script>
    </Helmet>
  );
}
