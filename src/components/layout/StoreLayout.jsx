import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { ToastContainer } from '../common/ToastContainer';
import { ScrollProgress } from '../common/ScrollProgress';
import { useStore } from '../../context/StoreContext';
import { useReveal } from '../../hooks/useReveal';
import { initMotion, destroyMotion } from '../../lib/motion';
import { MessageCircle } from 'lucide-react';

export const StoreLayout = ({ children }) => {
  const { config } = useStore();
  const location = useLocation();

  useEffect(() => {
    initMotion();
    return destroyMotion;
  }, []);

  useReveal(location);

  const whatsappUrl = `https://wa.me/${config.whatsapp ? config.whatsapp.replace(/[^0-9]/g, '') : ''}?text=${encodeURIComponent('Hello! I have an inquiry regarding your mushroom products.')}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollProgress />
      <AnnouncementBar />
      <Header />
      <main style={{ flexGrow: 1 }}>{children}</main>
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          backgroundColor: '#25D366',
          color: '#FFF',
          borderRadius: '50%',
          width: '52px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md)',
          zIndex: 950,
          transition: 'transform 0.2s ease'
        }}
        title="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};
