import type { TicketData, ColumnKey, SortDirection } from '@/types';

const getColumnValue = (ticket: TicketData, column: ColumnKey): string | number => {
  switch (column) {
    case 'id':
      return ticket.id || '';
    case 'title':
      return ticket.title;
    case 'status':
      return ticket.status;
    case 'assignees':
      return ticket.assignees[0] || '';
    case 'dueDate':
      return ticket.dueDate;
    case 'startDate':
      return ticket.startDate;
    case 'estimate':
      return ticket.estimate;
    default:
      return '';
  }
};

export const sortTickets = (
  tickets: TicketData[],
  sortColumn: ColumnKey | null,
  sortDirection: SortDirection,
  sortOrders: { [key: string]: number }
): TicketData[] => {
  return [...tickets].sort((a, b) => {
    // First priority: Column sort if specified
    if (sortColumn && sortDirection) {
      const aValue = getColumnValue(a, sortColumn);
      const bValue = getColumnValue(b, sortColumn);
      
      if (aValue !== bValue) {
        return sortDirection === 'asc'
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      }
    }

    // Second priority: Sort order from meta file
    const orderA = sortOrders[a.id!] ?? Number.MAX_SAFE_INTEGER;
    const orderB = sortOrders[b.id!] ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // Third priority: Created date (newest first)
    const dateA = new Date(b.createdAt || '').getTime();
    const dateB = new Date(a.createdAt || '').getTime();
    return dateA - dateB;
  });
};

export const filterTicketsByStatus = (
  tickets: TicketData[],
  selectedStatuses: string[]
): TicketData[] => {
  if (selectedStatuses.length === 0) return tickets;
  return tickets.filter(ticket => selectedStatuses.includes(ticket.status));
};

export const filterTicketsByAssignee = (
  tickets: TicketData[],
  selectedAssignees: string[]
): TicketData[] => {
  if (selectedAssignees.length === 0) return tickets;
  return tickets.filter(ticket => {
    // Handle unassigned tickets (empty array or no assignees)
    if (selectedAssignees.includes('')) {
      if (!ticket.assignees || ticket.assignees.length === 0) {
        return true;
      }
    }
    // Handle assigned tickets
    return ticket.assignees.some(assignee => selectedAssignees.includes(assignee));
  });
};
