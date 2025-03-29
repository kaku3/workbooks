import { useState, useCallback } from 'react';
import type { TicketData } from '@/types';

interface TicketSortData {
  [key: string]: number;
}

// チケット管理のカスタムフック
export function useTicketManagement() {
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

// チケットソート関連のカスタムフック
export function useTicketSorting() {
  // チケットソート関連の状態
  const [sortOrders, setSortOrders] = useState<TicketSortData>({});
  const [isLoadingSortOrders, setIsLoadingSortOrders] = useState(true);
  const [sortOrdersError, setSortOrdersError] = useState<string | null>(null);
  
  // ソート順の取得
  const fetchSortOrders = useCallback(async () => {
    setIsLoadingSortOrders(true);
    try {
      const response = await fetch('/api/ticket-sort');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'ソート順の取得に失敗しました');
      }
      
      setSortOrders(data.sortData);
      setSortOrdersError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setSortOrdersError(errorMessage);
    } finally {
      setIsLoadingSortOrders(false);
    }
  }, []);

  // ソート順の更新
  const updateSortOrder = useCallback(async (ticketId: string, order: number) => {
    try {
      const response = await fetch('/api/ticket-sort', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId, order }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '更新に失敗しました');
      }

      setSortOrders(prev => ({
        ...prev,
        [ticketId]: order,
      }));
      setSortOrdersError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setSortOrdersError(errorMessage);
      return false;
    }
  }, []);

  // 複数のソート順を一括更新
  const updateBatchOrders = useCallback(async (orders: { ticketId: string, order: number }[]) => {
    try {
      const response = await fetch('/api/ticket-sort', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orders }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '更新に失敗しました');
      }

      setSortOrders(prev => {
        const newOrders = { ...prev };
        orders.forEach(({ ticketId, order }) => {
          newOrders[ticketId] = order;
        });
        return newOrders;
      });
      setSortOrdersError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      setSortOrdersError(errorMessage);
      return false;
    }
  }, []);

  return {
    sortOrders,
    isLoadingSortOrders,
    sortOrdersError,
    fetchSortOrders,
    updateSortOrder,
    updateBatchOrders,
  };
}
