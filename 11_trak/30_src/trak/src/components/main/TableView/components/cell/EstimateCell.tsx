import styles from '../../TableView.module.css';
import { useState, ChangeEvent } from 'react';

interface EstimateCellProps {
  value: number;
  onUpdate?: (value: number) => void;
}

const formatValue = (value: number) => {
  return value >= 8 ? `${(value / 8).toFixed(1)}d` : `${value}h`;
};

export default function EstimateCell({
  value,
  onUpdate
}: EstimateCellProps): JSX.Element {
  const [editValue, setEditValue] = useState(formatValue(value));

  // 編集不可の場合は表示のみ
  if (!onUpdate) {
    return <span>{formatValue(value)}</span>;
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.toLowerCase();
    let hours = value; // デフォルト値を維持

    if (inputValue.endsWith('h')) {
      const num = parseFloat(inputValue.slice(0, -1));
      if (!isNaN(num)) hours = num;
    } else if (inputValue.endsWith('d')) {
      const num = parseFloat(inputValue.slice(0, -1));
      if (!isNaN(num)) hours = num * 8;
    } else {
      const num = parseFloat(inputValue);
      if (!isNaN(num)) hours = num;
    }

    if (hours !== value) {
      onUpdate(hours);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
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
