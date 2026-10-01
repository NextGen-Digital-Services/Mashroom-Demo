import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import { formatCurrency, generateOrderId } from '../../utils/formatters';
import { ShieldCheck, Truck, CreditCard, CheckCircle } from 'lucide-react';

export const CheckoutPage = () => {
  useDocumentTitle('Checkout & Shipping');
  const { cart, config, createOrder, userAuth, addToast } = useStore();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState(userAuth ? userAuth.name : '');
  const [email, setEmail] = useState(userAuth ? userAuth.email : '');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Himachal Pradesh');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = config.freeShippingThreshold || 999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : (config.defaultShippingFee || 99);
  const tax = Math.round(subtotal * ((config.gstPercentage || 5) / 100));
  const total = subtotal + shippingFee + tax;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !street || !city || !pincode) {
      addToast('Please complete all required shipping fields', 'error');
      return;
    }

    const orderId = generateOrderId();
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      customer: {
        name,
        email,
        phone,
        address: street,
        city,
        state,
        pincode
      },
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        variant: item.variant,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      subtotal,
      discount: 0,
      tax,
      shippingFee,
      total,
      status: 'Placed',
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      trackingNumber: `TRK-IN-${Math.floor(1000000 + Math.random() * 9000000)}`,
      timeline: [
        { status: "Placed", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
        { status: "Confirmed", time: "Pending", done: false },
        { status: "Packed", time: "Pending", done: false },
        { status: "Shipped", time: "Pending", done: false },
        { status: "Delivered", time: "Pending", done: false }
      ]
    };

    createOrder(newOrder);
    addToast(`Order ${orderId} placed successfully!`);
    navigate(`/order-success/${orderId}`);
  };

  if (cart.length === 0) {
    return (
      <div className="section-padding" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2>No items in basket to checkout</h2>
          <Button onClick={() => navigate('/shop')} style={{ marginTop: '16px' }}>Return to Shop</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container">
        
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Secure Checkout</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
            Complete Your Order
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }} className="checkout-grid">
          
          {/* Shipping Form & Payment */}
          <div>
            
            {/* Address */}
            <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
                1. Shipping Address
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormField label="Full Name *" value={name} onChange={(e) => setName(e.target.value)} required />
                <FormField label="Email Address *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <FormField label="Phone Number *" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <FormField label="Street Address / Flat No *" value={street} onChange={(e) => setStreet(e.target.value)} required />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <FormField label="City *" value={city} onChange={(e) => setCity(e.target.value)} required />
                <FormField label="State *" value={state} onChange={(e) => setState(e.target.value)} required />
                <FormField label="Pincode *" value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength={6} required />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
                2. Select Payment Option (Demo Mode)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { id: 'UPI', label: 'UPI / GPay / PhonePe (Instant Approval)', desc: 'Scan & Pay via any UPI application' },
                  { id: 'Credit Card', label: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay, Amex' },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery (COD)', desc: 'Pay cash upon courier delivery' }
                ].map((pm) => (
                  <label
                    key={pm.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: paymentMethod === pm.id ? '2px solid var(--olive)' : '1px solid var(--line)',
                      background: paymentMethod === pm.id ? 'var(--parchment)' : 'var(--white)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{pm.label}</div>
                      <div style={{ fontSize: '0.78rem', color: '#666' }}>{pm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right Summary */}
          <div style={{ background: 'var(--parchment)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
              Basket Review ({cart.length} items)
            </h3>

            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px' }}>
              {cart.map((item) => (
                <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.85rem' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>{item.variant} x {item.quantity}</div>
                  </div>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.9rem', lineHeight: 2, borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST Tax ({config.gstPercentage}%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Express Courier</span>
                <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 700, borderTop: '1px solid var(--line)', paddingTop: '10px', color: 'var(--olive-deep)' }}>
                <span>Total Payable</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth size="lg" style={{ marginTop: '24px' }}>
              Confirm & Place Order <CheckCircle size={18} />
            </Button>
          </div>

        </form>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
