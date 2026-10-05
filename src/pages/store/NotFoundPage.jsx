import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button } from '../../components/common/Button';
import { Compass } from 'lucide-react';

export const NotFoundPage = () => {
  useDocumentTitle('404 Page Not Found');

  return (
    <div className="section-padding page-hero" style={{ textAlign: 'center', padding: '100px 20px' }}>
      <div className="container" style={{ maxWidth: '500px' }}>
        <Compass size={64} color="var(--terracotta)" style={{ marginBottom: '16px' }} />
        <span className="eyebrow">404 Error</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', marginBottom: '12px' }}>
          Path Not Found
        </h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>
          The harvest page or product you are looking for has been relocated or is unavailable.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">Return to Home Page</Button>
        </Link>
      </div>
    </div>
  );
};
