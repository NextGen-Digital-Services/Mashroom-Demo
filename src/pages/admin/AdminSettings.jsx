import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import { Save, RefreshCw, AlertTriangle } from 'lucide-react';

export const AdminSettings = () => {
  useDocumentTitle('Store Settings & Data Reset');
  const { config, updateConfig, resetDemoData, addToast } = useStore();

  const [name, setName] = useState(config.name || '[BRAND_NAME]');
  const [tagline, setTagline] = useState(config.tagline || '');
  const [email, setEmail] = useState(config.email || '');
  const [phone, setPhone] = useState(config.phone || '');
  const [address, setAddress] = useState(config.address || '');
  const [announcementText, setAnnouncementText] = useState(config.announcementText || '');

  const handleSaveConfig = (e) => {
    e.preventDefault();
    updateConfig({
      ...config,
      name,
      tagline,
      email,
      phone,
      address,
      announcementText
    });
  };

  const handleResetData = () => {
    if (window.confirm('WARNING: This will reset all products, orders, customers and settings back to clean initial demo data. Continue?')) {
      resetDemoData();
    }
  };

  return (
    <div style={{ maxWidth: '750px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Estate Store Settings</h1>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>Update store identity, contact info, and reset demo data store.</p>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title" style={{ marginBottom: '20px' }}>Global Store Identification</h3>
        
        <form onSubmit={handleSaveConfig}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField
              label="Brand Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FormField
              label="Brand Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          <FormField
            label="Header Announcement Banner Text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField
              label="Concierge Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FormField
              label="Concierge Phone *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <FormField
            label="Estate Physical Address"
            type="textarea"
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Button type="submit" variant="primary" size="md" style={{ marginTop: '12px' }}>
            <Save size={16} /> Save Store Information
          </Button>
        </form>
      </div>

      {/* Danger Zone: Reset Demo Data */}
      <div className="admin-card" style={{ border: '1px solid var(--terracotta)', background: '#FDF7F5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--terracotta)' }}>
          <AlertTriangle size={24} />
          <h3 className="admin-card-title" style={{ color: 'var(--terracotta)', margin: 0 }}>Reset Demo Data</h3>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#555', marginBottom: '16px' }}>
          Restores all initial dummy products, categories, orders, customers, coupons, reviews and settings from data files.
        </p>

        <Button onClick={handleResetData} variant="accent" size="sm">
          <RefreshCw size={14} /> Reset Demo Data Store
        </Button>
      </div>

    </div>
  );
};
