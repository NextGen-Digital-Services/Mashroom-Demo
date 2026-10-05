import React from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useStore } from '../../context/StoreContext';

export const PolicyPage = ({ type }) => {
  const { config } = useStore();

  const titles = {
    shipping: 'Shipping & Express Delivery Policy',
    returns: 'Returns & Quality Refund Policy',
    privacy: 'Privacy & Data Protection Policy',
    terms: 'Terms of Service'
  };

  useDocumentTitle(titles[type] || 'Policy');

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
      <div className="page-hero page-hero-card" style={{ marginBottom: '32px' }}>
        <span className="eyebrow">{config.name} Policies</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
            {titles[type]}
          </h1>
        </div>

        <div style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', lineHeight: 1.8, fontSize: '0.95rem' }}>
          {type === 'shipping' && (
            <div>
              <h3>Dispatch & Shipping Thresholds</h3>
              <p>All orders placed before 2:00 PM IST are processed and dispatched on the same day from our facility. Orders exceeding <strong>₹{config.freeShippingThreshold || 999}</strong> qualify for complimentary express delivery across India.</p>
              <h3>Transit Times</h3>
              <p>Metro cities: 2-3 business days. Regional & tier-2 cities: 3-5 business days. Remote pin-codes: via India Post Speed Post.</p>
            </div>
          )}

          {type === 'returns' && (
            <div>
              <h3>Harvest Guarantee & Returns</h3>
              <p>If any jar, pouch, kit, or pack arrives damaged or compromised, please contact our team within 48 hours of receipt for a hassle-free replacement or full refund.</p>
            </div>
          )}

          {type === 'privacy' && (
            <div>
              <h3>Data Protection</h3>
              <p>Your personal data and address information are strictly used for order fulfillment and customer support updates. We never sell or share user data with third-party advertising networks.</p>
            </div>
          )}

          {type === 'terms' && (
            <div>
              <h3>Terms of Use</h3>
              <p>By accessing {config.name}, you agree to our terms of service. All gourmet recipes, brand typography, and proprietary product formulations remain the intellectual property of {config.name}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
