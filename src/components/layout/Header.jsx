import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { MegaMenu } from './MegaMenu';

export const Header = () => {
  const { config, cart, wishlist, setIsCartOpen, products, userAuth } = useStore();
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const navigate = useNavigate();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchDropdown(false);
    }
  };

  return (
    <header
      style={{ position: 'sticky', top: 0, zIndex: 900, backgroundColor: 'var(--ivory)', borderBottom: '1px solid var(--line)' }}
      onMouseLeave={() => setShowMegaMenu(false)}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--header-height)' }}>
        
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', cursor: 'pointer' }}
          className="mobile-hamburger"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Wordmark Logo */}
        <Link to="/" style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--espresso)', lineHeight: 1 }}>
            {config.name}
          </span>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--gold)', marginTop: '2px' }}>
            {config.subtitle || "Artisan Delicacies"}
          </span>
        </Link>

        {/* Navigation Links Desktop */}
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link to="/" style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Home</Link>
          
          <div onMouseEnter={() => setShowMegaMenu(true)}>
            <Link
              to="/shop"
              style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Shop <ChevronDown size={14} />
            </Link>
          </div>

          <Link to="/our-farm" style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Our Farm</Link>
          <Link to="/recipes" style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Journal</Link>
          <Link to="/about" style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>About Us</Link>
          <Link to="/contact" style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contact</Link>
        </nav>

        {/* Actions (Search, Wishlist, Cart, User) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          
          {/* Live Search */}
          <div style={{ position: 'relative' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search fungi..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                style={{
                  width: '160px',
                  padding: '6px 12px 6px 30px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--line)',
                  fontSize: '0.8rem',
                  background: 'var(--parchment)'
                }}
              />
              <Search size={14} style={{ position: 'absolute', left: '10px', color: '#888' }} />
            </form>

            {/* Live Suggestions Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '280px',
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  marginTop: '8px',
                  zIndex: 999,
                  overflow: 'hidden'
                }}
              >
                {searchResults.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.slug}`}
                    onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderBottom: '1px solid var(--line)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <img src={item.images[0]} alt={item.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--espresso)' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gold)' }}>₹{item.price}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Icon */}
          <Link to="/wishlist" style={{ position: 'relative', color: 'var(--espresso)' }} title="Wishlist">
            <Heart size={22} />
            {wishlist.length > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'var(--terracotta)', color: '#fff', fontSize: '0.65rem', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{ position: 'relative', cursor: 'pointer', color: 'var(--espresso)' }}
            title="Cart"
          >
            <ShoppingBag size={22} />
            {totalCartCount > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'var(--olive)', color: '#fff', fontSize: '0.65rem', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {totalCartCount}
              </span>
            )}
          </button>

          {/* User Account / Login */}
          <Link to="/account" style={{ color: 'var(--espresso)' }} title={userAuth ? `Account (${userAuth.name})` : "Login / Register"}>
            <User size={22} />
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{ padding: '20px', background: 'var(--ivory)', borderTop: '1px solid var(--line)' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop All Products</Link>
            <Link to="/our-farm" onClick={() => setMobileMenuOpen(false)}>Our Farm</Link>
            <Link to="/recipes" onClick={() => setMobileMenuOpen(false)}>Culinary Journal</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--terracotta)', fontWeight: 700 }}>Track Order</Link>
            <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--gold)', fontWeight: 600 }}>Admin Portal →</Link>
          </nav>
        </div>
      )}

      {/* Desktop Mega Menu */}
      {showMegaMenu && (
        <MegaMenu
          onClose={() => setShowMegaMenu(false)}
          onMouseEnter={() => setShowMegaMenu(true)}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: block !important; }
        }
      `}</style>
    </header>
  );
};
