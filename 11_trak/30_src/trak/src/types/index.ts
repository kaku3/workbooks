import { type Tag, type CategoryTag } from '../backend/models/tag';
import { type User } from '../backend/models/user';
import { type Status } from '../backend/models/status';
import { type TicketSortData } from '../backend/models/ticket-sort';

export type { Tag, CategoryTag, User, Status, TicketSortData };

export interface Column {
  label: string;
  visible?: boolean;
  sortable?: boolean;
}

export interface ExtendedColumn extends Column {
  key: ColumnKey;
}

export type SortDirection = 'asc' | 'desc' | null;

export type ColumnKey = 'handle' | 'id' | 'title' | 'status' | 'assignees' | 'startDate' | 'dueDate' | 'estimate' | 'progress' | 'delete';

export interface TicketData {
  id?: string;
  title: string;
  status: string;
  assignees: string[];
  startDate: string;
  dueDate: string;
  estimate: number;
  progress?: number;
  tags?: string[]; // Array of tag IDs
  userOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}
