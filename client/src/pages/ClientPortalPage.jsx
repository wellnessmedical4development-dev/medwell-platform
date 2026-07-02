import SEO from '../components/SEO';
import ClientDashboard from '../components/client/ClientDashboard';

export default function ClientPortalPage() {
  return (
    <>
      <SEO title="My Dashboard — Client Portal" description="Gérez vos abonnements, rendez-vous, wellness coins et carte de membre Medical Wellness." noIndex />
      <ClientDashboard />
    </>
  );
}
