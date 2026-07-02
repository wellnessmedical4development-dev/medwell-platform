import { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, AuthContext, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import Sidebar from './components/layout/Sidebar';
import LoginPage from './pages/LoginPage';
import DownloadPage from './pages/DownloadPage';
import ClientPortalPage from './pages/ClientPortalPage';
import AdminPage from './pages/AdminPage';
import LandingPage from './components/landing/LandingPage';
import ServiceBrowser from './components/client/ServiceBrowser';
import MyAppointments from './components/client/MyAppointments';
import ServiceManager from './components/admin/ServiceManager';

function AnimatedPage({ children }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>
        {children}
      </div>
    </AnimatePresence>
  );
}

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open', sidebarOpen);
    }
  }, [sidebarOpen]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', closeOnResize);
    return () => window.removeEventListener('resize', closeOnResize);
  }, []);

  if (!isAuthenticated) {
    const demoPath = requiredRole === 'admin' ? '/demo/admin' : '/demo/client';
    return <Navigate to={demoPath} replace />;
  }
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/client'} replace />;
  }
  return (
    <>
      <Sidebar />
      <div className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />
      <main className="main-content">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${sidebarOpen ? 'open' : ''}`}>
            <span /><span /><span />
          </span>
        </button>
        {children}
      </main>
    </>
  );
}

function PublicRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/client'} replace />;
  }
  return children;
}

function DemoRoute({ children, role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const demoUser = {
    id: 'demo',
    role,
    name: role === 'admin' ? 'Admin Demo' : 'Client Demo',
    phone: '+212600000000',
    email: role === 'admin' ? 'admin@medwell.ma' : 'client@demo.ma',
    wellness_coin_balance: 1250,
    subscription_status: 'active',
    total_paid: 4500,
    amount_remaining: 0,
    membership_id: 'MW-DEMO001',
  };

  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('open', sidebarOpen);
  }, [sidebarOpen]);

  useEffect(() => {
    const closeOnResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener('resize', closeOnResize);
    return () => window.removeEventListener('resize', closeOnResize);
  }, []);

  return (
    <AuthContext.Provider value={{
      user: demoUser,
      token: 'demo-token',
      isAuthenticated: true,
      isAdmin: role === 'admin',
      isClient: role === 'client',
      loading: false,
      logout: () => {},
      login: async () => {},
      register: async () => {},
      registerLegacy: async () => {},
      saveAuth: () => {},
    }}>
      <style>{`.demo-mode .sidebar { top: 40px !important; height: calc(100vh - 40px) !important; } .demo-mode .sidebar-toggle { top: calc(0.75rem + 40px) !important; }`}</style>
      <div className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center py-2 text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        DEMO MODE — Exploring {role === 'admin' ? 'Admin Dashboard' : 'Client Portal'}
        <a href="/" className="ml-2 underline underline-offset-2 hover:text-amber-100">Exit Demo</a>
      </div>
      <div className="demo-mode pt-10 app-layout">
        <Sidebar />
        <div className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />
        <main className="main-content">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <span className={`hamburger ${sidebarOpen ? 'open' : ''}`}>
              <span /><span /><span />
            </span>
          </button>
          {children}
        </main>
      </div>
    </AuthContext.Provider>
  );
}

function DashboardLayout() {
  return (
    <div className="app-layout">
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/client" element={<ProtectedRoute requiredRole="client"><ClientPortalPage /></ProtectedRoute>} />
        <Route path="/client/services" element={<ProtectedRoute requiredRole="client"><ServiceBrowser /></ProtectedRoute>} />
        <Route path="/client/appointments" element={<ProtectedRoute requiredRole="client"><MyAppointments /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute requiredRole="admin"><ServiceManager /></ProtectedRoute>} />
        <Route path="/demo/client" element={<DemoRoute role="client"><ClientPortalPage /></DemoRoute>} />
        <Route path="/demo/client/services" element={<DemoRoute role="client"><ServiceBrowser /></DemoRoute>} />
        <Route path="/demo/client/appointments" element={<DemoRoute role="client"><MyAppointments /></DemoRoute>} />
        <Route path="/demo/admin" element={<DemoRoute role="admin"><AdminPage /></DemoRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  if (location.pathname === '/') {
    return <LandingPage />;
  }
  if (location.pathname === '/download') {
    return <DownloadPage />;
  }
  return <DashboardLayout />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
