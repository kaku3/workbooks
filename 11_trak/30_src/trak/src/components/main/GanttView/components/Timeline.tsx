import { TicketData } from '@/types';
import styles from '../GanttView.module.css';

interface TimelineProps {
  tickets: TicketData[];
  scale: 'day' | 'week' | 'month';
  timelineRange: {
    start: Date;
    end: Date;
  };
}

export default function Timeline({ 
  tickets, 
  scale, 
  timelineRange,
}: TimelineProps) {
  // スケールに応じた日付の配列を生成
  const generateTimelineDates = () => {
    const dates: Date[] = [];
    const current = new Date(timelineRange.start);

    while (current <= timelineRange.end) {
      dates.push(new Date(current));
      switch (scale) {
        case 'day':
          current.setDate(current.getDate() + 1);
          break;
        case 'week':
          current.setDate(current.getDate() + 7);
          break;
        case 'month':
          current.setMonth(current.getMonth() + 1);
          break;
      }
    }

    return dates;
  };

  const timelineDates = generateTimelineDates();
  let prevDate: Date | null = null;
  
  // スケールに応じたセル幅を設定
  const baseWidth = 24;
  const cellWidth = scale === 'day' ? baseWidth : scale === 'week' ? baseWidth * 2 : baseWidth * 4;
  // タイムラインの幅を計算（スケールに応じて調整）
  const totalWidth = timelineDates.length * cellWidth;

  // 日付フォーマッター
  const formatDate = (date: Date, showMonth: boolean) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    if (scale === 'month') return `${month}月`;
    return showMonth ? `${month}/${day}` : `${day}`;
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
                className={styles.timelineHeaderCell}
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

            // 開始位置の計算
            // スケールに応じた位置とサイズの計算
            const calculatePosition = () => {
              const days = (normalizedEndDate.getTime() - normalizedStartDate.getTime()) / msPerDay;
              const startDays = (normalizedStartDate.getTime() - normalizedTimelineStart.getTime()) / msPerDay;

              switch (scale) {
                case 'day': {
                  const offset = Math.max(0, startDays);
                  return {
                    left: offset * cellWidth,
                    width: Math.max(cellWidth, (days + 1) * cellWidth)
                  };
                }
                case 'week': {
                  const startWeek = Math.floor(startDays / 7);
                  const durationWeeks = Math.ceil((days + 1) / 7);
                  return {
                    left: startWeek * cellWidth,
                    width: Math.max(cellWidth, durationWeeks * cellWidth)
                  };
                }
                case 'month': {
                  const startMonth = normalizedStartDate.getMonth() + normalizedStartDate.getFullYear() * 12;
                  const endMonth = normalizedEndDate.getMonth() + normalizedEndDate.getFullYear() * 12;
                  const timelineStartMonth = normalizedTimelineStart.getMonth() + normalizedTimelineStart.getFullYear() * 12;
                  const monthOffset = startMonth - timelineStartMonth;
                  const monthDuration = endMonth - startMonth + 1;
                  return {
                    left: monthOffset * cellWidth,
                    width: Math.max(cellWidth, monthDuration * cellWidth)
                  };
                }
              }
            };

            const { left, width } = calculatePosition();

            return (
              <div 
                key={ticket.id} 
                className={styles.timelineRow}
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
