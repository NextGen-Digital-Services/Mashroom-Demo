import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/common/FormField';
import { EmptyState } from '../../components/common/EmptyState';
import { Plus, Edit, Trash2, Image as ImageIcon, Newspaper } from 'lucide-react';
import { slugify, statusSlug } from '../../utils/formatters';

const emptyBlogForm = {
  title: '',
  category: 'Fungi Wellness',
  author: 'Team MANASI',
  excerpt: '',
  image: '',
  content: ''
};

const emptyBannerForm = {
  title: '',
  subtitle: '',
  image: '',
  ctaText: 'Explore Collection',
  ctaLink: '/shop',
  position: 'hero-1',
  active: true
};

export const AdminContent = () => {
  useDocumentTitle('CMS & Content Editor');
  const { blogs, setBlogs, banners, setBanners, addToast } = useStore();

  const [activeTab, setActiveTab] = useState('blogs');
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogForm, setBlogForm] = useState(emptyBlogForm);

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState(emptyBannerForm);

  const setBlogField = (key, value) => setBlogForm((prev) => ({ ...prev, [key]: value }));
  const setBannerField = (key, value) => setBannerForm((prev) => ({ ...prev, [key]: value }));

  // ---- Blogs / Journal -------------------------------------------------
  const openCreateBlog = () => {
    setEditingBlogId(null);
    setBlogForm(emptyBlogForm);
    setIsBlogModalOpen(true);
  };

  const openEditBlog = (blog) => {
    setEditingBlogId(blog.id);
    setBlogForm({
      title: blog.title || '',
      category: blog.category || '',
      author: blog.author || '',
      excerpt: blog.excerpt || '',
      image: blog.image || '',
      content: blog.content || ''
    });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = (e) => {
    e.preventDefault();
    if (!blogForm.title.trim()) {
      addToast('A title is required to publish a post', 'error');
      return;
    }
    const content = blogForm.content.trim() || `<p>${blogForm.excerpt}</p>`;

    if (editingBlogId) {
      setBlogs(blogs.map((b) => (
        b.id === editingBlogId
          ? {
              ...b,
              title: blogForm.title.trim(),
              category: blogForm.category,
              author: blogForm.author,
              excerpt: blogForm.excerpt,
              image: blogForm.image || b.image,
              content
            }
          : b
      )));
      addToast(`Updated journal post "${blogForm.title.trim()}"`);
    } else {
      const newBlog = {
        id: `blog-${Date.now()}`,
        slug: slugify(blogForm.title),
        title: blogForm.title.trim(),
        excerpt: blogForm.excerpt,
        category: blogForm.category,
        author: blogForm.author,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: '5 min read',
        image: blogForm.image || "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop",
        featured: true,
        content
      };
      setBlogs([newBlog, ...blogs]);
      addToast(`Published journal post "${newBlog.title}"`);
    }
    setIsBlogModalOpen(false);
  };

  const handleDeleteBlog = (row) => {
    if (window.confirm(`Delete journal post "${row.title}"?`)) {
      setBlogs(blogs.filter(b => b.id !== row.id));
      addToast('Journal post deleted');
    }
  };

  const blogColumns = [
    { header: 'Title', accessor: 'title', render: (row) => <strong>{row.title}</strong> },
    { header: 'Category', accessor: 'category' },
    { header: 'Author', accessor: 'author' },
    { header: 'Date', accessor: 'date' },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => openEditBlog(row)} style={{ cursor: 'pointer', padding: '4px' }} title="Edit Post"><Edit size={16} color="var(--olive)" /></button>
          <button onClick={() => handleDeleteBlog(row)} style={{ cursor: 'pointer', padding: '4px' }} title="Delete Post"><Trash2 size={16} color="var(--terracotta)" /></button>
        </div>
      )
    }
  ];

  // ---- Banners ----------------------------------------------------------
  const openCreateBanner = () => {
    setBannerForm(emptyBannerForm);
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!bannerForm.title.trim()) {
      addToast('Banner title is required', 'error');
      return;
    }
    const newBanner = {
      id: `ban-${Date.now()}`,
      title: bannerForm.title.trim(),
      subtitle: bannerForm.subtitle,
      image: bannerForm.image || 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=800&auto=format&fit=crop',
      ctaText: bannerForm.ctaText,
      ctaLink: bannerForm.ctaLink,
      position: bannerForm.position,
      active: Boolean(bannerForm.active)
    };
    setBanners([newBanner, ...banners]);
    addToast(`Created banner "${newBanner.title}"`);
    setIsBannerModalOpen(false);
  };

  const handleDeleteBanner = (id) => {
    if (window.confirm('Delete this banner?')) {
      setBanners(banners.filter((b) => b.id !== id));
      addToast('Banner deleted');
    }
  };

  const bannerColumns = [
    {
      header: 'Banner',
      accessor: 'title',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={row.image} alt={row.title} style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
          <div>
            <div style={{ fontWeight: 600 }}>{row.title}</div>
            <div style={{ fontSize: '0.75rem', color: '#777' }}>{row.subtitle}</div>
          </div>
        </div>
      )
    },
    {
      header: 'CTA Link',
      render: (row) => (
        <div style={{ fontSize: '0.8rem' }}>
          <div style={{ fontWeight: 600 }}>{row.ctaText || '—'}</div>
          <div style={{ color: '#777' }}>{row.ctaLink}</div>
        </div>
      )
    },
    { header: 'Position', accessor: 'position' },
    {
      header: 'Status',
      accessor: 'active',
      render: (row) => (
        <span className={`status-pill ${statusSlug(row.active ? 'Active' : 'Inactive')}`}>
          {row.active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <button onClick={() => handleDeleteBanner(row.id)} style={{ cursor: 'pointer', padding: '4px' }} title="Delete Banner">
          <Trash2 size={16} color="var(--terracotta)" />
        </button>
      )
    }
  ];

  const tabStyle = (isActive) => ({
    padding: '8px 4px',
    background: 'transparent',
    border: 'none',
    borderBottom: isActive ? '3px solid var(--olive)' : '3px solid transparent',
    color: isActive ? 'var(--olive-deep)' : '#888',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  return (
    <div>
      <div className="admin-card-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>CMS & Editorial Manager</h1>
          <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
            <button style={tabStyle(activeTab === 'blogs')} onClick={() => setActiveTab('blogs')}>
              <Newspaper size={15} /> Journal / Recipes
            </button>
            <button style={tabStyle(activeTab === 'banners')} onClick={() => setActiveTab('banners')}>
              <ImageIcon size={15} /> Banners
            </button>
          </div>
        </div>
        {activeTab === 'blogs' ? (
          <Button onClick={openCreateBlog} variant="primary" size="sm">
            <Plus size={16} /> Add Journal Post
          </Button>
        ) : (
          <Button onClick={openCreateBanner} variant="primary" size="sm">
            <Plus size={16} /> Add Banner
          </Button>
        )}
      </div>

      {activeTab === 'blogs' ? (
        blogs.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No journal posts yet"
            description="Publish recipes and stories from our farm to fill the Journal section."
            actionLabel="Add Journal Post"
            onAction={openCreateBlog}
          />
        ) : (
          <DataTable columns={blogColumns} data={blogs} searchPlaceholder="Search posts by title or category..." rowKey="id" />
        )
      ) : (
        banners.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="No banners yet"
            description="Create a hero or promo banner to feature on the storefront."
            actionLabel="Add Banner"
            onAction={openCreateBanner}
          />
        ) : (
          <DataTable columns={bannerColumns} data={banners} searchPlaceholder="Search banners by title or link..." rowKey="id" />
        )
      )}

      {/* Blog create / edit */}
      <Modal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        title={editingBlogId ? 'Edit Journal Entry' : 'Publish Culinary Journal Entry'}
      >
        <form onSubmit={handleSaveBlog}>
          <FormField label="Title *" value={blogForm.title} onChange={(e) => setBlogField('title', e.target.value)} required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="Category" value={blogForm.category} onChange={(e) => setBlogField('category', e.target.value)} />
            <FormField label="Author" value={blogForm.author} onChange={(e) => setBlogField('author', e.target.value)} />
          </div>
          <FormField label="Excerpt" type="textarea" rows={3} value={blogForm.excerpt} onChange={(e) => setBlogField('excerpt', e.target.value)} />
          <FormField label="Image URL" value={blogForm.image} onChange={(e) => setBlogField('image', e.target.value)} />
          <FormField label="Content (HTML)" type="textarea" rows={8} value={blogForm.content} onChange={(e) => setBlogField('content', e.target.value)} />
          <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '16px' }}>
            {editingBlogId ? 'Save Post' : 'Publish Post'}
          </Button>
        </form>
      </Modal>

      {/* Banner create */}
      <Modal isOpen={isBannerModalOpen} onClose={() => setIsBannerModalOpen(false)} title="Create Banner">
        <form onSubmit={handleSaveBanner}>
          <FormField label="Title *" value={bannerForm.title} onChange={(e) => setBannerField('title', e.target.value)} required />
          <FormField label="Subtitle" value={bannerForm.subtitle} onChange={(e) => setBannerField('subtitle', e.target.value)} />
          <FormField label="Image URL" value={bannerForm.image} onChange={(e) => setBannerField('image', e.target.value)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FormField label="CTA Text" value={bannerForm.ctaText} onChange={(e) => setBannerField('ctaText', e.target.value)} />
            <FormField label="CTA Link" value={bannerForm.ctaLink} onChange={(e) => setBannerField('ctaLink', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Position</label>
              <select className="form-select" value={bannerForm.position} onChange={(e) => setBannerField('position', e.target.value)}>
                <option value="hero-1">Hero 1</option>
                <option value="hero-2">Hero 2</option>
                <option value="promo-banner">Promo Banner</option>
              </select>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '4px' }}>
              <input
                type="checkbox"
                id="banner-active"
                checked={bannerForm.active}
                onChange={(e) => setBannerField('active', e.target.checked)}
              />
              <label htmlFor="banner-active" className="form-label" style={{ marginBottom: 0 }}>Active</label>
            </div>
          </div>
          <Button type="submit" variant="primary" fullWidth size="md" style={{ marginTop: '16px' }}>Save Banner</Button>
        </form>
      </Modal>
    </div>
  );
};
