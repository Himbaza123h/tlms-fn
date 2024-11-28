import React, { useMemo, useState } from 'react';
import styles from '../../styles/components/Table.module.scss';

export interface TableColumn {
  Header: string;
  accessor: string;
  id?: string;
  sortable?: boolean;
  Cell?: (props: { value: any, row: any }) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  onRowClick?: (row: any) => void;
  emptyMessage?: string;
  className?: string;
  itemsPerPage?: number;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data available',
  className = '',
  itemsPerPage = 5
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'}>({
    key: '',
    direction: 'asc'
  });

  const renderCell = (column: TableColumn, row: any) => {
    if (column.Cell) {
      return column.Cell({ value: row[column.accessor], row });
    }
    return row[column.accessor];
  };

  const filteredData = useMemo(() => {
    return data.filter(row => 
      Object.values(row).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (columnKey: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: columnKey, direction });
  };

  return (
    <div className={`${styles.tableContainer} ${className}`}>
      <div className={styles.tableControls}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.searchInput}
        />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.id || column.accessor}
                onClick={() => column.sortable && handleSort(column.accessor)}
                className={column.sortable ? styles.sortableHeader : ''}
              >
                {column.Header}
                {column.sortable && (
                  <span className={styles.sortIndicator}>
                    {sortConfig.key === column.accessor && 
                      (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyState}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick && onRowClick(row)}
                className={onRowClick ? styles.clickableRow : ''}
              >
                {columns.map((column) => (
                  <td key={column.id || column.accessor}>
                    {renderCell(column, row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`${styles.pageButton} ${
                currentPage === page ? styles.activePage : ''
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Table;