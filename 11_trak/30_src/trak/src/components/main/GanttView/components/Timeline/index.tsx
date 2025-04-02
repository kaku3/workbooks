import { TicketData } from '@/types';
import styles from './style.module.css';

interface TimelineProps {
  tickets: TicketData[];
  timelineRange: {
    start: Date;
    end: Date;
  };
  zoomLevel?: number; // 25-150% (default 100%)
}

export default function Timeline({ 
  tickets, 
  timelineRange,
  zoomLevel = 100,
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
                  className={styles.timelineRow}
                  style={backgroundStyle}
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
                    width: `${width}px`
                  }}
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
