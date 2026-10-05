import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import { Package, MapPin, User, Heart, LogOut, MessageSquare, Star, RotateCcw, XCircle, Plus } from 'lucide-react';
import { formatCurrency, formatDate, statusSlug } from '../../utils/formatters';
import { STORAGE_KEYS } from '../../utils/storage';

// ---- Per-user address book (localStorage, no backend coupling) ----
const addressKey = (userId) => `${STORAGE_KEYS.ADDRESSES_PREFIX}${userId}`;

const readAddresses = (userId) => {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(addressKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeAddresses = (userId, list) => {
  if (!userId) return;
  try {
    localStorage.setItem(addressKey(userId), JSON.stringify(list));
  } catch {
    // Storage unavailable / full — in-memory state still works for this session.
  }
};

const emptyAddressForm = () => ({
  label: 'Home',
  name: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  pincode: ''
});

const sidebarBtnStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '12px 14px',
  borderRadius: '4px',
  border: 'none',
  background: active ? 'var(--parchment)' : 'none',
  fontWeight: 600,
  fontSize: '0.88rem',
  cursor: 'pointer',
  textAlign: 'left'
});

const cardStyle = {
  background: 'var(--white)',
  padding: '20px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--line)'
};

export const AccountDashboard = () => {
  useDocumentTitle('Customer Account Portal');
  const {
    userAuth,
    authReady,
    loginUser,
    registerUser,
    sendOtp,
    verifyOtp,
    logoutUser,
    updateProfile,
    changePassword,
    resetPassword,
    orders,
    setOrders,
    reviews,
    products,
    addToCart,
    addToast
  } = useStore();
  const navigate = useNavigate();

  // ---- Auth / session state ----
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'otp'
  const [emailInput, setEmailInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDemoCode, setOtpDemoCode] = useState('');
  const [resendIn, setResendIn] = useState(0);
  const [otpBusy, setOtpBusy] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');

  // Resend countdown for the OTP flow.
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // ---- Address book state ----
  const [addresses, setAddresses] = useState([]);
  const [addrForm, setAddrForm] = useState(emptyAddressForm());
  const [editingAddrId, setEditingAddrId] = useState(null);

  // ---- Profile state ----
  const [profileForm, setProfileForm] = useState({ name: '', email: '', phone: '' });
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [pwOne, setPwOne] = useState('');
  const [pwTwo, setPwTwo] = useState('');
  const [pwError, setPwError] = useState('');

  // Re-sync profile fields whenever the session user changes.
  useEffect(() => {
    if (!userAuth) return;
    setProfileForm({
      name: userAuth.name || '',
      email: userAuth.email || '',
      phone: userAuth.phone || ''
    });
  }, [userAuth]);

  // Load this user's saved addresses (+ prefill the new-address defaults).
  useEffect(() => {
    setAddresses(readAddresses(userAuth ? userAuth.id : null));
    setEditingAddrId(null);
    setAddrForm({
      ...emptyAddressForm(),
      name: userAuth ? userAuth.name || '' : '',
      phone: userAuth ? userAuth.phone || '' : ''
    });
  }, [userAuth]);

  const persistAddresses = (next) => {
    setAddresses(next);
    writeAddresses(userAuth ? userAuth.id : null, next);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!emailInput || !passInput) {
      const msg = 'Please provide email and password';
      setAuthError(msg);
      addToast(msg, 'error');
      return;
    }
    if (passInput.length < 6) {
      const msg = 'Password must be at least 6 characters';
      setAuthError(msg);
      addToast(msg, 'error');
      return;
    }
    setAuthBusy(true);
    try {
      if (isLoginMode) {
        const res = await loginUser(emailInput, passInput);
        if (res && res.success === false) {
          setAuthError(res.error || 'Sign in failed. Please try again.');
        }
      } else {
        const res = await registerUser(emailInput, passInput, emailInput.split('@')[0]);
        if (res && res.success === false) {
          setAuthError(res.error || 'Registration failed. Please try again.');
        } else if (res && res.success && !res.needsConfirm && res.user) {
          setIsLoginMode(true);
        }
      }
    } catch (err) {
      const msg = (err && err.message) || 'Something went wrong. Please try again.';
      setAuthError(msg);
      addToast(msg, 'error');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    if (!phoneInput || phoneInput.replace(/\D/g, '').length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpBusy(true);
    try {
      const res = await sendOtp(phoneInput);
      if (res && res.success) {
        setOtpSent(true);
        setOtpDemoCode(res.demoCode || '');
        setResendIn(30);
      } else if (res && res.error) {
        setAuthError(res.error);
      }
    } catch (err) {
      setAuthError((err && err.message) || 'Could not send OTP. Please try again.');
    } finally {
      setOtpBusy(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!/^\d{6}$/.test(otpInput.trim())) {
      setAuthError('Please enter the 6-digit OTP');
      return;
    }
    setOtpBusy(true);
    try {
      const res = await verifyOtp(phoneInput, otpInput);
      if (res && res.success === false) {
        setAuthError(res.error || 'OTP verification failed. Please try again.');
      } else if (res && res.success) {
        setOtpSent(false);
        setOtpInput('');
        setOtpDemoCode('');
      }
    } catch (err) {
      setAuthError((err && err.message) || 'OTP verification failed.');
    } finally {
      setOtpBusy(false);
    }
  };

  const switchAuthMethod = (method) => {
    setAuthMethod(method);
    setAuthError('');
    setOtpSent(false);
    setOtpInput('');
  };

  const handleForgotPassword = async () => {
    setAuthError('');
    if (!emailInput) {
      const msg = 'Enter your email address above first, then request a reset link.';
      setAuthError(msg);
      addToast(msg, 'error');
      return;
    }
    try {
      await resetPassword(emailInput);
    } catch (err) {
      const msg = (err && err.message) || 'Could not send the reset link.';
      setAuthError(msg);
      addToast(msg, 'error');
    }
  };

  // ---- Orders ----------------------------------------------------------
  const allOrders = orders || [];
  const myOrders = allOrders.filter(
    (o) => (o.customer?.email || '').toLowerCase() === (userAuth?.email || '').toLowerCase()
  );

  const canCancel = (status) => status === 'Placed' || status === 'Confirmed';

  const handleCancelOrder = (ord) => {
    if (!window.confirm(`Cancel order ${ord.id}? This cannot be undone.`)) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const next = allOrders.map((o) =>
      o.id === ord.id
        ? {
            ...o,
            status: 'Cancelled',
            timeline: [...(o.timeline || []), { status: 'Cancelled', time, done: true }]
          }
        : o
    );
    setOrders(next);
    addToast(`Order ${ord.id} has been cancelled`, 'info');
  };

  const handleReorder = (ord) => {
    const items = ord.items || [];
    let added = 0;
    let missing = 0;
    items.forEach((item) => {
      const product = (products || []).find((p) => p.id === item.id);
      if (product) {
        addToCart(product, null, item.quantity);
        added += 1;
      } else {
        missing += 1;
      }
    });
    const parts = [];
    if (added > 0) parts.push(`${added} item${added > 1 ? 's' : ''} back in your cart`);
    if (missing > 0) parts.push(`${missing} unavailable product${missing > 1 ? 's' : ''} skipped`);
    if (parts.length === 0) {
      addToast('Nothing from this order is available to reorder', 'error');
      return;
    }
    addToast(parts.join(' — '), missing > 0 ? 'info' : 'success');
    navigate('/cart');
  };

  // ---- Addresses -------------------------------------------------------
  const setAddrField = (key, value) => setAddrForm((prev) => ({ ...prev, [key]: value }));

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const f = addrForm;
    if (
      !f.label.trim() ||
      !f.name.trim() ||
      !f.street.trim() ||
      !f.city.trim() ||
      !f.state.trim() ||
      !f.pincode.trim()
    ) {
      addToast('Please fill in label, name, street, city, state and pincode', 'error');
      return;
    }
    if (editingAddrId) {
      const next = addresses.map((a) => (a.id === editingAddrId ? { ...a, ...f } : a));
      persistAddresses(next);
      addToast('Address updated');
    } else {
      const isFirst = addresses.length === 0 || !addresses.some((a) => a.isDefault);
      const newAddr = { id: `addr-${Date.now()}`, ...f, isDefault: isFirst };
      persistAddresses([...addresses, newAddr]);
      addToast('New delivery address added');
    }
    setEditingAddrId(null);
    setAddrForm({
      ...emptyAddressForm(),
      name: userAuth ? userAuth.name || '' : '',
      phone: userAuth ? userAuth.phone || '' : ''
    });
  };

  const handleEditAddress = (addr) => {
    setEditingAddrId(addr.id);
    setAddrForm({
      label: addr.label || '',
      name: addr.name || '',
      phone: addr.phone || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || ''
    });
  };

  const handleCancelEdit = () => {
    setEditingAddrId(null);
    setAddrForm({
      ...emptyAddressForm(),
      name: userAuth ? userAuth.name || '' : '',
      phone: userAuth ? userAuth.phone || '' : ''
    });
  };

  const handleDeleteAddress = (addr) => {
    if (!window.confirm(`Delete the "${addr.label}" address?`)) return;
    let next = addresses.filter((a) => a.id !== addr.id);
    if (next.length > 0 && !next.some((a) => a.isDefault)) {
      next = next.map((a, i) => (i === 0 ? { ...a, isDefault: true } : a));
    }
    persistAddresses(next);
    if (editingAddrId === addr.id) setEditingAddrId(null);
    addToast('Address removed', 'info');
  };

  const handleSetDefaultAddress = (addr) => {
    persistAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === addr.id })));
    addToast(`"${addr.label}" is now your default delivery address`);
  };

  // ---- Profile ---------------------------------------------------------
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      setProfileError('Name and email are required.');
      addToast('Name and email are required', 'error');
      return;
    }
    setProfileBusy(true);
    try {
      const res = await updateProfile({
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim()
      });
      if (res && res.success === false) {
        setProfileError(res.error || 'Profile update failed.');
      }
    } catch (err) {
      const msg = (err && err.message) || 'Profile update failed.';
      setProfileError(msg);
      addToast(msg, 'error');
    } finally {
      setProfileBusy(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwOne.length < 6) {
      setPwError('Password must be at least 6 characters.');
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    if (pwOne !== pwTwo) {
      setPwError('Passwords do not match.');
      addToast('Passwords do not match', 'error');
      return;
    }
    try {
      const res = await changePassword(pwOne);
      if (res && res.success) {
        setPwOne('');
        setPwTwo('');
        setPwError('');
      } else if (res && res.error) {
        setPwError(res.error);
      }
    } catch (err) {
      const msg = (err && err.message) || 'Password change failed.';
      setPwError(msg);
      addToast(msg, 'error');
    }
  };

  const handleSendResetLink = async () => {
    try {
      await resetPassword(userAuth.email);
    } catch (err) {
      addToast((err && err.message) || 'Could not send the reset link', 'error');
    }
  };

  // ---- Reviews ---------------------------------------------------------
  const myReviews = (reviews || []).filter(
    (r) =>
      (r.email || '').toLowerCase() === (userAuth?.email || '').toLowerCase() ||
      (r.name || '').toLowerCase() === (userAuth?.name || '').toLowerCase()
  );

  const renderStars = (rating) => {
    const value = Number(rating) || 0;
    return (
      <span style={{ display: 'inline-flex', gap: '2px', verticalAlign: 'middle' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={14}
            fill={i <= value ? 'var(--gold)' : 'transparent'}
            color={i <= value ? 'var(--gold)' : '#c8c3b7'}
          />
        ))}
      </span>
    );
  };

  // ---- Gates -----------------------------------------------------------
  if (!authReady) {
    return (
      <div className="section-padding" style={{ minHeight: '55vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <span className="eyebrow">My Account</span>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginTop: '10px' }}>
            Loading your account…
          </p>
        </div>
      </div>
    );
  }

  if (!userAuth) {
    return (
      <div className="section-padding">
        <div className="container" style={{ maxWidth: '440px' }}>
          <div style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span className="eyebrow">My Account</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>
                {isLoginMode ? 'Welcome Back' : 'Create Customer Account'}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', background: 'var(--cream, #f7f5ef)', padding: '5px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
              {[['email', 'Email'], ['otp', 'Mobile OTP']].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => switchAuthMethod(key)}
                  style={{
                    flex: 1, padding: '9px 6px', border: 'none', borderRadius: 'var(--radius-sm, 6px)',
                    cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                    background: authMethod === key ? 'var(--white)' : 'transparent',
                    color: authMethod === key ? 'var(--olive)' : 'var(--text-muted, #777)',
                    boxShadow: authMethod === key ? 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.08))' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {authMethod === 'email' ? (
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

                {authError && (
                  <p className="form-error" style={{ marginTop: '4px' }}>{authError}</p>
                )}

                <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '16px' }} disabled={authBusy}>
                  {authBusy ? 'Please wait…' : (isLoginMode ? 'Sign In To Account' : 'Register Account')}
                </Button>
              </form>
            ) : !otpSent ? (
              <form onSubmit={handleSendOtp}>
                <FormField
                  label="Mobile Number *"
                  type="tel"
                  placeholder="98765 43210"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  required
                />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #777)', marginTop: '-4px', marginBottom: '12px' }}>
                  We'll send a 6-digit OTP to verify your number.
                </p>

                {authError && (
                  <p className="form-error" style={{ marginTop: '4px' }}>{authError}</p>
                )}

                <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '8px' }} disabled={otpBusy || resendIn > 0}>
                  {otpBusy ? 'Sending…' : resendIn > 0 ? `Resend in ${resendIn}s` : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <FormField
                  label="Mobile Number"
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  disabled
                />
                <FormField
                  label="Enter 6-Digit OTP *"
                  type="text"
                  placeholder="123456"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                />

                {otpDemoCode && (
                  <div style={{ background: 'var(--olive-tint, #eef1e4)', border: '1px dashed var(--olive)', borderRadius: 'var(--radius-sm, 6px)', padding: '10px 12px', fontSize: '0.82rem', marginBottom: '8px' }}>
                    Demo mode — no SMS is sent. Your OTP is <strong style={{ fontSize: '1rem', letterSpacing: '0.15em' }}>{otpDemoCode}</strong>
                  </div>
                )}

                {authError && (
                  <p className="form-error" style={{ marginTop: '4px' }}>{authError}</p>
                )}

                <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '8px' }} disabled={otpBusy}>
                  {otpBusy ? 'Verifying…' : 'Verify & Sign In'}
                </Button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '0.82rem' }}>
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpInput(''); setAuthError(''); }}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--terracotta)', fontWeight: 600 }}
                  >
                    Change number
                  </button>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={resendIn > 0 || otpBusy}
                    style={{ border: 'none', background: 'none', cursor: resendIn > 0 ? 'default' : 'pointer', color: resendIn > 0 ? 'var(--text-muted, #999)' : 'var(--olive)', fontWeight: 600 }}
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : 'Resend OTP'}
                  </button>
                </div>
              </form>
            )}

            {authMethod === 'email' && isLoginMode && (
              <div style={{ textAlign: 'center', marginTop: '14px' }}>
                <button
                  onClick={handleForgotPassword}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--olive)', fontWeight: 600, fontSize: '0.82rem' }}
                >
                  Forgot password? Email me a reset link
                </button>
              </div>
            )}

            {authMethod === 'email' && (
              <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
                <button
                  onClick={() => { setIsLoginMode(!isLoginMode); setAuthError(''); }}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--terracotta)', fontWeight: 600 }}
                >
                  {isLoginMode ? "Don't have an account? Register" : "Already registered? Sign In"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container">

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
          <div>
            <span className="eyebrow">Need Help?</span>
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
            <button onClick={() => setActiveTab('orders')} style={sidebarBtnStyle(activeTab === 'orders')}>
              <Package size={16} color="var(--olive)" /> My Orders ({myOrders.length})
            </button>
            <button onClick={() => setActiveTab('addresses')} style={sidebarBtnStyle(activeTab === 'addresses')}>
              <MapPin size={16} color="var(--olive)" /> Saved Addresses ({addresses.length})
            </button>
            <button onClick={() => setActiveTab('profile')} style={sidebarBtnStyle(activeTab === 'profile')}>
              <User size={16} color="var(--olive)" /> Profile Settings
            </button>
            <button onClick={() => setActiveTab('reviews')} style={sidebarBtnStyle(activeTab === 'reviews')}>
              <MessageSquare size={16} color="var(--olive)" /> My Reviews ({myReviews.length})
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
                  <div style={{ ...cardStyle, textAlign: 'center', padding: '40px 20px' }}>
                    <Package size={32} color="var(--olive)" style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontWeight: 600, marginBottom: '6px' }}>You have not placed any orders yet.</p>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>
                      Anything you order will show up here with live delivery tracking.
                    </p>
                    <Link to="/shop" className="btn btn-primary btn-sm">Start Shopping</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {myOrders.map((ord) => (
                      <div key={ord.id} style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{ord.id}</span>
                            <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '12px' }}>{formatDate(ord.date)}</span>
                          </div>
                          <span className={`status-pill ${statusSlug(ord.status)}`}>{ord.status}</span>
                        </div>

                        <div style={{ fontSize: '0.88rem', marginBottom: '12px' }}>
                          {(ord.items || []).map((it, idx) => (
                            <div key={idx} style={{ color: '#444' }}>{it.name} ({it.variant}) x {it.quantity}</div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
                          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--olive-deep)' }}>Total: {formatCurrency(ord.total)}</span>
                          <Link to={`/track-order?orderId=${ord.id}`} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--olive)' }}>
                            Track Delivery →
                          </Link>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                          <Button variant="secondary" size="sm" onClick={() => handleReorder(ord)}>
                            <RotateCcw size={13} /> Reorder
                          </Button>
                          {canCancel(ord.status) && (
                            <Button variant="secondary" size="sm" onClick={() => handleCancelOrder(ord)}>
                              <XCircle size={13} /> Cancel Order
                            </Button>
                          )}
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

                {addresses.length === 0 ? (
                  <div style={{ ...cardStyle, textAlign: 'center', padding: '32px 20px', marginBottom: '24px' }}>
                    <MapPin size={28} color="var(--olive)" style={{ margin: '0 auto 10px' }} />
                    <p style={{ fontWeight: 600 }}>No saved addresses yet.</p>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Add one below — it will pre-fill at checkout.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                    {addresses.map((addr) => (
                      <div key={addr.id} style={{ background: 'var(--white)', padding: '16px', borderRadius: 'var(--radius-md)', border: addr.isDefault ? '1px solid var(--olive)' : '1px solid var(--line)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ color: 'var(--gold)', textTransform: 'uppercase', fontSize: '0.75rem' }}>{addr.label}</strong>
                          {addr.isDefault && (
                            <span className="status-pill default" style={{ fontSize: '0.65rem' }}>Default</span>
                          )}
                        </div>
                        <div style={{ fontWeight: 600, marginTop: '6px' }}>{addr.name}</div>
                        {addr.phone && <div style={{ fontSize: '0.82rem', color: '#666' }}>{addr.phone}</div>}
                        <div style={{ fontSize: '0.85rem', color: '#444', marginTop: '4px' }}>{addr.street}</div>
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>{addr.city}, {addr.state} — {addr.pincode}</div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                          <Button variant="secondary" size="sm" onClick={() => handleEditAddress(addr)}>Edit</Button>
                          {!addr.isDefault && (
                            <Button variant="secondary" size="sm" onClick={() => handleSetDefaultAddress(addr)}>Set Default</Button>
                          )}
                          <Button variant="secondary" size="sm" onClick={() => handleDeleteAddress(addr)}>Delete</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add / Edit Address Form */}
                <form onSubmit={handleAddressSubmit} style={{ background: 'var(--parchment)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '12px' }}>
                    {editingAddrId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="Address Label *" value={addrForm.label} onChange={(e) => setAddrField('label', e.target.value)} placeholder="Home, Office…" required />
                    <FormField label="Full Name *" value={addrForm.name} onChange={(e) => setAddrField('name', e.target.value)} required />
                  </div>
                  <FormField label="Phone" type="tel" value={addrForm.phone} onChange={(e) => setAddrField('phone', e.target.value)} placeholder="+91 98765 43210" />
                  <FormField label="Street / Flat Address *" value={addrForm.street} onChange={(e) => setAddrField('street', e.target.value)} required />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="City *" value={addrForm.city} onChange={(e) => setAddrField('city', e.target.value)} required />
                    <FormField label="State *" value={addrForm.state} onChange={(e) => setAddrField('state', e.target.value)} placeholder="e.g. Himachal Pradesh" required />
                  </div>
                  <FormField label="Pincode *" value={addrForm.pincode} onChange={(e) => setAddrField('pincode', e.target.value)} maxLength={6} required />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="submit" size="sm" variant="primary">
                      {editingAddrId ? 'Save Changes' : (<><Plus size={13} /> Save Address</>)}
                    </Button>
                    {editingAddrId && (
                      <Button type="button" size="sm" variant="secondary" onClick={handleCancelEdit}>Cancel Edit</Button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '16px' }}>Profile Settings</h3>

                <form onSubmit={handleProfileSubmit} style={{ ...cardStyle, marginBottom: '24px' }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '14px' }}>Personal Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="Full Name *" value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} required />
                    <FormField label="Phone" type="tel" value={profileForm.phone} onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210" />
                  </div>
                  <FormField label="Email Address *" type="email" value={profileForm.email} onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))} required />
                  {profileError && <p className="form-error">{profileError}</p>}
                  <Button type="submit" variant="primary" size="sm" disabled={profileBusy}>
                    {profileBusy ? 'Saving…' : 'Save Profile'}
                  </Button>
                </form>

                <form onSubmit={handleChangePassword} style={{ ...cardStyle, marginBottom: '24px' }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '14px' }}>Change Password</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <FormField label="New Password *" type="password" placeholder="••••••••" value={pwOne} onChange={(e) => setPwOne(e.target.value)} required />
                    <FormField label="Confirm New Password *" type="password" placeholder="••••••••" value={pwTwo} onChange={(e) => setPwTwo(e.target.value)} required />
                  </div>
                  {pwError && <p className="form-error">{pwError}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <Button type="submit" variant="primary" size="sm">Update Password</Button>
                    <Button type="button" variant="secondary" size="sm" onClick={handleSendResetLink}>Email me a reset link</Button>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#777', marginTop: '10px' }}>Minimum 6 characters. A reset link can also be sent to {userAuth.email}.</p>
                </form>

                <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '4px' }}>Session</h4>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>Signed in as {userAuth.email}</p>
                  </div>
                  <Button onClick={logoutUser} variant="secondary" size="sm">
                    <LogOut size={14} /> Sign Out
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '16px' }}>My Reviews</h3>
                {myReviews.length === 0 ? (
                  <div style={{ ...cardStyle, textAlign: 'center', padding: '40px 20px' }}>
                    <MessageSquare size={30} color="var(--olive)" style={{ margin: '0 auto 12px' }} />
                    <p style={{ fontWeight: 600, marginBottom: '6px' }}>You have not written any reviews yet.</p>
                    <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '16px' }}>
                      Reviews you submit on a product page will appear here.
                    </p>
                    <Link to="/shop" className="btn btn-primary btn-sm">Browse Products</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {myReviews.map((rev) => (
                      <div key={rev.id} style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.productName}</span>
                            <div style={{ fontSize: '0.78rem', color: '#888' }}>{formatDate(rev.date)}</div>
                          </div>
                          {renderStars(rev.rating)}
                        </div>
                        {rev.title && <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{rev.title}</div>}
                        <p style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.6 }}>{rev.content}</p>
                      </div>
                    ))}
                  </div>
                )}
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
