import React from 'react';

export const FormField = ({
  label,
  error,
  type = 'text',
  options, // for select
  rows = 3, // for textarea
  className = '',
  ...props
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && <label className="form-label">{label}</label>}
      {type === 'select' ? (
        <select className="form-select" {...props}>
          {options && options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea className="form-textarea" rows={rows} {...props} />
      ) : (
        <input type={type} className="form-input" {...props} />
      )}
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};
