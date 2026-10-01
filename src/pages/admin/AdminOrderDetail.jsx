import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { StatusBadge } from '../../components/admin/AdminLayout';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Printer, ArrowLeft, Save } from 'lucide-react';

export const AdminOrderDetail = () => {
  const { id } = useParams();
  const { orders, setOrders, addToast } = useStore();

  const order = orders.find((o) => o.id === id);
  useDocumentTitle(order ? `Manage Order ${order.id}` : 'Order Detail');

  const [status, setStatus] = useState(order ? order.status : 'Placed');
  const [trackingNumber, setTrackingNumber] = useState(order ? (order.trackingNumber || '') : '');

  if (!order) {
    return (
      <div>
        <h2>Order {id} not found.</h2>
        <Link to="/admin/orders">← Back to Orders</Link>
      </div>
    );
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    const updated = orders.map((o) => {
      if (o.id === order.id) {
        return {
          ...o,
          status,
          trackingNumber
        };
      }
      return o;
    });
    setOrders(updated);
    addToast(`Updated order ${order.id} status to "${status}"`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin/orders" style={{ fontSize: '0.85rem', color: 'var(--olive)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <ArrowLeft size={14} /> Back to Order List
        </Link>
      </div>

      <div className="admin-card-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Order #{order.id}</h1>
          <span style={{ fontSize: '0.85rem', color: '#666' }}>Placed on {formatDate(order.date)}</span>
        </div>
        <Button onClick={handlePrint} variant="secondary" size="sm">
          <Printer size={14} /> Print Packing Slip
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left: Items & Customer Details */}
        <div>
          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Ordered Items</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Variant</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((it, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{it.name}</td>
                    <td>{it.variant}</td>
                    <td>{it.quantity}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(it.price * it.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ textAlign: 'right', marginTop: '16px', fontSize: '1.1rem', fontWeight: 700, color: 'var(--olive-deep)' }}>
              Total: {formatCurrency(order.total)}
            </div>
          </div>

          <div className="admin-card">
            <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>Shipping Address</h3>
            <div><strong>{order.customer.name}</strong></div>
            <div>{order.customer.phone} • {order.customer.email}</div>
            <div>{order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}</div>
          </div>
        </div>

        {/* Right: Update Order Status Controls */}
        <div className="admin-card" style={{ height: 'fit-content' }}>
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Fulfillment Controls</h3>

          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Update Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <FormField
              label="Courier Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. TRK-IN-9920148"
            />

            <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '12px' }}>
              <Save size={14} /> Update Order State
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};
