import React from 'react';

export const KpiCard = ({ icon, iconColor, label, value, trend, trendDir, accentColor }) => (
    <div className={`kpi-card ${accentColor || 'blue'}`}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className={`kpi-icon ${iconColor || 'blue'}`}>
                <i className={`bi ${icon}`}></i>
            </div>
            {trend && (
                <span className={`kpi-trend ${trendDir || ''}`}>
                    <i className={`bi ${trendDir === 'up' ? 'bi-arrow-up-right' : trendDir === 'down' ? 'bi-arrow-down-right' : 'bi-dash'}`}></i>
                    {trend}
                </span>
            )}
        </div>
        <div>
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
        </div>
    </div>
);

export const StatusBadge = ({ status }) => {
    const map = {
        active: 'badge-active',
        'In Service': 'badge-active',
        maintenance: 'badge-maintenance',
        'Under Maintenance': 'badge-maintenance',
        idle: 'badge-idle',
        Idle: 'badge-idle',
        scheduled: 'badge-scheduled',
        available: 'badge-available',
        Available: 'badge-available',
        onDuty: 'badge-onduty',
        'On Duty': 'badge-onduty',
        resting: 'badge-resting',
        Resting: 'badge-resting',
    };
    const cls = map[status] || 'badge-idle';
    const label = status === 'active' ? 'In Service'
        : status === 'maintenance' ? 'Maintenance'
            : status === 'onDuty' ? 'On Duty'
                : status.charAt(0).toUpperCase() + status.slice(1);
    return <span className={`badge-status ${cls}`}>{label}</span>;
};

export const SkeletonRow = ({ cols = 5 }) => (
    <tr>
        {Array.from({ length: cols }).map((_, i) => (
            <td key={i}><div className="skeleton skeleton-text" style={{ width: `${50 + Math.random() * 50}%` }}></div></td>
        ))}
    </tr>
);

export const SkeletonCard = () => (
    <div className="skeleton skeleton-card"></div>
);

export const EmptyState = ({ icon, title, description }) => (
    <div className="empty-state">
        <div className="empty-state-icon"><i className={`bi ${icon || 'bi-inbox'}`}></i></div>
        <h3>{title || 'No data found'}</h3>
        <p>{description || 'There is nothing to display here yet.'}</p>
    </div>
);

export const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, type = 'danger' }) => {
    if (!open) return null;
    const icons = { danger: 'bi-exclamation-triangle-fill', warning: 'bi-question-circle-fill', info: 'bi-info-circle-fill' };
    const colors = { danger: 'var(--danger)', warning: 'var(--warning)', info: 'var(--primary)' };
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-box confirm-dialog" onClick={e => e.stopPropagation()}>
                <div className="icon" style={{ color: colors[type] }}>
                    <i className={`bi ${icons[type]}`}></i>
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{title}</h2>
                <p>{message}</p>
                <div className="confirm-actions">
                    <button className="btn-secondary-custom" onClick={onCancel}>Cancel</button>
                    <button className={type === 'danger' ? 'btn-danger-custom' : 'btn-primary-custom'} onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export const SearchBar = ({ value, onChange, placeholder }) => (
    <div className="search-bar">
        <i className="bi bi-search search-bar-icon"></i>
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder || 'Search...'}
        />
    </div>
);

export const ViewToggle = ({ view, onViewChange }) => (
    <div className="view-toggle">
        <button
            className={`view-toggle-btn ${view === 'table' ? 'active' : ''}`}
            onClick={() => onViewChange('table')}
            title="Table view"
        >
            <i className="bi bi-list-ul"></i>
        </button>
        <button
            className={`view-toggle-btn ${view === 'cards' ? 'active' : ''}`}
            onClick={() => onViewChange('cards')}
            title="Card view"
        >
            <i className="bi bi-grid-3x3-gap-fill"></i>
        </button>
    </div>
);

export const TabNav = ({ tabs, active, onChange }) => (
    <div className="tab-nav">
        {tabs.map(tab => (
            <button
                key={tab.key}
                className={`tab-btn ${active === tab.key ? 'active' : ''}`}
                onClick={() => onChange(tab.key)}
            >
                {tab.icon && <i className={`bi ${tab.icon}`}></i>}
                {tab.label}
            </button>
        ))}
    </div>
);
