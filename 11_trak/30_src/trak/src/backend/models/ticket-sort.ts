/**
 * チケットのソート順データの型定義
 */
export interface TicketSortData {
  [key: string]: number;  // ticketId: order
}

/**
 * チケットのソート順一括更新データの型定義
 */
export interface BatchUpdateData {
  orders: { ticketId: string, order: number }[];
}
