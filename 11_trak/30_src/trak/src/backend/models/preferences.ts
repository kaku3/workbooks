/**
 * ユーザー設定の型定義
 */
export interface Preferences {
  tableView?: {
    sortColumn: string | null;
    sortDirection: 'asc' | 'desc' | null;
    selectedStatuses: string[];
  };
}
