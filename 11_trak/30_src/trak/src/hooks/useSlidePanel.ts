import { useState, useEffect, useCallback, useRef } from 'react';
import { useApplication } from '@/contexts/ApplicationContext';

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

// 廃止予定：今後は直接useApplicationを使用してください
export const useSlidePanel = (initialTicketId?: string) => {
  const {
    slidePanel,
    openNewTicket,
    openEditTicket,
    closeSlidePanelTicket: handleClose
  } = useApplication();

  return {
    ...slidePanel,
    openNewTicket,
    openEditTicket,
    handleClose
  };
};
