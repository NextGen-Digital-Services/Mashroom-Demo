import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AccountDashboard = () => {
  useDocumentTitle('Customer Account Portal');
  const { userAuth, loginUser, logoutUser, orders, addToast } = useStore();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [activeTab, setActiveTab] = useState('orders');

  // Address State
  const [addresses, setAddresses] = useState([
    { id: 'addr-1', label: 'Home', street: '42 Golf Links, Apartment 3B', city: 'New Delhi', state: 'Delhi', pincode: '110003' }
  ]);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPincode, setNewPincode] = useState('');

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !passInput) {
      addToast('Please provide email and password', 'error');
      return;
    }
    loginUser(emailInput, passInput);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPincode) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      label: 'Saved Address',
      street: newStreet,
      city: newCity,
      state: 'Himachal Pradesh',
      pincode: newPincode
    };
    setAddresses([...addresses, newAddr]);
    addToast('New delivery address added');
    setNewStreet('');
    setNewCity('');
    setNewPincode('');
  };

  if (!userAuth) {
    return (
      <div className="section-padding">
        <div className="container" style={{ maxWidth: '440px' }}>
          <div style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span className="eyebrow">Artisan Estate Account</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>
                {isLoginMode ? 'Welcome Back' : 'Create Customer Account'}
              </h2>
            </div>

            <form onSubmit={handleAuthSubmit}>
              <FormField
                label="Email Address *"
                type="email"
                placeholder="you@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
              <FormField
                label="Password *"
                type="password"
                placeholder="••••••••"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                required
              />

              <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '16px' }}>
                {isLoginMode ? 'Sign In To Account' : 'Register Account'}
              </Button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--terracotta)', fontWeight: 600 }}
              >
                {isLoginMode ? "Don't have an account? Register" : "Already registered? Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.customer.email === userAuth.email) || orders;

  return (
    <div className="section-padding">
      <div className="container">
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
          <div>
            <span className="eyebrow">Customer Concierge</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
              Welcome, {userAuth.name}
            </h1>
          </div>
          <Button onClick={logoutUser} variant="secondary" size="sm">
            <LogOut size={14} /> Sign Out
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }} className="account-grid">
          
          {/* Account Sidebar Navigation */}
          <div style={{ background: 'var(--white)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', height: 'fit-content' }}>
            <button
              onClick={() => setActiveTab('orders')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 14px', borderRadius: '4px', border: 'none', background: activeTab === 'orders' ? 'var(--parchment)' : 'none', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
            >
              <Package size={16} color="var(--olive)" /> My Orders ({myOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 14px', borderRadius: '4px', border: 'none', background: activeTab === 'addresses' ? 'var(--parchment)' : 'none', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', textAlign: 'left' }}
            >
              <MapPin size={16} color="var(--olive)" /> Saved Addresses
            </button>
            <Link
              to="/wishlist"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px 14px', borderRadius: '4px', color: 'inherit', fontWeight: 600, fontSize: '0.88rem' }}
            >
              <Heart size={16} color="var(--terracotta)" /> My Wishlist
            </Link>
          </div>

          {/* Tab Content Stage */}
          <main>
            {activeTab === 'orders' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '16px' }}>Your Order History</h3>
                {myOrders.length === 0 ? (
                  <p>You have not placed any orders yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {myOrders.map((ord) => (
                      <div key={ord.id} style={{ background: 'var(--white)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{ord.id}</span>
                            <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '12px' }}>{formatDate(ord.date)}</span>
                          </div>
                          <span className={`status-pill ${ord.status.toLowerCase()}`}>{ord.status}</span>
                        </div>

                        <div style={{ fontSize: '0.88rem', marginBottom: '12px' }}>
                          {ord.items.map((it, idx) => (
                            <div key={idx} style={{ color: '#444' }}>{it.name} ({it.variant}) x {it.quantity}</div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
                          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--olive-deep)' }}>Total: {formatCurrency(ord.total)}</span>
                          <Link to={`/track-order?orderId=${ord.id}`} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--olive)' }}>
                            Track Delivery →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '16px' }}>Delivery Address Book</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  {addresses.map((addr) => (
                    <div key={addr.id} style={{ background: 'var(--white)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                      <strong style={{ color: 'var(--gold)', textTransform: 'uppercase', fontSize: '0.75rem' }}>{addr.label}</strong>
                      <div style={{ fontWeight: 600, marginTop: '4px' }}>{addr.street}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{addr.city}, {addr.pincode}</div>
                    </div>
                  ))}
                </div>

                {/* Add Address Form */}
                <form onSubmit={handleAddAddress} style={{ background: 'var(--parchment)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '12px' }}>Add New Delivery Address</h4>
                  <FormField label="Street / Flat Address" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} required />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="City" value={newCity} onChange={(e) => setNewCity(e.target.value)} required />
                    <FormField label="Pincode" value={newPincode} onChange={(e) => setNewPincode(e.target.value)} maxLength={6} required />
                  </div>
                  <Button type="submit" size="sm" variant="primary">Save Address</Button>
                </form>
              </div>
            )}
          </main>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .account-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
