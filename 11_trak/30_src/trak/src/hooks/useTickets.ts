import { useState, useCallback } from 'react';
import type { TicketData } from '@/types';

export const useTickets = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    try {
      const response = await fetch('/api/tickets');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'チケットの取得に失敗しました');
      }
      
      setTickets(data.tickets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTicket = useCallback(async (updatedTicket: TicketData) => {
    try {
      const response = await fetch(`/api/tickets/${updatedTicket.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTicket),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '更新に失敗しました');
      }

      setTickets(prev =>
        prev.map(t => (t.id === updatedTicket.id ? updatedTicket : t))
      );
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      return false;
    }
  }, []);

  const deleteTicket = useCallback(async (ticketId: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '削除に失敗しました');
      }

      setTickets(prev => prev.filter(t => t.id !== ticketId));
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      return false;
    }
  }, []);

  return {
    tickets,
    isLoading,
    error,
    fetchTickets,
    updateTicket,
    deleteTicket,
  };
};
