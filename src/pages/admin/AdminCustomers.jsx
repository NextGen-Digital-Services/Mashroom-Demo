import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { EmptyState } from '../../components/common/EmptyState';
import { formatCurrency, formatDate, statusSlug } from '../../utils/formatters';
import { ShieldOff, ShieldCheck, Eye, Plus, Pencil, Trash2, UserPlus } from 'lucide-react';

const emptyForm = { name: '', email: '', phone: '', city: '', address: '', status: 'active' };

export const AdminCustomers = () => {
  useDocumentTitle('Customer Base Directory');
  const { customers, setCustomers, orders, addToast } = useStore();
  const [selectedId, setSelectedId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const selectedCust = selectedId ? customers.find((c) => c.id === selectedId) || null : null;

  // Live figures — seed ordersCount/totalSpent fields are never trusted.
  const statsFor = (email) => {
    const own = orders.filter(
      (o) => (o.customer?.email || '').toLowerCase() === (email || '').toLowerCase()
    );
    const paid = own.filter((o) => o.status !== 'Cancelled');
    return {
      ordersCount: own.length,
      totalSpent: paid.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
    };
  };

  const toggleBlock = (id) => {
    const updated = customers.map((c) => {
      if (c.id === id) {
        const nextStatus = c.status === 'active' ? 'blocked' : 'active';
        addToast(`Customer ${c.name} ${nextStatus === 'blocked' ? 'blocked' : 'unblocked'}`);
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setCustomers(updated);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const openEditModal = (cust) => {
    setEditingId(cust.id);
    setForm({
      name: cust.name || '',
      email: cust.email || '',
      phone: cust.phone || '',
      city: cust.city || cust.addresses?.[0]?.city || '',
      address: cust.address || cust.addresses?.[0]?.street || '',
      status: cust.status || 'active'
    });
    setIsFormOpen(true);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      addToast('Name and email are required', 'error');
      return;
    }
    const duplicate = customers.find(
      (c) => c.id !== editingId && (c.email || '').toLowerCase() === form.email.trim().toLowerCase()
    );
    if (duplicate) {
      addToast(`A customer with email "${form.email.trim()}" already exists`, 'error');
      return;
    }

    if (editingId) {
      setCustomers(customers.map((c) => (c.id === editingId ? { ...c, ...form, name: form.name.trim(), email: form.email.trim() } : c)));
      addToast(`Updated customer "${form.name.trim()}"`);
    } else {
      const newCust = {
        id: `cust-${Date.now()}`,
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        ordersCount: 0,
        totalSpent: 0,
        joinDate: new Date().toISOString().slice(0, 10),
        addresses: []
      };
      setCustomers([newCust, ...customers]);
      addToast(`Added customer "${newCust.name}"`);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (cust) => {
    if (window.confirm(`Delete customer "${cust.name}"? Their order history will stay on record.`)) {
      setCustomers(customers.filter((c) => c.id !== cust.id));
      if (selectedId === cust.id) setSelectedId(null);
      if (editingId === cust.id) setIsFormOpen(false);
      addToast('Customer deleted');
    }
  };

  const columns = [
    {
      header: 'Customer',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#777' }}>{row.email}</div>
        </div>
      )
    },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Orders',
      accessor: 'ordersCount',
      render: (row) => statsFor(row.email).ordersCount
    },
    {
      header: 'Total Spent',
      accessor: 'totalSpent',
      render: (row) => <strong>{formatCurrency(statsFor(row.email).totalSpent)}</strong>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`status-pill ${statusSlug(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setSelectedId(row.id)} style={{ cursor: 'pointer', padding: '4px' }} title="View Order History"><Eye size={16} color="var(--olive)" /></button>
          <button onClick={() => openEditModal(row)} style={{ cursor: 'pointer', padding: '4px' }} title="Edit Customer"><Pencil size={16} color="var(--gold)" /></button>
          <button onClick={() => toggleBlock(row.id)} style={{ cursor: 'pointer', padding: '4px' }} title={row.status === 'active' ? "Block Customer" : "Unblock Customer"}>
            {row.status === 'active' ? <ShieldOff size={16} color="var(--terracotta)" /> : <ShieldCheck size={16} color="#137333" />}
          </button>
          <button onClick={() => handleDelete(row)} style={{ cursor: 'pointer', padding: '4px' }} title="Delete Customer"><Trash2 size={16} color="var(--terracotta)" /></button>
        </div>
      )
    }
  ];

  const custOrders = selectedCust
    ? orders.filter((o) => (o.customer?.email || '').toLowerCase() === (selectedCust.email || '').toLowerCase())
    : [];
  const custStats = selectedCust ? statsFor(selectedCust.email) : { ordersCount: 0, totalSpent: 0 };

  return (
    <div>
      <div className="admin-card-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Customer Directory</h1>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>Order counts and spend are calculated live from your orders.</p>
        </div>
        <Button onClick={openCreateModal} variant="primary" size="sm">
          <Plus size={16} /> Add Customer
        </Button>
      </div>

      {customers.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No customers yet"
          description="Add your first customer manually, or wait for storefront registrations."
          actionLabel="Add Customer"
          onAction={openCreateModal}
        />
      ) : (
        <DataTable columns={columns} data={customers} searchPlaceholder="Search customer name, email or phone..." rowKey="id" />
      )}

      {/* Create / Edit customer */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? 'Edit Customer' : 'Add Customer'}>
        <form onSubmit={handleSaveCustomer}>
          <FormField label="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <FormField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
          <FormField label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '16px' }}>
            {editingId ? 'Save Changes' : 'Create Customer'}
          </Button>
        </form>
      </Modal>

      {/* Order history */}
      <Modal isOpen={!!selectedCust} onClose={() => setSelectedId(null)} title={selectedCust ? `Order History - ${selectedCust.name}` : ''}>
        {selectedCust && (
          <div>
            <div style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
              <div><strong>Email:</strong> {selectedCust.email}</div>
              <div><strong>Phone:</strong> {selectedCust.phone || '—'}</div>
              <div><strong>City:</strong> {selectedCust.city || selectedCust.addresses?.[0]?.city || '—'}</div>
              <div><strong>Joined:</strong> {formatDate(selectedCust.joinDate)}</div>
              <div><strong>Orders:</strong> {custStats.ordersCount} • <strong>Spent:</strong> {formatCurrency(custStats.totalSpent)}</div>
            </div>

            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '10px' }}>Past Orders</h4>
            {custOrders.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#777' }}>No order records found.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {custOrders.map((o) => (
                  <div key={o.id} style={{ background: 'var(--parchment)', padding: '12px', borderRadius: '4px', border: '1px solid var(--line)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                      <span>{o.id}</span>
                      <span>{formatCurrency(o.total)}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{formatDate(o.date)} • <span className={`status-pill ${statusSlug(o.status)}`}>{o.status}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
