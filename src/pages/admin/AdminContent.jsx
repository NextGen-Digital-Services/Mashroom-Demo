import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { slugify } from '../../utils/formatters';

export const AdminContent = () => {
  useDocumentTitle('CMS & Content Editor');
  const { blogs, setBlogs, banners, setBanners, addToast } = useStore();

  const [activeTab, setActiveTab] = useState('blogs');
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Fungi Wellness');
  const [author, setAuthor] = useState('Estate Botanist');
  const [excerpt, setExcerpt] = useState('');

  const handleSaveBlog = (e) => {
    e.preventDefault();
    if (!title) return;
    const newBlog = {
      id: `blog-${Date.now()}`,
      slug: slugify(title),
      title,
      excerpt,
      category,
      author,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '5 min read',
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop",
      featured: true,
      content: `<p>${excerpt}</p>`
    };
    setBlogs([newBlog, ...blogs]);
    addToast(`Published journal post "${title}"`);
    setTitle('');
    setExcerpt('');
    setIsBlogModalOpen(false);
  };

  const blogColumns = [
    { header: 'Title', accessor: 'title', render: (row) => <strong>{row.title}</strong> },
    { header: 'Category', accessor: 'category' },
    { header: 'Author', accessor: 'author' },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Actions',
      render: (row) => (
        <button onClick={() => setBlogs(blogs.filter(b => b.id !== row.id))} style={{ cursor: 'pointer', padding: '4px' }}>
          <Trash2 size={16} color="var(--terracotta)" />
        </button>
      )
    }
  ];

  return (
    <div>
      <div className="admin-card-header">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>CMS & Editorial Manager</h1>
        <Button onClick={() => setIsBlogModalOpen(true)} variant="primary" size="sm">
          <Plus size={16} /> Add Journal Post
        </Button>
      </div>

      <DataTable columns={blogColumns} data={blogs} />

      <Modal isOpen={isBlogModalOpen} onClose={() => setIsBlogModalOpen(false)} title="Publish Culinary Journal Entry">
        <form onSubmit={handleSaveBlog}>
          <FormField label="Title *" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <FormField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
          <FormField label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          <FormField label="Excerpt" type="textarea" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
          <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '16px' }}>Publish Post</Button>
        </form>
      </Modal>
    </div>
  );
};
