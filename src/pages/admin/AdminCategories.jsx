import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { slugify } from '../../utils/formatters';
import { Plus, Edit, Trash2 } from 'lucide-react';

export const AdminCategories = () => {
  useDocumentTitle('Category Management');
  const { categories, setCategories, products, setProducts, addToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Live product count — never reads the seeded itemCount field
  const countFor = (cat) =>
    products.filter((p) => p.categorySlug === cat.slug || p.category === cat.name).length;

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setImage('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name || !name.trim()) {
      addToast('Category name is required', 'error');
      return;
    }
    const trimmed = name.trim();
    const slug = slugify(trimmed);

    if (editingId) {
      setCategories(categories.map(c => c.id === editingId ? { ...c, name: trimmed, slug, description, image } : c));
      addToast(`Updated category "${trimmed}"`);
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: trimmed,
        slug,
        description,
        image: image || "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop",
        featured: false,
        itemCount: products.filter((p) => p.categorySlug === slug || p.category === trimmed).length
      };
      setCategories([...categories, newCat]);
      addToast(`Created category "${trimmed}"`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (cat) => {
    const count = countFor(cat);

    if (count > 0) {
      const confirmed = window.confirm(
        `"${cat.name}" contains ${count} product${count === 1 ? '' : 's'}.\n\n` +
        'OK — delete the category and leave those products uncategorized.\n' +
        'Cancel — keep the category.'
      );
      if (!confirmed) return;
      setProducts(products.map((p) =>
        p.categorySlug === cat.slug || p.category === cat.name
          ? { ...p, category: '', categorySlug: '' }
          : p
      ));
      setCategories(categories.filter(c => c.id !== cat.id));
      addToast(`Category removed — ${count} product${count === 1 ? '' : 's'} left uncategorized`);
      return;
    }

    if (window.confirm('Delete category?')) {
      setCategories(categories.filter(c => c.id !== cat.id));
      addToast('Category removed');
    }
  };

  const columns = [
    {
      header: 'Category',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={row.image} alt={row.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{row.name}</div>
            <div style={{ fontSize: '0.75rem', color: '#777' }}>/{row.slug}</div>
          </div>
        </div>
      )
    },
    { header: 'Description', accessor: 'description' },
    {
      header: 'Products',
      render: (row) => {
        const count = countFor(row);
        return (
          <span style={{ color: count > 0 ? 'var(--olive-deep)' : '#999', fontWeight: 700 }}>
            {count}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => openEditModal(row)} style={{ cursor: 'pointer', padding: '4px' }}><Edit size={16} color="var(--olive)" /></button>
          <button onClick={() => handleDelete(row)} style={{ cursor: 'pointer', padding: '4px' }}><Trash2 size={16} color="var(--terracotta)" /></button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="admin-card-header">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Categories Manager</h1>
        <Button onClick={openCreateModal} variant="primary" size="sm">
          <Plus size={16} /> Add Category
        </Button>
      </div>

      <DataTable columns={columns} data={categories} rowKey="id" />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Category' : 'Create Category'}>
        <form onSubmit={handleSave}>
          <FormField label="Category Name *" value={name} onChange={(e) => setName(e.target.value)} required />
          <FormField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <FormField label="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
          <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '16px' }}>Save Category</Button>
        </form>
      </Modal>
    </div>
  );
};
