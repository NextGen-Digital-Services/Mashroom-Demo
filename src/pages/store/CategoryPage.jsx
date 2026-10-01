import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ProductGrid } from '../../components/product/ProductGrid';
import { NotFoundPage } from './NotFoundPage';

export const CategoryPage = () => {
  const { slug } = useParams();
  const { categories, products } = useStore();

  const category = categories.find((c) => c.slug === slug);
  useDocumentTitle(category ? category.name : 'Category');

  if (!category) {
    return <NotFoundPage />;
  }

  const categoryProducts = products.filter((p) => p.categorySlug === slug);

  return (
    <div>
      {/* Category Hero Banner */}
      <div style={{ backgroundColor: 'var(--parchment)', padding: '48px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <span className="eyebrow"><Link to="/shop">Pantry Catalog</Link> / Category</span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', marginBottom: '8px' }}>
              {category.name}
            </h1>
            <p style={{ color: '#555', maxWidth: '600px', fontSize: '1rem' }}>
              {category.description}
            </p>
          </div>
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              style={{ width: '160px', height: '120px', objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}
            />
          )}
        </div>
      </div>

      {/* Product List */}
      <div className="section-padding">
        <div className="container">
          <ProductGrid products={categoryProducts} />
        </div>
      </div>
    </div>
  );
};
