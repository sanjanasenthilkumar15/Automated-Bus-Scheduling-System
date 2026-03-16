import React, { useState } from 'react';
import { FaTools } from 'react-icons/fa';

const SchedulerAssign = () => {
  const [assignments, setAssignments] = useState([]);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hour12.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
  };

  const generateSchedule = () => {
    const dummyData = [
      { id: 1, route: '18A', bus: 'TN-01-A-1234', driver: 'Arun', conductor: 'Ravi', timeInMinutes: 360 }, // 6:00 AM
      { id: 2, route: '21C', bus: 'TN-01-B-4567', driver: 'Vijay', conductor: 'Kumar', timeInMinutes: 480 }, // 8:00 AM
      { id: 3, route: '12B', bus: 'TN-01-C-7890', driver: 'Sathish', conductor: 'Mani', timeInMinutes: 600 }  // 10:00 AM
    ];
    setAssignments(dummyData);
  };

  return (
    <div className="container-fluid bg-white p-4 min-vh-100">
      <div className="row">
        <div className="col-12">
          <div className="border rounded p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-primary fw-bold mb-0">Linked Duty Assignment</h5>
              <button className="btn btn-success d-flex align-items-center" onClick={generateSchedule}>
                <FaTools className="me-2" /> Generate Schedule
              </button>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Route</th>
                    <th>Bus</th>
                    <th>Driver</th>
                    <th>Conductor</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-muted">No schedule generated yet.</td>
                    </tr>
                  ) : (
                    assignments.map((item) => (
                      <tr key={item.id}>
                        <td>{item.route}</td>
                        <td>{item.bus}</td>
                        <td>{item.driver}</td>
                        <td>{item.conductor}</td>
                        <td>{formatTime(item.timeInMinutes)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerAssign;
