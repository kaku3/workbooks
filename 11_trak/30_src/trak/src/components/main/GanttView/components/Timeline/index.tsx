import { TicketData } from '@/types';
import styles from './style.module.css';
import { useCallback } from 'react';
import { TimelineBar } from './TimelineBar';
import { useApplication } from '@/contexts/ApplicationContext';

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
  const { project } = useApplication().projectStore;

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
    const weekendsPattern = timelineDates.reduce((acc: string[], date: Date, index: number) => {
      const pos = index * cellWidth;
      if (date.getDay() === 0 || date.getDay() === 6) {
        acc.push(`transparent ${pos}px`);
        acc.push(`var(--gantt-weekend-color) ${pos}px`);
        acc.push(`var(--gantt-weekend-color) ${pos + cellWidth}px`);
        acc.push(`transparent ${pos + cellWidth}px`);
      }
      return acc;
    }, []);
    
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
    const monthStarts = timelineDates.reduce((acc: string[], date: Date, index: number) => {
      if (date.getDate() === 1) {
        const pos = index * cellWidth;
        acc.push(`transparent ${pos}px`);
        acc.push(`rgba(0, 0, 0, 0.3) ${pos}px`);
        acc.push(`rgba(0, 0, 0, 0.3) ${pos + 1}px`);
        acc.push(`transparent ${pos + 1}px`);
      }
      return acc;
    }, []);

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
  const formatDateForApi = useCallback((date: Date): string => {
    return date.toISOString().split('T')[0];
  }, []);

  // タイムライン行のクリックハンドラー
  const handleTimelineRowClick = useCallback((ticket: TicketData, clickEvent: React.MouseEvent<HTMLDivElement>) => {
    if (!onUpdateTicket || (ticket.startDate && ticket.dueDate)) return;

    const rect = clickEvent.currentTarget.getBoundingClientRect();
    const offsetX = clickEvent.clientX - rect.left;
    const dayIndex = Math.floor(offsetX / cellWidth);
    
    const clickedDate = new Date(timelineRange.start);
    clickedDate.setDate(clickedDate.getDate() + dayIndex);
    
    const endDate = new Date(clickedDate);
    endDate.setDate(endDate.getDate() + 5);

    onUpdateTicket(ticket.id!, {
      startDate: formatDateForApi(clickedDate),
      dueDate: formatDateForApi(endDate)
    });
  }, [onUpdateTicket, timelineRange.start, cellWidth, formatDateForApi]);
  
  const projectBeginDate = new Date(timelineRange.start);

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
        <div style={{ width: totalWidth + 'px' }}>
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
            const normalizeDate = (date: Date): Date => {
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d;
            };

            const normalizedStartDate = normalizeDate(startDate);
            const normalizedEndDate = normalizeDate(endDate);
            const normalizedTimelineStart = normalizeDate(timelineRange.start);

            const { left, width } = (() => {
              const days = (normalizedEndDate.getTime() - normalizedStartDate.getTime()) / msPerDay;
              const startDays = (normalizedStartDate.getTime() - normalizedTimelineStart.getTime()) / msPerDay;
              const offset = Math.max(0, startDays);

              return {
                left: offset * cellWidth,
                width: Math.max(cellWidth, (days + 1) * cellWidth)
              };
            })();

            return (
              <div 
                key={ticket.id} 
                className={styles.timelineRow}
                style={backgroundStyle}
              >
                <TimelineBar
                  ticket={ticket}
                  left={left}
                  width={width}
                  projectBeginDate={projectBeginDate}
                  cellWidth={cellWidth}
                  onUpdate={onUpdateTicket!}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
