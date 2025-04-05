import React from 'react';
import styles from './style.module.css';
import dragStyles from '../../../TableView/styles/DragDrop.module.css';
import StatusSelect from '../../../TableView/components/StatusSelect';
import EstimateCell from '../../../TableView/components/cell/EstimateCell';
import ProgressCell from '../../../TableView/components/cell/ProgressCell';
import AssigneeCell from '../../../TableView/components/cell/AssigneeCell';
import HandleCell from '../../../TableView/components/cell/HandleCell';
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
  onDragEnd?: (sourceIndex: number, targetIndex: number) => void;
}

export default function TaskList({ 
  tickets,
  statuses,
  users,
  editingCell,
  setEditingCell,
  onStatusUpdate,
  onEstimateUpdate,
  onProgressUpdate,
  onDragEnd
}: TaskListProps) {
  const {
    openEditTicket,
  } = useApplication().slidePanelStore;
  const { tags } = useTags();

  const formatValue = (value: number) => {
    return value >= 8 ? `${(value / 8).toFixed(1)}d` : `${value}h`;
  };

  const CELL_WIDTHS = {
    handle: '20px',
    title: '372px',
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

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
  const [dragPosition, setDragPosition] = React.useState<'top' | 'bottom' | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && dragPosition) {
      const targetIndex = dragPosition === 'bottom' ? dragOverIndex + 1 : dragOverIndex;
      if (draggedIndex !== targetIndex && onDragEnd) {
        onDragEnd(draggedIndex, targetIndex);
      }
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDragPosition(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const position = y < rect.height / 2 ? 'top' : 'bottom';

    setDragOverIndex(index);
    setDragPosition(position);
  };

  return (
    <div className={styles.taskList}>
      <div className={styles.taskHeader}>
        <div className={styles.headerCell} style={{ width: CELL_WIDTHS.handle }}></div>
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
        {tickets.map((ticket, index) => (
          <div 
            key={ticket.id} 
            className={`${styles.taskRow} ${draggedIndex === index ? dragStyles.dragging : ''}`}
            draggable={draggedIndex === index}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            data-dragging={dragOverIndex === index ? dragPosition : undefined}
          >
            <div 
              className={`${styles.cell} ${styles.handleCell}`}
              style={{ width: CELL_WIDTHS.handle }}
            >
              <HandleCell onEnableDrag={(enable) => {
                if (enable) {
                  handleDragStart(index);
                }
              }} />
            </div>
            <div 
              className={`${styles.cell} ${styles.titleCell}`}
              onClick={() => openEditTicket(ticket.id!)}
              style={{ cursor: 'pointer', width: CELL_WIDTHS.title }}
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
              className={`${styles.cell} ${styles.progressCell} ${ticket.dueDate && new Date(ticket.dueDate) < new Date() && (ticket.progress || 0) < 100 ? styles.overdue : ''}`} 
              style={{ 
                width: CELL_WIDTHS.progress,
                '--progress-width': `${ticket.progress || 0}%`
              } as React.CSSProperties}
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
