import type { TicketData, ColumnKey, SortDirection } from '@/types';

export const sortTickets = (
  tickets: TicketData[],
  sortColumn: ColumnKey | null,
  sortDirection: SortDirection
): TicketData[] => {
  if (!sortColumn || !sortDirection) return tickets;

  return [...tickets].sort((a, b) => {
    let aValue: string | number | undefined, bValue: string | number | undefined;

    switch (sortColumn) {
      case 'id':
        aValue = a.id || '';
        bValue = b.id || '';
        break;
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'assignee':
        aValue = a.assignees[0] || '';
        bValue = b.assignees[0] || '';
        break;
      case 'dueDate':
        aValue = a.dueDate;
        bValue = b.dueDate;
        break;
      case 'estimate':
        aValue = a.estimate;
        bValue = b.estimate;
        break;
      default:
        return 0;
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const filterTicketsByStatus = (
  tickets: TicketData[],
  selectedStatuses: string[]
): TicketData[] => {
  if (selectedStatuses.length === 0) return tickets;
  return tickets.filter(ticket => selectedStatuses.includes(ticket.status));
};
