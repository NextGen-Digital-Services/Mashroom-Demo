import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { Plus, Trash2, Tag } from 'lucide-react';

export const AdminCoupons = () => {
  useDocumentTitle('Coupons & Offer Management');
  const { coupons, setCoupons, addToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('499');
  const [description, setDescription] = useState('');

  const toggleActive = (id) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
    addToast('Coupon status updated');
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!code || !discountValue) return;

    const newCoupon = {
      id: `coup-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      maxDiscount: 500,
      expiryDate: "2026-12-31",
      usageLimit: 500,
      usedCount: 0,
      active: true,
      description: description || `${discountValue}${discountType === 'percentage' ? '%' : '₹'} off on orders over ₹${minOrderAmount}`
    };

    setCoupons([newCoupon, ...coupons]);
    addToast(`Created coupon code "${newCoupon.code}"`);
    setCode('');
    setDiscountValue('');
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete coupon?')) {
      setCoupons(coupons.filter(c => c.id !== id));
      addToast('Coupon deleted');
    }
  };

  const columns = [
    {
      header: 'Code',
      accessor: 'code',
      render: (row) => <strong>{row.code}</strong>
    },
    {
      header: 'Discount',
      render: (row) => (
        <span>{row.discountValue}{row.discountType === 'percentage' ? '%' : '₹'} OFF</span>
      )
    },
    {
      header: 'Min Order',
      render: (row) => <span>₹{row.minOrderAmount}</span>
    },
    {
      header: 'Status',
      render: (row) => (
        <button
          onClick={() => toggleActive(row.id)}
          className={`status-pill ${row.active ? 'active' : 'cancelled'}`}
          style={{ cursor: 'pointer', border: 'none' }}
        >
          {row.active ? 'Active' : 'Inactive'}
        </button>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <button onClick={() => handleDelete(row.id)} style={{ cursor: 'pointer', padding: '4px' }}>
          <Trash2 size={16} color="var(--terracotta)" />
        </button>
      )
    }
  ];

  return (
    <div>
      <div className="admin-card-header">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Coupons & Discount Offers</h1>
        <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm">
          <Plus size={16} /> Create Coupon
        </Button>
      </div>

      <DataTable columns={columns} data={coupons} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Coupon Promo">
        <form onSubmit={handleSave}>
          <FormField label="Coupon Code *" placeholder="e.g. FESTIVE20" value={code} onChange={(e) => setCode(e.target.value)} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={discountType} onChange={(e) => setDiscountType(e.target.value)}>
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <FormField label="Discount Value *" type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} required />
          </div>
          <FormField label="Min Order Amount (₹)" type="number" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)} />
          <FormField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '16px' }}>Save Coupon</Button>
        </form>
      </Modal>
    </div>
  );
};
