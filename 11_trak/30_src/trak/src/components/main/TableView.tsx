'use client';

import styles from './TableView.module.css';
import { useState, useEffect, useCallback } from 'react';
import SlidePanel from '../common/SlidePanel';
import TicketForm from '../tickets/TicketForm';
import { TagsProvider } from './TagsContext';
import IdCell from './cell/IdCell';
import StatusCell from './cell/StatusCell';
import EstimateCell from './cell/EstimateCell';
import DateCell from './cell/DateCell';
import AssigneeCell from './cell/AssigneeCell';
import TitleCell from './cell/TitleCell';
import SortHeader from './SortHeader';
import TableStateRow from './TableStateRow';
import StatusFilter from './StatusFilter';
import type {
  User,
  Status,
  TicketData,
  ColumnKey,
  SortDirection,
  ExtendedColumn
} from '@/types';

interface TableViewProps {
  initialTicketId?: string;
}

export default function TableView({ initialTicketId }: TableViewProps) {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uiError, setUiError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [editingCell, setEditingCell] = useState<{ id: string; key: ColumnKey } | null>(null);
  const [slidePanelOpen, setSlidePanelOpen] = useState(false);
  const [ticketFormMode, setTicketFormMode] = useState<'new' | 'edit'>('new');
  const [selectedTicketId, setSelectedTicketId] = useState<string | undefined>();

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setSlidePanelOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Open ticket in edit mode if initialTicketId is provided
  useEffect(() => {
    if (initialTicketId && tickets.some(ticket => ticket.id === initialTicketId)) {
      handleEditTicket(initialTicketId);
    }
  }, [initialTicketId, tickets]);

  const columns: ExtendedColumn[] = [
    { key: 'id', label: 'ID', visible: true },
    { key: 'title', label: 'タイトル', visible: true },
    { key: 'status', label: 'ステータス', visible: true },
    { key: 'startDate', label: '開始日', visible: true },
    { key: 'dueDate', label: '期限', visible: true },
    { key: 'estimate', label: '見積', visible: true },
    { key: 'assignee', label: '担当者', visible: true },
  ];

  const updateTicket = useCallback(async (updatedTicket: TicketData) => {
    try {
      const response = await fetch(`/api/tickets/${updatedTicket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTicket),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '更新に失敗しました');
      }

      setTickets(prev =>
        prev.map(t => (t.id === updatedTicket.id ? updatedTicket : t))
      );
    } catch (err) {
      setUiError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      setEditingCell(null);
    }
  }, []);

  // ユーザーデータの取得
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        if (data.users) {
          setUsers(data.users);
        }
      } catch (err) {
        setUiError('ユーザーデータの取得に失敗しました');
        console.error('ユーザーデータの取得に失敗:', err);
      }
    };

    fetchUsers();
  }, []);

  // ステータスデータの取得
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch('/api/statuses');
        const data = await response.json();
        if (data.statuses) {
          setStatuses(data.statuses);
        }
      } catch {
        setStatuses([
          { id: 'open', name: 'Open', color: '#3b82f6' },
          { id: 'in-progress', name: 'In Progress', color: '#8b5cf6' },
          { id: 'in-review', name: 'In Review', color: '#10b981' },
          { id: 'completed', name: 'Completed', color: '#059669' },
          { id: 'close', name: 'Close', color: '#6b7280' },
          { id: 'blocked', name: 'Blocked', color: '#ef4444' },
          { id: 'waiting', name: 'Waiting', color: '#f59e0b' }
        ]);
      }
    };

    fetchStatuses();
  }, []);

  // チケットデータの取得
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'チケットの取得に失敗しました');
        }
        
        setTickets(data.tickets);
      } catch (err) {
        setUiError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // フィルタリングとソートされたチケットリストを取得
  const getSortedTickets = () => {
    let filteredTickets = tickets;
    
    // ステータスフィルタリング
    if (selectedStatuses.length > 0) {
      filteredTickets = tickets.filter(ticket => 
        selectedStatuses.includes(ticket.status)
      );
    }

    if (!sortColumn || !sortDirection) return filteredTickets;

    return [...tickets].sort((a, b) => {
      let aValue, bValue;

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

  // ソート処理
  const handleSort = (key: ColumnKey) => {
    if (sortColumn === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  // TicketForm用の関数
  const handleCreateTicket = () => {
    setTicketFormMode('new');
    setSelectedTicketId(undefined);
    setSlidePanelOpen(true);
  };

  const handleEditTicket = (ticketId: string) => {
    setTicketFormMode('edit');
    setSelectedTicketId(ticketId);
    setSlidePanelOpen(true);
    // Update URL without page reload
    window.history.pushState({}, '', `/tickets/${ticketId}`);
  };

  const handleClosePanel = () => {
    setSlidePanelOpen(false);

    // If this was opened via direct URL, redirect to home
    if (window.location.pathname.startsWith('/tickets/')) {
      window.location.href = '/';
      return;
    }

    // Otherwise, go back to previous URL
    window.history.back();
    
    // チケットリストを更新
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'チケットの取得に失敗しました');
        }
        
        setTickets(data.tickets);
      } catch (err) {
        setUiError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      }
    };
    fetchTickets();
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // If clicking inside a cell, don't clear editing state
    if ((e.target as HTMLElement).closest('td')) {
      return;
    }
    setEditingCell(null);
  };

  return (
    <TagsProvider>
      <div className={styles.container} onClick={handleContainerClick}>
        <div className={styles.toolbar}>
          <button className={styles.createButton} onClick={handleCreateTicket}>
            新規チケット
          </button>
          <StatusFilter
            statuses={statuses}
            selectedStatuses={selectedStatuses}
            onStatusChange={setSelectedStatuses}
          />
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns
                  .filter(col => col.visible)
                  .map(col => (
                    <SortHeader
                      key={col.key}
                      columnKey={col.key}
                      label={col.label}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableStateRow
                  colSpan={columns.filter(col => col.visible).length}
                  type="loading"
                />
              ) : uiError ? (
                <TableStateRow
                  colSpan={columns.filter(col => col.visible).length}
                  type="error"
                  message={uiError}
                />
              ) : getSortedTickets().length === 0 ? (
                <TableStateRow
                  colSpan={columns.filter(col => col.visible).length}
                  type="empty"
                />
              ) : (
                getSortedTickets().map(ticket => (
                  <tr 
                    key={ticket.id}
                    className={styles.tableRow}
                  >
                    {columns.filter(col => col.visible).map(col => (
                      <td 
                        key={`${ticket.id}-${col.key}`} 
                        className={styles[`table_${col.key}`]}
                        onClick={() => {
                          if (!['id'].includes(col.key)) {
                            setEditingCell({ id: ticket.id!, key: col.key });
                          }
                        }}
                      >
                        {col.key === 'id' ? (
                          <IdCell 
                            id={ticket.id!} 
                            onClick={() => handleEditTicket(ticket.id!)}
                          />
                        ) : col.key === 'title' ? (
                          <TitleCell 
                            value={ticket.title}
                            tags={ticket.tags}
                            setEditingCell={setEditingCell}
                            onUpdate={
                              editingCell?.id === ticket.id && editingCell?.key === col.key
                                ? (value) => {
                                    const updatedTicket = { ...ticket, title: value };
                                    updateTicket(updatedTicket);
                                  }
                                : undefined
                            }
                            onUpdateTags={
                              editingCell?.id === ticket.id && editingCell?.key === col.key
                                ? (tags) => {
                                    const updatedTicket = { ...ticket, tags };
                                    updateTicket(updatedTicket);
                                  }
                                : undefined
                            }
                          />
                        ) : col.key === 'status' ? (
                          <StatusCell
                            status={ticket.status}
                            statuses={statuses}
                            onUpdate={
                              editingCell?.id === ticket.id && editingCell?.key === col.key
                                ? (value) => {
                                    const updatedTicket = { ...ticket, status: value };
                                    updateTicket(updatedTicket);
                                    setEditingCell(null);
                                  }
                                : undefined
                            }
                          />
                        ) : col.key === 'assignee' ? (
                          <AssigneeCell
                            value={ticket.assignees}
                            users={users}
                            onUpdate={
                              editingCell?.id === ticket.id && editingCell?.key === col.key
                                ? (value) => {
                                    const updatedTicket = { ...ticket, assignees: value };
                                    updateTicket(updatedTicket);
                                    setEditingCell(null);
                                  }
                                : undefined
                            }
                          />
                        ) : col.key === 'startDate' ? (
                          <DateCell
                            value={ticket.startDate}
                            onUpdate={
                              editingCell?.id === ticket.id && editingCell?.key === col.key
                                ? (value) => {
                                    const updatedTicket = { ...ticket, startDate: value };
                                    updateTicket(updatedTicket);
                                    setEditingCell(null);
                                  }
                                : undefined
                            }
                          />
                        ) : col.key === 'dueDate' ? (
                          <DateCell
                            value={ticket.dueDate}
                            onUpdate={
                              editingCell?.id === ticket.id && editingCell?.key === col.key
                                ? (value) => {
                                    const updatedTicket = { ...ticket, dueDate: value };
                                    updateTicket(updatedTicket);
                                    setEditingCell(null);
                                  }
                                : undefined
                            }
                          />
                        ) : col.key === 'estimate' ? (
                          <EstimateCell
                            value={ticket.estimate}
                            onUpdate={
                              editingCell?.id === ticket.id && editingCell?.key === col.key
                                ? (value) => {
                                    const updatedTicket = { ...ticket, estimate: value };
                                    updateTicket(updatedTicket);
                                    setEditingCell(null);
                                  }
                                : undefined
                            }
                          />
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <SlidePanel 
        isOpen={slidePanelOpen} 
        onClose={handleClosePanel}
        title={ticketFormMode === 'new' ? 'チケット作成' : 'チケット編集'}
      >
        <TicketForm
          mode={ticketFormMode}
          ticketId={selectedTicketId}
          onClose={handleClosePanel}
        />
      </SlidePanel>
    </TagsProvider>
  );
}
