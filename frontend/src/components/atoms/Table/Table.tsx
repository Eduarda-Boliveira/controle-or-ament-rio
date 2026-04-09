import type { ReactNode } from 'react';
import styles from './Table.module.css';

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: any) => ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  onSort?: (key: string) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export function Table({ columns, data, onSort, sortColumn, sortDirection }: TableProps) {
  function handleSort(key: string, sortable?: boolean) {
    if (sortable && onSort) {
      onSort(key);
    }
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${styles.th} ${column.sortable ? styles.sortable : ''}`}
                onClick={() => handleSort(column.key, column.sortable)}
              >
                <div className={styles.headerContent}>
                  {column.header}
                  {column.sortable && (
                    <span className={styles.sortIcon}>
                      {sortColumn === column.key ? (
                        sortDirection === 'asc' ? '↑' : '↓'
                      ) : (
                        '↕'
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.emptyMessage}>
                Nenhuma transação encontrada
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id || index} className={styles.tr}>
                {columns.map((column) => (
                  <td key={column.key} className={styles.td}>
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
