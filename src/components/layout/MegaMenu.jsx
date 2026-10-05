import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { images } from '../../data/images';
import { ArrowRight } from 'lucide-react';

export const MegaMenu = ({ onClose, onMouseEnter }) => {
  const { categories, products, config } = useStore();
  const combo = products.find((p) => p.slug === 'farm-combo-pack');

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: 'var(--white)',
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        boxShadow: 'var(--shadow-md)',
        padding: '32px 0',
        zIndex: 1000
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onClose}
    >
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '40px', alignItems: 'flex-start' }}>
        
        {/* Column 1: Fungi Categories (~25%) */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '16px', color: 'var(--gold)', letterSpacing: '0.05em' }}>
            Fungi Categories
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {categories.map((cat) => (
              <li key={cat.id} style={{ marginBottom: '10px' }}>
                <Link
                  to={`/category/${cat.slug}`}
                  onClick={onClose}
                  style={{ fontSize: '0.9rem', color: 'var(--espresso)', fontWeight: 500, display: 'inline-block', whiteSpace: 'nowrap' }}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Curated Collections (~25%) */}
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', marginBottom: '16px', color: 'var(--gold)', letterSpacing: '0.05em' }}>
            Curated Collections
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/shop?tag=Bestseller" onClick={onClose} style={{ fontSize: '0.9rem', color: 'var(--espresso)', fontWeight: 500, display: 'inline-block', whiteSpace: 'nowrap' }}>
                ★ Bestsellers
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/category/fresh-mushrooms" onClick={onClose} style={{ fontSize: '0.9rem', color: 'var(--espresso)', fontWeight: 500, display: 'inline-block', whiteSpace: 'nowrap' }}>
                🌱 Fresh From Our Farm
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/shop?tag=New" onClick={onClose} style={{ fontSize: '0.9rem', color: 'var(--espresso)', fontWeight: 500, display: 'inline-block', whiteSpace: 'nowrap' }}>
                ✨ New In The Range
              </Link>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/recipes" onClick={onClose} style={{ fontSize: '0.9rem', color: 'var(--espresso)', fontWeight: 500, display: 'inline-block', whiteSpace: 'nowrap' }}>
                📖 Mushroom Culinary Journal
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Featured Combo Pack (~50%) */}
        <div style={{ background: 'var(--parchment)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <img
            src={images.products.comboMaster[0]}
            alt="Farm Combo Pack"
            style={{ width: '130px', height: '130px', objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0, border: '1px solid var(--line)' }}
          />
          <div style={{ flex: 1 }}>
            <span className="eyebrow" style={{ color: 'var(--gold)', display: 'block', marginBottom: '4px' }}>Featured Combo</span>
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', marginBottom: '8px', color: 'var(--espresso)', lineHeight: 1.2 }}>
              Farm Combo Pack
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#555', marginBottom: '16px', lineHeight: 1.5 }}>
              Selected mushroom products together in one convenient package — an easy way to explore more of our range.
            </p>
            <Link to="/product/farm-combo-pack" onClick={onClose} className="btn btn-primary btn-sm">
              {combo ? `View Combo (${config.currencySymbol}${combo.price.toLocaleString('en-IN')})` : 'View Combo'} <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
