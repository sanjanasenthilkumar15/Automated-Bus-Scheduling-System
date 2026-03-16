import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import { SearchBar, StatusBadge, EmptyState, ConfirmDialog } from '../components/ui/SharedComponents';

const DEPOT_SIDEBAR = [
  { to: '/dashboard/depotManager', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
  { to: '/depot/buses', icon: 'bi-bus-front-fill', label: 'Buses' },
  { to: '/depot/crews', icon: 'bi-person-badge-fill', label: 'Crews', end: true },
  { to: '/depot/routes', icon: 'bi-signpost-split-fill', label: 'Routes' },
  { to: '/dashboard/scheduler', icon: 'bi-calendar3', label: 'Scheduler' },
];

const CrewsPage = () => {
  const [crews, setCrews] = useState([]);
  const [newCrew, setNewCrew] = useState({ name: '', role: '', status: 'available' });
  const [search, setSearch] = useState('');
  const [TICK, setTICK] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [view, setView] = useState('table');

  useEffect(() => { fetchCrews(); }, []);
  useEffect(() => {
    const interval = setInterval(() => { setTICK(prev => prev + 1); }, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchCrews = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/crews');
      setCrews(Array.isArray(res.data) ? res.data : []);
    } catch (err) { console.error('Error fetching crews:', err); setCrews([]); }
    finally { setLoading(false); }
  };

  const handleInputChange = (e) => setNewCrew({ ...newCrew, [e.target.name]: e.target.value });

  const handleAddCrew = async () => {
    try {
      await axios.post('http://localhost:5000/api/crews', newCrew);
      setNewCrew({ name: '', role: '', status: 'available' });
      fetchCrews();
    } catch (err) { console.error('Error adding crew:', err); }
  };

  const handleDeleteCrew = async (id) => {
    try { await axios.delete(`http://localhost:5000/api/crews/${id}`); fetchCrews(); }
    catch (err) { console.error('Error deleting crew:', err); }
    finally { setConfirmDelete(null); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = await axios.put(`http://localhost:5000/api/crews/${id}`, { status });
      if (status === 'available' && updated.data.lastAssignedTime) {
        const restMinutes = calculateRestTime(updated.data.lastAssignedTime).minutes;
        if (restMinutes < 30) alert('⚠️ Rest period is under 30 minutes!');
      }
      fetchCrews();
    } catch (err) { console.error('Error updating status:', err); }
  };

  const calculateRestTime = (lastAssignedTime) => {
    if (!lastAssignedTime) return { minutes: 0, text: '0m', percent: 0 };
    const now = new Date();
    const last = new Date(lastAssignedTime);
    const diffMs = now - last;
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const percent = Math.min(100, (totalMinutes / 60) * 100);
    return { minutes: totalMinutes, text: `${hours}h ${minutes}m`, percent };
  };

  const filteredCrews = crews.filter(crew =>
    crew.name.toLowerCase().includes(search.toLowerCase()) ||
    crew.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportCSV = () => {
    const csv = [['Name', 'Role', 'Status', 'Last Assigned Time'], ...crews.map(c => [c.name, c.role, c.status, c.lastAssignedTime || 'N/A'])]
      .map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = 'crew_list.csv';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const availableCount = crews.filter(c => c.status === 'available').length;
  const onDutyCount = crews.filter(c => c.status === 'onDuty').length;
  const restingCount = crews.filter(c => c.status === 'resting').length;

  return (
    <DashboardLayout title="Crew Management" subtitle={`${crews.length} members`} sidebarLinks={DEPOT_SIDEBAR}>
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Crew Member"
        message="Are you sure you want to delete this crew member? This action cannot be undone."
        onConfirm={() => handleDeleteCrew(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        type="danger"
      />

      {/* Summary Badges */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--success-light)', color: 'var(--success)', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600 }}>
          <i className="bi bi-check-circle" style={{ marginRight: 6 }}></i>Available: {availableCount}
        </div>
        <div style={{ background: 'var(--info-light)', color: 'var(--info)', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600 }}>
          <i className="bi bi-clock" style={{ marginRight: 6 }}></i>On Duty: {onDutyCount}
        </div>
        <div style={{ background: 'var(--warning-light)', color: 'var(--warning)', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontSize: 13, fontWeight: 600 }}>
          <i className="bi bi-moon-stars" style={{ marginRight: 6 }}></i>Resting: {restingCount}
        </div>
      </div>

      {/* Add Crew Form */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header-custom">
          <h3><i className="bi bi-person-plus" style={{ marginRight: 8, color: 'var(--primary)' }}></i>Add Crew Member</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
              <label className="label-custom">Name</label>
              <input className="input-custom" name="name" placeholder="Enter crew name" value={newCrew.name} onChange={handleInputChange} />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: 180, marginBottom: 0 }}>
              <label className="label-custom">Role</label>
              <select className="select-custom" name="role" value={newCrew.role} onChange={handleInputChange}>
                <option value="">Select Role</option>
                <option value="driver">Driver</option>
                <option value="conductor">Conductor</option>
              </select>
            </div>
            <button className="btn-primary-custom" disabled={!newCrew.name || !newCrew.role} onClick={handleAddCrew}>
              <i className="bi bi-plus-lg"></i> Add Crew
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search crew by name or role..." />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary-custom" onClick={handleExportCSV}>
            <i className="bi bi-download"></i> Export CSV
          </button>
        </div>
      </div>

      {/* Crew Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 20 }}>
              {[1, 2, 3].map(i => <div key={i} className="skeleton skeleton-row" style={{ marginBottom: 8 }}></div>)}
            </div>
          ) : filteredCrews.length === 0 ? (
            <EmptyState icon="bi-person-x" title="No crew data found" description="Add crew members or adjust your search." />
          ) : (
            <table className="table-custom">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Rest Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCrews.map((crew, index) => {
                  const rest = calculateRestTime(crew.lastAssignedTime);
                  return (
                    <tr key={crew._id}>
                      <td style={{ color: 'var(--gray-400)' }}>{index + 1}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="crew-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                            {crew.name.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600 }}>{crew.name}</span>
                        </div>
                      </td>
                      <td style={{ textTransform: 'capitalize' }}>{crew.role}</td>
                      <td>
                        <select className="select-custom" style={{ width: 'auto', fontSize: 12, padding: '4px 28px 4px 8px' }}
                          value={crew.status} onChange={e => handleStatusChange(crew._id, e.target.value)}>
                          <option value="available">Available</option>
                          <option value="resting">Resting</option>
                          <option value="onDuty">On Duty</option>
                        </select>
                      </td>
                      <td>
                        {crew.status === 'resting' ? (
                          <div style={{ minWidth: 120 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                              <span style={{ color: rest.minutes < 30 ? 'var(--danger)' : 'var(--warning)', fontWeight: 600 }}>
                                {rest.text} {rest.minutes < 30 ? '(Insufficient)' : ''}
                              </span>
                            </div>
                            <div className="progress-bar-wrap">
                              <div className={`progress-bar-fill ${rest.minutes < 30 ? 'red' : rest.minutes < 60 ? 'amber' : 'green'}`}
                                style={{ width: `${rest.percent}%` }}></div>
                            </div>
                          </div>
                        ) : <span style={{ color: 'var(--gray-400)' }}>—</span>}
                      </td>
                      <td>
                        <button className="btn-danger-custom" style={{ padding: '5px 10px', fontSize: 12 }}
                          onClick={() => setConfirmDelete(crew._id)}>
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CrewsPage;
