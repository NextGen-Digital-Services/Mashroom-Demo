import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Save } from 'lucide-react';

export const AdminInventory = () => {
  useDocumentTitle('Inventory & Stock Manager');
  const { products, setProducts, addToast } = useStore();

  const [stockMap, setStockMap] = useState(() => {
    const map = {};
    products.forEach((p) => { map[p.id] = p.stock; });
    return map;
  });

  const handleStockChange = (id, newStock) => {
    setStockMap(prev => ({ ...prev, [id]: Number(newStock) }));
  };

  const handleSaveStock = (id) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return { ...p, stock: Number(stockMap[id] || 0) };
      }
      return p;
    });
    setProducts(updated);
    addToast('Stock level updated');
  };

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
          <Button onClick={() => handleSaveStock(row.id)} size="sm" variant="secondary">
            <Save size={12} /> Save
          </Button>
        </div>
      )
    },
    {
      header: 'Stock Status',
      render: (row) => {
        const current = stockMap[row.id] !== undefined ? stockMap[row.id] : row.stock;
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
      </div>

      <DataTable columns={columns} data={products} searchPlaceholder="Filter by product name or SKU..." />
    </div>
  );
};
