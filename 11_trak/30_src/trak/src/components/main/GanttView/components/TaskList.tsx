import { TicketData } from '@/types';
import styles from '../GanttView.module.css';

interface TaskListProps {
  tickets: TicketData[];
}

export default function TaskList({ 
  tickets 
}: TaskListProps) {

  const headerLabels = [
    { key: 'title', label: 'タイトル', flex: '1 1 392px' },
    { key: 'status', label: 'ステータス', width: '120px' },
    { key: 'assignee', label: '担当者', width: '80px' },
    { key: 'estimate', label: '見積', width: '48px' }
  ];

  return (
    <div className={styles.taskList}>
      <div className={styles.taskHeader}>
        {headerLabels.map(header => (
          <div
            key={header.key}
            className={styles.headerCell}
            style={header.width ? { width: header.width } : { flex: header.flex }}
          >
            {header.label}
          </div>
        ))}
      </div>
      <div className={styles.taskRows}>
        {tickets.map(ticket => (
          <div key={ticket.id} className={styles.taskRow}>
            <div className={styles.cell}>{ticket.title}</div>
            <div className={styles.cell} style={{ width: '120px' }}>{ticket.status}</div>
            <div className={styles.cell} style={{ width: '80px' }}>
              {ticket.assignees?.[0]}
            </div>
            <div className={styles.cell} style={{ width: '48px' }}>{ticket.estimate}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
