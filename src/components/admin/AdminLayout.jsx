import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ToastContainer } from '../common/ToastContainer';
import { statusSlug } from '../../utils/formatters';

export const AdminLayout = () => {
  const { adminAuth, authReady } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Wait for session restore before deciding (avoids bouncing a
  // signed-in admin to the login page on refresh)
  if (!authReady) {
    return (
      <div className="admin-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#888' }}>
          <div className="admin-spinner" style={{ margin: '0 auto 12px' }} />
          Restoring admin session…
        </div>
      </div>
    );
  }

  // Protected Route Check for Admin
  if (!adminAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-wrapper">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="admin-main">
        <AdminHeader setMobileOpen={setMobileOpen} />
        <main className="admin-body">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  return <span className={`status-pill ${statusSlug(status)}`}>{status}</span>;
};
