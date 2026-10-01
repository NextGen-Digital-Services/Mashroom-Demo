import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = "No items found",
  description = "There is no content available in this view at the moment.",
  actionLabel,
  onAction
}) => {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px', background: 'var(--parchment)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--line)' }}>
      <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--ivory)', borderRadius: '50%', color: 'var(--olive)', marginBottom: '16px' }}>
        <Icon size={36} />
      </div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: '#666', maxWidth: '400px', margin: '0 auto 20px', fontSize: '0.9rem' }}>{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
