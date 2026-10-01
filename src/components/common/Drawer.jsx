import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Drawer = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="drawer-overlay" onClick={onClose}>
        <motion.div
          className="drawer-content"
          onClick={(e) => e.stopPropagation()}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
        >
          <div style={{ padding: '20px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--parchment)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>{title}</h3>
            <button onClick={onClose} style={{ cursor: 'pointer', padding: '4px' }}>
              <X size={20} color="var(--espresso)" />
            </button>
          </div>
          <div style={{ padding: '20px', overflowY: 'auto', flexGrow: 1 }}>
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
