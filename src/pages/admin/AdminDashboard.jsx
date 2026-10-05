import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { StatusBadge } from '../../components/admin/AdminLayout';
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const LOW_STOCK_THRESHOLD = 15;
const DAY_MS = 24 * 60 * 60 * 1000;

const dayKey = (d) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

export const AdminDashboard = () => {
  useDocumentTitle('Admin Dashboard Overview');
  const { orders, products, customers } = useStore();

  const activeOrders = orders.filter((o) => o.status !== 'Cancelled');
  const totalRevenue = activeOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrders = orders.length;
  const aov = activeOrders.length > 0 ? Math.round(totalRevenue / activeOrders.length) : 0;
  const lowStockProducts = products.filter((p) => (Number(p.stock) || 0) <= LOW_STOCK_THRESHOLD);

  // Distinct customers: storefront directory ∪ emails seen on orders
  const emailSet = new Set();
  customers.forEach((c) => {
    const email = (c.email || '').toLowerCase();
    if (email) emailSet.add(email);
  });
  orders.forEach((o) => {
    const email = (o.customer?.email || '').toLowerCase();
    if (email) emailSet.add(email);
  });
  const totalCustomers = emailSet.size;

  // Week-over-week revenue (last 7 days vs previous 7 days)
  const now = Date.now();
  const revenueBetween = (minAgeDays, maxAgeDays) =>
    activeOrders.reduce((sum, o) => {
      const ts = new Date(o.date).getTime();
      if (Number.isNaN(ts)) return sum;
      const age = now - ts;
      if (age >= minAgeDays * DAY_MS && age < maxAgeDays * DAY_MS) {
        return sum + (Number(o.total) || 0);
      }
      return sum;
    }, 0);
  const lastWeekRevenue = revenueBetween(0, 7);
  const prevWeekRevenue = revenueBetween(7, 14);
  const revenueDelta = prevWeekRevenue > 0 ? ((lastWeekRevenue - prevWeekRevenue) / prevWeekRevenue) * 100 : null;

  // Fulfilment health
  const fulfilledCount = activeOrders.filter((o) => o.status === 'Shipped' || o.status === 'Delivered').length;
  const fulfilledPct = activeOrders.length > 0 ? Math.round((fulfilledCount / activeOrders.length) * 100) : 0;

  // Basket depth
  const totalItems = activeOrders.reduce(
    (sum, o) => sum + (o.items || []).reduce((s, it) => s + (Number(it.quantity) || 0), 0),
    0
  );
  const avgItemsPerOrder = activeOrders.length > 0 ? totalItems / activeOrders.length : 0;

  // 7-day revenue series (zero-filled calendar buckets)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const buckets = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(startOfToday);
    d.setDate(d.getDate() - i);
    buckets.push({ date: d, key: dayKey(d), revenue: 0 });
  }
  const bucketIndex = {};
  buckets.forEach((b) => { bucketIndex[b.key] = b; });
  activeOrders.forEach((o) => {
    const d = new Date(o.date);
    if (Number.isNaN(d.getTime())) return;
    d.setHours(0, 0, 0, 0);
    const bucket = bucketIndex[dayKey(d)];
    if (bucket) bucket.revenue += Number(o.total) || 0;
  });
  const salesData = buckets.map((b) => ({
    name: b.date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    sales: b.revenue
  }));

  // Revenue per category (only categories that actually sold something)
  const shareByCategory = {};
  activeOrders.forEach((o) => {
    (o.items || []).forEach((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return;
      const category = product.category || 'Uncategorized';
      shareByCategory[category] = (shareByCategory[category] || 0)
        + (Number(item.price) || 0) * (Number(item.quantity) || 0);
    });
  });
  const categoryShare = Object.entries(shareByCategory)
    .filter(([, sales]) => sales > 0)
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Performance Dashboard</h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>Revenue, fulfilment and stock figures derived from your live order data — {totalCustomers} known customer{totalCustomers === 1 ? '' : 's'} on file.</p>
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
          <span style={{ fontSize: '0.75rem', color: revenueDelta !== null && revenueDelta >= 0 ? '#137333' : '#666', fontWeight: 600 }}>
            {revenueDelta === null
              ? '— vs previous week'
              : `${revenueDelta >= 0 ? '↑ +' : '↓ '}${revenueDelta.toFixed(1)}% from last week`}
          </span>
        </div>

        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Total Orders</span>
            <ShoppingBag size={18} color="var(--olive)" />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, margin: '8px 0 4px' }}>
            {totalOrders}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#666' }}>{fulfilledPct}% Fulfilled or Dispatched</span>
        </div>

        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Average Order Value</span>
            <TrendingUp size={18} color="var(--gold)" />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, margin: '8px 0 4px' }}>
            {formatCurrency(aov)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>{avgItemsPerOrder.toFixed(1)} items per order</span>
        </div>

        <div className="admin-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Low Stock Alerts</span>
            <AlertTriangle size={18} color="var(--terracotta)" />
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, margin: '8px 0 4px', color: lowStockProducts.length > 0 ? 'var(--terracotta)' : 'var(--olive)' }}>
            {lowStockProducts.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#666' }}>Products below {LOW_STOCK_THRESHOLD} units</span>
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
            {categoryShare.length === 0 ? (
              <p style={{ color: '#666', fontSize: '0.85rem', padding: '16px' }}>No category revenue yet — sales appear here once orders are placed.</p>
            ) : (
              <ResponsiveContainer>
                <BarChart data={categoryShare}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFE6D2" />
                  <XAxis dataKey="name" stroke="#666" fontSize={11} />
                  <YAxis stroke="#666" fontSize={11} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="sales" fill="#B38B3F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
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
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                    No orders yet — they will appear here as customers check out.
                  </td>
                </tr>
              )}
              {orders.slice(0, 4).map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: 700 }}><Link to={`/admin/orders/${ord.id}`}>{ord.id}</Link></td>
                  <td>{ord.customer?.name || '—'}</td>
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
