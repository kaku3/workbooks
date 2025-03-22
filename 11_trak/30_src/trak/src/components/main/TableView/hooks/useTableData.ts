import { useState, useEffect } from 'react';
import type { User, Status } from '@/types';

export const useTableData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        if (data.users) {
          setUsers(data.users);
        }
      } catch (err) {
        setError('ユーザーデータの取得に失敗しました');
        console.error('ユーザーデータの取得に失敗:', err);
      }
    };

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

    Promise.all([fetchUsers(), fetchStatuses()]).catch(err => {
      console.error('データ取得に失敗:', err);
      setError('データの取得に失敗しました');
    });
  }, []);

  return {
    users,
    statuses,
    error,
  };
};
