import { useMemo } from 'react';
import styles from '../TableView.module.css';
import { CELL_TYPES, type CellType } from '../constants/tableColumns';
import IdCell from './cell/IdCell';
import StatusCell from './cell/StatusCell';
import EstimateCell from './cell/EstimateCell';
import DateCell from './cell/DateCell';
import AssigneeCell from './cell/AssigneeCell';
import TitleCell from './cell/TitleCell';
import DeleteCell from './cell/DeleteCell';
import type { TicketData, ColumnKey, Status, User } from '@/types';

interface TableCellProps {
  columnKey: ColumnKey;
  ticket: TicketData;
  users?: User[];
  statuses?: Status[];
  isEditing: boolean;
  onUpdate: (updatedTicket: TicketData) => Promise<boolean | void>;
  onEdit: (key: ColumnKey) => void;
  onEditTicket: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const TableCell = ({
  columnKey,
  ticket,
  users = [],
  statuses = [],
  isEditing,
  onUpdate,
  onEdit,
  onEditTicket,
  onDelete,
}: TableCellProps) => {
  const cellType = CELL_TYPES[columnKey as keyof typeof CELL_TYPES];

  const handleUpdate = useMemo(() => {
    if (!isEditing) return undefined;

    return (value: string | number | string[] | undefined) => {
      const updatedTicket = { ...ticket, [columnKey]: value };
      onUpdate(updatedTicket);
    };
  }, [isEditing, ticket, columnKey, onUpdate]);

  const handleTagsUpdate = useMemo(() => {
    if (!isEditing || columnKey !== 'title') return undefined;

    return (tags: string[]) => {
      const updatedTicket = { ...ticket, tags };
      onUpdate(updatedTicket);
    };
  }, [isEditing, columnKey, ticket, onUpdate]);

  const renderCell = (type: CellType) => {
    switch (type) {
      case 'id':
        return (
          <IdCell 
            id={ticket.id!} 
            onClick={() => onEditTicket(ticket.id!)}
          />
        );
      case 'title':
        return (
          <TitleCell 
            value={ticket.title}
            tags={ticket.tags}
            setEditingCell={() => onEdit('title')}
            onUpdate={handleUpdate}
            onUpdateTags={handleTagsUpdate}
          />
        );
      case 'status':
        return (
          <StatusCell
            status={ticket.status}
            statuses={statuses}
            onUpdate={handleUpdate}
          />
        );
      case 'assignee':
        return (
          <AssigneeCell
            value={ticket.assignees}
            users={users}
            onUpdate={handleUpdate}
          />
        );
      case 'date':
        return (
          <DateCell
            value={columnKey === 'startDate' ? ticket.startDate : ticket.dueDate}
            onUpdate={handleUpdate}
          />
        );
      case 'estimate':
        return (
          <EstimateCell
            value={ticket.estimate}
            onUpdate={handleUpdate}
          />
        );
      case 'delete':
        return onDelete ? (
          <DeleteCell onDelete={() => onDelete(ticket.id!)} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <td 
      className={styles[`table_${columnKey}`]}
      onClick={() => {
        if (cellType !== 'id' && cellType !== 'delete') {
          onEdit(columnKey);
        }
      }}
    >
      {renderCell(cellType)}
    </td>
  );
};
