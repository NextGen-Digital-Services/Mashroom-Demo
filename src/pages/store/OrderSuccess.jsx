import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { CheckCircle, Printer, ArrowRight, Package } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

export const OrderSuccess = () => {
  const { id } = useParams();
  const { orders } = useStore();

  // Never fall back to an unrelated order: in Supabase mode the placed
  // order may be RLS-hidden on a later visit, so degrade to a generic
  // confirmation keyed on the URL id instead of showing someone else's bill.
  const order = orders.find((o) => o.id === id);
  useDocumentTitle(order ? `Order ${order.id} Confirmed` : 'Order Placed');

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="section-padding">
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div style={{ backgroundColor: 'var(--parchment)', padding: '40px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)' }}>
            <CheckCircle size={56} color="var(--olive)" style={{ marginBottom: '16px' }} />
            <span className="eyebrow">Thank You For Your Order</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', marginBottom: '8px' }}>
              Order #{id} Received!
            </h1>
            <p style={{ color: '#555', fontSize: '0.92rem', marginBottom: '24px' }}>
              Your order is confirmed. Use the order id below to track delivery anytime — no login required.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to={`/track-order?orderId=${id}`} className="btn btn-primary btn-sm">
                <Package size={14} /> Track Order Progress
              </Link>
              <Link to="/shop" className="btn btn-secondary btn-sm">
                Continue Shopping <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const customer = order.customer || {};

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Success Card Header */}
        <div style={{ backgroundColor: 'var(--parchment)', padding: '40px 24px', textAlign: 'center', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', marginBottom: '32px' }}>
          <CheckCircle size={56} color="var(--olive)" style={{ marginBottom: '16px' }} />
          <span className="eyebrow">Thank You For Your Order</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', marginBottom: '8px' }}>
            Order #{order.id} Received!
          </h1>
          <p style={{ color: '#555', fontSize: '0.95rem' }}>
            We've sent a confirmation email to <strong>{order.customer.email}</strong>. Tracking status updates will appear in your account.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
            <Link to={`/track-order?orderId=${order.id}`} className="btn btn-primary btn-sm">
              <Package size={14} /> Track Order Progress
            </Link>
            <Button onClick={handlePrint} variant="secondary" size="sm">
              <Printer size={14} /> Print Invoice
            </Button>
          </div>
        </div>

        {/* Printable Invoice Details */}
        <div style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }} id="printable-invoice">
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>Order Details</h3>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>Placed on {formatDate(order.date)}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>Payment Method</span>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.paymentMethod} ({order.paymentStatus})</div>
            </div>
          </div>

          {/* Customer & Shipping info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px', fontSize: '0.88rem' }}>
            <div>
              <strong style={{ color: 'var(--gold)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>Customer</strong>
              <div>{customer.name}</div>
              <div>{customer.phone}</div>
              <div>{customer.email}</div>
            </div>
            <div>
              <strong style={{ color: 'var(--gold)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>Shipping Address</strong>
              <div>{customer.address}</div>
              <div>{customer.city}, {customer.state} - {customer.pincode}</div>
            </div>
          </div>

          {/* Items table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', marginBottom: '24px' }}>
            <thead>
              <tr style={{ background: 'var(--parchment)', textAlign: 'left', borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '8px 12px' }}>Item</th>
                <th style={{ padding: '8px 12px' }}>Variant</th>
                <th style={{ padding: '8px 12px' }}>Qty</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.name}</td>
                  <td style={{ padding: '10px 12px', color: '#666' }}>{item.variant}</td>
                  <td style={{ padding: '10px 12px' }}>{item.quantity}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial summary */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.9rem', gap: '6px' }}>
            <div>Subtotal: <strong>{formatCurrency(order.subtotal)}</strong></div>
            {order.discount > 0 && (
              <div style={{ color: 'var(--terracotta)' }}>
                Coupon {order.couponCode ? `(${order.couponCode})` : ''}: <strong>-{formatCurrency(order.discount)}</strong>
              </div>
            )}
            <div>GST Tax: <strong>{formatCurrency(order.tax)}</strong></div>
            <div>Shipping: <strong>{order.shippingFee === 0 ? 'FREE' : formatCurrency(order.shippingFee)}</strong></div>
            <div style={{ fontSize: '1.2rem', color: 'var(--olive-deep)', fontWeight: 700, borderTop: '1px solid var(--line)', paddingTop: '8px', marginTop: '4px' }}>
              Total Paid: {formatCurrency(order.total)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
