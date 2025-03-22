import { getTextColor } from '@/lib/utils/colors';
import styles from './TableView.module.css';
import type { Status } from '@/types';

interface StatusCellProps {
  status: string;
  statuses: Status[];
}

export default function StatusCell({
  status,
  statuses
}: StatusCellProps): JSX.Element {
  const statusInfo = statuses.find(s => s.id === status);
  const backgroundColor = statusInfo?.color || '#3b82f6';
  const color = getTextColor(backgroundColor);

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
