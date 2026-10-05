import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  useDocumentTitle('Contact Us');
  const { config, messages, setMessages, addToast } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      addToast('Please complete all required fields', 'error');
      return;
    }

    const newMsg = {
      id: `msg-${Date.now()}`,
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      message,
      date: new Date().toISOString(),
      read: false
    };

    setMessages([newMsg, ...messages]);
    addToast('Message delivered! Our farm team will reply shortly.');
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="section-padding">
      <div className="container">
        
      <div className="page-hero page-hero-card" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="eyebrow">Farm Concierge</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
            Connect With Our Farm
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }} className="contact-grid">
          
          {/* Info Card */}
          <div style={{ background: 'var(--olive-deep)', color: 'var(--ivory)', padding: '40px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--gold)', marginBottom: '16px' }}>
              Farm Headquarters
            </h3>
            <p style={{ color: '#C8D1BE', marginBottom: '32px' }}>
              We welcome wholesale inquiries, restaurant partnerships, and farm visit reservations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Phone color="var(--gold)" size={20} /> <span>{config.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <Mail color="var(--gold)" size={20} /> <span>{config.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <MapPin color="var(--gold)" size={20} /> <span>{config.address}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '20px' }}>
              Send Us A Message
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormField label="Your Name *" value={name} onChange={(e) => setName(e.target.value)} required />
              <FormField label="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <FormField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <FormField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <FormField label="Message *" type="textarea" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required />

            <Button type="submit" variant="primary" fullWidth size="md">
              <Send size={16} /> Send Inquiry
            </Button>
          </form>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
