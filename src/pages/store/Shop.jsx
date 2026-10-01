import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductFilter } from '../../components/product/ProductFilter';
import { ProductSort } from '../../components/product/ProductSort';
import { X } from 'lucide-react';

export const Shop = () => {
  useDocumentTitle('All Gourmet Fungi Products & Preserves');
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States synced with URL query params
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState(Number(searchParams.get('price')) || 7000);
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('stock') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');
  const [layout, setLayout] = useState('grid');

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (priceRange < 7000) params.price = priceRange;
    if (selectedTag) params.tag = selectedTag;
    if (inStockOnly) params.stock = 'true';
    if (sortBy !== 'featured') params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [selectedCategory, priceRange, selectedTag, inStockOnly, sortBy]);

  // Filtering Logic
  let filteredProducts = products.filter((prod) => {
    if (selectedCategory && prod.categorySlug !== selectedCategory) return false;
    if (prod.price > priceRange) return false;
    if (selectedTag && (!prod.tags || !prod.tags.includes(selectedTag))) return false;
    if (inStockOnly && prod.stock <= 0) return false;
    return true;
  });

  // Sorting Logic
  filteredProducts.sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'newest') return b.id.localeCompare(a.id);
    return 0; // featured default
  });

  const handleResetFilters = () => {
    setSelectedCategory('');
    setPriceRange(7000);
    setSelectedTag('');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="section-padding">
      <div className="container">
        
        {/* Header Title */}
        <div style={{ marginBottom: '32px' }}>
          <span className="eyebrow">Pantry Catalog</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
            Gourmet Mushroom Shop
          </h1>
        </div>

        {/* Active Filter Chips */}
        {(selectedCategory || selectedTag || inStockOnly || priceRange < 7000) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#666' }}>Active Filters:</span>
            {selectedCategory && (
              <span style={{ background: 'var(--parchment)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid var(--line)' }}>
                Category: {selectedCategory} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('')} />
              </span>
            )}
            {selectedTag && (
              <span style={{ background: 'var(--parchment)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid var(--line)' }}>
                Tag: {selectedTag} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedTag('')} />
              </span>
            )}
            {inStockOnly && (
              <span style={{ background: 'var(--parchment)', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '6px', border: '1px solid var(--line)' }}>
                In Stock <X size={12} style={{ cursor: 'pointer' }} onClick={() => setInStockOnly(false)} />
              </span>
            )}
            <button onClick={handleResetFilters} style={{ fontSize: '0.75rem', color: 'var(--terracotta)', textDecoration: 'underline', cursor: 'pointer', border: 'none', background: 'none' }}>
              Clear All
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }} className="shop-grid">
          
          {/* Sidebar Filters */}
          <aside>
            <ProductFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              inStockOnly={inStockOnly}
              onInStockChange={setInStockOnly}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Main Product Grid Stage */}
          <main>
            <ProductSort
              sortBy={sortBy}
              onSortChange={setSortBy}
              layout={layout}
              onLayoutChange={setLayout}
              totalResults={filteredProducts.length}
            />

            <ProductGrid products={filteredProducts} layout={layout} />
          </main>

        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .shop-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
