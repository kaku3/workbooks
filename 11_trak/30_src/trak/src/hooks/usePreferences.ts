import { useApplication } from '@/contexts/ApplicationContext';

interface TableViewPreferences {
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  selectedStatuses: string[];
}

interface Preferences {
  tableView?: TableViewPreferences;
}

// 廃止予定：今後は直接useApplicationを使用してください
export const usePreferences = () => {
  const {
    preferences,
    isLoadingPreferences: isLoading,
    preferencesError: error,
    fetchPreferences,
    savePreferences,
    updateTableViewPreferences
  } = useApplication();

  return {
    preferences,
    isLoading,
    error,
    fetchPreferences,
    savePreferences,
    updateTableViewPreferences
  };
};
