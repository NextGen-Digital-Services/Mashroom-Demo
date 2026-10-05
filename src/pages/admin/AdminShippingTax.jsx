import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import { Save } from 'lucide-react';

export const AdminShippingTax = () => {
  useDocumentTitle('Shipping Rates & GST Tax Configuration');
  const { shippingTax, setShippingTax } = useStore();

  const [gstPercentage, setGstPercentage] = useState(shippingTax.gstPercentage || 5);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(shippingTax.freeShippingThreshold || 999);
  const [flatShippingFee, setFlatShippingFee] = useState(shippingTax.flatShippingFee || 99);
  const [pincodeList, setPincodeList] = useState(shippingTax.pincodes ? shippingTax.pincodes.join(', ') : '');

  // Re-sync once async hydration lands (otherwise the form shows stale
  // pre-hydration values while the rest of the app already updated).
  useEffect(() => {
    setGstPercentage(shippingTax.gstPercentage ?? 5);
    setFreeShippingThreshold(shippingTax.freeShippingThreshold ?? 999);
    setFlatShippingFee(shippingTax.flatShippingFee ?? 99);
    setPincodeList(Array.isArray(shippingTax.pincodes) ? shippingTax.pincodes.join(', ') : '');
  }, [shippingTax]);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      gstPercentage: Number(gstPercentage),
      freeShippingThreshold: Number(freeShippingThreshold),
      flatShippingFee: Number(flatShippingFee),
      pincodes: pincodeList.split(',').map(p => p.trim()).filter(Boolean)
    };
    setShippingTax(updated);
  };

  return (
    <div style={{ maxWidth: '650px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Shipping & Tax Settings</h1>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>Configure GST rates, express delivery fees, and serviceable pincode whitelist.</p>
      </div>

      <div className="admin-card">
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <FormField
              label="GST Rate (%) *"
              type="number"
              value={gstPercentage}
              onChange={(e) => setGstPercentage(e.target.value)}
              required
            />
            <FormField
              label="Flat Express Courier Fee (₹) *"
              type="number"
              value={flatShippingFee}
              onChange={(e) => setFlatShippingFee(e.target.value)}
              required
            />
          </div>

          <FormField
            label="Free Shipping Threshold (₹) *"
            type="number"
            value={freeShippingThreshold}
            onChange={(e) => setFreeShippingThreshold(e.target.value)}
            required
          />

          <FormField
            label="Express Serviceable Pincodes (Comma Separated)"
            type="textarea"
            rows={4}
            value={pincodeList}
            onChange={(e) => setPincodeList(e.target.value)}
            placeholder="110001, 110003, 411001, 500033..."
          />

          <Button type="submit" variant="primary" size="md" style={{ marginTop: '16px' }}>
            <Save size={16} /> Save Rules
          </Button>
        </form>
      </div>
    </div>
  );
};
