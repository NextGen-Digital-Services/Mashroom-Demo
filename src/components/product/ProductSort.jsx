import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export const ProductSort = ({ sortBy, onSortChange, layout, onLayoutChange, totalResults }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', background: 'var(--white)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }}>
      <span style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>
        Showing <strong>{totalResults}</strong> gourmet products
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--espresso)' }}>Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '4px 10px', fontSize: '0.8rem' }}
          >
            <option value="featured">Featured Harvests</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
            <option value="newest">Newest Additions</option>
          </select>
        </div>

        <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
          <button
            onClick={() => onLayoutChange('grid')}
            style={{ padding: '6px 10px', background: layout === 'grid' ? 'var(--parchment)' : 'var(--white)', cursor: 'pointer' }}
            title="Grid view"
          >
            <LayoutGrid size={16} color="var(--espresso)" />
          </button>
          <button
            onClick={() => onLayoutChange('list')}
            style={{ padding: '6px 10px', background: layout === 'list' ? 'var(--parchment)' : 'var(--white)', cursor: 'pointer' }}
            title="List view"
          >
            <List size={16} color="var(--espresso)" />
          </button>
        </div>
      </div>
    </div>
  );
};
