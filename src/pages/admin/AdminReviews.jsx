import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export const AdminReviews = () => {
  useDocumentTitle('Customer Reviews Moderation');
  const { reviews, setReviews, addToast } = useStore();

  const handleStatusChange = (id, newStatus) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
    addToast(`Review status updated to ${newStatus}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete review?')) {
      setReviews(reviews.filter(r => r.id !== id));
      addToast('Review deleted');
    }
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'productName',
      render: (row) => <strong>{row.productName}</strong>
    },
    { header: 'Author', accessor: 'author' },
    {
      header: 'Rating',
      render: (row) => (
        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>
          {row.rating} ★
        </span>
      )
    },
    { header: 'Title & Comment', render: (row) => <div><div style={{ fontWeight: 600 }}>{row.title}</div><div style={{ fontSize: '0.8rem', color: '#666' }}>{row.content}</div></div> },
    {
      header: 'Status',
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
          <button onClick={() => handleStatusChange(row.id, 'approved')} style={{ cursor: 'pointer', padding: '4px' }} title="Approve"><CheckCircle size={16} color="#137333" /></button>
          <button onClick={() => handleStatusChange(row.id, 'rejected')} style={{ cursor: 'pointer', padding: '4px' }} title="Reject"><XCircle size={16} color="var(--terracotta)" /></button>
          <button onClick={() => handleDelete(row.id)} style={{ cursor: 'pointer', padding: '4px' }} title="Delete"><Trash2 size={16} color="#999" /></button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="admin-card-header">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Review Moderation Inbox</h1>
      </div>

      <DataTable columns={columns} data={reviews} searchPlaceholder="Search by product name or author..." />
    </div>
  );
};
