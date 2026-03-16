import React, { useEffect, useState } from 'react';
import { KpiCard, SkeletonCard, EmptyState } from '../../components/ui/SharedComponents';

function downloadCSV(data, filename = 'data.csv') {
  if (!data || !data.length) return;
  const keys = Object.keys(data[0]);
  const csvContent =
    keys.join(',') + '\n' +
    data.map(row => keys.map(k => `"${(row[k] ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

const demoRecentUsers = [
  { name: 'Kumar A', email: 'kumar@ex.com', registeredAt: new Date().toISOString() },
  { name: 'Priya S', email: 'priya@ex.com', registeredAt: new Date().toISOString() },
];

const activityTimeline = [
  { icon: 'bi-calendar-check', color: 'var(--success-light)', textColor: 'var(--success)', title: 'Schedule generated for Route 15G', time: '2 mins ago' },
  { icon: 'bi-person-plus', color: 'var(--info-light)', textColor: 'var(--info)', title: 'New crew member Ravi S added', time: '15 mins ago' },
  { icon: 'bi-bus-front', color: 'var(--warning-light)', textColor: 'var(--warning)', title: 'Bus TN-01-AB-1234 sent to maintenance', time: '1 hour ago' },
  { icon: 'bi-shield-check', color: 'var(--primary-light)', textColor: 'var(--primary)', title: 'System backup completed', time: '3 hours ago' },
];

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ users: 120, buses: 33, depots: 7, routes: 42 });
  const [recentUsers, setRecentUsers] = useState(demoRecentUsers);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setCounts({ users: 120, buses: 33, depots: 7, routes: 42 });
      setRecentUsers(demoRecentUsers);
      setLoading(false);
    }, 700);
  };

  useEffect(() => { fetchSummary(); }, []);

  const handleUserAction = (userEmail, action) => {
    setUserLoading(true);
    setTimeout(() => {
      alert(`${action}d user: ${userEmail}`);
      setRecentUsers(users => users.filter(u => u.email !== userEmail));
      setUserLoading(false);
    }, 500);
  };

  return (
    <div>
      {/* Quick Actions Bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className="btn-primary-custom" onClick={fetchSummary} disabled={loading}>
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
        <button className="btn-success-custom" disabled={recentUsers.length === 0 || loading}
          onClick={() => downloadCSV(recentUsers, 'recent_users.csv')}>
          <i className="bi bi-download"></i> Export Users CSV
        </button>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="kpi-grid" style={{ marginBottom: 24 }}>
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div style={{ color: 'var(--danger)', marginBottom: 24 }}>{error}</div>
      ) : (
        <div className="kpi-grid">
          <KpiCard icon="bi-people-fill" iconColor="blue" accentColor="blue"
            label="Total Users" value={counts.users} trend="+8 this week" trendDir="up" />
          <KpiCard icon="bi-bus-front-fill" iconColor="green" accentColor="green"
            label="Total Buses" value={counts.buses} trend="All operational" trendDir="up" />
          <KpiCard icon="bi-building" iconColor="indigo" accentColor="indigo"
            label="Depots" value={counts.depots} />
          <KpiCard icon="bi-signpost-split-fill" iconColor="amber" accentColor="amber"
            label="Active Routes" value={counts.routes} trend="+3 new" trendDir="up" />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Users */}
        <div className="card">
          <div className="card-header-custom">
            <h3><i className="bi bi-person-plus" style={{ marginRight: 8, color: 'var(--primary)' }}></i>Recent Registrations</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {loading ? (
              <div style={{ padding: 20 }}>
                {[1, 2].map(i => <div key={i} className="skeleton skeleton-row" style={{ marginBottom: 8 }}></div>)}
              </div>
            ) : recentUsers.length === 0 ? (
              <EmptyState icon="bi-person-x" title="No recent users" description="No new registrations found." />
            ) : (
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map(({ name, email, registeredAt }, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{name}</td>
                      <td style={{ color: 'var(--gray-500)' }}>{email}</td>
                      <td style={{ color: 'var(--gray-400)', fontSize: 12 }}>{new Date(registeredAt).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn-success-custom" style={{ padding: '5px 10px', fontSize: 12 }}
                            disabled={userLoading} onClick={() => handleUserAction(email, 'approve')}>
                            <i className="bi bi-check-lg"></i> Approve
                          </button>
                          <button className="btn-danger-custom" style={{ padding: '5px 10px', fontSize: 12 }}
                            disabled={userLoading} onClick={() => handleUserAction(email, 'deactivate')}>
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="card">
          <div className="card-header-custom">
            <h3><i className="bi bi-activity" style={{ marginRight: 8, color: 'var(--primary)' }}></i>Activity Timeline</h3>
          </div>
          <div className="card-body">
            <div className="timeline">
              {activityTimeline.map((item, idx) => (
                <div className="timeline-item" key={idx}>
                  <div className="timeline-dot" style={{ background: item.color, color: item.textColor }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div className="timeline-content">
                    <strong>{item.title}</strong>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
