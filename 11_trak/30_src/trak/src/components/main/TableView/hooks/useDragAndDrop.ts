import { useState, useRef } from 'react';
import type { TicketData } from '@/types';

export const useDragAndDrop = (
  tickets: TicketData[],
  onUpdate: (ticket: TicketData) => Promise<boolean | void>
) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleDragStart = (id: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveId(id);
  };

  const handleDragEnd = (sourceId: string, destinationId: string) => {
    setActiveId(null);

    if (sourceId === destinationId) return;

    // Find source and destination tickets
    const sourceTicket = tickets.find(t => t.id === sourceId);
    const destinationTicket = tickets.find(t => t.id === destinationId);
    if (!sourceTicket || !destinationTicket) return;

    // If both tickets have orders, put the source ticket between its neighbors
    if (destinationTicket.userOrder !== undefined) {
      // Find the previous and next tickets in order
      const sortedTickets = tickets
        .filter(t => t.userOrder !== undefined)
        .sort((a, b) => (a.userOrder ?? 0) - (b.userOrder ?? 0));
      
      const destIndex = sortedTickets.findIndex(t => t.id === destinationId);
      const prevTicket = destIndex > 0 ? sortedTickets[destIndex - 1] : null;
      const nextTicket = destIndex < sortedTickets.length - 1 ? sortedTickets[destIndex + 1] : null;

      let newOrder: number;
      if (!prevTicket) {
        newOrder = (destinationTicket.userOrder ?? 0) - 1000;
      } else if (!nextTicket) {
        newOrder = (destinationTicket.userOrder ?? 0) + 1000;
      } else {
        newOrder = ((prevTicket.userOrder ?? 0) + (nextTicket.userOrder ?? 0)) / 2;
      }

      // Update the source ticket's order and set a timeout to clear the active state
      onUpdate({ ...sourceTicket, userOrder: newOrder });
      timeoutRef.current = setTimeout(() => {
        setActiveId(null);
      }, 100);
    }
    // If destination ticket has no order, give both tickets initial orders
    else {
      onUpdate({ ...destinationTicket, userOrder: 1000 });
      onUpdate({ ...sourceTicket, userOrder: 2000 });
    }
  };

  return {
    activeId,
    handleDragStart,
    handleDragEnd,
  };
};
