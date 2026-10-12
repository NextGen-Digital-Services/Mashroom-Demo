import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const TABS = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/shop', label: 'Shop', Icon: LayoutGrid },
  { to: '/cart', label: 'Cart', Icon: ShoppingBag, hasBadge: true },
  { to: '/account', label: 'Account', Icon: User }
];

export const MobileBottomNav = () => {
  const { cart } = useStore();
  const { pathname } = useLocation();

  // native-commerce pattern: the buy box owns the bottom bar on PDP,
  // and checkout runs full-screen
  if (pathname.startsWith('/product/') || pathname.startsWith('/checkout')) return null;

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

  return (
    <nav className="mobile-bottom-nav" aria-label="Quick navigation">
      {TABS.map(({ to, label, Icon, hasBadge }) => (
        <Link key={to} to={to} className={`mbn-tab${isActive(to) ? ' active' : ''}`}>
          <span className="mbn-ico">
            <Icon size={20} strokeWidth={isActive(to) ? 2.4 : 1.8} />
            {hasBadge && cartCount > 0 && <span className="mbn-badge">{cartCount}</span>}
          </span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
};
