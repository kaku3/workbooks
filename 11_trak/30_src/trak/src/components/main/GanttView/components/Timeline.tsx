import { forwardRef } from 'react';
import { TicketData } from '@/types';
import styles from '../GanttView.module.css';

interface TimelineProps {
  tickets: TicketData[];
  scale: 'day' | 'week' | 'month';
  timelineRange: {
    start: Date;
    end: Date;
  };
  onScroll: (scrollTop: number) => void;
}

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(({ 
  tickets, 
  scale, 
  timelineRange,
  onScroll 
}, ref) => {
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

  // 日付のフォーマット
  const formatDate = (date: Date): string => {
    switch (scale) {
      case 'day':
        return `${date.getMonth() + 1}/${date.getDate()}`;
      case 'week':
        return `${date.getMonth() + 1}/${date.getDate()}`;
      case 'month':
        return `${date.getMonth() + 1}月`;
    }
  };

  const timelineDates = generateTimelineDates();
  const cellWidth = scale === 'day' ? 24 : scale === 'week' ? 48 : 96;

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineHeader}>
        {timelineDates.map((date, index) => (
          <div
            key={index}
            className={styles.timelineHeaderCell}
            style={{ width: `${cellWidth}px` }}
          >
            {formatDate(date)}
          </div>
        ))}
      </div>
      <div 
        ref={ref}
        className={styles.timelineContent}
        onScroll={(e) => onScroll(e.currentTarget.scrollTop)}
      >
        {tickets.map(ticket => {
          // チケットの開始日と終了日を取得
          const startDate = ticket.startDate ? new Date(ticket.startDate) : null;
          const endDate = ticket.dueDate ? new Date(ticket.dueDate) : null;

          // 日付が設定されていない場合はバーを表示しない
          if (!startDate || !endDate) {
            return (
              <div key={ticket.id} className={styles.timelineRow} />
            );
          }

          // タイムラインバーの位置とサイズを計算
          const msPerDay = 24 * 60 * 60 * 1000;
          const daysBetween = (date1: Date, date2: Date) => 
            Math.round(Math.abs((date1.getTime() - date2.getTime()) / msPerDay));

          // 開始位置の計算
          let left = 0;
          if (startDate >= timelineRange.start) {
            left = daysBetween(startDate, timelineRange.start) * cellWidth;
          }

          // 幅の計算
          const duration = daysBetween(endDate, startDate);
          const width = duration * cellWidth;

          return (
            <div key={ticket.id} className={styles.timelineRow}>
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
  );
});

Timeline.displayName = 'Timeline';

export default Timeline;
