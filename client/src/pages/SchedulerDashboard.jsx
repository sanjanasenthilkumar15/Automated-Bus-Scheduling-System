import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaExclamationTriangle } from 'react-icons/fa';
import { KpiCard } from '../components/ui/SharedComponents';

const SchedulerDashboard = () => {
  const [date, setDate] = useState(new Date());
  const [alerts, setAlerts] = useState([]);
  const [routeCount, setRouteCount] = useState(0);
  const [crewStats, setCrewStats] = useState({ available: 0, onDuty: 0, resting: 0 });

  const fetchRouteCount = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/routes/active-count');
      const data = await res.json();
      setRouteCount(data.count);
    } catch (err) { console.error('Failed to fetch route count:', err); }
  };

  const fetchCrewStatus = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/crews/status-summary');
      const data = await res.json();
      setCrewStats(data.statusSummary);
    } catch (err) { console.error('Failed to fetch crew stats:', err); }
  };

  const fetchAlerts = async (selectedDate) => {
    try {
      const res = await fetch(`http://localhost:5000/api/alerts?date=${selectedDate.toISOString().split('T')[0]}`);
      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch (err) { console.error('Failed to fetch alerts:', err); }
  };

  useEffect(() => { fetchRouteCount(); fetchCrewStatus(); }, []);
  useEffect(() => { fetchAlerts(date); }, [date]);

  return (
    <div>
      {/* KPI Row */}
      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <KpiCard icon="bi-signpost-split-fill" iconColor="blue" accentColor="blue"
          label="Active Routes" value={routeCount} />
        <KpiCard icon="bi-person-check-fill" iconColor="green" accentColor="green"
          label="Crew Available" value={crewStats.available} trend="Ready" trendDir="up" />
        <KpiCard icon="bi-clock-fill" iconColor="amber" accentColor="amber"
          label="On Duty" value={crewStats.onDuty} />
        <KpiCard icon="bi-moon-stars-fill" iconColor="red" accentColor="red"
          label="Resting" value={crewStats.resting} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Calendar */}
          <div className="card">
            <div className="card-header-custom">
              <h3><i className="bi bi-calendar3" style={{ marginRight: 8, color: 'var(--primary)' }}></i>Calendar</h3>
            </div>
            <div className="card-body" style={{ display: 'flex', justifyContent: 'center' }}>
              <Calendar
                value={date}
                onChange={setDate}
                className="w-100 border rounded"
              />
            </div>
          </div>

          {/* Crew Status */}
          <div className="card">
            <div className="card-header-custom">
              <h3><i className="bi bi-people" style={{ marginRight: 8, color: 'var(--primary)' }}></i>Crew Status</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Available', value: crewStats.available, color: 'green', bg: 'var(--success-light)', text: 'var(--success)' },
                  { label: 'On Duty', value: crewStats.onDuty, color: 'amber', bg: 'var(--warning-light)', text: 'var(--warning)' },
                  { label: 'Resting', value: crewStats.resting, color: 'red', bg: 'var(--danger-light)', text: 'var(--danger)' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: item.bg, borderRadius: 'var(--radius-md)' }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: item.text }}>{item.label}</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: item.text }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Alerts */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header-custom">
            <h3><i className="bi bi-exclamation-triangle" style={{ marginRight: 8, color: 'var(--warning)' }}></i>Alerts for {date.toISOString().split('T')[0]}</h3>
            <span className="badge-status badge-scheduled">{alerts.length} alerts</span>
          </div>
          <div className="card-body">
            {alerts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--gray-400)' }}>
                <i className="bi bi-check-circle" style={{ fontSize: 40, display: 'block', marginBottom: 12, color: 'var(--success)' }}></i>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 6 }}>All Clear!</h3>
                <p style={{ fontSize: 13 }}>No alerts for this date.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {alerts.map((alert, idx) => (
                  <div key={idx} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '12px 16px', background: 'var(--warning-light)',
                    borderRadius: 'var(--radius-md)', border: '1px solid #fcd34d'
                  }}>
                    <FaExclamationTriangle style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{alert.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerDashboard;
