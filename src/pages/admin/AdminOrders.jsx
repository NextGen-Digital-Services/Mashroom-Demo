import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { createShipment } from '../../lib/shipments';
import { Eye } from 'lucide-react';

export const ORDER_STATUSES = ['Pending Payment', 'Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

export const AdminOrders = () => {
  useDocumentTitle('Order Fulfillment & Management');
  const { orders, setOrders, addToast } = useStore();
  const [statusFilter, setStatusFilter] = useState('All');

  const handleStatusChange = async (orderId, newStatus) => {
    const target = orders.find((o) => o.id === orderId);
    let trackingNumber = target?.trackingNumber || '';

    // Dispatching for the first time without an AWB -> mock courier
    // adapter (see src/lib/shipments.js — Shiprocket-ready interface)
    if (newStatus === 'Shipped' && !trackingNumber.trim() && target) {
      const shipment = await createShipment(target);
      trackingNumber = shipment.awb;
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const updatedTimeline = o.timeline ? o.timeline.map((step) => {
          if (step.status.toLowerCase() === newStatus.toLowerCase()) {
            return { ...step, done: true, time: now };
          }
          return step;
        }) : [];
        return { ...o, status: newStatus, trackingNumber, timeline: updatedTimeline };
      }
      return o;
    });
    setOrders(updated);
    addToast(`Order ${orderId} status changed to ${newStatus}`);
  };

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter((o) => o.status.toLowerCase() === statusFilter.toLowerCase());

  const columns = [
    {
      header: 'Order ID',
      accessor: 'id',
      render: (row) => <Link to={`/admin/orders/${row.id}`} style={{ fontWeight: 700, color: 'var(--olive)' }}>{row.id}</Link>
    },
    {
      header: 'Customer',
      accessor: 'customer',
      render: (row) => {
        const customer = row.customer || {};
        return (
          <div>
            <div style={{ fontWeight: 600 }}>{customer.name || '—'}</div>
            <div style={{ fontSize: '0.75rem', color: '#777' }}>{customer.city || customer.email || ''}</div>
          </div>
        );
      }
    },
    {
      header: 'Items',
      render: (row) => <span>{row.items?.length || 0} items</span>
    },
    {
      header: 'Total Paid',
      accessor: 'total',
      render: (row) => <strong>{formatCurrency(row.total)}</strong>
    },
    {
      header: 'Status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="form-select"
          style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem', fontWeight: 600 }}
        >
          {(ORDER_STATUSES.includes(row.status) ? ORDER_STATUSES : [row.status, ...ORDER_STATUSES]).map((st) => (
            <option key={st} value={st}>{st}</option>
          ))}
        </select>
      )
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => <span style={{ fontSize: '0.8rem' }}>{formatDate(row.date)}</span>
    },
    {
      header: 'Action',
      render: (row) => (
        <Link to={`/admin/orders/${row.id}`} style={{ color: 'var(--espresso)' }} title="View Details">
          <Eye size={18} />
        </Link>
      )
    }
  ];

  return (
    <div>
      <div className="admin-card-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Orders Manager</h1>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>Update order dispatch states and track customer orders.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', ...ORDER_STATUSES].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                border: '1px solid var(--line)',
                background: statusFilter === st ? 'var(--olive)' : 'var(--white)',
                color: statusFilter === st ? 'var(--white)' : 'var(--espresso)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={filteredOrders} searchPlaceholder="Search order ID, customer name or city..." />
    </div>
  );
};
