import React, { useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

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

const dataSample = [
  { date: '2025-07-01', buses: 105, crew: 200 },
  { date: '2025-07-02', buses: 108, crew: 210 },
  { date: '2025-07-03', buses: 102, crew: 180 },
  { date: '2025-07-04', buses: 110, crew: 220 },
  { date: '2025-07-05', buses: 107, crew: 195 },
];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, font: { size: 12, family: 'Inter' } } } },
  scales: { x: { grid: { display: false }, ticks: { font: { size: 11, family: 'Inter' } } }, y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11, family: 'Inter' } } } },
};

const Reports = () => {
  const [filters, setFilters] = useState({ from: '', to: '' });
  const [genData, setGenData] = useState(dataSample);

  const handleGenerate = () => {
    alert('Report generated!');
    setGenData(dataSample.filter(r => (!filters.from || r.date >= filters.from) && (!filters.to || r.date <= filters.to)));
  };

  const busUtilData = {
    labels: genData.map(d => d.date),
    datasets: [{
      label: 'Buses Active',
      data: genData.map(d => d.buses),
      backgroundColor: 'rgba(26, 79, 214, 0.15)',
      borderColor: '#1a4fd6',
      borderWidth: 2, borderRadius: 6, fill: true
    }]
  };

  const crewWorkloadData = {
    labels: genData.map(d => d.date),
    datasets: [{
      label: 'Crew On Duty',
      data: genData.map(d => d.crew),
      borderColor: '#0e9f6e',
      backgroundColor: 'rgba(14, 159, 110, 0.1)',
      borderWidth: 2, pointRadius: 4, pointBackgroundColor: '#0e9f6e',
      fill: true, tension: 0.4
    }]
  };

  const routePerfData = {
    labels: ['Route 15G', 'Route 27D', 'Route 570', 'Route 29C', 'Route 102A'],
    datasets: [{
      label: 'Performance Score',
      data: [92, 85, 78, 88, 95],
      backgroundColor: ['#1a4fd6', '#0e9f6e', '#d97706', '#6366f1', '#e02424'],
      borderWidth: 0
    }]
  };

  return (
    <div>
      {/* Filters */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label-custom">From Date</label>
              <input type="date" className="input-custom" value={filters.from}
                onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label-custom">To Date</label>
              <input type="date" className="input-custom" value={filters.to}
                onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} />
            </div>
            <button className="btn-primary-custom" onClick={handleGenerate}>
              <i className="bi bi-file-earmark-bar-graph"></i> Generate
            </button>
            <button className="btn-secondary-custom" disabled={!genData.length}
              onClick={() => downloadCSV(genData, 'bus_crew_report.csv')}>
              <i className="bi bi-download"></i> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="chart-container">
          <div className="chart-title">
            <span><i className="bi bi-bus-front" style={{ marginRight: 8, color: 'var(--primary)' }}></i>Bus Utilization</span>
          </div>
          <div style={{ height: 260 }}>
            <Bar data={busUtilData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-container">
          <div className="chart-title">
            <span><i className="bi bi-people" style={{ marginRight: 8, color: 'var(--success)' }}></i>Crew Workload</span>
          </div>
          <div style={{ height: 260 }}>
            <Line data={crewWorkloadData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
        <div className="chart-container">
          <div className="chart-title">
            <span><i className="bi bi-signpost-split" style={{ marginRight: 8, color: 'var(--warning)' }}></i>Route Performance</span>
          </div>
          <div style={{ height: 260, maxWidth: 400, margin: '0 auto' }}>
            <Doughnut data={routePerfData} options={{ ...chartOptions, scales: undefined }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
