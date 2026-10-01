import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Download, Mail } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const AdminMessages = () => {
  useDocumentTitle('Messages & Subscribers');
  const { messages, subscribers, addToast } = useStore();

  const exportSubscribersCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["ID,Email,Subscribed Date", ...subscribers.map(s => `${s.id},${s.email},${s.date}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Downloaded subscribers CSV export');
  };

  const messageColumns = [
    {
      header: 'Sender',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#777' }}>{row.email} • {row.phone}</div>
        </div>
      )
    },
    { header: 'Subject', accessor: 'subject', render: (row) => <strong>{row.subject}</strong> },
    { header: 'Message', accessor: 'message', render: (row) => <div style={{ fontSize: '0.85rem', color: '#444' }}>{row.message}</div> },
    { header: 'Date', accessor: 'date', render: (row) => <span style={{ fontSize: '0.78rem' }}>{formatDate(row.date)}</span> }
  ];

  return (
    <div>
      <div className="admin-card-header">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Concierge Inbox</h1>
      </div>

      <DataTable columns={messageColumns} data={messages} searchPlaceholder="Search messages..." />

      {/* Newsletter Subscribers Section */}
      <div className="admin-card" style={{ marginTop: '32px' }}>
        <div className="admin-card-header">
          <div>
            <h3 className="admin-card-title">Harvest Gazette Newsletter Subscribers ({subscribers.length})</h3>
            <p style={{ fontSize: '0.82rem', color: '#666' }}>Active customer email list.</p>
          </div>
          <Button onClick={exportSubscribersCSV} variant="secondary" size="sm">
            <Download size={14} /> Export Subscribers CSV
          </Button>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {subscribers.map((s) => (
            <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--parchment)', borderRadius: '4px', fontSize: '0.85rem' }}>
              <span><Mail size={14} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {s.email}</span>
              <span style={{ color: '#777' }}>Joined {s.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
