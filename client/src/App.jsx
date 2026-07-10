import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/landing/Navbar';
import Footer from './components/landing/Footer';
import ScrollToTop from './components/landing/ScrollToTop';
import MobileBottomNav from './components/landing/MobileBottomNav';
import ScrollProgress from './components/ui/ScrollProgress';
import FloatingContact from './components/ui/FloatingContact';
import ChatAssistant from './components/chat/ChatAssistant';
import Analytics from './components/Analytics';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AppPage from './pages/AppPage';
import DownloadPage from './pages/DownloadPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollRestore() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/download" element={<DownloadPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <div className="landing-page">
            <Analytics />
            <ScrollRestore />
            <ScrollProgress />
            <Navbar />
            <AnimatedRoutes />
            <Footer />
            <ScrollToTop />
            <FloatingContact />
            <ChatAssistant />
            <MobileBottomNav />
          </div>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
