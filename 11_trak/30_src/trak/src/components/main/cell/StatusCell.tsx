import styles from '../TableView.module.css';
import { getTextColor } from '@/lib/utils/colors';
import type { Status } from '@/types';

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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue !== status) {
      onUpdate(newValue);
    }
  };

  // 編集可能な場合は選択肢を表示
  return (
    <div className={`${styles.editableCell} ${styles.editingCell}`}>
      <select
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
