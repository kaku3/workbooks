import { useApplication } from '@/contexts/ApplicationContext';

// 後方互換性のための実装
// このフックは廃止予定なので、今後は直接useApplicationを使用してください
export const useTickets = () => {
  const { 
    tickets, 
    isLoadingTickets: isLoading, 
    ticketsError: error,
    fetchTickets,
    updateTicket,
    deleteTicket 
  } = useApplication();
  
  // 既存のインターフェイスと互換性のある形で返す
  return {
    tickets,
    isLoading,
    error,
    fetchTickets,
    updateTicket,
    deleteTicket,
  };
};
