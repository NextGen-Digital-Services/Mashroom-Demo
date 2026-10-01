import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { formatCurrency, slugify } from '../../utils/formatters';
import { Plus, Edit, Copy, Trash2, Image } from 'lucide-react';

export const AdminProducts = () => {
  useDocumentTitle('Product Catalog Management');
  const { products, setProducts, categories, addToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [categorySlug, setCategorySlug] = useState('mushroom-powder');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [tag, setTag] = useState('Organic');
  const [shortDesc, setShortDesc] = useState('');
  const [longDesc, setLongDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setCategorySlug(categories[0]?.slug || 'mushroom-powder');
    setPrice('');
    setCompareAtPrice('');
    setStock('25');
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setTag('Organic');
    setShortDesc('');
    setLongDesc('');
    setImageUrl('');
    setImagePreview('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setCategorySlug(product.categorySlug);
    setPrice(product.price);
    setCompareAtPrice(product.compareAtPrice || '');
    setStock(product.stock);
    setSku(product.sku);
    setTag(product.tags?.[0] || 'Organic');
    setShortDesc(product.shortDescription);
    setLongDesc(product.longDescription);
    setImageUrl(product.images?.[0] || '');
    setImagePreview(product.images?.[0] || '');
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!name || !price) {
      addToast('Name and price are required', 'error');
      return;
    }

    const catObj = categories.find(c => c.slug === categorySlug);
    const finalImage = imagePreview || imageUrl || "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop";

    if (editingId) {
      const updated = products.map((p) => {
        if (p.id === editingId) {
          return {
            ...p,
            name,
            slug: slugify(name),
            category: catObj ? catObj.name : p.category,
            categorySlug,
            price: Number(price),
            compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
            stock: Number(stock),
            sku,
            tags: [tag],
            shortDescription: shortDesc,
            longDescription: longDesc,
            images: [finalImage, ...(p.images ? p.images.slice(1) : [])]
          };
        }
        return p;
      });
      setProducts(updated);
      addToast(`Updated product "${name}"`);
    } else {
      const newProd = {
        id: `prod-${Date.now()}`,
        slug: slugify(name),
        name,
        category: catObj ? catObj.name : 'Mushroom Powder',
        categorySlug,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        stock: Number(stock),
        sku,
        rating: 5.0,
        reviewCount: 0,
        shortDescription: shortDesc || 'Artisan estate harvest',
        longDescription: longDesc || 'Crafted with traditional mountain log methods.',
        ingredients: '100% Organic Fungi',
        benefits: ['High purity', 'Artisanal harvest'],
        usage: 'Consume daily with warm tonic.',
        shelfLife: '24 Months',
        tags: [tag],
        images: [finalImage],
        status: 'active'
      };
      setProducts([newProd, ...products]);
      addToast(`Created product "${name}"`);
    }
    setIsModalOpen(false);
  };

  const handleDuplicate = (product) => {
    const dup = {
      ...product,
      id: `prod-${Date.now()}`,
      name: `${product.name} (Copy)`,
      slug: slugify(`${product.name}-copy`),
      sku: `${product.sku}-COPY`
    };
    setProducts([dup, ...products]);
    addToast(`Duplicated "${product.name}"`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      addToast('Product deleted', 'info');
    }
  };

  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={row.images?.[0]} alt={row.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#777' }}>SKU: {row.sku}</div>
          </div>
        </div>
      )
    },
    { header: 'Category', accessor: 'category' },
    {
      header: 'Price',
      accessor: 'price',
      render: (row) => <strong>{formatCurrency(row.price)}</strong>
    },
    {
      header: 'Stock',
      accessor: 'stock',
      render: (row) => (
        <span style={{ color: row.stock <= 15 ? 'var(--terracotta)' : '#137333', fontWeight: 700 }}>
          {row.stock} units
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => openEditModal(row)} style={{ cursor: 'pointer', padding: '4px' }} title="Edit"><Edit size={16} color="var(--olive)" /></button>
          <button onClick={() => handleDuplicate(row)} style={{ cursor: 'pointer', padding: '4px' }} title="Duplicate"><Copy size={16} color="var(--gold)" /></button>
          <button onClick={() => handleDelete(row.id)} style={{ cursor: 'pointer', padding: '4px' }} title="Delete"><Trash2 size={16} color="var(--terracotta)" /></button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="admin-card-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Product Catalog</h1>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>Manage inventory, pricing, images and product variants.</p>
        </div>
        <Button onClick={openCreateModal} variant="primary" size="sm">
          <Plus size={16} /> Add New Product
        </Button>
      </div>

      <DataTable columns={columns} data={products} searchPlaceholder="Search by name, SKU or category..." />

      {/* Add / Edit Modal Form */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Product' : 'Add New Product'}>
        <form onSubmit={handleSaveProduct}>
          <FormField label="Product Name *" value={name} onChange={(e) => setName(e.target.value)} required />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tag Badge</label>
              <select className="form-select" value={tag} onChange={(e) => setTag(e.target.value)}>
                <option value="Organic">Organic</option>
                <option value="Bestseller">Bestseller</option>
                <option value="New">New Season</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FormField label="Price (₹) *" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <FormField label="Compare Price (₹)" type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} />
            <FormField label="Stock Units *" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </div>

          <FormField label="SKU Code" value={sku} onChange={(e) => setSku(e.target.value)} />
          <FormField label="Short Description" value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} />
          <FormField label="Detailed Description" type="textarea" rows={3} value={longDesc} onChange={(e) => setLongDesc(e.target.value)} />

          {/* Image Upload / URL Input */}
          <div className="form-group">
            <label className="form-label">Product Image (URL or Local File)</label>
            <input
              type="text"
              placeholder="Paste Image URL..."
              value={imageUrl}
              onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value); }}
              className="form-input"
              style={{ marginBottom: '8px' }}
            />
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ fontSize: '0.8rem' }} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', objectFit: 'cover', marginTop: '8px', borderRadius: '4px', border: '1px solid var(--line)' }} />
            )}
          </div>

          <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '16px' }}>
            {editingId ? 'Save Product Changes' : 'Publish Product'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};
