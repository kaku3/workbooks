import styles from './style.module.css';
import StatusSelect from '../../../TableView/components/StatusSelect';
import { TicketData, Status } from '@/types';
import { getTextColor } from '@/lib/utils/colors';

interface TaskListProps {
  tickets: TicketData[];
  statuses: Status[];
  editingCell: { type: string; id: string } | null;
  setEditingCell: (cell: { type: string; id: string } | null) => void;
  onStatusUpdate: (ticketId: string, value: string) => void;
}

export default function TaskList({ 
  tickets,
  statuses,
  editingCell,
  setEditingCell,
  onStatusUpdate 
}: TaskListProps) {
  const headerLabels = [
    { key: 'title', label: 'タイトル', flex: '1 1 392px' },
    { key: 'assignee', label: '担当者', width: '80px' },
    { key: 'estimate', label: '見積', width: '48px' },
    { key: 'status', label: 'ステータス', width: '120px' },
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
            <div className={styles.cell} style={{ width: '80px' }}>
              {ticket.assignees?.[0]}
            </div>
            <div className={styles.cell} style={{ width: '48px' }}>{ticket.estimate}</div>
            <div 
              className={styles.cell} 
              style={{ width: '120px' }} 
              onClick={(e) => {
                e.stopPropagation();
                setEditingCell({type: 'status', id: ticket.id!});
              }}
            >
              {editingCell?.type === 'status' && editingCell.id === ticket.id ? (
                <StatusSelect
                  value={ticket.status}
                  statuses={statuses}
                  onUpdate={(value) => {
                    onStatusUpdate(ticket.id!, value);
                  }}
                  onClose={() => setEditingCell(null)}
                />
              ) : (
                <div
                  style={{
                    backgroundColor: statuses.find(s => s.id === ticket.status)?.color || '#3b82f6',
                    color: getTextColor(statuses.find(s => s.id === ticket.status)?.color || '#3b82f6'),
                    padding: '2px 8px',
                    borderRadius: '4px',
                    width: 'fit-content'
                  }}
                >
                  {statuses.find(s => s.id === ticket.status)?.name || ticket.status}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
