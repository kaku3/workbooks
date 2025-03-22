'use client';

import styles from './TableView.module.css';
import { useState, useEffect, useCallback } from 'react';
import IdCell from './cell/IdCell';
import StatusSelect from './StatusSelect';
import EstimateInput from './edit/EstimateInput';
import DateInput from './edit/DateInput';
import AssigneeInput from './edit/AssigneeInput';
import TitleInput from './edit/TitleInput';
import StatusCell from './cell/StatusCell';
import EstimateCell from './cell/EstimateCell';
import AssigneeList from './edit/AssigneeList';
import SortHeader from './SortHeader';
import DateCell from './cell/DateCell';
import TableStateRow from './TableStateRow';
import type {
  User,
  Status,
  Column,
  TicketData,
  ColumnKey,
  SortDirection,
  ExtendedColumn
} from '@/types';

export default function TableView() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uiError, setUiError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [editingCell, setEditingCell] = useState<{ id: string; key: ColumnKey } | null>(null);
  const [columns, setColumns] = useState<ExtendedColumn[]>([
    { key: 'id', label: 'ID', visible: true },
    { key: 'title', label: 'タイトル', visible: true },
    { key: 'status', label: 'ステータス', visible: true },
    { key: 'dueDate', label: '期限', visible: true },
    { key: 'estimate', label: '見積', visible: true },
    { key: 'assignee', label: '担当者', visible: true },
  ]);

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

  // ソートされたチケットリストを取得
  const getSortedTickets = () => {
    if (!sortColumn || !sortDirection) return tickets;

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

  return (
    <div className={styles.container}>
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
                <tr key={ticket.id}>
                  {columns.filter(col => col.visible).map(col => (
                    <td key={`${ticket.id}-${col.key}`} className={styles[`table_${col.key}`]}>
                      {col.key === 'id' ? (
                        <IdCell id={ticket.id!} />
                      ) : (
                        <div
                          className={
                            editingCell?.id === ticket.id && editingCell?.key === col.key
                              ? styles.editingCell
                              : styles.editableCell
                          }
                          onClick={() => {
                            if (!['id', 'startDate'].includes(col.key)) {
                              setEditingCell({ id: ticket.id!, key: col.key });
                            }
                          }}
                        >
                          {editingCell?.id === ticket.id && editingCell?.key === col.key ? (
                            col.key === 'estimate' ? (
                              <EstimateInput
                                value={ticket.estimate}
                                onUpdate={(hours) => {
                                  const updatedTicket = { ...ticket, estimate: hours };
                                  updateTicket(updatedTicket);
                                }}
                                onClose={() => setEditingCell(null)}
                              />
                            ) : col.key === 'status' ? (
                              <StatusSelect
                                value={ticket.status}
                                statuses={statuses}
                                onUpdate={(value) => {
                                  const updatedTicket = { ...ticket, status: value };
                                  updateTicket(updatedTicket);
                                }}
                                onClose={() => setEditingCell(null)}
                              />
                            ) : col.key === 'dueDate' ? (
                              <DateInput
                                value={ticket.dueDate}
                                onUpdate={(value) => {
                                  const updatedTicket = { ...ticket, dueDate: value };
                                  updateTicket(updatedTicket);
                                }}
                                onClose={() => setEditingCell(null)}
                              />
                            ) : col.key === 'assignee' ? (
                              <AssigneeInput
                                value={ticket.assignees}
                                users={users}
                                onUpdate={(value) => {
                                  const updatedTicket = { ...ticket, assignees: value };
                                  updateTicket(updatedTicket);
                                }}
                                onClose={() => setEditingCell(null)}
                              />
                            ) : (
                              <TitleInput
                                value={ticket.title}
                                onUpdate={(value) => {
                                  const updatedTicket = { ...ticket, title: value };
                                  updateTicket(updatedTicket);
                                }}
                                onClose={() => setEditingCell(null)}
                              />
                            )
                          ) : (
                            <>
                              {col.key === 'title' && ticket.title}
                              {col.key === 'status' && (
                                <StatusCell
                                  status={ticket.status}
                                  statuses={statuses}
                                />
                              )}
                              {col.key === 'assignee' && (
                                <AssigneeList
                                  assignees={ticket.assignees}
                                  users={users}
                                />
                              )}
                              {col.key === 'dueDate' && (
                                <DateCell value={ticket.dueDate} />
                              )}
                              {col.key === 'estimate' && (
                                <EstimateCell value={ticket.estimate} />
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
