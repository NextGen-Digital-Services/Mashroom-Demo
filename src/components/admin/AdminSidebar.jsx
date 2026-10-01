import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Boxes,
  Tag,
  Star,
  FileText,
  Mail,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AdminSidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { config, logoutAdmin } = useStore();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { label: 'Coupons & Offers', path: '/admin/coupons', icon: Tag },
    { label: 'Reviews', path: '/admin/reviews', icon: Star },
    { label: 'CMS & Content', path: '/admin/content', icon: FileText },
    { label: 'Messages & Subs', path: '/admin/messages', icon: Mail },
    { label: 'Shipping & Tax', path: '/admin/shipping-tax', icon: Truck },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        {!collapsed && (
          <span className="admin-sidebar-brand">{config.name} Admin</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: 'var(--gold)', cursor: 'pointer', padding: '4px' }}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="admin-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '16px', borderTop: '1px solid rgba(220, 207, 180, 0.15)' }}>
        <button
          onClick={logoutAdmin}
          className="admin-nav-item"
          style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--terracotta)' }}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Exit Portal</span>}
        </button>
      </div>
    </aside>
  );
};
