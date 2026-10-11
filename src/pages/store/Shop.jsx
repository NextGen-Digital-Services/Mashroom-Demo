import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductFilter } from '../../components/product/ProductFilter';
import { ProductSort } from '../../components/product/ProductSort';
import { X, SlidersHorizontal } from 'lucide-react';

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
  const [filtersOpen, setFiltersOpen] = useState(false);

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

  // Lock body scroll while the mobile filter drawer is open
  useEffect(() => {
    document.body.style.overflow = filtersOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [filtersOpen]);

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

  const filterProps = {
    categories,
    selectedCategory,
    onCategoryChange: setSelectedCategory,
    priceRange,
    onPriceChange: setPriceRange,
    selectedTag,
    onTagChange: setSelectedTag,
    inStockOnly,
    onInStockChange: setInStockOnly,
    onReset: handleResetFilters
  };

  return (
    <div className="section-padding">
      <div className="container">
        
      {/* Header Title */}
      <div className="page-hero page-hero-card" style={{ marginBottom: '32px' }}>
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

        {/* Mobile: edge tab opens the filter drawer; products show directly otherwise */}
        <button className="shop-filter-edge" onClick={() => setFiltersOpen(true)} aria-label="Open filters">
          <SlidersHorizontal size={12} />
          Filter
        </button>

        {filtersOpen && (
          <>
            <div className="filter-drawer-backdrop" onClick={() => setFiltersOpen(false)} />
            <aside className="filter-drawer">
              <div className="filter-drawer-head">
                <span className="eyebrow" style={{ marginBottom: 0 }}>Refine</span>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" style={{ color: 'var(--espresso)' }}>
                  <X size={22} />
                </button>
              </div>
              <ProductFilter {...filterProps} />
            </aside>
          </>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px' }} className="shop-grid">
          
          {/* Sidebar Filters (desktop only) */}
          <aside className="shop-sidebar">
            <ProductFilter {...filterProps} />
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
        .shop-filter-edge { display: none; }
        .filter-drawer-backdrop { display: none; }
        .filter-drawer { display: none; }

        @media (max-width: 850px) {
          .shop-grid { grid-template-columns: 1fr !important; }
          .shop-sidebar { display: none !important; }

          /* edge tab — slim, hugging the phone edge so it barely takes space */
          .shop-filter-edge {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            position: fixed;
            left: 0;
            top: 42%;
            transform: translateY(-50%);
            z-index: 850;
            background: var(--olive-deep);
            color: var(--ivory);
            padding: 11px 5px;
            border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
            writing-mode: vertical-rl;
            transform: translateY(-50%) rotate(180deg);
            font-size: 0.56rem;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            box-shadow: var(--shadow-sm);
          }

          .filter-drawer-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(42, 33, 26, 0.45);
            z-index: 1000;
          }
          .filter-drawer {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: min(320px, 86vw);
            background: var(--ivory);
            z-index: 1001;
            overflow-y: auto;
            padding: 20px 16px 40px;
            box-shadow: var(--shadow-lg);
            animation: filter-drawer-in 0.28s cubic-bezier(0.22, 1, 0.36, 1);
          }
          .filter-drawer-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
          }
        }
        @keyframes filter-drawer-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .filter-drawer { animation: none; }
        }
      `}</style>
    </div>
  );
};
