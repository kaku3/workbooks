'use client';

import { Status } from '@/types';
import styles from './TableView.module.css';

interface StatusFilterProps {
  statuses: Status[];
  selectedStatuses: string[];
  onStatusChange: (selectedStatuses: string[]) => void;
}

export default function StatusFilter({ statuses, selectedStatuses, onStatusChange }: StatusFilterProps) {
  const handleStatusToggle = (statusId: string) => {
    const newSelectedStatuses = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter(id => id !== statusId)
      : [...selectedStatuses, statusId];
    onStatusChange(newSelectedStatuses);
  };

  return (
    <div className={styles.statusFilter}>
      {statuses.map(status => (
        <label key={status.id} className={styles.statusCheckbox}>
          <input
            type="checkbox"
            checked={selectedStatuses.includes(status.id)}
            onChange={() => handleStatusToggle(status.id)}
          />
          <span className={styles.statusLabel} style={{ backgroundColor: status.color }}>
            {status.name}
          </span>
        </label>
      ))}
    </div>
  );
}
