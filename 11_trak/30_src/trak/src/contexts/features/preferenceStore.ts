import { useState, useCallback } from "react";

export interface TableViewPreference {
  sortColumn: string | null;
  sortDirection: "asc" | "desc" | null;
  selectedStatuses: string[];
  selectedAssignees: string[];
}

export interface Preference {
  tableView?: TableViewPreference;
}

export interface PreferenceStore {
  preference: Preference;
  isLoadingPreference: boolean;
  preferenceError: string | null;
  fetchPreference: () => Promise<void>;
  savePreference: (newPreference: Preference) => Promise<boolean>;
  updateTableViewPreference: (
    tableViewPreferences: TableViewPreference
  ) => Promise<boolean>;
}

export function usePreferenceStore(): PreferenceStore {
  // ユーザー設定関連の状態
  const [preference, setPreference] = useState<Preference>({});
  const [isLoadingPreference, setIsLoadingPreference] = useState(true);
  const [preferenceError, setPreferenceError] = useState<string | null>(null);

  // 設定を読み込む
  const fetchPreference = useCallback(async () => {
    try {
      setIsLoadingPreference(true);
      const response = await fetch("/api/preference");
      if (!response.ok) {
        throw new Error("Failed to load preferences");
      }
      const data = await response.json();
      setPreference(data);
      setPreferenceError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setPreferenceError(errorMessage);
      console.error("Error loading preferences:", err);
    } finally {
      setIsLoadingPreference(false);
    }
  }, []);

  // 設定を保存する
  const savePreference = useCallback(async (newPreferences: Preference) => {
    try {
      const response = await fetch("/api/preference", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPreferences),
      });

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }

      setPreference(newPreferences);
      setPreferenceError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setPreferenceError(errorMessage);
      console.error("Error saving preferences:", err);
      return false;
    }
  }, []);

  // TableViewの設定を更新する
  const updateTableViewPreference = useCallback(
    async (tableViewPreference: TableViewPreference) => {
      const newPreference = {
        ...preference,
        tableView: tableViewPreference,
      };
      return await savePreference(newPreference);
    },
    [preference, savePreference]
  );

  return {
    preference,
    isLoadingPreference,
    preferenceError,
    fetchPreference,
    savePreference,
    updateTableViewPreference,
  };
}
