'use client';

import styles from '../styles/TableView.module.css';
import type { ColumnKey, SortDirection } from '@/types';

interface SortHeaderProps {
  columnKey: ColumnKey;
  label: string;
  sortColumn: ColumnKey | null;
  sortDirection: SortDirection;
  onSort?: (columnKey: ColumnKey) => void;
}

export default function SortHeader({
  columnKey,
  label,
  sortColumn,
  sortDirection,
  onSort,
}: SortHeaderProps): JSX.Element {
  const active = sortColumn === columnKey;
  const icon = active ? (sortDirection === 'asc' ? '↑' : '↓') : '↕';

  const handleClick = () => {
    if (onSort) {
      onSort(columnKey);
    }
  };

  return (
    <th 
      className={onSort ? styles.sortableHeader : ''} 
      onClick={handleClick}
    >
      {label}
      {onSort && (
        <span className={styles.sortIcon}>
          {icon}
        </span>
      )}
    </th>
  );
}
