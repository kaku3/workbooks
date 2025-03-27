import styles from './styles/StatusCell.module.css';
import { getTextColor } from '@/lib/utils/colors';
import type { Status } from '@/types';
import { useEffect, useRef } from 'react';

// HTMLSelectElement に showPicker メソッドを追加
declare global {
  interface HTMLSelectElement {
    showPicker(): void;
  }
}

interface StatusCellProps {
  status: string;
  statuses: Status[];
  onUpdate?: (value: string) => void;
}

export default function StatusCell({
  status,
  statuses,
  onUpdate
}: StatusCellProps): JSX.Element {
  const statusInfo = statuses.find(s => s.id === status);
  const backgroundColor = statusInfo?.color || '#3b82f6';
  const color = getTextColor(backgroundColor);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    // 編集モードで、マウント時に自動で開く
    if (onUpdate && selectRef.current) {
      selectRef.current.focus();
      if ('showPicker' in selectRef.current) {
        selectRef.current.showPicker();
      }
    }
  }, [onUpdate]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue !== status) {
      onUpdate?.(newValue);
    }
  };

  // 編集不可の場合は表示のみ
  if (!onUpdate) {
    return (
      <div
        className={styles.statusCell}
        style={{
          backgroundColor,
          color
        }}
      >
        {statusInfo?.name || status}
      </div>
    );
  }

  return (
    <div className={`${styles.editableCell} ${styles.editingCell}`}>
      <select
        ref={selectRef}
        className={styles.editInput}
        value={status}
        onChange={handleChange}
        style={{
          backgroundColor,
          color,
          borderColor: backgroundColor
        }}
        autoFocus
      >
        {statuses.map(s => (
          <option
            key={s.id}
            value={s.id}
            style={{
              backgroundColor: s.color,
              color: getTextColor(s.color)
            }}
          >
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
