import { useState, useCallback } from 'react';
import type { User } from '@/types';

export interface UserStore {
  users: User[];
  isLoadingUsers: boolean;
  usersError: string | null;
  fetchUsers: () => Promise<void>;
}

// ユーザー管理のカスタムフック
export function useUserStore(): UserStore {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    console.log('[ApplicationContext] fetchUsers called');
    setIsLoadingUsers(true);

    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.users) {
        setUsers(data.users);
        setUsersError(null);
      } else {
        throw new Error('ユーザーデータの取得に失敗しました');
      }
    } catch (err) {
      console.error('[ApplicationContext] fetchUsers error:', err);
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setUsersError(errorMessage);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  return {
    users,
    isLoadingUsers,
    usersError,
    fetchUsers,
  };
}
