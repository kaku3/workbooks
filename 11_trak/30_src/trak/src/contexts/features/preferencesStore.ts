import { useState, useCallback } from 'react';

export interface TableViewPreferences {
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  selectedStatuses: string[];
}

export interface Preferences {
  tableView?: TableViewPreferences;
}

export interface PreferencesStore {
  preferences: Preferences;
  isLoadingPreferences: boolean;
  preferencesError: string | null;
  fetchPreferences: () => Promise<void>;
  savePreferences: (newPreferences: Preferences) => Promise<boolean>;
  updateTableViewPreferences: (tableViewPreferences: TableViewPreferences) => Promise<boolean>;
}
  
export function usePreferencesStore(): PreferencesStore {
  // ユーザー設定関連の状態
  const [preferences, setPreferences] = useState<Preferences>({});
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  
  // 設定を読み込む
  const fetchPreferences = useCallback(async () => {
    try {
      setIsLoadingPreferences(true);
      const response = await fetch('/api/preferences');
      if (!response.ok) {
        throw new Error('Failed to load preferences');
      }
      const data = await response.json();
      setPreferences(data);
      setPreferencesError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setPreferencesError(errorMessage);
      console.error('Error loading preferences:', err);
    } finally {
      setIsLoadingPreferences(false);
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
      setPreferencesError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setPreferencesError(errorMessage);
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

  return {
    preferences,
    isLoadingPreferences,
    preferencesError,
    fetchPreferences,
    savePreferences,
    updateTableViewPreferences,
  };
}
