'use client';

import { User } from '@/types';
import styles from '../styles/TableView.module.css';

interface AssigneeFilterProps {
  users: User[];
  selectedAssignees: string[];
  onAssigneeChange: (selectedAssignees: string[]) => void;
  assigneeCounts: Record<string, number>;
  totalCount: number;
}

export default function AssigneeFilter({ 
  users, 
  selectedAssignees, 
  onAssigneeChange, 
  assigneeCounts, 
  totalCount 
}: AssigneeFilterProps) {
  const handleAssigneeToggle = (email: string) => {
    const newSelectedAssignees = selectedAssignees.includes(email)
      ? selectedAssignees.filter(id => id !== email)
      : [...selectedAssignees, email];
    onAssigneeChange(newSelectedAssignees);
  };

  const handleToggleAll = () => {
    const isAllSelected = users.length === selectedAssignees.length;
    if (isAllSelected) {
      onAssigneeChange([]);
    } else {
      const allUserEmails = users.map(user => user.email);
      onAssigneeChange(allUserEmails);
    }
  };

  const isAllSelected = users.length === selectedAssignees.length;

  return (
    <div className={styles.assigneeFilter}>
      <span className={styles.totalCount}>Total {totalCount}</span>
      <div className={styles.filterHeader}>
        <label className={styles.assigneeCheckbox}>
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleToggleAll}
            aria-label="全て選択/選択解除"
          />
          <span className={styles.assigneeLabel} role="presentation">
            {isAllSelected ? "選択解除" : "全て選択"}
          </span>
        </label>
      </div>
      {users.map(user => (
        <label key={user.email} className={styles.assigneeCheckbox}>
          <input
            type="checkbox"
            checked={selectedAssignees.includes(user.email)}
            onChange={() => handleAssigneeToggle(user.email)}
          />
          <span className={styles.assigneeLabel}>
            {user.name}
            {assigneeCounts[user.email] > 0 && (<span className={styles.assigneeCount}>({assigneeCounts[user.email]})</span>)}
          </span>
        </label>
      ))}
    </div>
  );
}
