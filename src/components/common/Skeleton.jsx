import React from 'react';

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '4px', className = '' }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
};
