import React from 'react';
import { useStore } from '../../context/StoreContext';

export const AnnouncementBar = () => {
  const { config } = useStore();
  return (
    <div style={{ backgroundColor: 'var(--olive-deep)', color: 'var(--parchment)', textAlign: 'center', padding: '8px 16px', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.05em' }}>
      {config.announcementText || "Complimentary Express Shipping on orders over ₹999 | Handcrafted Harvest"}
    </div>
  );
};
