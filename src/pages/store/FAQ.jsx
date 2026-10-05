import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQ = () => {
  useDocumentTitle('Frequently Asked Questions');
  const { faqs } = useStore();
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
      <div className="page-hero page-hero-card" style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="eyebrow">Customer Guidance</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
            Frequently Asked Questions
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqs.map((faq, idx) => (
            <div key={faq.id || idx} style={{ background: 'var(--white)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                style={{
                  width: '100%',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: openIdx === idx ? 'var(--parchment)' : 'var(--white)'
                }}
              >
                <span>{faq.question}</span>
                {openIdx === idx ? <ChevronUp size={20} color="var(--olive)" /> : <ChevronDown size={20} color="var(--espresso)" />}
              </button>

              {openIdx === idx && (
                <div style={{ padding: '20px 24px', fontSize: '0.92rem', color: '#444', lineHeight: 1.7, borderTop: '1px solid var(--line)' }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
