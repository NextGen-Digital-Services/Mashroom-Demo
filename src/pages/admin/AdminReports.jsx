import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Download, BarChart2, PackageOpen } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const LOW_STOCK_THRESHOLD = 15;

const RANGES = [
  { label: 'All time', days: null },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 }
];

const csvEscape = (value) => `"${String(value === null || value === undefined ? '' : value).replace(/"/g, '""')}"`;

const downloadCSV = (rows, filename) => {
  const body = rows.map((row) => row.map(csvEscape).join(',')).join('\n');
  const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(body);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const AdminReports = () => {
  useDocumentTitle('Sales & Performance Reports');
  const { orders, products, addToast } = useStore();
  const [rangeDays, setRangeDays] = useState(null);

  const rangeLabel = RANGES.find((r) => r.days === rangeDays)?.label || 'All time';

  const rangeOrders = rangeDays === null
    ? orders
    : orders.filter((o) => {
        const ts = new Date(o.date).getTime();
        if (Number.isNaN(ts)) return false;
        return ts >= Date.now() - rangeDays * 24 * 60 * 60 * 1000;
      });

  const saleOrders = rangeOrders.filter((o) => o.status !== 'Cancelled');

  const totalRevenue = saleOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalUnits = saleOrders.reduce(
    (sum, o) => sum + (o.items || []).reduce((s, it) => s + (Number(it.quantity) || 0), 0),
    0
  );
  const aov = saleOrders.length > 0 ? Math.round(totalRevenue / saleOrders.length) : 0;

  // Per-product performance across the selected range (cancelled orders excluded)
  const performance = products.map((p) => {
    let units = 0;
    let revenue = 0;
    saleOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        if (item.id === p.id) {
          units += Number(item.quantity) || 0;
          revenue += (Number(item.price) || 0) * (Number(item.quantity) || 0);
        }
      });
    });
    return { ...p, units, revenue };
  }).sort((a, b) => b.revenue - a.revenue);

  const exportSalesCSV = () => {
    if (rangeOrders.length === 0) {
      addToast('No orders in the selected date range', 'error');
      return;
    }
    downloadCSV(
      [
        ['Order ID', 'Date', 'Customer', 'Total', 'Status', 'Payment'],
        ...rangeOrders.map((o) => [
          o.id,
          o.date,
          o.customer?.name || '',
          o.total,
          o.status,
          o.paymentMethod || ''
        ])
      ],
      'sales_report.csv'
    );
    addToast(`Sales CSV report downloaded (${rangeLabel})`);
  };

  return (
    <div>
      <div className="admin-card-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Sales & Product Analytics</h1>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>Export raw transaction logs and review item velocities.</p>
        </div>

        <Button onClick={exportSalesCSV} variant="primary" size="sm">
          <Download size={14} /> Download Full Sales CSV
        </Button>
      </div>

      {/* Date range filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {RANGES.map((r) => (
          <button
            key={r.label}
            onClick={() => setRangeDays(r.days)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              border: '1px solid var(--line)',
              background: rangeDays === r.days ? 'var(--olive)' : 'var(--white)',
              color: rangeDays === r.days ? 'var(--white)' : 'var(--espresso)',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {rangeOrders.length === 0 ? (
        <EmptyState
          icon={PackageOpen}
          title="No orders in this range"
          description={`There are no orders between the selected dates (${rangeLabel}). Try a wider range.`}
        />
      ) : (
        <>
          {/* Totals derived from the filtered orders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Revenue', value: formatCurrency(totalRevenue) },
              { label: 'Orders', value: saleOrders.length },
              { label: 'Units Sold', value: totalUnits },
              { label: 'Avg Order Value', value: formatCurrency(aov) }
            ].map((stat) => (
              <div key={stat.label} className="admin-card" style={{ marginBottom: 0 }}>
                <div style={{ color: '#666', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginTop: '6px', color: 'var(--olive-deep)' }}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <h3 className="admin-card-title">Product Performance Ranking</h3>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>{rangeLabel} • cancelled orders excluded</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Units Sold</th>
                  <th>Current Stock</th>
                  <th>Revenue Generated</th>
                </tr>
              </thead>
              <tbody>
                {performance.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                      No products in the catalogue yet.
                    </td>
                  </tr>
                )}
                {performance.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.units > 0 ? `${p.units} units` : '—'}</td>
                    <td style={{ fontWeight: 700, color: p.stock <= LOW_STOCK_THRESHOLD ? 'var(--terracotta)' : '#137333' }}>{p.stock}</td>
                    <td style={{ fontWeight: 700 }}>{p.revenue > 0 ? formatCurrency(p.revenue) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '0.78rem', color: '#777' }}>
        <BarChart2 size={14} />
        Revenue counts {saleOrders.length} non-cancelled order{saleOrders.length === 1 ? '' : 's'} in {rangeLabel.toLowerCase()}.
      </div>
    </div>
  );
};
