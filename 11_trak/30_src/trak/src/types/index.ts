export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Status {
  id: string;
  name: string;
  color: string;
}

export interface Column {
  label: string;
  visible: boolean;
}

export interface ExtendedColumn extends Column {
  key: ColumnKey;
}

export type SortDirection = 'asc' | 'desc' | null;

export type ColumnKey = 'id' | 'title' | 'status' | 'assignee' | 'dueDate' | 'estimate';

export interface TicketData {
  id?: string;
  title: string;
  status: string;
  assignees: string[];
  dueDate: string;
  estimate: number;
}
