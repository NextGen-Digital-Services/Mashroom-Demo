import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { ArrowRight } from 'lucide-react';

export const Recipes = () => {
  useDocumentTitle('Italian Culinary Journal & Recipes');
  const { blogs } = useStore();

  return (
    <div className="section-padding">
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="eyebrow">Artisan Culinary Guides</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-4xl)' }}>
            The Fungi Culinary Journal
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {blogs.map((blog) => (
            <div key={blog.id} style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', overflow: 'hidden' }}>
              <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                  <span>{blog.category}</span>
                  <span>{blog.readTime}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: '10px' }}>
                  {blog.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#666', marginBottom: '16px' }}>{blog.excerpt}</p>
                <Link to={`/recipes/${blog.slug}`} className="btn btn-secondary btn-sm">
                  Read Journal Entry <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
