import { useApplication } from '@/contexts/ApplicationContext';

// 廃止予定：今後は直接useApplicationを使用してください
export const useTicketSort = () => {
  const {
    sortOrders,
    isLoadingSortOrders: isLoading,
    sortOrdersError: error,
    fetchSortOrders,
    updateSortOrder,
    updateBatchOrders
  } = useApplication();

  return {
    sortOrders,
    isLoading,
    error,
    fetchSortOrders,
    updateSortOrder,
    updateBatchOrders
  };
};
