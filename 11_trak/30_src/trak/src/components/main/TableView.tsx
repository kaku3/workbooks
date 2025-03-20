'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { TicketData } from '@/app/api/tickets/types';
import { getUserColor, getTextColor } from '@/lib/utils/colors';
import styles from './TableView.module.css';

type SortDirection = 'asc' | 'desc' | null;
type ColumnKey = 'id' | 'title' | 'status' | 'assignee' | 'dueDate' | 'estimate';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Status {
  id: string;
  name: string;
  color: string;
}

interface Column {
  key: ColumnKey;
  label: string;
  visible: boolean;
}

export default function TableView() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [editingCell, setEditingCell] = useState<{ id: string; key: ColumnKey } | null>(null);
  const router = useRouter();

  // ユーザー検索
  useEffect(() => {
    if (!editingCell || editingCell.key !== 'assignee') return;
    
    const searchLower = searchText.toLowerCase();
    const filtered = users.filter(user => {
      const nameMatch = user.name.toLowerCase().includes(searchLower);
      const emailMatch = user.email.toLowerCase().includes(searchLower);
      return nameMatch || emailMatch;
    });
    setFilteredUsers(filtered);
    setShowSearch(searchText !== '');
  }, [searchText, users, editingCell]);

  // 検索結果の外側クリックで閉じる
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      // 更新が成功したら、チケットリストを更新
      setTickets(prev =>
        prev.map(t => (t.id === updatedTicket.id ? updatedTicket : t))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      // エラー時は編集状態を解除
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
      } catch (error) {
        console.error('ユーザーデータの取得に失敗:', error);
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
      } catch (error) {
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
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
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

  const [columns, setColumns] = useState<Column[]>([
    { key: 'id', label: 'ID', visible: true },
    { key: 'title', label: 'タイトル', visible: true },
    { key: 'status', label: 'ステータス', visible: true },
    { key: 'assignee', label: '担当者', visible: true },
    { key: 'dueDate', label: '期限', visible: true },
    { key: 'estimate', label: '見積', visible: true },
  ]);

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

  // ソートアイコンの表示
  const getSortIcon = (key: ColumnKey) => {
    if (sortColumn !== key) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.container}>
      {/* 表示カラム設定 */}
      <div className={styles.columnSettings}>
        <select
          multiple
          value={columns.filter(col => col.visible).map(col => col.key)}
          onChange={(e) => {
            const selectedValues = Array.from(e.target.selectedOptions, option => option.value as ColumnKey);
            setColumns(columns.map(col => ({
              ...col,
              visible: selectedValues.includes(col.key)
            })));
          }}
        >
          {columns.map(col => (
            <option key={col.key} value={col.key}>
              {col.label}
            </option>
          ))}
        </select>
      </div>

      {/* テーブル */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns
                .filter(col => col.visible)
                .map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={styles.sortableHeader}
                  >
                    {col.label}
                    <span className={styles.sortIcon}>
                      {getSortIcon(col.key)}
                    </span>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.filter(col => col.visible).length} className={styles.center}>
                  読み込み中...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.filter(col => col.visible).length} className={styles.error}>
                  {error}
                </td>
              </tr>
            ) : getSortedTickets().length === 0 ? (
              <tr>
                <td colSpan={columns.filter(col => col.visible).length} className={styles.center}>
                  チケットがありません
                </td>
              </tr>
            ) : (
              getSortedTickets().map(ticket => (
                <tr key={ticket.id}>
                  {columns.filter(col => col.visible).map(col => (
                    <td key={`${ticket.id}-${col.key}`}>
                      {col.key === 'id' ? (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/tickets/${ticket.id}/edit`);
                          }}
                          className={styles.idLink}
                        >
                          {ticket.id}
                        </a>
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
                              <input
                                type="text"
                                defaultValue={ticket.estimate >= 8 ? `${(ticket.estimate / 8).toFixed(1)}d` : `${ticket.estimate}h`}
                                className={styles.editInput}
                                onBlur={(e) => {
                                  const value = e.target.value.toLowerCase();
                                  let hours = ticket.estimate; // デフォルト値を維持

                                  if (value.endsWith('h')) {
                                    const num = parseFloat(value.slice(0, -1));
                                    if (!isNaN(num)) hours = num;
                                  } else if (value.endsWith('d')) {
                                    const num = parseFloat(value.slice(0, -1));
                                    if (!isNaN(num)) hours = num * 8; // 1日 = 8時間
                                  } else {
                                    const num = parseFloat(value);
                                    if (!isNaN(num)) hours = num;
                                  }

                                  const updatedTicket = { ...ticket, estimate: hours };
                                  updateTicket(updatedTicket);
                                  setEditingCell(null);
                                }}
                                autoFocus
                              />
                            ) : col.key === 'status' ? (
                              <select
                                className={styles.editInput}
                                value={ticket.status}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  const updatedTicket = { ...ticket, status: value };
                                  updateTicket(updatedTicket);
                                  setTimeout(() => setEditingCell(null), 200);
                                }}
                                style={{
                                  backgroundColor: statuses.find(s => s.id === ticket.status)?.color || '#3b82f6',
                                  color: getTextColor(statuses.find(s => s.id === ticket.status)?.color || '#3b82f6'),
                                  borderColor: statuses.find(s => s.id === ticket.status)?.color || '#3b82f6'
                                }}
                                autoFocus
                              >
                                {statuses.map(status => (
                                  <option
                                    key={status.id}
                                    value={status.id}
                                    style={{
                                      backgroundColor: status.color,
                                      color: getTextColor(status.color)
                                    }}
                                  >
                                    {status.name}
                                  </option>
                                ))}
                              </select>
                            ) : col.key === 'dueDate' ? (
                              <input
                                type="date"
                                value={ticket.dueDate}
                                className={styles.editInput}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setTickets(prev =>
                                    prev.map(t =>
                                      t.id === ticket.id ? { ...t, dueDate: value } : t
                                    )
                                  );
                                }}
                                onBlur={(e) => {
                                  const updatedTicket = { ...ticket, dueDate: e.target.value };
                                  updateTicket(updatedTicket);
                                  setEditingCell(null);
                                }}
                                autoFocus
                              />
                            ) : col.key === 'assignee' ? (
                              <div className={styles.assigneeSearch} ref={searchRef}>
                                <input
                                  type="text"
                                  value={searchText}
                                  className={styles.searchInput}
                                  onChange={(e) => {
                                    setSearchText(e.target.value);
                                    setShowSearch(true);
                                  }}
                                  onFocus={() => setShowSearch(true)}
                                  placeholder="担当者を検索... (ESCで閉じる)"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                      setEditingCell(null);
                                      setSearchText('');
                                    }
                                  }}
                                  autoFocus
                                />
                                <button
                                  type="button"
                                  className={styles.closeButton}
                                  onClick={() => {
                                    setEditingCell(null);
                                    setSearchText('');
                                  }}
                                >
                                  ×
                                </button>
                                {showSearch && filteredUsers.length > 0 && (
                                  <div className={styles.searchResults}>
                                    {filteredUsers.map(user => (
                                      <div
                                        key={user.email}
                                        className={styles.searchItem}
                                        onMouseDown={() => {
                                          if (!ticket.assignees.includes(user.email)) {
                                            const updatedTicket = {
                                              ...ticket,
                                              assignees: [...ticket.assignees, user.email]
                                            };
                                            updateTicket(updatedTicket);
                                          }
                                          setSearchText('');
                                        }}
                                      >
                                        <span className={styles.searchItemName}>{user.name}</span>
                                        <span className={styles.searchItemEmail}>{user.email}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={ticket.title}
                                className={styles.editInput}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setTickets(prev =>
                                    prev.map(t =>
                                      t.id === ticket.id ? { ...t, title: value } : t
                                    )
                                  );
                                }}
                                onBlur={(e) => {
                                  const updatedTicket = { ...ticket, title: e.target.value };
                                  updateTicket(updatedTicket);
                                  setEditingCell(null);
                                }}
                                autoFocus
                              />
                            )
                          ) : (
                            <>
                              {col.key === 'title' && ticket.title}
                              {col.key === 'status' && (
                                <div
                                  className={styles.statusCell}
                                  style={{
                                    backgroundColor: statuses.find(s => s.id === ticket.status)?.color || '#3b82f6',
                                    color: getTextColor(statuses.find(s => s.id === ticket.status)?.color || '#3b82f6')
                                  }}
                                >
                                  {statuses.find(s => s.id === ticket.status)?.name || ticket.status}
                                </div>
                              )}
                              {col.key === 'assignee' && ticket.assignees.length > 0 && (
                                <div className={styles.assigneeTags}>
                                  {ticket.assignees.map(email => {
                                    const user = users.find(u => u.email === email);
                                    return (
                                      <div
                                        key={email}
                                        className={styles.assigneeCell}
                                        style={{
                                          backgroundColor: getUserColor(user?.id || ''),
                                          color: getTextColor(getUserColor(user?.id || ''))
                                        }}
                                      >
                                        <span className={styles.assigneeName}>
                                          {user?.name || email}
                                        </span>
                                        <button
                                          type="button"
                                          className={styles.removeButton}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const updatedTicket = {
                                              ...ticket,
                                              assignees: ticket.assignees.filter(a => a !== email)
                                            };
                                            updateTicket(updatedTicket);
                                          }}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {col.key === 'assignee' && !ticket.assignees.length && '-'}
                              {col.key === 'dueDate' && ticket.dueDate && new Date(ticket.dueDate).toLocaleDateString()}
                              {col.key === 'estimate' && (
                                ticket.estimate >= 8 
                                  ? `${(ticket.estimate / 8).toFixed(1)}d` 
                                  : `${ticket.estimate}h`
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
