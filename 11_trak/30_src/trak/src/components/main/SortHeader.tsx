import styles from './TableView.module.css';
import type { ColumnKey } from '@/types';

interface SortHeaderProps {
  columnKey: ColumnKey;
  label: string;
  sortColumn: ColumnKey | null;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (key: ColumnKey) => void;
}

export default function SortHeader({
  columnKey,
  label,
  sortColumn,
  sortDirection,
  onSort
}: SortHeaderProps): JSX.Element {
  const getSortIcon = () => {
    if (sortColumn !== columnKey) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <th
      onClick={() => onSort(columnKey)}
      className={styles.sortableHeader}
    >
      {label}
      <span className={styles.sortIcon}>
        {getSortIcon()}
      </span>
    </th>
  );
}
