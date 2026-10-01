import React from 'react';

export const ProductFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  maxPrice = 7000,
  selectedTag,
  onTagChange,
  inStockOnly,
  onInStockChange,
  onReset
}) => {
  return (
    <div style={{ background: 'var(--white)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}>Filters</h4>
        <button onClick={onReset} style={{ fontSize: '0.75rem', color: 'var(--terracotta)', fontWeight: 600, cursor: 'pointer' }}>Reset All</button>
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label className="eyebrow">Category</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <label style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="radio"
              name="cat"
              checked={!selectedCategory}
              onChange={() => onCategoryChange('')}
            />
            <span>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="radio"
                name="cat"
                checked={selectedCategory === cat.slug}
                onChange={() => onCategoryChange(cat.slug)}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label className="eyebrow" style={{ margin: 0 }}>Max Price</label>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--olive)' }}>₹{priceRange}</span>
        </div>
        <input
          type="range"
          min="200"
          max={maxPrice}
          step="100"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--olive)' }}
        />
      </div>

      {/* Tag Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label className="eyebrow">Product Tag</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
          {['Bestseller', 'New', 'Organic'].map((tag) => (
            <button
              key={tag}
              onClick={() => onTagChange(selectedTag === tag ? '' : tag)}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                border: '1px solid var(--line)',
                background: selectedTag === tag ? 'var(--olive)' : 'var(--parchment)',
                color: selectedTag === tag ? 'var(--ivory)' : 'var(--espresso)',
                cursor: 'pointer'
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock Toggle */}
      <div>
        <label style={{ fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
          />
          <span>In-Stock Only</span>
        </label>
      </div>
    </div>
  );
};
