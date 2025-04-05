import styles from './style.module.css';
import StatusSelect from '../../../TableView/components/StatusSelect';
import EstimateCell from '../../../TableView/components/cell/EstimateCell';
import ProgressCell from '../../../TableView/components/cell/ProgressCell';
import AssigneeCell from '../../../TableView/components/cell/AssigneeCell';
import { TicketData, Status, User } from '@/types';
import { getTextColor } from '@/lib/utils/colors';
import { useApplication } from '@/contexts/ApplicationContext';
import { useTags } from '../../../TagsContext';

interface TaskListProps {
  tickets: TicketData[];
  statuses: Status[];
  users: User[];
  editingCell: { type: string; id: string } | null;
  setEditingCell: (cell: { type: string; id: string } | null) => void;
  onStatusUpdate: (ticketId: string, value: string) => void;
  onEstimateUpdate: (ticketId: string, value: number) => void;
  onProgressUpdate: (ticketId: string, value: number) => void;
}

export default function TaskList({ 
  tickets,
  statuses,
  users,
  editingCell,
  setEditingCell,
  onStatusUpdate,
  onEstimateUpdate,
  onProgressUpdate
}: TaskListProps) {
  const {
    openEditTicket,
  } = useApplication().slidePanelStore;
  const { tags } = useTags();

  const formatValue = (value: number) => {
    return value >= 8 ? `${(value / 8).toFixed(1)}d` : `${value}h`;
  };

  const CELL_WIDTHS = {
    title: '392px',
    assignee: '120px',
    estimate: '44px',
    progress: '44px',
    status: '104px'
  }
  
  const headerLabels = [
    { key: 'title', label: 'タイトル', flex: `1 1 ${CELL_WIDTHS.title}` },
    { key: 'assignee', label: '担当者', width: CELL_WIDTHS.assignee },
    { key: 'estimate', label: '見積', width: CELL_WIDTHS.estimate },
    { key: 'progress', label: '進捗', width: CELL_WIDTHS.progress },
    { key: 'status', label: 'ステータス', width: CELL_WIDTHS.status },
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
            <div 
              className={`${styles.cell} ${styles.titleCell}`}
              onClick={() => openEditTicket(ticket.id!)}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.titleContainer}>
                {ticket.tags && ticket.tags.length > 0 && (
                  <div className={styles.tagList}>
                    {ticket.tags.map(tagId => {
                      const tag = tags.find(t => t.id === tagId);
                      if (!tag) return null;
                      return (
                        <span
                          key={tag.id}
                          className={styles.tag}
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      );
                    })}
                  </div>
                )}
                <span>{ticket.title}</span>
              </div>
            </div>
            <div 
              className={`${styles.cell} ${styles.assigneeCell}`}
              style={{ width: CELL_WIDTHS.assignee }}
              onClick={(e) => {
                e.stopPropagation();
                setEditingCell({type: 'assignee', id: ticket.id!});
              }}
            >
              <AssigneeCell
                value={ticket.assignees || []}
                users={users}
              />
            </div>
            <div 
              className={`${styles.cell} ${styles.estimateCell}`} 
              style={{ width: CELL_WIDTHS.estimate }}
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
              style={{ width: CELL_WIDTHS.progress }}
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
              className={`${styles.cell} ${styles.statusCell}`} 
              style={{ width: CELL_WIDTHS.status }} 
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
