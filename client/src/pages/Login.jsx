import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [district, setDistrict] = useState('Chennai');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('scheduler');
  const [depot, setDepot] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role,
          depot: role === 'depotManager' ? depot : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('district', district);
        if (role === 'depotManager') {
          localStorage.setItem('depot', depot);
        }
        navigate(`/dashboard/${data.role}`);
      } else {
        alert(data.message || 'Invalid login credentials');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
      console.error('Login error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-left-content">
          <h1>Automated Bus Scheduling &amp; Route Management</h1>
          <p>
            Streamline operations with intelligent scheduling, real-time crew management,
            and comprehensive route planning for seamless public transportation.
          </p>
          <div className="login-stats">
            <div className="login-stat">
              <span className="login-stat-value">500+</span>
              <span className="login-stat-label">Buses Managed</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-value">120+</span>
              <span className="login-stat-label">Active Routes</span>
            </div>
            <div className="login-stat">
              <span className="login-stat-value">1.2M</span>
              <span className="login-stat-label">Daily Passengers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-logo">
            <div className="login-logo-icon">
              <i className="bi bi-bus-front-fill" style={{ color: '#fff' }}></i>
            </div>
            <div className="login-logo-text">
              <h2>TN Transport</h2>
              <p>Government of Tamil Nadu</p>
            </div>
          </div>

          <h1>Welcome back</h1>
          <p>Sign in to your transport management dashboard</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label-custom">District</label>
              <select
                className="select-custom"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                required
              >
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Madurai">Madurai</option>
                <option value="Tiruchirapalli">Tiruchirapalli</option>
                <option value="Salem">Salem</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label-custom">Email</label>
              <input
                type="email"
                className="input-custom"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label-custom">Password</label>
              <input
                type="password"
                className="input-custom"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label-custom">Role</label>
              <select
                className="select-custom"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="admin">Admin</option>
                <option value="scheduler">Scheduler / Planner</option>
                <option value="depotManager">Depot Manager</option>
              </select>
            </div>

            {role === 'depotManager' && (
              <div className="form-group">
                <label className="label-custom">Depot</label>
                <select
                  className="select-custom"
                  value={depot}
                  onChange={(e) => setDepot(e.target.value)}
                  required
                >
                  <option value="">Select Depot</option>
                  <option value="Depot 1">Depot 1</option>
                  <option value="Depot 2">Depot 2</option>
                  <option value="Depot 3">Depot 3</option>
                </select>
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="bi bi-arrow-repeat" style={{ animation: 'logo-spin 1s linear infinite' }}></i>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
