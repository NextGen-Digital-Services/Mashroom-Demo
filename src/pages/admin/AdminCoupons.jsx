import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { statusSlug } from '../../utils/formatters';
import { Plus, Trash2, Pencil } from 'lucide-react';

const oneYearFromNow = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
};

const makeEmptyForm = () => ({
  code: '',
  discountType: 'percentage',
  discountValue: '',
  minOrderAmount: '499',
  maxDiscount: '500',
  expiryDate: oneYearFromNow(),
  usageLimit: '500',
  active: true,
  description: ''
});

export const AdminCoupons = () => {
  useDocumentTitle('Coupons & Offer Management');
  const { coupons, setCoupons, addToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(makeEmptyForm());

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleActive = (id) => {
    setCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));
    addToast('Coupon status updated');
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(makeEmptyForm());
    setIsModalOpen(true);
  };

  const openEditModal = (coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code || '',
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue ?? '',
      minOrderAmount: coupon.minOrderAmount ?? '',
      maxDiscount: coupon.maxDiscount ?? '',
      expiryDate: coupon.expiryDate || '',
      usageLimit: coupon.usageLimit ?? '',
      active: coupon.active !== false,
      description: coupon.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.code.trim()) {
      addToast('Coupon code is required', 'error');
      return;
    }
    if (form.discountValue === '' || Number(form.discountValue) <= 0) {
      addToast('Enter a discount value greater than zero', 'error');
      return;
    }
    if (!form.expiryDate) {
      addToast('Expiry date is required', 'error');
      return;
    }
    if (form.usageLimit === '' || Number(form.usageLimit) < 1) {
      addToast('Usage limit must be at least 1', 'error');
      return;
    }

    const normalized = form.code.trim().toUpperCase();
    const duplicate = coupons.find(
      (c) => c.id !== editingId && String(c.code || '').trim().toUpperCase() === normalized
    );
    if (duplicate) {
      addToast(`Coupon code "${normalized}" already exists`, 'error');
      return;
    }

    const payload = {
      code: normalized,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: Number(form.minOrderAmount) || 0,
      maxDiscount: Number(form.maxDiscount) || 0,
      expiryDate: form.expiryDate,
      usageLimit: Number(form.usageLimit),
      active: Boolean(form.active),
      description: form.description || `${form.discountValue}${form.discountType === 'percentage' ? '%' : '₹'} off on orders over ₹${Number(form.minOrderAmount) || 0}`
    };

    if (editingId) {
      setCoupons(coupons.map((c) => (c.id === editingId ? { ...c, ...payload } : c)));
      addToast(`Updated coupon code "${payload.code}"`);
    } else {
      const newCoupon = {
        id: `coup-${Date.now()}`,
        ...payload,
        usedCount: 0
      };
      setCoupons([newCoupon, ...coupons]);
      addToast(`Created coupon code "${newCoupon.code}"`);
    }
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
      header: 'Used',
      render: (row) => {
        const used = Number(row.usedCount) || 0;
        const limit = Number(row.usageLimit) || 0;
        const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
        return (
          <div>
            <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px' }}>{used} / {limit}</div>
            <div style={{ width: '90px', height: '6px', background: 'var(--parchment)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? 'var(--terracotta)' : 'var(--olive)' }} />
            </div>
          </div>
        );
      }
    },
    {
      header: 'Expires',
      accessor: 'expiryDate',
      render: (row) => <span style={{ fontSize: '0.8rem', color: '#666' }}>{row.expiryDate || '—'}</span>
    },
    {
      header: 'Status',
      render: (row) => (
        <button
          onClick={() => toggleActive(row.id)}
          className={`status-pill ${statusSlug(row.active ? 'Active' : 'Inactive')}`}
          style={{ cursor: 'pointer', border: 'none' }}
        >
          {row.active ? 'Active' : 'Inactive'}
        </button>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => openEditModal(row)} style={{ cursor: 'pointer', padding: '4px' }} title="Edit Coupon">
            <Pencil size={16} color="var(--olive)" />
          </button>
          <button onClick={() => handleDelete(row.id)} style={{ cursor: 'pointer', padding: '4px' }} title="Delete Coupon">
            <Trash2 size={16} color="var(--terracotta)" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="admin-card-header">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Coupons & Discount Offers</h1>
        <Button onClick={openCreateModal} variant="primary" size="sm">
          <Plus size={16} /> Create Coupon
        </Button>
      </div>

      <DataTable columns={columns} data={coupons} searchPlaceholder="Search coupon code or description..." />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Coupon Promo' : 'Create Coupon Promo'}
      >
        <form onSubmit={handleSave}>
          <FormField label="Coupon Code *" placeholder="e.g. FESTIVE20" value={form.code} onChange={(e) => setField('code', e.target.value)} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.discountType} onChange={(e) => setField('discountType', e.target.value)}>
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <FormField label="Discount Value *" type="number" value={form.discountValue} onChange={(e) => setField('discountValue', e.target.value)} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Min Order Amount (₹)" type="number" value={form.minOrderAmount} onChange={(e) => setField('minOrderAmount', e.target.value)} />
            <FormField label="Max Discount (₹)" type="number" value={form.maxDiscount} onChange={(e) => setField('maxDiscount', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Expiry Date *" type="date" value={form.expiryDate} onChange={(e) => setField('expiryDate', e.target.value)} required />
            <FormField label="Usage Limit *" type="number" value={form.usageLimit} onChange={(e) => setField('usageLimit', e.target.value)} required />
          </div>
          <FormField label="Description" value={form.description} onChange={(e) => setField('description', e.target.value)} />
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="coupon-active"
              checked={form.active}
              onChange={(e) => setField('active', e.target.checked)}
            />
            <label htmlFor="coupon-active" className="form-label" style={{ marginBottom: 0 }}>Coupon is active</label>
          </div>
          <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '16px' }}>
            {editingId ? 'Save Coupon Changes' : 'Save Coupon'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};
