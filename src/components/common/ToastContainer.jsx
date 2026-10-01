import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useStore();

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          {toast.type === 'error' ? (
            <AlertCircle size={18} color="#B4552D" />
          ) : toast.type === 'info' ? (
            <Info size={18} color="#B38B3F" />
          ) : (
            <CheckCircle size={18} color="#A9B48C" />
          )}
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} style={{ marginLeft: 'auto', color: 'var(--ivory)' }}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
