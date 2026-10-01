import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { Button } from '../../components/common/Button';
import { Download, BarChart2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const AdminReports = () => {
  useDocumentTitle('Sales & Performance Reports');
  const { orders, products, addToast } = useStore();

  const exportSalesCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Order ID,Date,Customer,Total,Status,Payment"].concat(
          orders.map(o => `${o.id},${o.date},"${o.customer.name}",${o.total},${o.status},${o.paymentMethod}`)
        ).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Sales CSV Report downloaded');
  };

  return (
    <div>
      <div className="admin-card-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>Sales & Product Analytics</h1>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>Export raw transaction logs and review item velocities.</p>
        </div>

        <Button onClick={exportSalesCSV} variant="primary" size="sm">
          <Download size={14} /> Download Full Sales CSV
        </Button>
      </div>

      <div className="admin-card">
        <h3 className="admin-card-title" style={{ marginBottom: '16px' }}>Product Performance Ranking</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Units Sold</th>
              <th>Current Stock</th>
              <th>Revenue Generated</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{p.category}</td>
                <td>{Math.floor(15 + Math.random() * 85)} units</td>
                <td style={{ fontWeight: 700, color: p.stock <= 15 ? 'var(--terracotta)' : '#137333' }}>{p.stock}</td>
                <td style={{ fontWeight: 700 }}>{formatCurrency(p.price * 24)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
