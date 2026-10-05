import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { MegaMenu } from './MegaMenu';

export const Header = () => {
  const { config, cart, wishlist, setIsCartOpen, products, userAuth, adminAuth, logoutUser, authReady } = useStore();
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const navigate = useNavigate();
  const searchWrapRef = useRef(null);

  // Close the compact search popup on outside click or Escape.
  useEffect(() => {
    if (!searchOpen) return;
    const onDocDown = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setSearchOpen(false);
        setShowSearchDropdown(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === 'Escape') { setSearchOpen(false); setShowSearchDropdown(false); }
    };
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [searchOpen]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchDropdown(false);
      setSearchOpen(false);
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
            {config.subtitle || "Fresh Mushrooms & Mushroom Products"}
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

          {/* Search — hover/tap the icon to pop a small search bar below */}
          <div
            ref={searchWrapRef}
            onMouseEnter={() => setSearchOpen(true)}
            onMouseLeave={() => { setSearchOpen(false); setShowSearchDropdown(false); }}
            style={{ position: 'relative' }}
          >
            <button
              onClick={() => { setSearchOpen((v) => !v); setShowSearchDropdown(false); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--espresso)', background: 'none',
                border: 'none', padding: '4px'
              }}
              title="Search"
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <Search size={22} />
            </button>

            {searchOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: 'min(320px, calc(100vw - 40px))',
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  padding: '8px',
                  zIndex: 999
                }}
              >
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search…"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDropdown(true); }}
                    onFocus={() => setShowSearchDropdown(true)}
                    style={{
                      flex: 1, minWidth: 0,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--line)',
                      fontSize: '0.85rem',
                      background: 'var(--parchment)'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '32px', height: '32px', flexShrink: 0,
                      borderRadius: '50%', border: 'none', cursor: 'pointer',
                      background: 'var(--olive)', color: '#fff'
                    }}
                    aria-label="Submit search"
                  >
                    <Search size={15} />
                  </button>
                </form>

                {showSearchDropdown && searchResults.length > 0 && (
                  <div style={{ marginTop: '8px', overflow: 'hidden' }}>
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.slug}`}
                        onClick={() => { setSearchOpen(false); setShowSearchDropdown(false); setSearchQuery(''); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '7px 8px', borderRadius: 'var(--radius-sm, 6px)',
                          fontSize: '0.82rem'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--parchment)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <img src={item.images[0]} alt={item.name} style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: 600, color: 'var(--espresso)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--gold)' }}>₹{item.price}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
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
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAccountMenu((v) => !v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                color: 'var(--espresso)',
                background: 'none',
                border: 'none',
                padding: '4px'
              }}
              title={userAuth ? `Account (${userAuth.name})` : 'Login / Register'}
              aria-label="Account menu"
            >
              <User size={22} />
              {authReady && userAuth && (
                <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                  {String(userAuth.name || '').split(' ')[0]}
                </span>
              )}
              {adminAuth && (
                <span style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--olive)', color: '#fff', padding: '2px 6px', borderRadius: 'var(--radius-full)' }}>
                  Admin
                </span>
              )}
            </button>

            {showAccountMenu && (
              <>
                <div
                  onClick={() => setShowAccountMenu(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 997 }}
                />
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 10px)',
                    width: '230px',
                    background: 'var(--white)',
                    border: '1px solid var(--line)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-md)',
                    zIndex: 999,
                    overflow: 'hidden',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', background: 'var(--parchment)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--espresso)' }}>
                      {authReady && userAuth ? userAuth.name : 'Welcome'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#777' }}>
                      {authReady && userAuth ? userAuth.email : 'Sign in to track orders & saves addresses'}
                    </div>
                  </div>

                  <Link
                    to="/account"
                    onClick={() => setShowAccountMenu(false)}
                    style={{ display: 'block', padding: '11px 16px', color: 'var(--espresso)', fontWeight: 600 }}
                  >
                    {userAuth ? 'My Account' : 'Sign In / Register'}
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setShowAccountMenu(false)}
                    style={{ display: 'block', padding: '11px 16px', color: 'var(--espresso)', fontWeight: 600 }}
                  >
                    My Wishlist
                  </Link>
                  <Link
                    to="/track-order"
                    onClick={() => setShowAccountMenu(false)}
                    style={{ display: 'block', padding: '11px 16px', color: 'var(--espresso)', fontWeight: 600 }}
                  >
                    Track Order
                  </Link>
                  <Link
                    to={adminAuth ? '/admin' : '/admin/login'}
                    onClick={() => setShowAccountMenu(false)}
                    style={{ display: 'block', padding: '11px 16px', color: 'var(--gold)', fontWeight: 700, borderTop: '1px solid var(--line)' }}
                  >
                    Admin Portal →
                  </Link>
                  {userAuth && (
                    <button
                      onClick={() => {
                        setShowAccountMenu(false);
                        logoutUser();
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '11px 16px',
                        border: 'none',
                        borderTop: '1px solid var(--line)',
                        background: 'none',
                        color: '#b23b2e',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
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
            <Link to={adminAuth ? '/admin' : '/admin/login'} onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--gold)', fontWeight: 600 }}>Admin Portal →</Link>
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
