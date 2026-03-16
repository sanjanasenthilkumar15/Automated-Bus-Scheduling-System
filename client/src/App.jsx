import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Admin from './pages/Admin/Admin.jsx';
import UsersPage from './pages/Admin/UsersPage.jsx';
import Login from './pages/Login.jsx';
import Scheduler from './pages/Scheduler.jsx';
import DepotManager from './pages/DepotManager.jsx';
import BusesPage from './pages/BusesPage.jsx';
import CrewsPage from './pages/CrewsPage.jsx';
import RoutePages from './pages/RoutePages.jsx';


function App() {
  return (
    <Routes>
      {/* Redirect base path to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Login Page */}
      <Route path="/login" element={<Login />} />

      {/* Admin Panel */}
      <Route path="/dashboard/admin" element={<Admin />} />
      <Route path="/admin/users" element={<UsersPage />} />

      {/* Scheduler Panel */}
      <Route path="/dashboard/scheduler" element={<Scheduler />} />

      {/* Depot Manager Dashboard + Routes */}
      <Route path="/dashboard/depotManager" element={<DepotManager />} />
      <Route path="/depot/buses" element={<BusesPage />} />
      <Route path="/depot/crews" element={<CrewsPage />} />
<Route path="/depot/routes" element={<RoutePages/>} />

    </Routes>
  );
}

export default App;
