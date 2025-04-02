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

  // 日付フォーマッター
  const formatDate = (date: Date, showMonth: boolean) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return showMonth ? `${month}/${day}` : `${day}`;
  };

  // グリッドと土日の背景パターンを生成
  const generateBackground = () => {
    const startDayOfWeek = timelineRange.start.getDay();
    const majorGrid = `linear-gradient(90deg, 
      var(--gantt-grid-color) 1px, 
      transparent 1px
    )`;

    const minorGrid = `linear-gradient(90deg, 
      var(--gantt-grid-color-light) 1px, 
      transparent 1px
    )`;

    const weekendBackground = Array.from({ length: 7 }, (_, i) => {
      const dayOfWeek = (startDayOfWeek + i) % 7;
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      return `${isWeekend ? 'var(--gantt-weekend-color)' : 'transparent'} ${i * cellWidth}px ${(i + 1) * cellWidth}px${i < 6 ? ',' : ''}`;
    }).join('');

    const weekendPattern = `repeating-linear-gradient(90deg, ${weekendBackground})`;

    return [majorGrid, minorGrid, weekendPattern].join(', ');
  };

  const backgroundStyle = {
    backgroundColor: '#fff',
    backgroundImage: generateBackground(),
    backgroundSize: [
      `${cellWidth * 7}px 100%`,
      `${cellWidth}px 100%`,
      `${cellWidth * 7}px 100%`,
    ].join(', '),
    backgroundRepeat: 'repeat',
    backgroundPositionY: 0
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineHeader}>
        <div style={{ width: totalWidth + 'px', display: 'flex' }}>
          {timelineDates.map(date => {
            const showMonth = !prevDate || prevDate.getMonth() !== date.getMonth();
            const formattedDate = formatDate(date, showMonth);
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
