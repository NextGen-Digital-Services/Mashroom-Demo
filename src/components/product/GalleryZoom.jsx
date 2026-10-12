import React, { useState } from 'react';

export const GalleryZoom = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const currentImage = images[selectedIndex] || images[0] || '';

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Main Image Stage — hover to inspect on desktop, tap for fullscreen on touch */}
      <div
        role="button"
        tabIndex={0}
        aria-label="View fullscreen product image"
        onClick={() => setLightbox(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightbox(true); } }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundColor: 'var(--parchment)',
          border: '1px solid var(--line)',
          cursor: 'zoom-in'
        }}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={currentImage}
          alt="Product stage"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
            transform: isZoomed ? 'scale(1.8)' : 'scale(1)',
            transition: isZoomed ? 'none' : 'transform 0.3s ease'
          }}
        />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '12px',
            bottom: '12px',
            background: 'rgba(47, 58, 32, 0.85)',
            color: '#F7F1E5',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '7px 12px',
            borderRadius: 'var(--radius-full)',
            pointerEvents: 'none'
          }}
          >
            Zoom
          </span>
      </div>

      {/* Fullscreen lightbox (touch-friendly zoom) */}
      {lightbox && (
        <div
          onClick={() => setLightbox(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setLightbox(false); }}
          role="button"
          tabIndex={-1}
          aria-label="Close fullscreen image"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(42, 33, 26, 0.94)',
            zIndex: 1500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            padding: 'max(24px, env(safe-area-inset-top)) max(24px, env(safe-area-inset-right)) max(24px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left))',
            cursor: 'zoom-out'
          }}
        >
          <img
            src={currentImage}
            alt="Product fullscreen"
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
          />
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 'calc(20px + env(safe-area-inset-bottom))',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#C8D1BE',
              fontSize: '0.72rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            Tap anywhere to close
          </span>
        </div>
      )}

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '12px' }}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              aria-label={`View image ${idx + 1}`}
              style={{
                width: '70px',
                height: '70px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                border: selectedIndex === idx ? '2px solid var(--olive)' : '1px solid var(--line)',
                padding: 0,
                cursor: 'pointer',
                background: 'var(--parchment)'
              }}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
