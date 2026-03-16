import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';

const SchedulerExport = () => {
  const [schedule, setSchedule] = useState([]);
  const [scheduleDate, setScheduleDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch schedule data from backend
    const fetchSchedule = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/duties/generate-linked', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        if (data.success && data.data) {
          setSchedule(data.data.assignments || []);
          setScheduleDate(data.data.date || null);
        } else {
          alert('❌ Failed to fetch schedule');
          setSchedule([]);
          setScheduleDate(null);
        }
      } catch (err) {
        console.error('Error fetching schedule:', err);
        alert('🚨 Backend error');
        setSchedule([]);
        setScheduleDate(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const handleExport = () => {
    const headers = ['Route', 'Bus', 'Driver', 'Conductor', 'Shift', 'Time'];
    const rows = schedule.map(item =>
      [item.route, item.bus, item.driver, item.conductor, item.shift, item.time]
    );
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = scheduleDate ? `linked_schedule_${scheduleDate}.csv` : `linked_schedule_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h4 className="mb-4 fw-bold">Export Linked Duty Schedule</h4>

      {scheduleDate && (
        <p><strong>Schedule Date:</strong> {scheduleDate}</p>
      )}

      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
          <div>Loading schedule...</div>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-light">
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
              {schedule.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-muted text-center">No schedule found.</td>
                </tr>
              ) : (
                schedule.map((entry, idx) => (
                  <tr key={`${entry.route}-${entry.bus}-${idx}`}>
                    <td>{entry.route}</td>
                    <td>{entry.bus}</td>
                    <td>{entry.driver}</td>
                    <td>{entry.conductor}</td>
                    <td>{entry.shift}</td>
                    <td>{entry.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-end">
            <Button variant="success" onClick={handleExport} disabled={schedule.length === 0}>
              ⬇️ Export as CSV
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default SchedulerExport;
