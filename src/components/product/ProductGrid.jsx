import React from 'react';
import { ProductCard } from './ProductCard';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';

export const ProductGrid = ({ products, loading = false, layout = 'grid' }) => {
  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} style={{ border: '1px solid var(--line)', padding: '16px', borderRadius: '8px' }}>
            <Skeleton height="220px" borderRadius="8px" className="mb-3" />
            <Skeleton height="20px" width="60%" className="mb-2" />
            <Skeleton height="28px" width="90%" className="mb-2" />
            <Skeleton height="16px" width="40%" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState title="No products match criteria" description="Try selecting a different category or clearing filters." />;
  }

  return (
    <div
      data-reveal-stagger
      style={{
        display: 'grid',
        gridTemplateColumns: layout === 'list' ? '1fr' : 'repeat(auto-fill, minmax(270px, 1fr))',
        gap: '24px'
      }}
    >
      {products.map((prod) => (
        <ProductCard key={prod.id} product={prod} />
      ))}
    </div>
  );
};
