import { forwardRef, useEffect } from 'react';
import { TicketData } from '@/types';
import styles from '../GanttView.module.css';

interface TaskListProps {
  tickets: TicketData[];
  onScroll?: (scrollTop: number) => void;
  scrollTop: number;
}

const TaskList = forwardRef<HTMLDivElement, TaskListProps>(({ 
  tickets,
  scrollTop
}, ref) => {
  // タイムラインのスクロール位置に合わせて表示位置を更新
  useEffect(() => {
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.style.transform = `translateY(-${scrollTop}px)`;
    }
  }, [scrollTop]);

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
