import { forwardRef } from 'react';
import { TicketData } from '@/types';
import styles from '../GanttView.module.css';

interface TaskListProps {
  tickets: TicketData[];
  onScroll: (scrollTop: number) => void;
}

const TaskList = forwardRef<HTMLDivElement, TaskListProps>(({ tickets, onScroll }, ref) => {
  return (
    <div className={styles.taskList}>
      <div className={styles.taskHeader}>
        <div className={styles.headerCell}>タイトル</div>
        <div className={styles.headerCell}>ステータス</div>
        <div className={styles.headerCell}>担当者</div>
        <div className={styles.headerCell}>見積</div>
      </div>
      <div 
        ref={ref}
        className={styles.taskRows}
        onScroll={(e) => onScroll(e.currentTarget.scrollTop)}
      >
        {tickets.map(ticket => (
          <div key={ticket.id} className={styles.taskRow}>
            <div className={styles.cell}>{ticket.title}</div>
            <div className={styles.cell}>{ticket.status}</div>
            <div className={styles.cell}>
              {ticket.assignees?.join(', ')}
            </div>
            <div className={styles.cell}>{ticket.estimate}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

TaskList.displayName = 'TaskList';

export default TaskList;
