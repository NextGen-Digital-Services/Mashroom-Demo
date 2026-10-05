import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { Download, Mail, Eye, Trash2, MailOpen, MailPlus, Inbox } from 'lucide-react';
import { formatDate, statusSlug } from '../../utils/formatters';

const csvEscape = (value) => `"${String(value === null || value === undefined ? '' : value).replace(/"/g, '""')}"`;

const downloadCSV = (rows, filename) => {
  const body = rows.map((row) => row.map(csvEscape).join(',')).join('\n');
  const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(body);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const AdminMessages = () => {
  useDocumentTitle('Messages & Subscribers');
  const { messages, setMessages, subscribers, setSubscribers, addToast } = useStore();
  const [selectedId, setSelectedId] = useState(null);

  const selected = selectedId ? messages.find((m) => m.id === selectedId) || null : null;

  const exportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      addToast('No subscribers to export', 'error');
      return;
    }
    downloadCSV(
      [['ID', 'Email', 'Subscribed Date'], ...subscribers.map((s) => [s.id, s.email, s.date])],
      'subscribers_export.csv'
    );
    addToast('Downloaded subscribers CSV export');
  };

  const toggleRead = (id) => {
    let nextRead = false;
    const next = messages.map((m) => {
      if (m.id === id) {
        nextRead = !m.read;
        return { ...m, read: nextRead };
      }
      return m;
    });
    setMessages(next);
    addToast(nextRead ? 'Message marked as read' : 'Message marked as unread', 'info');
  };

  const deleteMessage = (id) => {
    if (window.confirm('Delete this message? This cannot be undone.')) {
      setMessages(messages.filter((m) => m.id !== id));
      if (selectedId === id) setSelectedId(null);
      addToast('Message deleted');
    }
  };

  const deleteSubscriber = (id) => {
    if (window.confirm('Remove this subscriber from the newsletter list?')) {
      setSubscribers(subscribers.filter((s) => s.id !== id));
      addToast('Subscriber removed');
    }
  };

  const replyLink = (m) => `mailto:${m.email}?subject=Re: ${m.subject}`;

  const renderActions = (m) => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={() => setSelectedId(m.id)} style={{ cursor: 'pointer', padding: '4px' }} title="View Message">
        <Eye size={16} color="var(--olive)" />
      </button>
      <button onClick={() => toggleRead(m.id)} style={{ cursor: 'pointer', padding: '4px' }} title={m.read ? 'Mark Unread' : 'Mark Read'}>
        {m.read ? <MailPlus size={16} color="var(--gold)" /> : <MailOpen size={16} color="#1A73E8" />}
      </button>
      <a href={replyLink(m)} style={{ cursor: 'pointer', padding: '4px', display: 'inline-flex' }} title="Reply by Email">
        <Mail size={16} color="var(--espresso)" />
      </a>
      <button onClick={() => deleteMessage(m.id)} style={{ cursor: 'pointer', padding: '4px' }} title="Delete">
        <Trash2 size={16} color="var(--terracotta)" />
      </button>
    </div>
  );

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
    {
      header: 'Subject',
      accessor: 'subject',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <strong>{row.subject}</strong>
          <span className={`status-pill ${statusSlug(row.read ? 'Read' : 'Unread')}`}>
            {row.read ? 'Read' : 'Unread'}
          </span>
        </div>
      )
    },
    { header: 'Message', accessor: 'message', render: (row) => <div style={{ fontSize: '0.85rem', color: '#444', maxWidth: '320px' }}>{row.message}</div> },
    { header: 'Date', accessor: 'date', render: (row) => <span style={{ fontSize: '0.78rem' }}>{formatDate(row.date)}</span> },
    { header: 'Actions', render: (row) => renderActions(row) }
  ];

  return (
    <div>
      <div className="admin-card-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Messages Inbox</h1>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            {messages.filter((m) => !m.read).length} unread of {messages.length} inquiries
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No messages yet"
          description="Customer inquiries from the contact form will land here."
        />
      ) : (
        <DataTable columns={messageColumns} data={messages} searchPlaceholder="Search messages..." rowKey="id" />
      )}

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

        {subscribers.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="No subscribers yet"
            description="Signups from the newsletter footer form will appear here."
          />
        ) : (
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {subscribers.map((s) => (
              <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--parchment)', borderRadius: '4px', fontSize: '0.85rem' }}>
                <span><Mail size={14} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> {s.email}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#777' }}>Joined {formatDate(s.date)}</span>
                  <button onClick={() => deleteSubscriber(s.id)} style={{ cursor: 'pointer', padding: '4px' }} title="Delete Subscriber">
                    <Trash2 size={15} color="var(--terracotta)" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Full message detail */}
      <Modal isOpen={!!selected} onClose={() => setSelectedId(null)} title={selected ? selected.subject : ''}>
        {selected && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className={`status-pill ${statusSlug(selected.read ? 'Read' : 'Unread')}`}>
                {selected.read ? 'Read' : 'Unread'}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#777' }}>{formatDate(selected.date)}</span>
            </div>

            <div style={{ fontSize: '0.88rem', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Name:</strong> {selected.name}</div>
              <div><strong>Email:</strong> {selected.email}</div>
              <div><strong>Phone:</strong> {selected.phone || '—'}</div>
              <div><strong>Subject:</strong> {selected.subject}</div>
            </div>

            <div style={{ background: 'var(--parchment)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', padding: '14px', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {selected.message}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <Button onClick={() => toggleRead(selected.id)} variant="secondary" size="sm">
                {selected.read ? <MailPlus size={14} /> : <MailOpen size={14} />}
                {selected.read ? 'Mark Unread' : 'Mark Read'}
              </Button>
              <a href={replyLink(selected)} className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                <Mail size={14} /> Reply
              </a>
              <Button onClick={() => deleteMessage(selected.id)} variant="secondary" size="sm">
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
