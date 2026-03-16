import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TabNav } from '../components/ui/SharedComponents';
import SchedulerDashboard from './SchedulerDashboard';
import SchedulerAssign from './SchedulerAssign';
import SchedulerExport from './SchedulerExport';

const SCHEDULER_SIDEBAR = [
  { to: '/dashboard/admin', icon: 'bi-shield-lock-fill', label: 'Admin Panel' },
  { to: '/dashboard/scheduler', icon: 'bi-calendar3', label: 'Scheduler', end: true },
  { to: '/dashboard/depotManager', icon: 'bi-building', label: 'Depot Manager' },
  { to: '/depot/buses', icon: 'bi-bus-front-fill', label: 'Buses' },
  { to: '/depot/crews', icon: 'bi-person-badge-fill', label: 'Crews' },
  { to: '/depot/routes', icon: 'bi-signpost-split-fill', label: 'Routes' },
];

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2' },
  { key: 'assign', label: 'Assign', icon: 'bi-calendar-plus' },
  { key: 'export', label: 'Export', icon: 'bi-file-earmark-arrow-down' },
];

const Scheduler = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <DashboardLayout
      title="Scheduler"
      subtitle="Schedule & Assign Duties"
      sidebarLinks={SCHEDULER_SIDEBAR}
    >
      <TabNav tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'dashboard' && <SchedulerDashboard />}
      {activeTab === 'assign' && <SchedulerAssign />}
      {activeTab === 'export' && <SchedulerExport />}
    </DashboardLayout>
  );
};

export default Scheduler;
