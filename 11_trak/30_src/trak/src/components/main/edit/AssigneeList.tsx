import styles from '../TableView.module.css';
import { getUserColor, getTextColor } from '@/lib/utils/colors';
import type { User } from '@/types';

interface AssigneeListProps {
  assignees: string[];
  users: User[];
}

export default function AssigneeList({
  assignees,
  users
}: AssigneeListProps): JSX.Element {
  if (assignees.length === 0) {
    return <>-</>;
  }

  return (
    <div className={styles.assigneeTags}>
      {assignees.map(email => {
        const user = users.find(u => u.email === email);
        return (
          <div
            key={email}
            className={styles.assigneeCell}
            style={{
              backgroundColor: getUserColor(user?.id || ''),
              color: getTextColor(getUserColor(user?.id || ''))
            }}
          >
            <span className={styles.assigneeName}>
              {user?.name || email}
            </span>
          </div>
        );
      })}
    </div>
  );
}
