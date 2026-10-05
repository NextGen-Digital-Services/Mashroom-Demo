import React from 'react';

export const Badge = ({ children, variant = 'outline', className = '' }) => {
  return <span className={`badge badge-${variant.toLowerCase()} ${className}`}>{children}</span>;
};

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '4px', className = '' }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
};

export const ArchMaskImage = ({ src, alt, className = '', height = '400px' }) => {
  const fallbackSrc = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23EFE6D2'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%234B5A34' font-family='serif' font-size='20'>MANASI</text></svg>";

  return (
    <div className={`arch-mask ${className}`} style={{ height, width: '100%', position: 'relative' }}>
      <img
        src={src}
        alt={alt || 'MANASI Harvest'}
        onError={(e) => { e.target.src = fallbackSrc; }}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
};
