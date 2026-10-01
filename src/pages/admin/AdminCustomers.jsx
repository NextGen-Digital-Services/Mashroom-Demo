import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ShieldOff, ShieldCheck, Eye } from 'lucide-react';

export const AdminCustomers = () => {
  useDocumentTitle('Customer Base Directory');
  const { customers, setCustomers, orders, addToast } = useStore();
  const [selectedCust, setSelectedCust] = useState(null);

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
    { header: 'Orders', accessor: 'ordersCount' },
    {
      header: 'Total Spent',
      accessor: 'totalSpent',
      render: (row) => <strong>{formatCurrency(row.totalSpent)}</strong>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`status-pill ${row.status}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setSelectedCust(row)} style={{ cursor: 'pointer', padding: '4px' }} title="View Order History"><Eye size={16} color="var(--olive)" /></button>
          <button onClick={() => toggleBlock(row.id)} style={{ cursor: 'pointer', padding: '4px' }} title={row.status === 'active' ? "Block Customer" : "Unblock Customer"}>
            {row.status === 'active' ? <ShieldOff size={16} color="var(--terracotta)" /> : <ShieldCheck size={16} color="#137333" />}
          </button>
        </div>
      )
    }
  ];

  const custOrders = selectedCust ? orders.filter(o => o.customer.email === selectedCust.email) : [];

  return (
    <div>
      <div className="admin-card-header">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Customer Directory</h1>
      </div>

      <DataTable columns={columns} data={customers} searchPlaceholder="Search customer name, email or phone..." />

      <Modal isOpen={!!selectedCust} onClose={() => setSelectedCust(null)} title={selectedCust ? `Order History - ${selectedCust.name}` : ''}>
        {selectedCust && (
          <div>
            <div style={{ marginBottom: '16px', fontSize: '0.88rem' }}>
              <div><strong>Email:</strong> {selectedCust.email}</div>
              <div><strong>Phone:</strong> {selectedCust.phone}</div>
              <div><strong>Joined:</strong> {formatDate(selectedCust.joinDate)}</div>
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
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{formatDate(o.date)} • {o.status}</div>
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
