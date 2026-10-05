import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import { Search, CheckCircle, Package, Truck, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const OrderTracking = () => {
  useDocumentTitle('Track Your Shipment');
  const { trackOrder } = useStore();
  const [searchParams] = useSearchParams();

  const [orderIdInput, setOrderIdInput] = useState(searchParams.get('orderId') || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const paramId = searchParams.get('orderId');
    if (paramId) {
      let cancelled = false;
      (async () => {
        const match = await trackOrder(paramId, '');
        if (!cancelled && match) {
          setTrackedOrder(match);
          setSearched(true);
        }
      })();
      return () => {
        cancelled = true;
      };
    }
  }, [searchParams]);

  const handleTrack = async (e) => {
    e.preventDefault();
    setBusy(true);
    setSearched(true);
    try {
      const match = await trackOrder(orderIdInput, phoneInput);
      setTrackedOrder(match || null);
    } finally {
      setBusy(false);
    }
  };

  const steps = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered"];

  const getStepStatus = (order, stepName) => {
    if (!order) return false;
    const currentIdx = steps.indexOf(order.status);
    const stepIdx = steps.indexOf(stepName);
    return stepIdx <= currentIdx;
  };

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '850px' }}>
        
        <div className="page-hero page-hero-card" style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="eyebrow">Real-Time Dispatch Tracking</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
            Track Your Order
          </h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Enter your 5-digit Order ID (e.g., ORD-89241) or phone number below.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleTrack} style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', marginBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end' }} className="track-form-grid">
            <FormField
              label="Order ID *"
              placeholder="e.g. ORD-89241"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
            />
            <FormField
              label="Phone Number (Optional)"
              placeholder="e.g. +91 98123 45678"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
            />
            <div style={{ marginBottom: '16px' }}>
              <Button type="submit" variant="primary" size="md" disabled={busy}>
                <Search size={16} /> {busy ? 'Searching…' : 'Track Order'}
              </Button>
            </div>
          </div>
        </form>

        {/* Results Timeline */}
        {searched && !trackedOrder && (
          <div style={{ background: 'var(--parchment)', padding: '32px', textAlign: 'center', borderRadius: 'var(--radius-md)', border: '1px dashed var(--line)' }}>
            <Clock size={36} color="var(--terracotta)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>Order Not Found</h3>
            <p style={{ color: '#666', fontSize: '0.88rem' }}>Please verify the Order ID or phone number and try again.</p>
          </div>
        )}

        {trackedOrder && (
          <div style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '16px', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="eyebrow">Active Shipment</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem' }}>Order #{trackedOrder.id}</h3>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>Courier Waybill: <strong>{trackedOrder.trackingNumber || 'TRK-IN-PENDING'}</strong></span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`status-pill ${trackedOrder.status.toLowerCase()}`} style={{ fontSize: '0.9rem', padding: '6px 16px' }}>
                  {trackedOrder.status}
                </span>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '6px' }}>Estimated Delivery: 2-3 Business Days</div>
              </div>
            </div>

            {/* Visual Timeline Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', textAlign: 'center', position: 'relative', marginBottom: '32px' }}>
              {steps.map((step, idx) => {
                const isCompleted = getStepStatus(trackedOrder, step);
                return (
                  <div key={idx} style={{ position: 'relative', zIndex: 2 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: isCompleted ? 'var(--olive)' : 'var(--line)',
                        color: 'var(--white)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 8px',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      {isCompleted ? <CheckCircle size={18} /> : idx + 1}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: isCompleted ? 700 : 500, color: isCompleted ? 'var(--espresso)' : '#888' }}>
                      {step}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Items & Address Summary */}
            <div style={{ background: 'var(--parchment)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', fontSize: '0.88rem' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '12px' }}>Shipment Summary</h4>
              {trackedOrder.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span>{item.name} ({item.variant}) x {item.quantity}</span>
                  <strong style={{ color: 'var(--olive-deep)' }}>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '8px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total Amount Paid</span>
                <span>{formatCurrency(trackedOrder.total)}</span>
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @media (max-width: 650px) {
          .track-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
