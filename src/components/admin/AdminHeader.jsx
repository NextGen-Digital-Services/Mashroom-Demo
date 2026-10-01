import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Menu, Search, Bell, ExternalLink, User } from 'lucide-react';

export const AdminHeader = ({ setMobileOpen }) => {
  const { adminAuth, messages, orders } = useStore();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadMessages = messages.filter(m => !m.read).length;
  const pendingOrders = orders.filter(o => o.status === 'Placed' || o.status === 'Confirmed').length;

  const currentPath = location.pathname.split('/').pop() || 'dashboard';

  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setMobileOpen(true)}
          style={{ display: 'none', cursor: 'pointer' }}
          className="admin-hamburger"
        >
          <Menu size={22} color="var(--espresso)" />
        </button>

        <div style={{ textTransform: 'capitalize', fontSize: '0.9rem', color: '#666', fontWeight: 600 }}>
          Admin / <span style={{ color: 'var(--espresso)' }}>{currentPath}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        
        {/* Storefront Link */}
        <Link
          to="/"
          target="_blank"
          style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--olive)', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          Live Storefront <ExternalLink size={14} />
        </Link>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: 'relative', cursor: 'pointer', padding: '6px' }}
          >
            <Bell size={20} color="var(--espresso)" />
            {(unreadMessages > 0 || pendingOrders > 0) && (
              <span style={{ position: 'absolute', top: 2, right: 2, background: 'var(--terracotta)', color: '#fff', fontSize: '0.65rem', borderRadius: '50%', width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {unreadMessages + pendingOrders}
              </span>
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                width: '280px',
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                padding: '16px',
                zIndex: 1000
              }}
            >
              <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '10px' }}>Notifications</h5>
              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/admin/orders" onClick={() => setShowNotifications(false)} style={{ color: 'var(--olive)' }}>
                  📦 {pendingOrders} orders requiring fulfillment
                </Link>
                <Link to="/admin/messages" onClick={() => setShowNotifications(false)} style={{ color: 'var(--olive)' }}>
                  ✉️ {unreadMessages} unread customer inquiries
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'var(--olive)', color: 'var(--white)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
            A
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{adminAuth?.name || 'Administrator'}</span>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-hamburger { display: block !important; }
        }
      `}</style>
    </header>
  );
};
