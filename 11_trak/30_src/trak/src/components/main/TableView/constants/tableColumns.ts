import type { ExtendedColumn } from '@/types';

export const TABLE_COLUMNS: ExtendedColumn[] = [
  { key: 'handle', label: '', sortable: false },
  { key: 'id', label: 'ID', sortable: true },
  { key: 'title', label: 'タイトル', sortable: true },
  { key: 'assignees', label: '担当者', sortable: true },
  { key: 'estimate', label: '見積', sortable: true },
  { key: 'status', label: 'ステータス', sortable: true },
  { key: 'startDate', label: '開始日', sortable: true },
  { key: 'dueDate', label: '期限', sortable: true },
  { key: 'delete', label: '', sortable: false },
];

// Cell rendering options
export const EDITABLE_COLUMNS = ['title', 'status', 'startDate', 'dueDate', 'estimate', 'assignees'];
export const NON_EDITABLE_COLUMNS = ['handle', 'id', 'delete'];

// Cell type mappings
export const CELL_TYPES = {
  handle: 'handle',
  id: 'id',
  title: 'title',
  status: 'status',
  startDate: 'date',
  dueDate: 'date',
  estimate: 'estimate',
  assignees: 'assignees',
  delete: 'delete',
} as const;

export type CellType = typeof CELL_TYPES[keyof typeof CELL_TYPES];
