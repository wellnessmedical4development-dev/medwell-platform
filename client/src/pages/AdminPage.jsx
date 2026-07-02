import SEO from '../components/SEO';
import AdminDashboard from '../components/admin/AdminDashboard';

export default function AdminPage() {
  return (
    <>
      <SEO title="Admin Dashboard" description="Administration Medical Wellness. Gérez les clients, services, abonnements et analytics." noIndex />
      <AdminDashboard />
    </>
  );
}
