import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/admin/AdminLayout';
import { DollarSign, ShoppingBag, Users, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const AdminDashboard = () => {
  useDocumentTitle('Admin Dashboard Overview');
  const { orders, products, customers } = useStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const lowStockProducts = products.filter(p => p.stock <= 15);

  const salesData = [
    { name: 'Sep 25', sales: 4200 },
    { name: 'Sep 26', sales: 6800 },
    { name: 'Sep 27', sales: 5100 },
    { name: 'Sep 28', sales: 9400 },
    { name: 'Sep 29', sales: 11200 },
    { name: 'Sep 30', sales: 8300 },
    { name: 'Oct 01', sales: 14500 }
  ];

  const categoryShare = [
    { name: 'Powders', sales: 24500 },
    { name: 'Pickles', sales: 18200 },
    { name: 'Grow Kits', sales: 14900 },
    { name: 'Dried Fungi', sales: 19800 }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Estate Performance Dashboard</h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>Real-time telemetry on revenue, fulfillment, and product stock levels.</p>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Total Revenue</span>
            <DollarSign size={18} color="var(--olive)" />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, margin: '8px 0 4px', color: 'var(--olive-deep)' }}>
            {formatCurrency(totalRevenue)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#137333', fontWeight: 600 }}>↑ +18.4% from last week</span>
        </div>

        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Total Orders</span>
            <ShoppingBag size={18} color="var(--olive)" />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, margin: '8px 0 4px' }}>
            {totalOrders}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#666' }}>100% Fulfilled or Dispatched</span>
        </div>

        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Average Order Value</span>
            <TrendingUp size={18} color="var(--gold)" />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, margin: '8px 0 4px' }}>
            {formatCurrency(aov)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#137333', fontWeight: 600 }}>↑ Premium tier basket</span>
        </div>

        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Low Stock Alerts</span>
            <AlertTriangle size={18} color="var(--terracotta)" />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, margin: '8px 0 4px', color: lowStockProducts.length > 0 ? 'var(--terracotta)' : 'var(--olive)' }}>
            {lowStockProducts.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#666' }}>Products below 15 units</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '28px' }} className="charts-grid">
        
        {/* Sales Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Revenue Growth Trajectory (₹)</h3>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>Past 7 Days</span>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE6D2" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area type="monotone" dataKey="sales" stroke="#4B5A34" fill="#4B5A34" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Category Revenue</h3>
          </div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={categoryShare}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE6D2" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="sales" fill="#B38B3F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Orders & Low Stock Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }} className="tables-grid">
        
        {/* Recent Orders */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Recent Customer Orders</h3>
            <Link to="/admin/orders" style={{ fontSize: '0.8rem', color: 'var(--olive)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: 700 }}><Link to={`/admin/orders/${ord.id}`}>{ord.id}</Link></td>
                  <td>{ord.customer.name}</td>
                  <td style={{ fontWeight: 700, color: 'var(--olive-deep)' }}>{formatCurrency(ord.total)}</td>
                  <td><StatusBadge status={ord.status} /></td>
                  <td style={{ fontSize: '0.8rem', color: '#777' }}>{formatDate(ord.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Low Stock Alerts Box */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Stock Replenishment Alert</h3>
          </div>

          {lowStockProducts.length === 0 ? (
            <p style={{ color: '#666', fontSize: '0.85rem' }}>All product inventory levels are healthy.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lowStockProducts.map((p) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--parchment)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#777' }}>SKU: {p.sku}</div>
                  </div>
                  <span style={{ background: 'var(--terracotta)', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {p.stock} units
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .charts-grid, .tables-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
