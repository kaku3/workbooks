/**
 * ユーザー設定の型定義
 */
export interface Preference {
  tableView?: {
    sortColumn: string | null;
    sortDirection: 'asc' | 'desc' | null;
    selectedStatuses: string[];
  };
}
