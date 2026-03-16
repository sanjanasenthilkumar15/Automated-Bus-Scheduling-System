import React, { useState, useEffect } from 'react';
import { FaTools, FaCalendarDay, FaSave, FaCheckCircle } from 'react-icons/fa';

const SchedulerAssign = () => {
  const [assignments, setAssignments] = useState([]);
  const [scheduleDate, setScheduleDate] = useState(new Date().toISOString().split('T')[0]); // default to today
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch saved schedule for selected date
  const fetchSavedSchedule = async (date) => {
    try {
      const res = await fetch(`http://localhost:5000/api/duties/schedule?date=${date}`);
      const data = await res.json();
      if (data.success && data.data) {
        setAssignments(data.data.assignments);
        setSaved(true);
      } else {
        setAssignments([]);
        setSaved(false);
      }
    } catch (err) {
      console.error('Failed to fetch saved schedule:', err);
      setAssignments([]);
      setSaved(false);
    }
  };

  // Load saved schedule whenever scheduleDate changes
  useEffect(() => {
    if (scheduleDate) {
      fetchSavedSchedule(scheduleDate);
    }
  }, [scheduleDate]);

  // Generate schedule
  const generateSchedule = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch('http://localhost:5000/api/duties/generate-linked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setAssignments(data.data.assignments || []);
        if (data.data.date) setScheduleDate(data.data.date);
      } else {
        alert('❌ Failed to generate schedule');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      alert('🚨 Backend connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Save schedule
  const saveSchedule = async () => {
    if (!scheduleDate || assignments.length === 0) return;

    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/duties/save-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: scheduleDate, assignments }),
      });
      const result = await res.json();

      if (result.success) {
        setSaved(true);
        alert('✅ Schedule saved successfully!');
      } else {
        alert('❌ Failed to save schedule');
      }
    } catch (err) {
      console.error('Save Error:', err);
      alert('🚨 Error saving schedule');
    } finally {
      setSaving(false);
    }
  };

  // Clear schedule
  const clearTable = () => {
    setAssignments([]);
    setScheduleDate(null);
    setSaved(false);
  };

  return (
    <div className="container-fluid bg-light py-4 min-vh-100">
      <div className="row">
        <div className="col-12">
          <div className="border rounded p-4 shadow-sm bg-white">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
              <h4 className="text-primary fw-bold mb-0">Linked Duty Assignment</h4>
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-success d-flex align-items-center"
                  onClick={generateSchedule}
                  disabled={loading}
                >
                  <FaTools className="me-2" />
                  {loading ? 'Generating...' : 'Generate Schedule'}
                </button>

                <button
                  className="btn btn-outline-secondary"
                  onClick={clearTable}
                  disabled={loading || assignments.length === 0}
                >
                  Clear Table
                </button>

                <button
                  className="btn btn-outline-info d-flex align-items-center"
                  disabled={!scheduleDate}
                >
                  <FaCalendarDay className="me-2" />
                  {scheduleDate ? `Schedule Date: ${scheduleDate}` : 'No Date'}
                </button>

                <button
                  className="btn btn-primary d-flex align-items-center"
                  onClick={saveSchedule}
                  disabled={!scheduleDate || assignments.length === 0 || saving || saved}
                  title={
                    !scheduleDate
                      ? 'No schedule date'
                      : assignments.length === 0
                      ? 'Nothing to save'
                      : saved
                      ? 'Schedule already saved'
                      : 'Save schedule'
                  }
                >
                  <FaSave className="me-2" />
                  {saving
                    ? 'Saving...'
                    : saved
                    ? (
                      <>
                        <FaCheckCircle className="me-2 text-success" />
                        Saved
                      </>
                    )
                    : (
                      'Save Schedule'
                    )}
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-striped text-center align-middle w-100">
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
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-muted">No schedule generated yet.</td>
                    </tr>
                  ) : (
                    assignments.map((item, idx) => (
                      <tr key={`${item.route}-${item.bus}-${idx}`}>
                        <td>{item.route}</td>
                        <td>{item.bus}</td>
                        <td>{item.driver}</td>
                        <td>{item.conductor}</td>
                        <td>{item.shift}</td>
                        <td>{item.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {scheduleDate && (
              <p className="mt-3 text-muted">
                📅 This schedule is allocated for <strong>{scheduleDate}</strong>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerAssign;
