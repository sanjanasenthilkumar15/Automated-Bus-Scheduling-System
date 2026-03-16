import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ links, collapsed, onToggle, role }) => {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="bi bi-bus-front-fill" style={{ color: '#fff' }}></i>
        </div>
        <div className="sidebar-brand">
          TN Transport<br />
          <span style={{ fontSize: '10px', fontWeight: 400, opacity: 0.6 }}>Management System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <i className={`bi ${link.icon} sidebar-icon`}></i>
            <span className="sidebar-label">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="sidebar-toggle-btn" onClick={onToggle}>
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
