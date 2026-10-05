import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Save, SaveAll } from 'lucide-react';

export const AdminInventory = () => {
  useDocumentTitle('Inventory & Stock Manager');
  const { products, setProducts, addToast } = useStore();

  const [stockMap, setStockMap] = useState({});
  const dirtyRef = useRef(new Set());

  // Re-derive from products whenever they change (initial mount, backend
  // hydration, bulk saves) while preserving rows the admin is still editing.
  useEffect(() => {
    setStockMap((prev) => {
      const next = {};
      products.forEach((p) => {
        const keepDirty = dirtyRef.current.has(p.id) && prev[p.id] !== undefined;
        next[p.id] = keepDirty ? prev[p.id] : p.stock;
      });
      return next;
    });
  }, [products]);

  const isDirty = (row) => Number(stockMap[row.id]) !== Number(row.stock);

  const handleStockChange = (id, newStock) => {
    const parsed = Number(newStock);
    const value = Number.isNaN(parsed) ? 0 : parsed;
    const product = products.find((p) => p.id === id);
    if (product && Number(product.stock) === value) dirtyRef.current.delete(id);
    else dirtyRef.current.add(id);
    setStockMap(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveStock = (id) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, stock: Number(stockMap[id] || 0) };
      }
      return p;
    });
    setProducts(updated);
    dirtyRef.current.delete(id);
    addToast('Stock level updated');
  };

  const handleSaveAll = () => {
    const dirtyRows = products.filter((p) => isDirty(p));
    if (dirtyRows.length === 0) {
      addToast('No stock changes to save', 'info');
      return;
    }
    const dirtyIds = new Set(dirtyRows.map((p) => p.id));
    const updated = products.map((p) =>
      dirtyIds.has(p.id) ? { ...p, stock: Number(stockMap[p.id] || 0) } : p
    );
    setProducts(updated);
    dirtyRef.current = new Set();
    addToast(`Stock updated for ${dirtyRows.length} product${dirtyRows.length === 1 ? '' : 's'}`);
  };

  const dirtyCount = products.filter((p) => isDirty(p)).length;

  const columns = [
    {
      header: 'Product Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: '#777' }}>SKU: {row.sku}</div>
        </div>
      )
    },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Current Stock Units',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="number"
            value={stockMap[row.id] !== undefined ? stockMap[row.id] : row.stock}
            onChange={(e) => handleStockChange(row.id, e.target.value)}
            className="form-input"
            style={{ width: '80px', padding: '4px 8px', fontSize: '0.85rem' }}
          />
          {isDirty(row) && <span className="admin-unsaved-chip">unsaved</span>}
          <Button onClick={() => handleSaveStock(row.id)} size="sm" variant="secondary">
            <Save size={12} /> Save
          </Button>
        </div>
      )
    },
    {
      header: 'Stock Status',
      render: (row) => {
        const current = stockMap[row.id] !== undefined ? Number(stockMap[row.id]) : Number(row.stock);
        if (current <= 0) return <span style={{ color: 'var(--terracotta)', fontWeight: 700 }}>Out of Stock</span>;
        if (current <= 15) return <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Low Stock Alert</span>;
        return <span style={{ color: '#137333', fontWeight: 600 }}>In Stock ({current})</span>;
      }
    }
  ];

  return (
    <div>
      <div className="admin-card-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Inventory Control</h1>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>Quickly adjust warehouse inventory and track low stock thresholds.</p>
        </div>
        <Button onClick={handleSaveAll} variant="primary" size="sm" disabled={dirtyCount === 0}>
          <SaveAll size={16} /> Save all changes{dirtyCount > 0 ? ` (${dirtyCount})` : ''}
        </Button>
      </div>

      <DataTable columns={columns} data={products} searchPlaceholder="Filter by product name or SKU..." rowKey="id" />
    </div>
  );
};
