'use client';

import { Status } from '@/types';
import styles from '../TableView.module.css';

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

  const handleToggleAll = () => {
    const isAllSelected = statuses.length === selectedStatuses.length;
    if (isAllSelected) {
      onStatusChange([]);
    } else {
      const allStatusIds = statuses.map(status => status.id);
      onStatusChange(allStatusIds);
    }
  };

  const isAllSelected = statuses.length === selectedStatuses.length;

  return (
    <div className={styles.statusFilter}>
      <label className={styles.statusCheckbox}>
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={handleToggleAll}
          aria-label="全て選択/選択解除"
        />
        <span className={styles.statusLabel} role="presentation">
          {isAllSelected ? "選択解除" : "全て選択"}
        </span>
      </label>
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
