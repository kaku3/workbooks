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
  const daysPerUnit = scale === 'day' ? 1 : scale === 'week' ? 7 : 30;

  // タイムラインの幅を計算
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
            const daysBetween = (date1: Date, date2: Date) => 
              Math.round(Math.abs((date1.getTime() - date2.getTime()) / msPerDay));

            const startOffset = Math.max(0, daysBetween(startDate, timelineRange.start));
            const duration = daysBetween(endDate, startDate);

            const left = Math.round(startOffset * (cellWidth / daysPerUnit));
            const width = Math.max(Math.round(duration * (cellWidth / daysPerUnit)), cellWidth / 2);

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
