import { useState, useEffect, useCallback } from 'react';

interface SlidePanelState {
  isOpen: boolean;
  mode: 'new' | 'edit';
  ticketId?: string;
}

interface SlidePanelHook extends SlidePanelState {
  openNewTicket: () => void;
  openEditTicket: (ticketId: string) => void;
  handleClose: () => void;
}

export const useSlidePanel = (initialTicketId?: string): SlidePanelHook => {
  const [state, setState] = useState<SlidePanelState>({
    isOpen: false,
    mode: 'new',
  });

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setState(prev => ({ ...prev, isOpen: false }));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Open ticket in edit mode if initialTicketId is provided
  useEffect(() => {
    if (initialTicketId) {
      openEditTicket(initialTicketId);
    }
  }, [initialTicketId]);

  const openNewTicket = useCallback(() => {
    setState({
      isOpen: true,
      mode: 'new',
      ticketId: undefined,
    });
  }, []);

  const openEditTicket = useCallback((ticketId: string) => {
    setState({
      isOpen: true,
      mode: 'edit',
      ticketId,
    });
    // Update URL without page reload
    window.history.pushState({}, '', `/tickets/${ticketId}`);
  }, []);

  const handleClose = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));

    // If this was opened via direct URL, redirect to home
    if (window.location.pathname.startsWith('/tickets/')) {
      window.location.href = '/';
      return;
    }

    // Otherwise, go back to previous URL
    window.history.back();
  }, []);

  return {
    ...state,
    openNewTicket,
    openEditTicket,
    handleClose,
  };
};
