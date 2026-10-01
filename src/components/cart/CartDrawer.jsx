import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Drawer } from '../common/Drawer';
import { Button } from '../common/Button';
import { Plus, Minus, Trash2, ArrowRight, Tag, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const CartDrawer = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    config,
    coupons,
    addToast
  } = useStore();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.min((subtotal * appliedCoupon.discountValue) / 100, appliedCoupon.maxDiscount || 9999);
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const freeShippingThreshold = config.freeShippingThreshold || 999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : (config.defaultShippingFee || 99);
  const gstRate = (config.gstPercentage || 5) / 100;
  const tax = Math.round((subtotal - discount) * gstRate);
  const total = Math.max(0, subtotal - discount + shippingFee + tax);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    const valid = coupons.find((c) => c.code === code && c.active);

    if (!valid) {
      addToast('Invalid or expired coupon code', 'error');
      return;
    }

    if (subtotal < valid.minOrderAmount) {
      addToast(`Minimum order amount of ₹${valid.minOrderAmount} required for coupon ${code}`, 'error');
      return;
    }

    setAppliedCoupon(valid);
    addToast(`Coupon "${code}" applied successfully!`);
    setCouponInput('');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <Drawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} title="Your Gourmet Basket">
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <ShoppingBag size={48} color="var(--olive)" style={{ marginBottom: '16px' }} />
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '8px' }}>Your basket is empty</h4>
          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '20px' }}>Discover our hand-picked mountain fungi and preserves.</p>
          <Button onClick={() => { setIsCartOpen(false); navigate('/shop'); }} size="sm">
            Browse Shop
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Free Shipping Meter */}
          <div style={{ background: 'var(--parchment)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--line)' }}>
            {remainingForFreeShipping > 0 ? (
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--espresso)', marginBottom: '6px' }}>
                Add <strong style={{ color: 'var(--terracotta)' }}>{formatCurrency(remainingForFreeShipping)}</strong> more for <strong>FREE Shipping</strong>!
              </p>
            ) : (
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--olive)', marginBottom: '6px' }}>
                🎉 Congratulations! You qualify for FREE Shipping!
              </p>
            )}
            <div style={{ height: '6px', background: 'var(--line)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--olive)', width: `${freeShippingProgress}%`, transition: 'width 0.3s ease' }} />
            </div>
          </div>

          {/* Cart Items List */}
          <div style={{ flexGrow: 1, overflowY: 'auto', marginBottom: '20px' }}>
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                style={{
                  display: 'flex',
                  gap: '14px',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                  borderBottom: '1px solid var(--line)'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', background: 'var(--parchment)' }}
                />
                <div style={{ flexGrow: 1 }}>
                  <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', lineHeight: 1.2, marginBottom: '2px' }}>
                    {item.name}
                  </h5>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    {item.variant}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 'var(--radius-full)', background: 'var(--white)' }}>
                      <button onClick={() => updateCartQuantity(item.cartItemId, -1)} style={{ padding: '4px 8px', cursor: 'pointer' }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '0 8px' }}>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.cartItemId, 1)} style={{ padding: '4px 8px', cursor: 'pointer' }}>
                        <Plus size={12} />
                      </button>
                    </div>

                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--olive-deep)' }}>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>

                <button onClick={() => removeFromCart(item.cartItemId)} style={{ cursor: 'pointer', color: '#999', alignSelf: 'flex-start', padding: '4px' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="Coupon Code (e.g. WELCOME10)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="form-input"
              style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}
            />
            <Button type="submit" size="sm" variant="secondary">
              <Tag size={12} /> Apply
            </Button>
          </form>

          {appliedCoupon && (
            <div style={{ background: '#E6F4EA', color: '#137333', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Applied: <strong>{appliedCoupon.code}</strong> (-{formatCurrency(discount)})</span>
              <button onClick={() => setAppliedCoupon(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#137333', fontWeight: 700 }}>✕</button>
            </div>
          )}

          {/* Breakdown Summary */}
          <div style={{ borderTop: '1px dashed var(--line)', paddingTop: '12px', marginBottom: '20px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--terracotta)' }}>
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span>Estimated GST ({config.gstPercentage || 5}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Shipping Fee</span>
              <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, borderTop: '1px solid var(--line)', paddingTop: '10px', color: 'var(--espresso)' }}>
              <span>Total</span>
              <span style={{ color: 'var(--olive-deep)' }}>{formatCurrency(total)}</span>
            </div>
          </div>

          <Button onClick={handleCheckout} variant="primary" fullWidth size="lg">
            Proceed to Checkout <ArrowRight size={16} />
          </Button>
          
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <Link to="/cart" onClick={() => setIsCartOpen(false)} style={{ fontSize: '0.78rem', color: 'var(--gold)', textDecoration: 'underline' }}>
              View Detailed Basket Page
            </Link>
          </div>
        </div>
      )}
    </Drawer>
  );
};
