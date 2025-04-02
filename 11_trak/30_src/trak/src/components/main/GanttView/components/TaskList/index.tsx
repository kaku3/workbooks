import styles from './style.module.css';
import StatusSelect from '../../../TableView/components/StatusSelect';
import EstimateCell from '../../../TableView/components/cell/EstimateCell';
import ProgressCell from '../../../TableView/components/cell/ProgressCell';
import { TicketData, Status } from '@/types';
import { getTextColor } from '@/lib/utils/colors';

interface TaskListProps {
  tickets: TicketData[];
  statuses: Status[];
  editingCell: { type: string; id: string } | null;
  setEditingCell: (cell: { type: string; id: string } | null) => void;
  onStatusUpdate: (ticketId: string, value: string) => void;
  onEstimateUpdate: (ticketId: string, value: number) => void;
  onProgressUpdate: (ticketId: string, value: number) => void;
}

export default function TaskList({ 
  tickets,
  statuses,
  editingCell,
  setEditingCell,
  onStatusUpdate,
  onEstimateUpdate,
  onProgressUpdate
}: TaskListProps) {
  const formatValue = (value: number) => {
    return value >= 8 ? `${(value / 8).toFixed(1)}d` : `${value}h`;
  };
  
  const headerLabels = [
    { key: 'title', label: 'タイトル', flex: '1 1 392px' },
    { key: 'assignee', label: '担当者', width: '80px' },
    { key: 'estimate', label: '見積', width: '48px' },
    { key: 'progress', label: '進捗', width: '48px' },
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
            <div 
              className={`${styles.cell} ${styles.estimateCell}`} 
              style={{ width: '48px' }}
              onClick={(e) => {
                e.stopPropagation();
                setEditingCell({type: 'estimate', id: ticket.id!});
              }}
            >
              <div className={styles.editableCell}>
                {editingCell?.type === 'estimate' && editingCell.id === ticket.id ? (
                  <div className={styles.editingCell}>
                    <EstimateCell
                      value={ticket.estimate}
                      onUpdate={(value) => {
                        onEstimateUpdate(ticket.id!, value);
                        setEditingCell(null);
                      }}
                    />
                  </div>
                ) : formatValue(ticket.estimate)}
              </div>
            </div>
            <div 
              className={`${styles.cell} ${styles.progressCell}`} 
              style={{ width: '48px' }}
              onClick={(e) => {
                e.stopPropagation();
                setEditingCell({type: 'progress', id: ticket.id!});
              }}
            >
              <div className={styles.editableCell}>
                {editingCell?.type === 'progress' && editingCell.id === ticket.id ? (
                  <div className={styles.editingCell}>
                    <ProgressCell
                      value={ticket.progress ?? 0}
                      onUpdate={(value) => {
                        onProgressUpdate(ticket.id!, value);
                        setEditingCell(null);
                      }}
                    />
                  </div>
                ) : `${ticket.progress ?? 0}%`}
              </div>
            </div>
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
