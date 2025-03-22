import { useState } from 'react';
import styles from '../TableView.module.css';

interface TitleCellProps {
  value: string;
  onUpdate?: (value: string) => void;
}

export default function TitleCell({
  value,
  onUpdate
}: TitleCellProps): JSX.Element {
  const [editValue, setEditValue] = useState(value);

  // 編集不可の場合は表示のみ
  if (!onUpdate) {
    return <span>{value}</span>;
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
        type="text"
        value={editValue}
        className={styles.editInput}
        onChange={handleChange}
        onBlur={handleBlur}
        autoFocus
      />
    </div>
  );
}
