'use client';

import { useState } from 'react';
import styles from './GanttView.module.css';

type TimeScale = 'day' | 'week' | 'month';

interface GanttViewProps {
  selectedStatuses: string[];
}

export default function GanttView({ selectedStatuses }: GanttViewProps) {
  const [scale, setScale] = useState<TimeScale>('week');
  const [startDate, setStartDate] = useState(new Date());

  // スケールに応じた日数を取得
  const getScaleDays = () => {
    switch (scale) {
      case 'day':
        return 14; // 2週間分
      case 'week':
        return 42; // 6週間分
      case 'month':
        return 90; // 3ヶ月分
    }
  };

  // タイムラインの日付を生成
  const generateTimelineDates = () => {
    const dates: Date[] = [];
    const days = getScaleDays();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  // 日付のフォーマット
  const formatDate = (date: Date) => {
    switch (scale) {
      case 'day':
        return date.toLocaleDateString('ja', { month: 'numeric', day: 'numeric' });
      case 'week':
        return date.toLocaleDateString('ja', { month: 'numeric', day: 'numeric' });
      case 'month':
        return date.toLocaleDateString('ja', { month: 'numeric' });
    }
  };

  return (
    <div className={styles.container}>
      {/* スケール切替 */}
      <div className={styles.controls}>
        <div className={styles.scaleButtons}>
          <button
            className={`${styles.scaleButton} ${scale === 'day' ? styles.active : ''}`}
            onClick={() => setScale('day')}
          >
            日
          </button>
          <button
            className={`${styles.scaleButton} ${scale === 'week' ? styles.active : ''}`}
            onClick={() => setScale('week')}
          >
            週
          </button>
          <button
            className={`${styles.scaleButton} ${scale === 'month' ? styles.active : ''}`}
            onClick={() => setScale('month')}
          >
            月
          </button>
        </div>

        <div className={styles.dateNavigation}>
          <button
            onClick={() => {
              const newDate = new Date(startDate);
              newDate.setDate(newDate.getDate() - getScaleDays());
              setStartDate(newDate);
            }}
          >
            ◀
          </button>
          <span>{startDate.toLocaleDateString('ja')}</span>
          <button
            onClick={() => {
              const newDate = new Date(startDate);
              newDate.setDate(newDate.getDate() + getScaleDays());
              setStartDate(newDate);
            }}
          >
            ▶
          </button>
        </div>
      </div>

      {/* ガントチャート */}
      <div className={styles.ganttContainer}>
        <div className={styles.timeline}>
          {/* タイムラインヘッダー */}
          <div className={styles.timelineHeader}>
            {generateTimelineDates().map((date, index) => (
              <div
                key={index}
                className={styles.timelineCell}
                style={{
                  minWidth: scale === 'day' ? '60px' : scale === 'week' ? '100px' : '150px'
                }}
              >
                {formatDate(date)}
              </div>
            ))}
          </div>

          {/* タイムラインコンテンツ */}
          <div className={styles.timelineContent}>
            {/* TODO: チケットバーの表示 */}
          </div>
        </div>
      </div>
    </div>
  );
}
