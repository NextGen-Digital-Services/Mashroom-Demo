import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon: Icon,
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const fullClass = fullWidth ? 'btn-full' : '';
  
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${sizeClass} ${fullClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children}
    </button>
  );
};
