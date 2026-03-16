import React, { useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import AdminDashboard from './AdminDashboard';
import UsersPage from './UsersPage';
import Reports from './Reports';
import Logs from './Logs';

const ADMIN_SIDEBAR_LINKS = [
  { to: '/dashboard/admin', icon: 'bi-grid-1x2-fill', label: 'Dashboard', end: true },
  { to: '/admin/users', icon: 'bi-people-fill', label: 'Users' },
];

const TAB_CONFIG = [
  { key: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2', component: AdminDashboard },
  { key: 'users', label: 'Users', icon: 'bi-people', component: UsersPage },
  { key: 'reports', label: 'Reports', icon: 'bi-bar-chart-line', component: Reports },
  { key: 'logs', label: 'Logs', icon: 'bi-journal-text', component: Logs },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const district = useMemo(() => localStorage.getItem('district') || 'Chennai', []);

  const ActiveComponent = useMemo(() => {
    const tab = TAB_CONFIG.find(tab => tab.key === activeTab);
    return tab?.component || AdminDashboard;
  }, [activeTab]);

  return (
    <DashboardLayout
      title="Admin Panel"
      subtitle={district + ' Operations'}
      sidebarLinks={[
        { to: '/dashboard/admin', icon: 'bi-grid-1x2-fill', label: 'Dashboard', end: true },
        { to: '/dashboard/scheduler', icon: 'bi-calendar3', label: 'Scheduler' },
        { to: '/dashboard/depotManager', icon: 'bi-building', label: 'Depot Manager' },
      ]}
    >
      {/* Sub-tabs */}
      <div className="tab-nav" style={{ marginBottom: 24 }}>
        {TAB_CONFIG.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`tab-btn ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <i className={`bi ${icon}`}></i>
            {label}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </DashboardLayout>
  );
};

export default Admin;
