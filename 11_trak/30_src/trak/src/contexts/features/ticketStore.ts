import { useState, useCallback } from 'react';
import type { TicketData } from '@/types';

export interface TicketStore {
  tickets: TicketData[];
  isLoadingTickets: boolean;
  ticketsError: string | null;
  fetchTickets: () => Promise<void>;
  updateTicket: (ticket: TicketData) => Promise<boolean>;
  deleteTicket: (id: string) => Promise<boolean>;
}

// チケット管理のカスタムフック
export function useTicketStore(): TicketStore {
  // チケット関連の状態
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

  // チケットの取得
  const fetchTickets = useCallback(async () => {
    console.log('[ApplicationContext] fetchTickets called');
    setIsLoadingTickets(true);
    
    try {
      const response = await fetch('/api/tickets');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'チケットの取得に失敗しました');
      }

      const newTickets = [...data.tickets];
      console.log('[ApplicationContext] fetchTickets success:', newTickets);
      setTickets(newTickets);
      setTicketsError(null);
    } catch (err) {
      console.error('[ApplicationContext] fetchTickets error:', err);
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setTicketsError(errorMessage);
    } finally {
      setIsLoadingTickets(false);
    }
  }, []);

  // チケットの更新
  const updateTicket = useCallback(async (updatedTicket: TicketData) => {
    console.log('[ApplicationContext] updateTicket:', updatedTicket);
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

      setTickets(prev => prev.map(t => 
        t.id === updatedTicket.id ? updatedTicket : t
      ));
      
      return true;
    } catch (err) {
      console.error('[ApplicationContext] updateTicket error:', err);
      return false;
    }
  }, []);

  // チケットの削除
  const deleteTicket = useCallback(async (ticketId: string) => {
    console.log('[ApplicationContext] deleteTicket:', ticketId);
    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '削除に失敗しました');
      }

      setTickets(prev => prev.filter(t => t.id !== ticketId));
      return true;
    } catch (err) {
      console.error('[ApplicationContext] deleteTicket error:', err);
      return false;
    }
  }, []);

  return {
    tickets,
    isLoadingTickets,
    ticketsError,
    fetchTickets,
    updateTicket,
    deleteTicket,
  };
}

