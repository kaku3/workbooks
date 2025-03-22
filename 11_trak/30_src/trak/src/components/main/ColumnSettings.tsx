import styles from './TableView.module.css';
import type { Column, ColumnKey } from '@/types';

interface ExtendedColumn extends Column {
  key: ColumnKey;
}

interface ColumnSettingsProps {
  columns: ExtendedColumn[];
  onChange: (columns: ExtendedColumn[]) => void;
}

export default function ColumnSettings({
  columns,
  onChange
}: ColumnSettingsProps): JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(e.target.selectedOptions, option => option.value as ColumnKey);
    const updatedColumns = columns.map(col => ({
      ...col,
      visible: selectedValues.includes(col.key)
    }));
    onChange(updatedColumns);
  };

  return (
    <div className={styles.columnSettings}>
      <select
        multiple
        value={columns.filter(col => col.visible).map(col => col.key)}
        onChange={handleChange}
      >
        {columns.map(col => (
          <option key={col.key} value={col.key}>
            {col.label}
          </option>
        ))}
      </select>
    </div>
  );
}
