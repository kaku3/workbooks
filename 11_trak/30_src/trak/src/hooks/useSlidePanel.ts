import { useState, useEffect, useCallback, useRef } from 'react';

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
  const initialTicketHandled = useRef(false);
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
    if (initialTicketId && !initialTicketHandled.current) {
      initialTicketHandled.current = true;
      setState({
        isOpen: true,
        mode: 'edit',
        ticketId: initialTicketId,
      });
      // Update URL without page reload
      window.history.pushState({}, '', `/tickets/${initialTicketId}`);
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
    if (state.ticketId !== ticketId || !state.isOpen) {
      setState({
        isOpen: true,
        mode: 'edit',
        ticketId,
      });
      // Update URL without page reload
      window.history.pushState({}, '', `/tickets/${ticketId}`);
    }
  }, [state.ticketId, state.isOpen]);

  const handleClose = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));

    // Reset the initialTicketHandled when closing
    initialTicketHandled.current = false;

    // Always restore URL to home when closing panel
    if (window.location.pathname.startsWith('/tickets/')) {
      // Push new state to avoid triggering back button
      window.history.pushState({}, '', '/');
    }
  }, []);

  return {
    ...state,
    openNewTicket,
    openEditTicket,
    handleClose,
  };
};
