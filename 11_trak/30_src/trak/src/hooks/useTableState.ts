import { useState, useCallback } from 'react';
import type { ColumnKey, SortDirection } from '@/types';

interface TableState {
  sortColumn: ColumnKey | null;
  sortDirection: SortDirection;
  selectedStatuses: string[];
  editingCell: { id: string; key: ColumnKey } | null;
}

interface TableStateHook extends TableState {
  handleSort: (key: ColumnKey) => void;
  setSelectedStatuses: (statuses: string[]) => void;
  setEditingCell: (cell: { id: string; key: ColumnKey } | null) => void;
  handleContainerClick: (e: React.MouseEvent) => void;
}

export const useTableState = (): TableStateHook => {
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<{ id: string; key: ColumnKey } | null>(null);

  const handleSort = useCallback((key: ColumnKey) => {
    if (sortColumn === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    // If clicking inside a cell, don't clear editing state
    if ((e.target as HTMLElement).closest('td')) {
      return;
    }
    setEditingCell(null);
  }, []);

  return {
    sortColumn,
    sortDirection,
    selectedStatuses,
    editingCell,
    handleSort,
    setSelectedStatuses,
    setEditingCell,
    handleContainerClick,
  };
};
