import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Search } from 'lucide-react';

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  useDocumentTitle(`Search results for "${query}"`);

  const { products } = useStore();

  const matchingProducts = query.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
        (p.ingredients && p.ingredients.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="section-padding">
      <div className="container">
        
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Search Results</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
            Showing results for "{query}"
          </h1>
          <p style={{ color: '#666', marginTop: '4px' }}>
            Found {matchingProducts.length} matching products
          </p>
        </div>

        <ProductGrid products={matchingProducts} />
      </div>
    </div>
  );
};
