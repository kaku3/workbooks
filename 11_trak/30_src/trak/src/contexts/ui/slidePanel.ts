import { useState, useCallback, useRef, useEffect } from 'react';

interface SlidePanelState {
  isOpen: boolean;
  mode: 'new' | 'edit';
  ticketId?: string;
}

export interface SlidePanelHook extends SlidePanelState {
  openNewTicket: () => void;
  openEditTicket: (ticketId: string) => void;
  handleClose: () => void;
}

export function useSlidePanel(initialTicketId?: string) {
  const initialTicketHandled = useRef(false);
  const [slidePanelState, setSlidePanelState] = useState<SlidePanelState>({
    isOpen: false,
    mode: 'new'
  });

  // 新規チケットパネルを開く
  const openNewTicket = useCallback(() => {
    console.log('[SlidePanel] openNewTicket');
    setSlidePanelState({
      isOpen: true,
      mode: 'new'
    });
  }, []);

  // チケット編集パネルを開く
  const openEditTicket = useCallback((ticketId: string) => {
    console.log('[SlidePanel] openEditTicket', ticketId);
    if (slidePanelState.ticketId !== ticketId || !slidePanelState.isOpen) {
      setSlidePanelState({
        isOpen: true,
        mode: 'edit',
        ticketId
      });

      // Update URL without page reload
      window.history.pushState({}, '', `/tickets/${ticketId}`);
    }
  }, [slidePanelState.ticketId, slidePanelState.isOpen]);

  // パネルを閉じる
  const handleClose = useCallback(() => {
    console.log('[SlidePanel] handleClose');
    setSlidePanelState(prev => ({ ...prev, isOpen: false }));

    // Reset the initialTicketHandled when closing
    initialTicketHandled.current = false;

    // Always restore URL to home when closing panel
    if (window.location.pathname.startsWith('/tickets/')) {
      // Push new state to avoid triggering back button
      window.history.pushState({}, '', '/');
    }
  }, []);

  // ブラウザのバック/フォワードナビゲーション処理
  useEffect(() => {
    const handlePopState = () => {
      setSlidePanelState(prev => ({ ...prev, isOpen: false }));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 初期チケットIDがある場合、編集モードでパネルを開く
  useEffect(() => {
    if (initialTicketId && !initialTicketHandled.current) {
      console.log('[SlidePanel] Opening initial ticket:', initialTicketId);
      initialTicketHandled.current = true;
      setSlidePanelState({
        isOpen: true,
        mode: 'edit',
        ticketId: initialTicketId,
      });
      // Update URL without page reload
      window.history.pushState({}, '', `/tickets/${initialTicketId}`);
    }
  }, [initialTicketId]);

  return {
    ...slidePanelState,
    openNewTicket,
    openEditTicket,
    handleClose,
  };
}
