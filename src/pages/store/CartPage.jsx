import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency } from '../../utils/formatters';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartPage = () => {
  useDocumentTitle('Shopping Basket');
  const { cart, updateCartQuantity, removeFromCart, clearCart, config, setIsCartOpen } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = config.freeShippingThreshold || 999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : (config.defaultShippingFee || 99);
  const tax = Math.round(subtotal * ((config.gstPercentage || 5) / 100));
  const total = subtotal + shippingFee + tax;

  if (cart.length === 0) {
    return (
      <div className="section-padding">
        <div className="container">
          <EmptyState
            icon={ShoppingBag}
            title="Your Basket is Currently Empty"
            description="Explore our hand-picked mountain fungi and preserves."
            actionLabel="Discover Gourmet Harvests"
            onAction={() => navigate('/shop')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container">
        
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Order Summary</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
            Your Gourmet Basket
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }} className="cart-grid">
          
          {/* Items Table */}
          <div style={{ background: 'var(--white)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '12px', marginBottom: '20px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)' }}>
              <span>Product</span>
              <span>Quantity & Total</span>
            </div>

            {cart.map((item) => (
              <div key={item.cartItemId} style={{ display: 'flex', gap: '20px', paddingBottom: '20px', marginBottom: '20px', borderBottom: '1px solid var(--line)' }}>
                <img src={item.image} alt={item.name} style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', background: 'var(--parchment)' }} />
                <div style={{ flexGrow: 1 }}>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '4px' }}>{item.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: '12px' }}>{item.variant}</span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 'var(--radius-full)' }}>
                      <button onClick={() => updateCartQuantity(item.cartItemId, -1)} style={{ padding: '6px 12px', cursor: 'pointer' }}><Minus size={12} /></button>
                      <span style={{ padding: '0 12px', fontWeight: 700, fontSize: '0.85rem' }}>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.cartItemId, 1)} style={{ padding: '6px 12px', cursor: 'pointer' }}><Plus size={12} /></button>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--olive-deep)' }}>{formatCurrency(item.price * item.quantity)}</div>
                      <button onClick={() => removeFromCart(item.cartItemId)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '0.75rem', marginTop: '4px' }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
              <Button onClick={clearCart} variant="secondary" size="sm">Clear Basket</Button>
              <Link to="/shop" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--olive)' }}>← Continue Shopping</Link>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div style={{ background: 'var(--parchment)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
              Order Breakdown
            </h3>

            <div style={{ fontSize: '0.9rem', lineHeight: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated GST ({config.gstPercentage}%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Express Shipping</span>
                <span>{shippingFee === 0 ? 'FREE' : formatCurrency(shippingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, borderTop: '1px solid var(--line)', paddingTop: '12px', marginTop: '8px', color: 'var(--espresso)' }}>
                <span>Total</span>
                <span style={{ color: 'var(--olive-deep)' }}>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button onClick={() => navigate('/checkout')} variant="primary" fullWidth size="lg" style={{ marginTop: '24px' }}>
              Proceed to Checkout <ArrowRight size={16} />
            </Button>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
