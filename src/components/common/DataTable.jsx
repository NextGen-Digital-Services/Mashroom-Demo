import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { EmptyState } from './EmptyState';

export const DataTable = ({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search records...",
  pageSize = 8,
  actions,
  rowKey
}) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Nested fields (customer, items, address…) must be searchable too —
  // String({}) would just produce "[object Object]".
  const searchableText = (value, depth = 0) => {
    if (value === null || value === undefined || depth > 3) return '';
    if (Array.isArray(value)) return value.map((v) => searchableText(v, depth + 1)).join(' ');
    if (typeof value === 'object') {
      return Object.values(value).map((v) => searchableText(v, depth + 1)).join(' ');
    }
    return String(value);
  };

  const filteredData = data.filter((item) => {
    if (!search) return true;
    const lowerSearch = search.toLowerCase();
    return Object.values(item).some((val) =>
      searchableText(val).toLowerCase().includes(lowerSearch)
    );
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = filteredData.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <div>
      {searchable && (
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="form-input"
              style={{ paddingLeft: '36px' }}
            />
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}

      {paginatedData.length === 0 ? (
        <EmptyState title="No records match" description="Try adjusting your search query or filters." />
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} style={{ width: col.width }}>{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rIdx) => (
                <tr key={(rowKey && row[rowKey]) || row.id || row.code || rIdx}>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.85rem' }}>
          <span style={{ color: '#666' }}>
            Showing {((safePage - 1) * pageSize) + 1} to {Math.min(safePage * pageSize, filteredData.length)} of {filteredData.length} entries
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{ padding: '6px 12px', border: '1px solid var(--line)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ padding: '6px 12px', fontWeight: 600 }}>
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{ padding: '6px 12px', border: '1px solid var(--line)', borderRadius: '4px', background: 'var(--white)', cursor: 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
