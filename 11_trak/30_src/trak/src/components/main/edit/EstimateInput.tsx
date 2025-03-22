import styles from '../TableView.module.css';
import { ChangeEvent } from 'react';

interface EstimateInputProps {
  value: number;
  onUpdate: (value: number) => void;
  onClose: () => void;
}

export default function EstimateInput({
  value,
  onUpdate,
  onClose
}: EstimateInputProps): JSX.Element {
  const formatValue = (value: number) => {
    return value >= 8 ? `${(value / 8).toFixed(1)}d` : `${value}h`;
  };

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

    onUpdate(hours);
    onClose();
  };

  return (
    <input
      type="text"
      defaultValue={formatValue(value)}
      className={styles.editInput}
      onBlur={handleBlur}
      autoFocus
    />
  );
}
