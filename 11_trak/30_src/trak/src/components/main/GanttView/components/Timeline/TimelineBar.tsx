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
  const [resizeStartWidth, setResizeStartWidth] = useState<number>(0);
  const [resizeStartLeft, setResizeStartLeft] = useState<number>(0);
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

    const bar = e.currentTarget.closest(`.${styles.timelineBar}`) as HTMLElement;
    if (!bar) return;

    // クロージャ内で使用する値をローカル変数として保持
    const startX = e.clientX;
    const startLeft = left;
    const startWidth = width;

    // Reactの状態も更新（他の場所で使う場合のため）
    setResizing(handle);
    setResizeStartX(startX);
    setResizeStartLeft(startLeft);
    setResizeStartWidth(startWidth);
    
    bar.classList.add(styles.resizing);

    function onMouseMove(e: MouseEvent) {
      e.preventDefault();
      if (!ticket.startDate || !ticket.dueDate) return;

      // ローカル変数を使用
      const deltaX = e.clientX - startX;
      const daysDelta = Math.round(deltaX / cellWidth);

      // デバッグログの追加
      if (Math.abs(deltaX) % 10 === 0) {
        console.log('Resize move:', {
          clientX: e.clientX,
          startX,
          deltaX,
          startWidth,
          newWidth: handle === 'left' ? startWidth - deltaX : startWidth + deltaX
        });
      }

      // 新しい日付を計算
      const originalStartDate = new Date(ticket.startDate);
      const originalDueDate = new Date(ticket.dueDate);

      if (handle === 'left') {
        const newWidth = Math.max(cellWidth, startWidth - deltaX);
        const widthDelta = startWidth - newWidth;
        const newLeft = startLeft + widthDelta;

        const newDate = new Date(originalStartDate);
        newDate.setDate(originalStartDate.getDate() + daysDelta);
        
        if (newDate <= originalDueDate && newDate >= projectBeginDate) {
          bar.style.left = `${newLeft}px`;
          bar.style.width = `${newWidth}px`;
        }
      } else {
        const newWidth = Math.max(cellWidth, startWidth + deltaX);
        
        const newDate = new Date(originalDueDate);
        newDate.setDate(originalDueDate.getDate() + daysDelta);
        
        if (newDate >= originalStartDate) {
          bar.style.width = `${newWidth}px`;
        }
      }
    }

    function onMouseUp(e: MouseEvent) {
      e.preventDefault();
      
      // ローカル変数を使用
      const deltaX = e.clientX - startX;
      const daysDelta = Math.round(deltaX / cellWidth);

      if (handle === 'left') {
        const newStartDate = new Date(ticket.startDate);
        newStartDate.setDate(newStartDate.getDate() + daysDelta);
        if (newStartDate <= new Date(ticket.dueDate) && newStartDate >= projectBeginDate) {
          onUpdate(ticket.id!, { startDate: formatDateForApi(newStartDate) });
        }
      } else {
        const newDueDate = new Date(ticket.dueDate);
        newDueDate.setDate(newDueDate.getDate() + daysDelta);
        if (newDueDate >= new Date(ticket.startDate)) {
          onUpdate(ticket.id!, { dueDate: formatDateForApi(newDueDate) });
        }
      }

      bar.classList.remove(styles.resizing);
      setResizing(null);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div 
      id={`timeline-bar-${ticket.id}`}  // IDを追加
      className={styles.timelineBar}
      style={{
        left: `${left}px`,
        width: `${width}px`,
        position: 'absolute',
        willChange: 'transform, left, width',
        transition: 'none',
        touchAction: 'none',
        cursor: 'grab'  // ドラッグ用のカーソルを明示的に指定
      }}
      draggable={true}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
    >
      <div
        className={`${styles.resizeHandle} ${styles.left}`}
        onMouseDown={(e) => handleResizeStart(e, 'left')}
        title="開始日を変更"  // ツールチップを追加
      />
      {ticket.title}
      <div
        className={`${styles.resizeHandle} ${styles.right}`}
        onMouseDown={(e) => handleResizeStart(e, 'right')}
        title="終了日を変更"  // ツールチップを追加
      />
    </div>
  );
}
