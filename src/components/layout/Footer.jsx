import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

export const Footer = () => {
  const { config, subscribers, setSubscribers, addToast } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please enter a valid email address', 'error');
      return;
    }
    const newSubscriber = { id: `sub-${Date.now()}`, email, date: new Date().toISOString().split('T')[0] };
    setSubscribers([newSubscriber, ...subscribers]);
    addToast('Thank you for subscribing to our Mushroom Journal!');
    setEmail('');
  };

  return (
    <footer style={{ backgroundColor: 'var(--olive-deep)', color: 'var(--ivory)', paddingTop: '64px', paddingBottom: '32px', borderTop: '1px solid var(--gold)' }}>
      <div className="container">
        
        {/* Top Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
          
          {/* Brand Column */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: '12px' }}>
              {config.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#C8D1BE', lineHeight: 1.6, marginBottom: '20px' }}>
              {config.aboutShort}
            </p>
            <div style={{ display: 'flex', gap: '14px', color: 'var(--gold)' }}>
              <a href={config.socials?.instagram} target="_blank" rel="noreferrer"><Instagram size={18} /></a>
              <a href={config.socials?.facebook} target="_blank" rel="noreferrer"><Facebook size={18} /></a>
              <a href={config.socials?.youtube} target="_blank" rel="noreferrer"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Direct Shop Navigation */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '16px' }}>
              Shop Our Range
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', lineHeight: 2.2, color: '#C8D1BE' }}>
              <li><Link to="/category/fresh-mushrooms">Fresh Mushrooms</Link></li>
              <li><Link to="/category/mushroom-spawn">Mushroom Spawn</Link></li>
              <li><Link to="/category/mushroom-powder">Mushroom Powder</Link></li>
              <li><Link to="/category/mushroom-pickle">Mushroom Pickle</Link></li>
              <li><Link to="/category/sun-dried-mushrooms">Sun-Dried Mushrooms</Link></li>
              <li><Link to="/category/home-growing-kit">Home Growing Kit</Link></li>
              <li><Link to="/category/farm-combo-pack">Farm Combo Pack</Link></li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '16px' }}>
              Customer Care
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '0.85rem', lineHeight: 2.2, color: '#C8D1BE' }}>
              <li><Link to="/track-order">Track Your Order</Link></li>
              <li><Link to="/faq">Frequently Asked Questions</Link></li>
              <li><Link to="/shipping-policy">Shipping & Delivery</Link></li>
              <li><Link to="/returns-policy">Returns & Refunds</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/admin/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Admin Portal Login</Link></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--gold)', marginBottom: '12px' }}>
              Harvest Gazette
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#C8D1BE', marginBottom: '16px' }}>
              Subscribe for new arrivals, recipes, and updates from our farm.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--line)',
                  fontSize: '0.85rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--ivory)'
                }}
              />
              <button type="submit" className="btn btn-accent btn-sm" style={{ width: '100%' }}>
                Join The Club <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div style={{ borderTop: '1px solid rgba(220, 207, 180, 0.2)', borderBottom: '1px solid rgba(220, 207, 180, 0.2)', padding: '20px 0', display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', fontSize: '0.82rem', color: '#C8D1BE' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={14} color="var(--gold)" /> <span>{config.phone}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={14} color="var(--gold)" /> <span>{config.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={14} color="var(--gold)" /> <span>{config.address}</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.75rem', color: '#A0AB94' }}>
          © {new Date().getFullYear()} {config.name}. All Rights Reserved. From Our Farm. With Experience. With Care.
        </div>
      </div>
    </footer>
  );
};
