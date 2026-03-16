import React, { useMemo } from 'react';

const Topbar = ({ title, subtitle }) => {
    const district = useMemo(() => localStorage.getItem('district') || 'Chennai', []);
    const role = useMemo(() => localStorage.getItem('role') || 'admin', []);

    const initials = role === 'admin' ? 'AD' : role === 'scheduler' ? 'SC' : 'DM';

    return (
        <header className="topbar">
            <div className="topbar-title">
                {title}
                {subtitle && <span style={{ fontWeight: 400, color: 'var(--gray-400)', fontSize: '13px', marginLeft: 8 }}>{subtitle}</span>}
            </div>

            <div className="topbar-actions">
                <span className="topbar-badge">
                    <i className="bi bi-geo-alt-fill" style={{ marginRight: 4 }}></i>
                    {district} District
                </span>

                <button className="topbar-icon-btn" title="Refresh">
                    <i className="bi bi-arrow-clockwise"></i>
                </button>

                <button className="topbar-icon-btn" title="Notifications">
                    <i className="bi bi-bell"></i>
                    <span className="topbar-notif-badge"></span>
                </button>

                <div className="topbar-avatar" title={`${role} - ${district}`}>
                    {initials}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
