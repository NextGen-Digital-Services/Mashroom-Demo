import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { createShipment } from '../../lib/shipments';
import { Printer, ArrowLeft, Save } from 'lucide-react';

const TIMELINE_STEPS = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
const STATUS_OPTIONS = ['Pending Payment', 'Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

export const AdminOrderDetail = () => {
  const { id } = useParams();
  const { orders, setOrders, addToast } = useStore();

  const order = orders.find((o) => o.id === id);
  useDocumentTitle(order ? `Manage Order ${order.id}` : 'Order Detail');

  const [status, setStatus] = useState(order ? order.status : 'Placed');
  const [trackingNumber, setTrackingNumber] = useState(order ? (order.trackingNumber || '') : '');
  const [saving, setSaving] = useState(false);

  // Keep the form in sync when the order updates elsewhere (another tab,
  // hydration finishing, status change from the list view).
  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setTrackingNumber(order.trackingNumber || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id, order?.status, order?.trackingNumber]);

  if (!order) {
    return (
      <div>
        <h2>Order {id} not found.</h2>
        <Link to="/admin/orders">← Back to Orders</Link>
      </div>
    );
  }

  const customer = order.customer || {};

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalTracking = trackingNumber;

      // First shipment dispatch -> mock courier adapter issues an AWB
      // (swap for Shiprocket when the API keys land, see lib/shipments.js)
      if (status === 'Shipped' && !finalTracking.trim()) {
        const shipment = await createShipment(order);
        finalTracking = shipment.awb;
        setTrackingNumber(shipment.awb);
      }

      const updated = orders.map((o) => {
        if (o.id !== order.id) return o;

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let timeline = o.timeline || [];
        if (TIMELINE_STEPS.includes(status)) {
          timeline = timeline.map((step) =>
            step.status === status ? { ...step, done: true, time: now } : step
          );
        } else if (status === 'Cancelled' && !timeline.some((t) => t.status === 'Cancelled')) {
          timeline = [...timeline, { status: 'Cancelled', time: now, done: true }];
        }

        return { ...o, status, trackingNumber: finalTracking, timeline };
      });
      setOrders(updated);
      addToast(`Updated order ${order.id} status to "${status}"`);
    } catch (err) {
      addToast(err?.message || 'Could not update the order', 'error');
    } finally {
      setSaving(false);
    }
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

          <div className="admin-card" id="printable-slip">
            <h3 className="admin-card-title" style={{ marginBottom: '12px' }}>Shipping Address</h3>
            <div><strong>{customer.name || '—'}</strong></div>
            <div>{customer.phone} • {customer.email}</div>
            <div>{customer.address}, {customer.city}, {customer.state} - {customer.pincode}</div>
          </div>
        </div>

        {/* Right: Update Order Status Controls */}
        <div className="admin-card" style={{ height: 'fit-content' }}>
          <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Fulfillment Controls</h3>

          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Update Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                {(STATUS_OPTIONS.includes(status) ? STATUS_OPTIONS : [status, ...STATUS_OPTIONS]).map((st) => (
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

            <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '12px' }} disabled={saving}>
              <Save size={14} /> {saving ? 'Updating…' : 'Update Order State'}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};
