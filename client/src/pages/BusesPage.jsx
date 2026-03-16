import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { SearchBar, StatusBadge, ViewToggle, EmptyState, SkeletonCard, ConfirmDialog } from '../components/ui/SharedComponents';

const DEPOT_SIDEBAR = [
  { to: '/dashboard/depotManager', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
  { to: '/depot/buses', icon: 'bi-bus-front-fill', label: 'Buses', end: true },
  { to: '/depot/crews', icon: 'bi-person-badge-fill', label: 'Crews' },
  { to: '/depot/routes', icon: 'bi-signpost-split-fill', label: 'Routes' },
  { to: '/dashboard/scheduler', icon: 'bi-calendar3', label: 'Scheduler' },
];

const BusesPage = () => {
  const [buses, setBuses] = useState([]);
  const [editBusId, setEditBusId] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [detailBus, setDetailBus] = useState(null);
  const [sortBy, setSortBy] = useState('busNumber');
  const [sortDir, setSortDir] = useState('asc');

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/buses');
      setBuses(await res.json());
    } catch (err) { console.error('Failed to fetch buses:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBuses(); }, []);

  const handleEdit = (id, currentStatus) => { setEditBusId(id); setStatusUpdate(currentStatus); };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/buses/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusUpdate })
      });
      if (res.ok) { fetchBuses(); setEditBusId(null); }
      else { const errorText = await res.text(); console.error('Update failed:', res.status, errorText); alert('Failed to update bus.'); }
    } catch (err) { console.error('Update error:', err); }
  };

  const filtered = buses
    .filter(b => (statusFilter === 'all' || b.status === statusFilter) &&
      (search === '' || b.busNumber?.toLowerCase().includes(search.toLowerCase()) || b.depot?.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      const valA = (a[sortBy] || '').toString().toLowerCase();
      const valB = (b[sortBy] || '').toString().toLowerCase();
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

  const handleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('asc'); }
  };

  return (
    <DashboardLayout title="Bus Management" subtitle={`${buses.length} buses total`} sidebarLinks={DEPOT_SIDEBAR}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by bus number or depot..." />
          <select className="select-custom" style={{ width: 'auto', minWidth: 140 }}
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">In Service</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
        <ViewToggle view={view} onViewChange={setView} />
      </div>

      {loading ? (
        <div className="bus-grid">{[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="bi-bus-front" title="No buses found" description="Try adjusting your search or filter." />
      ) : view === 'cards' ? (
        /* Card View */
        <div className="bus-grid">
          {filtered.map(bus => (
            <div key={bus._id} className="bus-card" onClick={() => setDetailBus(bus)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="bus-num">{bus.busNumber}</div>
                  <div className="bus-depot"><i className="bi bi-building" style={{ marginRight: 4 }}></i>{bus.depot || 'N/A'}</div>
                </div>
                <StatusBadge status={bus.status} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                {editBusId === bus._id ? (
                  <>
                    <select className="select-custom" style={{ flex: 1, fontSize: 12 }}
                      value={statusUpdate} onChange={e => setStatusUpdate(e.target.value)}>
                      <option value="active">In Service</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                    <button className="btn-success-custom" style={{ padding: '6px 12px', fontSize: 12 }}
                      onClick={(e) => { e.stopPropagation(); handleSave(bus._id); }}>
                      <i className="bi bi-check-lg"></i>
                    </button>
                  </>
                ) : (
                  <button className="btn-secondary-custom" style={{ padding: '6px 12px', fontSize: 12, flex: 1 }}
                    onClick={(e) => { e.stopPropagation(); handleEdit(bus._id, bus.status); }}>
                    <i className="bi bi-pencil"></i> Edit Status
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <table className="table-custom">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>#</th>
                  <th onClick={() => handleSort('busNumber')} style={{ cursor: 'pointer' }}>
                    Bus Number {sortBy === 'busNumber' && <i className={`bi bi-chevron-${sortDir === 'asc' ? 'up' : 'down'}`}></i>}
                  </th>
                  <th>Status</th>
                  <th onClick={() => handleSort('depot')} style={{ cursor: 'pointer' }}>
                    Depot {sortBy === 'depot' && <i className={`bi bi-chevron-${sortDir === 'asc' ? 'up' : 'down'}`}></i>}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((bus, idx) => (
                  <tr key={bus._id} style={{ cursor: 'pointer' }} onClick={() => setDetailBus(bus)}>
                    <td style={{ color: 'var(--gray-400)' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 600 }}>{bus.busNumber}</td>
                    <td>
                      {editBusId === bus._id ? (
                        <select className="select-custom" style={{ width: 'auto', fontSize: 12, padding: '4px 28px 4px 8px' }}
                          value={statusUpdate} onChange={e => setStatusUpdate(e.target.value)} onClick={e => e.stopPropagation()}>
                          <option value="active">In Service</option>
                          <option value="maintenance">Maintenance</option>
                        </select>
                      ) : <StatusBadge status={bus.status} />}
                    </td>
                    <td>{bus.depot || 'N/A'}</td>
                    <td onClick={e => e.stopPropagation()}>
                      {editBusId === bus._id ? (
                        <button className="btn-success-custom" style={{ padding: '5px 10px', fontSize: 12 }}
                          onClick={() => handleSave(bus._id)}>
                          <i className="bi bi-check-lg"></i> Save
                        </button>
                      ) : (
                        <button className="btn-secondary-custom" style={{ padding: '5px 10px', fontSize: 12 }}
                          onClick={() => handleEdit(bus._id, bus.status)}>
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bus Detail Modal */}
      {detailBus && (
        <div className="modal-overlay" onClick={() => setDetailBus(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="bi bi-bus-front" style={{ marginRight: 10, color: 'var(--primary)' }}></i>Bus Details</h2>
              <button className="modal-close" onClick={() => setDetailBus(null)}><i className="bi bi-x-lg"></i></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 800 }}>{detailBus.busNumber}</h3>
                  <p style={{ color: 'var(--gray-500)', fontSize: 13, margin: 0 }}>{detailBus.depot || 'No depot assigned'}</p>
                </div>
                <StatusBadge status={detailBus.status} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: 'var(--gray-50)', padding: 14, borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 4 }}>Type</div>
                  <div style={{ fontWeight: 600 }}>{detailBus.type || 'Standard'}</div>
                </div>
                <div style={{ background: 'var(--gray-50)', padding: 14, borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 4 }}>Capacity</div>
                  <div style={{ fontWeight: 600 }}>{detailBus.capacity || '50'} seats</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BusesPage;
