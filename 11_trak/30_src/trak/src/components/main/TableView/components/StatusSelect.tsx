import type { Status } from '@/types';
import { getTextColor } from '@/lib/utils/colors';
import styles from '../styles/TableView.module.css';

interface StatusSelectProps {
  value: string;
  statuses: Status[];
  onUpdate: (value: string) => void;
  onClose: () => void;
}

export default function StatusSelect({
  value,
  statuses,
  onUpdate,
  onClose
}: StatusSelectProps): JSX.Element {
  return (
    <select
      className={styles.editInput}
      value={value}
      onChange={(e) => {
        onUpdate(e.target.value);
        setTimeout(onClose, 200);
      }}
      style={{
        backgroundColor: statuses.find(s => s.id === value)?.color || '#3b82f6',
        color: getTextColor(statuses.find(s => s.id === value)?.color || '#3b82f6'),
        borderColor: statuses.find(s => s.id === value)?.color || '#3b82f6'
      }}
      autoFocus
    >
      {statuses.map(status => (
        <option
          key={status.id}
          value={status.id}
          style={{
            backgroundColor: status.color,
            color: getTextColor(status.color)
          }}
        >
          {status.name}
        </option>
      ))}
    </select>
  );
};
