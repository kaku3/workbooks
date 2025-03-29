'use client';

import { User } from '@/types';
import styles from '../TicketToolbar.module.css';

interface AssigneeFilterProps {
  users: User[];
  selectedAssignees: string[];
  onAssigneeChange: (selectedAssignees: string[]) => void;
  assigneeCounts: Record<string, number>;
}

export default function AssigneeFilter({ 
  users, 
  selectedAssignees, 
  onAssigneeChange, 
  assigneeCounts
}: AssigneeFilterProps) {
  const handleAssigneeToggle = (email: string) => {
    const newSelectedAssignees = selectedAssignees.includes(email)
      ? selectedAssignees.filter(id => id !== email)
      : [...selectedAssignees, email];
    onAssigneeChange(newSelectedAssignees);
  };

  const handleToggleAll = () => {
    const isAllSelected = users.length + 1 === selectedAssignees.length; // +1 for unassigned
    if (isAllSelected) {
      onAssigneeChange([]);
    } else {
      const allUserEmails = [...users.map(user => user.email), ''];
      onAssigneeChange(allUserEmails);
    }
  };

  const isAllSelected = users.length + 1 === selectedAssignees.length;

  return (
    <div className={styles.assigneeFilter}>
      <span className={styles.totalCount}>担当者</span>
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
      {/* 未アサイン */}
      <label key="" className={styles.assigneeCheckbox}>
        <input
          type="checkbox"
          checked={selectedAssignees.includes('')}
          onChange={() => handleAssigneeToggle('')}
        />
        <span className={styles.assigneeLabel}>
          未割当
          {assigneeCounts[''] > 0 && (<span className={styles.assigneeCount}>({assigneeCounts['']})</span>)}
        </span>
      </label>
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
