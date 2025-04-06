/**
 * ステータスの型定義
 */
export interface Status {
  id: string;
  name: string;
  color: string;
}

/**
 * ステータス設定の型定義
 */
export interface StatusConfig {
  statuses: Status[];
}
