import { useState, useCallback } from 'react';

interface TicketSortData {
  [key: string]: number;
}

interface UseTicketSortReturn {
  sortOrders: TicketSortData;
  isLoading: boolean;
  error: string | null;
  fetchSortOrders: () => Promise<void>;
  updateSortOrder: (ticketId: string, order: number) => Promise<boolean>;
  updateBatchOrders: (orders: { ticketId: string, order: number }[]) => Promise<boolean>;
}

export const useTicketSort = (): UseTicketSortReturn => {
  const [sortOrders, setSortOrders] = useState<TicketSortData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSortOrders = useCallback(async () => {
    try {
      const response = await fetch('/api/ticket-sort');
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'ソート順の取得に失敗しました');
      }
      
      setSortOrders(data.sortData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      return false;
    }
  }, []);

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
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      return false;
    }
  }, []);

  return {
    sortOrders,
    isLoading,
    error,
    fetchSortOrders,
    updateSortOrder,
    updateBatchOrders,
  };
};
