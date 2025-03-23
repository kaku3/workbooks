import styles from './styles/DeleteCell.module.css';
import { useState } from 'react';

interface DateCellProps {
  value: string;
  onUpdate?: (value: string) => void;
}

export default function DateCell({
  value,
  onUpdate
}: DateCellProps): JSX.Element {
  const [editValue, setEditValue] = useState(value);
  const displayValue = value ? new Date(value).toLocaleDateString() : "";

  // 編集不可の場合は表示のみ
  if (!onUpdate) {
    return (
      <div className="text-center">
        {displayValue}
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleBlur = () => {
    if (editValue !== value) {
      onUpdate(editValue);
    }
  };

  // 編集可能な場合は入力フィールドを表示
  return (
    <div className={`${styles.editableCell} ${styles.editingCell}`}>
      <input
        type="date"
        value={editValue}
        className={styles.editInput}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
      />
    </div>
  );
}
