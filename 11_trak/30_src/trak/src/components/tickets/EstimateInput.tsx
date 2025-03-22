'use client';

import { useState } from 'react';
import styles from './TicketForm.module.css';

interface EstimateInputProps {
  value: number;
  onChange: (value: number) => void;
}

const formatValue = (value: number) => {
  return value >= 8 ? `${(value / 8).toFixed(1)}d` : `${value}h`;
};

export default function EstimateInput({ value, onChange }: EstimateInputProps) {
  const [editValue, setEditValue] = useState(formatValue(value));

  const handleBlur = () => {
    const inputValue = editValue.toLowerCase();
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
      onChange(hours);
    }
    setEditValue(formatValue(hours));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  return (
    <input
      type="text"
      value={editValue}
      className={styles.input}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="例: 4h, 1d"
    />
  );
}
