/**
 * チケットデータの型定義
 */
export interface TicketData {
  id?: string;
  title: string;
  creator: string;
  assignees: string[];
  status: string;
  startDate: string;
  dueDate: string;
  estimate: number;
  progress?: number;
  content: string;
  templateId: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * チケットAPIレスポンスの型定義
 */
export interface APIResponse {
  success: boolean;
  ticketId: string;
  error?: string;
}

/**
 * チケット取得APIレスポンスの型定義
 */
export interface GetTicketResponse {
  success: boolean;
  ticket?: TicketData;
  ticketId: string;
  error?: string;
}
