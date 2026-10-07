import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { NotFoundPage } from './NotFoundPage';

export const RecipeDetail = () => {
  const { slug } = useParams();
  const { blogs } = useStore();

  const blog = blogs.find((b) => b.slug === slug);
  useDocumentTitle(blog ? blog.title : 'Journal Article');

  if (!blog) return <NotFoundPage />;

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="page-hero page-hero-card" style={{ marginBottom: '24px' }}>
          <Link to="/recipes" style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 600 }}>← Back to Journal</Link>
          <span className="eyebrow" style={{ marginTop: '12px' }}>{blog.category}</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)', marginBottom: '12px' }}>
            {blog.title}
          </h1>
          <div style={{ fontSize: '0.85rem', color: '#777' }}>By {blog.author} • {blog.date}</div>
        </div>

        <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '32px' }} />

        <div data-reveal className="journal-body" style={{ background: 'var(--white)', padding: '32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </div>
  );
};
