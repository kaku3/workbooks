import { useState, useRef } from 'react';
import type { TicketData } from '@/types';

interface UseDragAndDropProps {
  tickets: TicketData[];
  onUpdateOrder: (ticketId: string, order: number) => Promise<boolean>;
  onUpdateBatchOrders: (orders: { ticketId: string, order: number }[]) => Promise<boolean>;
  sortOrders: { [key: string]: number };
}

export const useDragAndDrop = ({
  tickets,
  onUpdateBatchOrders,
  sortOrders
}: UseDragAndDropProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleDragStart = (id: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveId(id);
  };

  const normalizeOrders = (
    tickets: TicketData[],
    sourceId: string,
    destinationId: string,
    direction: 'top' | 'bottom'
  ): TicketData[] => {
    // 現在のソート順を取得（ソート順が未設定のものは末尾に配置）
    const sortedTickets = [...tickets].sort((a, b) => {
      if (!a.id || !b.id) return 0;
      const orderA = sortOrders[a.id] ?? Number.MAX_SAFE_INTEGER;
      const orderB = sortOrders[b.id] ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });

    // ドラッグ中のチケットを目的の位置に移動
    const sourceIndex = sortedTickets.findIndex(t => t.id === sourceId);
    const destIndex = sortedTickets.findIndex(t => t.id === destinationId);
    
    if (sourceIndex !== -1 && destIndex !== -1) {
      const [sourceTicket] = sortedTickets.splice(sourceIndex, 1);
      // 下にドロップする場合は対象の次、上にドロップする場合は対象の位置に挿入
      const insertIndex = direction === 'bottom' ? destIndex + 1 : destIndex;
      const mutableTickets = [...sortedTickets];
      mutableTickets.splice(insertIndex, 0, sourceTicket);
      return mutableTickets;
    }

    return sortedTickets;
  };

  const handleDragEnd = async (sourceId: string, destinationId: string, direction: 'top' | 'bottom') => {
    setActiveId(null);

    if (sourceId === destinationId) return;

    // 全てのチケットの順序を1から振り直す
    const newTicketOrder = normalizeOrders(tickets, sourceId, destinationId, direction);
    const newOrders = newTicketOrder
      .filter(ticket => ticket.id)
      .map((ticket, index) => ({
        ticketId: ticket.id!,
        order: (index + 1) * 1000
      }));

    await onUpdateBatchOrders(newOrders);
  };

  return {
    activeId,
    handleDragStart,
    handleDragEnd,
  };
};
