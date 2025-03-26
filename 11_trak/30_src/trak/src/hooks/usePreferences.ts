import { useState, useEffect, useCallback } from 'react';

interface TableViewPreferences {
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  selectedStatuses: string[];
}

interface Preferences {
  tableView?: TableViewPreferences;
}

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<Preferences>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 設定を読み込む
  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/preferences');
      if (!response.ok) {
        throw new Error('Failed to load preferences');
      }
      const data = await response.json();
      setPreferences(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error loading preferences:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 設定を保存する
  const savePreferences = useCallback(async (newPreferences: Preferences) => {
    try {
      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreferences),
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      setPreferences(newPreferences);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error saving preferences:', err);
      return false;
    }
  }, []);

  // TableViewの設定を更新する
  const updateTableViewPreferences = useCallback(async (tableViewPrefs: TableViewPreferences) => {
    const newPreferences = {
      ...preferences,
      tableView: tableViewPrefs,
    };
    return await savePreferences(newPreferences);
  }, [preferences, savePreferences]);

  // 初回マウント時に設定を読み込む
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    isLoading,
    error,
    savePreferences,
    updateTableViewPreferences,
  };
};
