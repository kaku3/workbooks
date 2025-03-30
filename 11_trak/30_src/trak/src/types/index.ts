export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface CategoryTag {
  categoryId: string;
  name: string;
  tags: Tag[];
}

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
  visible?: boolean;
  sortable?: boolean;
}

export interface ExtendedColumn extends Column {
  key: ColumnKey;
}

export type SortDirection = 'asc' | 'desc' | null;

export type ColumnKey = 'handle' | 'id' | 'title' | 'status' | 'assignees' | 'startDate' | 'dueDate' | 'estimate' | 'delete';

export interface TicketData {
  id?: string;
  title: string;
  status: string;
  assignees: string[];
  startDate: string;
  dueDate: string;
  estimate: number;
  tags?: string[]; // Array of tag IDs
  userOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TicketSortData {
  [key: string]: number;
}
