import { useState, useCallback } from 'react';
import type { TicketSortData } from '@/types';

export interface TicketSortStore {
  sortOrders: TicketSortData;
  isLoadingSortOrders: boolean;
  sortOrdersError: string | null;
  fetchSortOrders: () => Promise<void>;
  updateSortOrder: (ticketId: string, order: number) => Promise<boolean>;
  updateBatchOrders: (orders: { ticketId: string, order: number }[]) => Promise<boolean>;
}

// チケットソート関連のカスタムフック
export function useTicketSortStore(): TicketSortStore {
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
