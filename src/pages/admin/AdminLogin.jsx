import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { FormField } from '../../components/common/FormField';
import { Button } from '../../components/common/Button';
import { ShieldCheck, Info } from 'lucide-react';

export const AdminLogin = () => {
  useDocumentTitle('Admin Portal Login');
  const { loginAdmin } = useStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@brand.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const res = loginAdmin(email, password);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--olive-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: 'var(--white)', padding: '40px', borderRadius: 'var(--radius-lg)', maxWidth: '440px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <ShieldCheck size={48} color="var(--olive)" style={{ marginBottom: '12px' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Brand Admin Portal</h2>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>Authenticate to manage estate store settings.</p>
        </div>

        {/* Demo Credentials Box */}
        <div style={{ background: 'var(--parchment)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)', marginBottom: '20px', fontSize: '0.8rem', display: 'flex', gap: '10px' }}>
          <Info size={18} color="var(--terracotta)" style={{ flexShrink: 0 }} />
          <div>
            <strong>Demo Credentials:</strong><br />
            Email: <code>admin@brand.com</code><br />
            Password: <code>Admin@123</code>
          </div>
        </div>

        {error && (
          <div style={{ background: '#FCE8E6', color: '#C5221F', padding: '10px', borderRadius: '4px', fontSize: '0.8rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            label="Admin Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormField
            label="Password *"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" fullWidth size="lg" style={{ marginTop: '16px' }}>
            Login to Admin Console
          </Button>
        </form>

      </div>
    </div>
  );
};
