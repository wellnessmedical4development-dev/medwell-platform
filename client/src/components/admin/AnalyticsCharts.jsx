import useTranslation from '../../hooks/useTranslation';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#d4af37', '#4ade80', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa'];

function formatMonth(month) {
  if (!month) return '';
  const [y, m] = month.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function AnalyticsCharts({ monthlyRevenue, clientGrowth, subscriptionBreakdown }) {
  const { t } = useTranslation();

  const revData = (monthlyRevenue || []).map(r => ({ month: formatMonth(r.month), revenue: parseFloat(r.revenue) }));
  const growthData = (clientGrowth || []).map(r => ({ month: formatMonth(r.month), clients: parseInt(r.count, 10) }));
  const pieData = (subscriptionBreakdown || []).map(r => ({ name: t(`admin.${r.subscription_status}`) || r.subscription_status, value: parseInt(r.count, 10) }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {revData.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">{t('admin.revenue_chart')}</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                formatter={(value) => [`${value.toLocaleString()} MAD`, t('admin.total_revenue')]}
              />
              <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2} dot={{ fill: '#d4af37' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {growthData.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">{t('admin.client_growth_chart')}</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
              />
              <Bar dataKey="clients" fill="#d4af37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {pieData.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">{t('admin.subscription_chart')}</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
