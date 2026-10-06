import React, { useState } from 'react';

export const GalleryZoom = ({ images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const currentImage = images[selectedIndex] || images[0] || '';

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Main Image Stage */}
      <div
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
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '12px' }}>
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
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
              <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
