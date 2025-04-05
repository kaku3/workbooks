import { useState, useEffect } from 'react';
import type { Status } from '@/types';
import { useApplication } from '@/contexts/ApplicationContext';

export const useTableData = () => {
  const { userStore } = useApplication();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [error, setError] = useState<string | null>(null);

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

    fetchStatuses().catch(err => {
      console.error('データ取得に失敗:', err);
      setError('データの取得に失敗しました');
    });
  }, []);

  return {
    users: userStore.users,
    statuses,
    error: error || userStore.usersError,
  };
};
