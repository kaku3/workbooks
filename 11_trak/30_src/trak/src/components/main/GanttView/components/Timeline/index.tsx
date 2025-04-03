import { TicketData } from '@/types';
import styles from './style.module.css';
import { useState } from 'react';

interface TimelineProps {
  tickets: TicketData[];
  timelineRange: {
    start: Date;
    end: Date;
  };
  zoomLevel?: number; // 25-150% (default 100%)
  onUpdateTicket?: (ticketId: string, updates: Partial<TicketData>) => void;
}

export default function Timeline({ 
  tickets, 
  timelineRange,
  zoomLevel = 100,
  onUpdateTicket,
}: TimelineProps) {
  // 日付の配列を生成
  const generateTimelineDates = () => {
    const dates: Date[] = [];
    const current = new Date(timelineRange.start);

    while (current <= timelineRange.end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const timelineDates = generateTimelineDates();
  let prevDate: Date | null = null;
  
  // ズームレベルに応じたセル幅を設定 (24px = 100%)
  const baseWidth = 24;
  const cellWidth = Math.max(6, Math.min(36, (baseWidth * zoomLevel) / 100));
  const totalWidth = timelineDates.length * cellWidth;

  // 日付を表示するかどうかの判定
  const shouldShowDate = (date: Date) => {
    if (zoomLevel > 80) {
      // 80%以上は全ての日付を表示
      return true;
    } else if (zoomLevel > 50) {
      // 50-80%は月初と月曜日のみ表示
      return date.getDate() === 1 || date.getDay() === 1;
    } else {
      // 50%以下は月初のみ表示
      return date.getDate() === 1;
    }
  };

  // 日付フォーマッター
  const formatDate = (date: Date, showMonth: boolean) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if (date.getDate() === 1) {
      // 月初は必ず月を表示
      return `${month}/${day}`;
    }
    return showMonth ? `${month}/${day}` : `${day}`;
  };

  // グリッドと背景を生成
  const generateBackground = () => {
    // 土日のマスク
    const weekendsPattern = timelineDates.reduce((acc, date, index) => {
      const pos = index * cellWidth;
      if (date.getDay() === 0 || date.getDay() === 6) {
        acc.push(`transparent ${pos}px`);
        acc.push(`var(--gantt-weekend-color) ${pos}px`);
        acc.push(`var(--gantt-weekend-color) ${pos + cellWidth}px`);
        acc.push(`transparent ${pos + cellWidth}px`);
      }
      return acc;
    }, [] as string[]);
    
    const weekendMask = weekendsPattern.length > 0 
      ? `linear-gradient(90deg, ${weekendsPattern.join(', ')})` 
      : '';

    // 日グリッド
    const dailyGrid = `repeating-linear-gradient(90deg,
      transparent 0,
      transparent ${cellWidth - 1}px,
      var(--gantt-grid-color-light) ${cellWidth - 1}px,
      var(--gantt-grid-color-light) ${cellWidth}px
    )`;

    // 月初線
    const monthStarts = timelineDates.reduce((acc, date, index) => {
      if (date.getDate() === 1) {
        const pos = index * cellWidth;
        acc.push(`transparent ${pos}px`);
        acc.push(`rgba(0, 0, 0, 0.3) ${pos}px`);
        acc.push(`rgba(0, 0, 0, 0.3) ${pos + 1}px`);
        acc.push(`transparent ${pos + 1}px`);
      }
      return acc;
    }, [] as string[]);

    const monthLines = monthStarts.length > 0 
      ? `linear-gradient(90deg, ${monthStarts.join(', ')})` 
      : '';

    return [weekendMask, dailyGrid, monthLines].join(', ');
  };

  const backgroundStyle = {
    backgroundColor: '#fff',
    backgroundImage: generateBackground(),
    backgroundSize: `100% 100%, ${cellWidth}px 100%, 100% 100%`,
    backgroundRepeat: 'no-repeat, repeat, no-repeat',
    backgroundPositionY: 0
  };

  // 日付をYYYY-MM-DD形式に変換
  const formatDateForApi = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // タイムライン行のクリックハンドラー
  const handleTimelineRowClick = (ticket: TicketData, clickEvent: React.MouseEvent<HTMLDivElement>) => {
    if (!onUpdateTicket || (ticket.startDate && ticket.dueDate)) {
      return; // 更新コールバックがない、または既に日付が設定されている場合は何もしない
    }

    // クリックされた位置から日付を計算
    const rect = clickEvent.currentTarget.getBoundingClientRect();
    const offsetX = clickEvent.clientX - rect.left;
    const dayIndex = Math.floor(offsetX / cellWidth);
    
    // クリックされた日付を計算
    const clickedDate = new Date(timelineRange.start);
    clickedDate.setDate(clickedDate.getDate() + dayIndex);
    
    // 終了日（開始日+5日）を計算
    const endDate = new Date(clickedDate);
    endDate.setDate(endDate.getDate() + 5);

    // チケットを更新
    onUpdateTicket(ticket.id!, {
      startDate: formatDateForApi(clickedDate),
      dueDate: formatDateForApi(endDate)
    });
  };

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartOffset, setDragStartOffset] = useState<number>(0);
  const [dragStartDate, setDragStartDate] = useState<Date | null>(null);
  const [dragDelta, setDragDelta] = useState<number>(0);

  // ドラッグ開始時のハンドラー
  const handleDragStart = (e: React.DragEvent, ticket: TicketData) => {
    if (!ticket.startDate || !ticket.dueDate) return;
    
    const element = e.currentTarget as HTMLDivElement;
    const rect = element.getBoundingClientRect();

    console.log('Drag start', {
      clientX: e.clientX,
      rectLeft: rect.left,
      elementOffsetLeft: element.offsetLeft,
      ticket: ticket.title
    });

    setDraggingId(ticket.id!);
    setDragStartX(e.clientX);
    setDragStartOffset(element.offsetLeft);
    setDragStartDate(new Date(ticket.startDate));
    
    // ゴースト画像を設定
    const ghost = document.createElement('div');
    ghost.style.display = 'none';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 0, 0);
    setTimeout(() => document.body.removeChild(ghost), 0);

    element.classList.add(styles.dragging);
  };

  // ドラッグ中のハンドラー
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!draggingId) return;

    const deltaX = e.clientX - dragStartX;
    const daysDelta = Math.round(deltaX / cellWidth);

    // 即座に視覚的な位置を更新
    const element = document.querySelector(`.${styles.dragging}`);
    if (element) {
      (element as HTMLElement).style.transform = `translate(${deltaX}px, -2px)`;
      (element as HTMLElement).style.transition = 'none';
    }

    setDragDelta(daysDelta);
  };

  // ドラッグ終了時のハンドラー
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingId || !dragStartDate || !onUpdateTicket) return;

    const deltaX = e.clientX - dragStartX;
    const daysDelta = Math.round(deltaX / cellWidth);

    const ticket = tickets.find(t => t.id === draggingId);
    if (ticket && daysDelta !== 0 && ticket.startDate && ticket.dueDate) {
      const newStartDate = new Date(ticket.startDate);
      newStartDate.setDate(newStartDate.getDate() + daysDelta);
      
      const newDueDate = new Date(ticket.dueDate);
      newDueDate.setDate(newDueDate.getDate() + daysDelta);

      // データの更新を即座に実行
      onUpdateTicket(draggingId, {
        startDate: formatDateForApi(newStartDate),
        dueDate: formatDateForApi(newDueDate)
      });

      // ドラッグされた要素のスタイルを即座に更新
      const draggingElement = document.querySelector(`.${styles.dragging}`);
      if (draggingElement) {
        const element = draggingElement as HTMLElement;
        const currentLeft = parseInt(element.style.left);
        element.style.left = `${currentLeft + deltaX}px`;
        element.style.transform = '';
        element.classList.remove(styles.dragging);
      }
    }

    setDraggingId(null);
    setDragStartDate(null);
    setDragDelta(0);
  };

  // ドラッグがキャンセルされた時のハンドラー
  const handleDragEnd = (e: React.DragEvent) => {
    // ドロップ先が無効な場合は元の位置に戻す
    const draggingElement = document.querySelector(`.${styles.dragging}`);
    if (draggingElement) {
      (draggingElement as HTMLElement).style.transform = '';
      draggingElement.classList.remove(styles.dragging);
    }
    setDraggingId(null);
    setDragStartDate(null);
    setDragDelta(0);
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineHeader}>
        <div style={{ width: totalWidth + 'px', display: 'flex' }}>
          {timelineDates.map(date => {
            const showMonth = !prevDate || prevDate.getMonth() !== date.getMonth();
            const formattedDate = shouldShowDate(date) ? formatDate(date, showMonth) : '';
            prevDate = new Date(date);
            return (
              <div
                key={date.getTime()}
                className={`${styles.timelineHeaderCell} ${
                  [0, 6].includes(date.getDay()) ? styles.weekend : ''
                }`}
                style={{ width: cellWidth + 'px' }}
              >
                {formattedDate}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.timelineContent}>
        <div 
          style={{ width: totalWidth + 'px' }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {tickets.map(ticket => {
            const startDate = ticket.startDate ? new Date(ticket.startDate) : null;
            const endDate = ticket.dueDate ? new Date(ticket.dueDate) : null;

            if (!startDate || !endDate) {
              return (
                <div 
                  key={ticket.id} 
                  className={`${styles.timelineRow} ${!ticket.startDate && !ticket.dueDate ? styles.clickable : ''}`}
                  style={backgroundStyle}
                  onClick={(e) => handleTimelineRowClick(ticket, e)}
                  title={!ticket.startDate && !ticket.dueDate ? "Click to set dates" : undefined}
                />
              );
            }

            const msPerDay = 24 * 60 * 60 * 1000;

            // 日付を正規化（時刻を00:00:00に）
            const normalizeDate = (date: Date): Date => {
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d;
            };

            // 期間計算用のstartDateとendDateを正規化
            const normalizedStartDate = normalizeDate(startDate);
            const normalizedEndDate = normalizeDate(endDate);
            const normalizedTimelineStart = normalizeDate(timelineRange.start);

            // 位置とサイズの計算
            const calculatePosition = () => {
              const days = (normalizedEndDate.getTime() - normalizedStartDate.getTime()) / msPerDay;
              const startDays = (normalizedStartDate.getTime() - normalizedTimelineStart.getTime()) / msPerDay;
              const offset = Math.max(0, startDays);

              return {
                left: offset * cellWidth,
                width: Math.max(cellWidth, (days + 1) * cellWidth)
              };
            };

            const { left, width } = calculatePosition();

            return (
              <div 
                key={ticket.id} 
                className={styles.timelineRow}
                style={backgroundStyle}
              >
                <div 
                  className={styles.timelineBar}
                  style={{
                    left: `${left}px`,
                    width: `${width}px`,
                    position: 'absolute'
                  }}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, ticket)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                >
                  {ticket.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
