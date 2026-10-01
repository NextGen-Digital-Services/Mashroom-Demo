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
  const { categories, setCategories, addToast } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

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
    if (!name) return;
    const slug = slugify(name);

    if (editingId) {
      setCategories(categories.map(c => c.id === editingId ? { ...c, name, slug, description, image } : c));
      addToast(`Updated category "${name}"`);
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name,
        slug,
        description,
        image: image || "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop",
        featured: false,
        itemCount: 0
      };
      setCategories([...categories, newCat]);
      addToast(`Created category "${name}"`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete category?')) {
      setCategories(categories.filter(c => c.id !== id));
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
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => openEditModal(row)} style={{ cursor: 'pointer', padding: '4px' }}><Edit size={16} color="var(--olive)" /></button>
          <button onClick={() => handleDelete(row.id)} style={{ cursor: 'pointer', padding: '4px' }}><Trash2 size={16} color="var(--terracotta)" /></button>
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

      <DataTable columns={columns} data={categories} />

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
