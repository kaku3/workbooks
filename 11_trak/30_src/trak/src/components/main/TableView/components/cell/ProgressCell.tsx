import { useState, ChangeEvent, KeyboardEvent } from 'react';
import styles from './styles/ProgressCell.module.css';

interface ProgressCellProps {
  value: number;
  onUpdate?: (value: number) => void;
}

const formatValue = (value: number) => {
  return `${value}%`;
};

const validateInput = (value: number) => {
  return Math.min(Math.max(Math.round(value), 0), 100);
};

export default function ProgressCell({
  value,
  onUpdate
}: ProgressCellProps): JSX.Element {
  const [editValue, setEditValue] = useState(value.toString());

  // 編集不可の場合は表示のみ（プログレスバー付き）
  if (!onUpdate) {
    return (
      <div className={styles.cell}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${value}%` }} 
        />
        <span className={styles.value}>{formatValue(value)}</span>
      </div>
    );
  }

  const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace('%', '');
    const num = parseFloat(inputValue);
    
    if (!isNaN(num)) {
      const validValue = validateInput(num);
      if (validValue !== value) {
        onUpdate(validValue);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      handleBlur({ target } as ChangeEvent<HTMLInputElement>);
      target.blur();
    }
  };

  return (
    <>
      <div className={styles.cell}>
        <div 
          className={styles.progressBar} 
          style={{ width: `${value}%` }} 
        />
        <span className={styles.value}>{formatValue(value)}</span>
      </div>
      <div className={`${styles.cell} ${styles.editing}`}>
        <input
          type="text"
          value={editValue}
          className={styles.input}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          onKeyDown={handleKeyDown}
        />
      </div>
    </>
  );
}
