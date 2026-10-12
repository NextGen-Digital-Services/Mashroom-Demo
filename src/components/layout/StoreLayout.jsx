import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { CartDrawer } from '../cart/CartDrawer';
import { ToastContainer } from '../common/ToastContainer';
import { ScrollProgress } from '../common/ScrollProgress';
import { useStore } from '../../context/StoreContext';
import { useReveal } from '../../hooks/useReveal';
import { initMotion, destroyMotion } from '../../lib/motion';

export const StoreLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    initMotion();
    return destroyMotion;
  }, []);

  useReveal(location);

  return (
    <div className="store-root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollProgress />
      <AnnouncementBar />
      <Header />
      <main style={{ flexGrow: 1 }}>{children}</main>
      <Footer />

      {/* Mobile commerce bottom tab bar (Amazon/Flipkart-style) */}
      <MobileBottomNav />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
