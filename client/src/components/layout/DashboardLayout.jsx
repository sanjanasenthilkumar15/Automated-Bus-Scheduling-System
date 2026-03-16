import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = ({ children, title, subtitle, sidebarLinks }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="app-shell">
            <Sidebar
                links={sidebarLinks}
                collapsed={collapsed}
                onToggle={() => setCollapsed(c => !c)}
            />
            <main className={`main-content${collapsed ? ' sidebar-collapsed' : ''}`}>
                <Topbar title={title} subtitle={subtitle} />
                <div className="page-content fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
