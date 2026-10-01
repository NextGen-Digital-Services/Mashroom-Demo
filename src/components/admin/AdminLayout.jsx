import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ToastContainer } from '../common/ToastContainer';

export const AdminLayout = () => {
  const { adminAuth } = useStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
  const lower = status ? status.toLowerCase() : 'pending';
  return <span className={`status-pill ${lower}`}>{status}</span>;
};
