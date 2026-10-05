import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ProductGrid } from '../../components/product/ProductGrid';
import { EmptyState } from '../../components/common/EmptyState';
import { Heart } from 'lucide-react';

export const WishlistPage = () => {
  useDocumentTitle('Your Saved Wishlist');
  const { wishlist } = useStore();

  return (
    <div className="section-padding">
      <div className="container">
        
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Saved Harvest Favorites</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
            Your Wishlist
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Explore our harvest catalog and tap the heart icon to save products."
          />
        ) : (
          <ProductGrid products={wishlist} />
        )}
      </div>
    </div>
  );
};
