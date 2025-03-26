import tableStyles from '../styles/TableView.module.css';
import { useMemo } from 'react';
import { CELL_TYPES, type CellType } from '../constants/tableColumns';
import IdCell from './cell/IdCell';
import StatusCell from './cell/StatusCell';
import EstimateCell from './cell/EstimateCell';
import DateCell from './cell/DateCell';
import AssigneeCell from './cell/AssigneeCell';
import TitleCell from './cell/TitleCell';
import DeleteCell from './cell/DeleteCell';
import HandleCell from './cell/HandleCell';
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
  onEnableDrag?: (enable: boolean) => void;
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
  onEnableDrag,
}: TableCellProps) => {
  const cellType = CELL_TYPES[columnKey as keyof typeof CELL_TYPES];

  const handleUpdate = useMemo(() => {
    if (!isEditing) return undefined;

    return (value: string | number | string[] | undefined, extraUpdate?: Partial<TicketData>) => {
      const updatedTicket = { ...ticket, [columnKey]: value, ...extraUpdate };
      onUpdate(updatedTicket);
    };
  }, [isEditing, ticket, columnKey, onUpdate]);

  const renderCell = (type: CellType) => {
    switch (type) {
      case 'handle':
        return onEnableDrag ? (
          <HandleCell onEnableDrag={onEnableDrag} />
        ) : null;
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
            editing={isEditing}
            setEditingCell={() => onEdit('title')}
            onUpdate={(title?: string, tags?: string[]) => {
              const updates: Partial<TicketData> = {};
              if (title !== undefined) updates.title = title;
              if (tags !== undefined) updates.tags = tags;
              handleUpdate?.(title, updates);
            }}
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
      case 'assignees':
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
      className={tableStyles[`table_${columnKey}`]}
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
