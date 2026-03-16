import React, { useEffect, useRef, useState } from 'react';
import { SearchBar, EmptyState } from '../../components/ui/SharedComponents';

function downloadCSV(data, filename = 'data.csv') {
  if (!data || !data.length) return;
  const keys = Object.keys(data[0]);
  const csvContent = keys.join(',') + '\n' + data.map(row => keys.map(k => `"${(row[k] ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.setAttribute('download', filename);
  document.body.appendChild(link); link.click();
  document.body.removeChild(link); window.URL.revokeObjectURL(url);
}

const demoLogs = [
  { timestamp: '2025-06-25 09:15', user: 'scheduler@dtc.com', action: 'Generated Schedule for Route 105', status: 'Success' },
  { timestamp: '2025-06-25 09:05', user: 'admin@dtc.com', action: 'Deleted User: depot@dtc.com', status: 'Warning' },
  { timestamp: '2025-06-25 08:45', user: 'depot@dtc.com', action: 'Updated Bus TN-04-AB-5678 status', status: 'Success' },
  { timestamp: '2025-06-25 08:30', user: 'scheduler@dtc.com', action: 'Assigned crew to Route 27D', status: 'Success' },
];

const Logs = () => {
  const [logs, setLogs] = useState(demoLogs);
  const [query, setQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => { setLogs(demoLogs); }, 5000);
    } else { clearInterval(intervalRef.current); }
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh]);

  const filtered = logs.filter(l =>
    l.user.toLowerCase().includes(query.toLowerCase()) ||
    l.action.toLowerCase().includes(query.toLowerCase()) ||
    l.status.toLowerCase().includes(query.toLowerCase()) ||
    l.timestamp.includes(query)
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <SearchBar value={query} onChange={setQuery} placeholder="Search logs..." />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gray-600)', cursor: 'pointer' }}>
          <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)}
            style={{ accentColor: 'var(--primary)' }} />
          Auto-Refresh
        </label>
        <button className="btn-secondary-custom" disabled={filtered.length === 0}
          onClick={() => downloadCSV(filtered, 'logs.csv')}>
          <i className="bi bi-download"></i> Export CSV
        </button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {filtered.length === 0 ? (
            <EmptyState icon="bi-journal-x" title="No logs found" description="Try adjusting your search query." />
          ) : (
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, idx) => (
                  <tr key={idx}>
                    <td style={{ color: 'var(--gray-500)', fontSize: 12, whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                    <td style={{ fontWeight: 500 }}>{log.user}</td>
                    <td>{log.action}</td>
                    <td>
                      {log.status === 'Success' ? (
                        <span className="badge-status badge-active">Success</span>
                      ) : log.status === 'Warning' ? (
                        <span className="badge-status badge-scheduled">Warning</span>
                      ) : (
                        <span className="badge-status badge-idle">{log.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logs;
