import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { KpiCard, EmptyState, SearchBar, SkeletonCard } from '../components/ui/SharedComponents';

const DEPOT_SIDEBAR = [
  { to: '/dashboard/depotManager', icon: 'bi-grid-1x2-fill', label: 'Dashboard', end: true },
  { to: '/depot/buses', icon: 'bi-bus-front-fill', label: 'Buses' },
  { to: '/depot/crews', icon: 'bi-person-badge-fill', label: 'Crews' },
  { to: '/depot/routes', icon: 'bi-signpost-split-fill', label: 'Routes' },
  { to: '/dashboard/scheduler', icon: 'bi-calendar3', label: 'Scheduler' },
];

const DepotManager = () => {
  const [assignments, setAssignments] = useState([]);
  const [routeFilter, setRouteFilter] = useState('');
  const [shiftFilter, setShiftFilter] = useState('All');
  const [buses, setBuses] = useState([]);
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
    fetchBuses();
    fetchCrew();
  }, []);

  const fetchAssignments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`http://localhost:5000/api/duties/schedule?date=${today}`);
      const data = await res.json();
      setAssignments(data.data?.assignments || []);
    } catch (err) { console.error('Failed to load assignments:', err); setAssignments([]); }
    finally { setLoading(false); }
  };

  const fetchBuses = async () => {
    try { const res = await fetch('http://localhost:5000/api/buses'); setBuses(await res.json()); }
    catch (err) { console.error('Failed to load buses:', err); setBuses([]); }
  };

  const fetchCrew = async () => {
    try { const res = await fetch('http://localhost:5000/api/crews'); setCrew(await res.json()); }
    catch (err) { console.error('Failed to load crew:', err); setCrew([]); }
  };

  const filteredAssignments = assignments.filter(a =>
    (routeFilter === '' || a.route.includes(routeFilter)) &&
    (shiftFilter === 'All' || a.shift === shiftFilter)
  );

  const inServiceCount = buses.filter(b => b.status === 'active').length;
  const maintenanceCount = buses.filter(b => b.status === 'maintenance').length;
  const availableCrew = Array.isArray(crew) ? crew.filter(c => c.status === 'available').length : 0;
  const crewCount = Array.isArray(crew) ? crew.length : 0;

  return (
    <DashboardLayout title="Depot Manager" subtitle="Chennai Operations" sidebarLinks={DEPOT_SIDEBAR}>
      {/* KPI Row */}
      <div className="kpi-grid">
        <KpiCard icon="bi-bus-front-fill" iconColor="green" accentColor="green"
          label="Buses In Service" value={inServiceCount} trend="Operational" trendDir="up" />
        <KpiCard icon="bi-tools" iconColor="red" accentColor="red"
          label="Under Maintenance" value={maintenanceCount} />
        <KpiCard icon="bi-people-fill" iconColor="blue" accentColor="blue"
          label="Total Crew" value={crewCount} />
        <KpiCard icon="bi-person-check-fill" iconColor="amber" accentColor="amber"
          label="Crew Available" value={availableCrew} trend="Ready for duty" />
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <NavLink to="/depot/buses" className="btn-primary-custom" style={{ textDecoration: 'none' }}>
          <i className="bi bi-bus-front"></i> Manage Buses
        </NavLink>
        <NavLink to="/depot/crews" className="btn-secondary-custom" style={{ textDecoration: 'none', color: 'var(--gray-700)' }}>
          <i className="bi bi-person-badge"></i> Manage Crews
        </NavLink>
        <NavLink to="/depot/routes" className="btn-secondary-custom" style={{ textDecoration: 'none', color: 'var(--gray-700)' }}>
          <i className="bi bi-signpost-split"></i> View Routes
        </NavLink>
      </div>

      {/* Assignments Table */}
      <div className="card">
        <div className="card-header-custom">
          <h3><i className="bi bi-calendar-check" style={{ marginRight: 8, color: 'var(--success)' }}></i>Today's Duty Assignments</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <SearchBar value={routeFilter} onChange={setRouteFilter} placeholder="Filter by route..." />
            <select className="select-custom" style={{ width: 'auto', minWidth: 160 }}
              value={shiftFilter} onChange={e => setShiftFilter(e.target.value)}>
              <option value="All">All Shifts</option>
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton-row"></div>)}
            </div>
          ) : filteredAssignments.length === 0 ? (
            <EmptyState icon="bi-calendar-x" title="No assignments found" description="No duty assignments for today. Generate a schedule first." />
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Route</th>
                    <th>Bus</th>
                    <th>Driver</th>
                    <th>Conductor</th>
                    <th>Shift</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((a, idx) => (
                    <tr key={idx}>
                      <td><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{a.route}</span></td>
                      <td>{a.bus}</td>
                      <td>{a.driver}</td>
                      <td>{a.conductor}</td>
                      <td>
                        <span className={`badge-status ${a.shift === 'Morning' ? 'badge-active' : a.shift === 'Afternoon' ? 'badge-scheduled' : 'badge-onduty'}`}>
                          {a.shift}
                        </span>
                      </td>
                      <td style={{ color: 'var(--gray-500)', fontSize: 12 }}>{a.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DepotManager;
