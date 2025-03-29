import { useState, useCallback, useEffect } from 'react';
import { useApplication } from '@/contexts/ApplicationContext'; 
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
  const { preferences, updateTableViewPreferences } = useApplication();
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(preferences.tableView?.sortColumn as ColumnKey || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(preferences.tableView?.sortDirection || null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(preferences.tableView?.selectedStatuses || []);
  const [editingCell, setEditingCell] = useState<{ id: string; key: ColumnKey } | null>(null);

  // 初期設定の適用
  useEffect(() => {
    if (preferences.tableView) {
      setSortColumn(preferences.tableView.sortColumn as ColumnKey);
      setSortDirection(preferences.tableView.sortDirection);
      setSelectedStatuses(preferences.tableView.selectedStatuses);
    }
  }, [preferences.tableView]);

  const handleSort = useCallback(async (key: ColumnKey) => {
    let newSortColumn = sortColumn;
    let newSortDirection = sortDirection;

    if (sortColumn === key) {
      if (sortDirection === 'asc') {
        newSortDirection = 'desc';
      } else if (sortDirection === 'desc') {
        newSortColumn = null;
        newSortDirection = null;
      }
    } else {
      newSortColumn = key;
      newSortDirection = 'asc';
    }

    setSortColumn(newSortColumn);
    setSortDirection(newSortDirection);

    await updateTableViewPreferences({
      sortColumn: newSortColumn,
      sortDirection: newSortDirection,
      selectedStatuses,
    });
  }, [sortColumn, sortDirection]);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    // If clicking inside a cell, don't clear editing state
    if ((e.target as HTMLElement).closest('td')) {
      return;
    }
    setEditingCell(null);
  }, []);

  const handleStatusChange = useCallback(async (newStatuses: string[]) => {
    setSelectedStatuses(newStatuses);
    await updateTableViewPreferences({
      sortColumn,
      sortDirection,
      selectedStatuses: newStatuses,
    });
  }, [sortColumn, sortDirection, updateTableViewPreferences]);

  return {
    sortColumn,
    sortDirection,
    selectedStatuses,
    editingCell,
    handleSort,
    setSelectedStatuses: handleStatusChange,
    setEditingCell,
    handleContainerClick,
  };
};
