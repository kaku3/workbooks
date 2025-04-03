import { TicketData } from '@/types';
import { useState } from 'react';
import styles from './style.module.css';

interface TimelineBarProps {
  ticket: TicketData;
  left: number;
  width: number;
  projectBeginDate: Date;
  cellWidth: number;
  onUpdate: (ticketId: string, updates: Partial<TicketData>) => void;
}

export function TimelineBar({
  ticket,
  left,
  width,
  projectBeginDate,
  cellWidth,
  onUpdate
}: TimelineBarProps) {
  const [resizing, setResizing] = useState<'left' | 'right' | null>(null);
  const [resizeStartX, setResizeStartX] = useState<number>(0);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartLeft, setDragStartLeft] = useState<number>(0);

  const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const bar = e.currentTarget;
    setDragStartX(e.clientX);
    setDragStartLeft(left);
    
    // ゴースト画像処理
    const ghost = document.createElement('div');
    ghost.style.display = 'none';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);

    bar.classList.add(styles.dragging);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.clientX) return;

    const deltaX = e.clientX - dragStartX;
    const bar = e.currentTarget;

    // transformのみを使用して位置を更新
    requestAnimationFrame(() => {
      bar.style.transform = `translate(${deltaX}px, -2px)`;
    });
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.clientX) return;

    const deltaX = e.clientX - dragStartX;
    const daysDelta = Math.round(deltaX / cellWidth);
    const bar = e.currentTarget;

    // 位置の更新とデータの更新を1フレームで行う
    requestAnimationFrame(() => {
      if (daysDelta !== 0 && ticket.startDate && ticket.dueDate) {
        const newStartDate = new Date(ticket.startDate);
        newStartDate.setDate(newStartDate.getDate() + daysDelta);
        
        const newDueDate = new Date(ticket.dueDate);
        newDueDate.setDate(newDueDate.getDate() + daysDelta);

        // まず新しい位置に更新
        bar.style.transform = '';
        bar.style.left = `${dragStartLeft + deltaX}px`;

        // 次にデータを更新
        onUpdate(ticket.id!, {
          startDate: formatDateForApi(newStartDate),
          dueDate: formatDateForApi(newDueDate)
        });
      } else {
        // 位置の変更がない場合は元の位置に戻す
        bar.style.transform = '';
      }

      bar.classList.remove(styles.dragging);
    });
  };

  const handleResizeStart = (e: React.MouseEvent, handle: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();

    const bar = e.currentTarget.parentElement as HTMLElement;
    if (!bar || resizing) return;

    setResizing(handle);
    setResizeStartX(e.clientX);
    
    bar.classList.add(styles.resizing);
    bar.dataset.startLeft = String(left);
    bar.dataset.startWidth = String(width);

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!resizing || !ticket.startDate || !ticket.dueDate) return;

      const deltaX = e.clientX - resizeStartX;
      const daysDelta = Math.round(deltaX / cellWidth);
      
      const startDate = new Date(ticket.startDate);
      const dueDate = new Date(ticket.dueDate);
      const startLeft = left;
      const startWidth = width;

      if (handle === 'left') {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(startDate.getDate() + daysDelta);
        if (newStartDate > dueDate || newStartDate < projectBeginDate) return;

        const newWidth = Math.max(cellWidth, startWidth - deltaX);
        bar.style.left = `${startLeft + deltaX}px`;
        bar.style.width = `${newWidth}px`;
      } else {
        const newDueDate = new Date(dueDate);
        newDueDate.setDate(dueDate.getDate() + daysDelta);
        if (newDueDate < startDate) return;

        const newWidth = Math.max(cellWidth, startWidth + deltaX);
        bar.style.width = `${newWidth}px`;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      if (!resizing || !ticket.startDate || !ticket.dueDate) return;

      const deltaX = e.clientX - resizeStartX;
      const daysDelta = Math.round(deltaX / cellWidth);

      if (handle === 'left') {
        const newStartDate = new Date(ticket.startDate);
        newStartDate.setDate(newStartDate.getDate() + daysDelta);
        
        if (newStartDate <= dueDate && newStartDate >= projectBeginDate) {
          requestAnimationFrame(() => {
            onUpdate(ticket.id!, {
              startDate: formatDateForApi(newStartDate)
            });
          });
        }
      } else {
        const newDueDate = new Date(ticket.dueDate);
        newDueDate.setDate(dueDate.getDate() + daysDelta);
        
        if (newDueDate >= startDate) {
          requestAnimationFrame(() => {
            onUpdate(ticket.id!, {
              dueDate: formatDateForApi(newDueDate)
            });
          });
        }
      }

      bar.classList.remove(styles.resizing);
      bar.style.transform = '';
      setResizing(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      className={styles.timelineBar}
      style={{
        left: `${left}px`,
        width: `${width}px`,
        position: 'absolute',
        willChange: 'transform, left',
        transition: 'none'
      }}
      draggable={true}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      data-original-left={left}
      data-original-width={width}
    >
      <div
        className={`${styles.resizeHandle} ${styles.left}`}
        onMouseDown={(e) => handleResizeStart(e, 'left')}
      />
      {ticket.title}
      <div
        className={`${styles.resizeHandle} ${styles.right}`}
        onMouseDown={(e) => handleResizeStart(e, 'right')}
      />
    </div>
  );
}
