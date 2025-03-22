import type { ExtendedColumn } from '@/types';

export const TABLE_COLUMNS: ExtendedColumn[] = [
  { key: 'id', label: 'ID', visible: true },
  { key: 'title', label: 'タイトル', visible: true },
  { key: 'status', label: 'ステータス', visible: true },
  { key: 'startDate', label: '開始日', visible: true },
  { key: 'dueDate', label: '期限', visible: true },
  { key: 'estimate', label: '見積', visible: true },
  { key: 'assignee', label: '担当者', visible: true },
  { key: 'delete', label: '', visible: true },
];

// Cell rendering options
export const EDITABLE_COLUMNS = ['title', 'status', 'startDate', 'dueDate', 'estimate', 'assignee'];
export const NON_EDITABLE_COLUMNS = ['id', 'delete'];

// Cell type mappings
export const CELL_TYPES = {
  id: 'id',
  title: 'title',
  status: 'status',
  startDate: 'date',
  dueDate: 'date',
  estimate: 'estimate',
  assignee: 'assignee',
  delete: 'delete',
} as const;

export type CellType = typeof CELL_TYPES[keyof typeof CELL_TYPES];
