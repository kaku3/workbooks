export interface TicketData {
  id?: string;
  title: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  assignees: string[];
  status: string;
  startDate: string;
  dueDate: string;
  estimate: number;
  content: string;
  templateId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface APIResponse {
  success: boolean;
  ticketId: string;
  error?: string;
}
