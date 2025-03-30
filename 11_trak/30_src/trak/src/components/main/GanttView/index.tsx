'use client';

import { useMemo, useState, useRef } from 'react';
import { useApplication } from '@/contexts/ApplicationContext';
import styles from './GanttView.module.css';
import { TicketData } from '@/types';
import { filterTicketsByStatus, filterTicketsByAssignee } from '../TableView/utils/tableUtils';
import TaskList from './components/TaskList';
import Timeline from './components/Timeline';

type Scale = 'day' | 'week' | 'month';

interface GanttViewProps {
  selectedStatuses: string[];
  selectedAssignees: string[];
}

export default function GanttView({
  selectedStatuses,
  selectedAssignees,
}: GanttViewProps) {
  // スケール切替のState
  const [scale, setScale] = useState<Scale>('day');

  // スクロール同期用のRef
  const taskListRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const {
    tickets,
    isLoadingTickets,
    ticketsError,
  } = useApplication().ticketStore;

  // フィルター適用済みのチケット一覧
  const displayTickets: TicketData[] = useMemo(() => {
    const statusFilteredTickets = filterTicketsByStatus(tickets, selectedStatuses);
    return filterTicketsByAssignee(statusFilteredTickets, selectedAssignees);
  }, [tickets, selectedStatuses, selectedAssignees]);

  // タイムラインの日付範囲の計算
  const timelineRange = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 7); // 1週間前から
    const end = new Date(now);
    end.setDate(now.getDate() + 30); // 30日後まで

    return { start, end };
  }, []);

  // スクロールハンドラー
  const handleTaskListScroll = (scrollTop: number) => {
    if (timelineRef.current) {
      const timelineContent = timelineRef.current;
      if (timelineContent.scrollTop !== scrollTop) {
        timelineContent.scrollTop = scrollTop;
      }
    }
  };

  const handleTimelineScroll = (scrollTop: number) => {
    if (taskListRef.current) {
      const taskListContent = taskListRef.current;
      if (taskListContent.scrollTop !== scrollTop) {
        taskListContent.scrollTop = scrollTop;
      }
    }
  };

  if (isLoadingTickets) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (ticketsError) {
    return <div className={styles.container}>Error: {ticketsError}</div>;
  }

  return (
    <div className={styles.container}>
      {/* スケール切替ボタン */}
      <div className={styles.scaleSelector}>
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

      <div className={styles.ganttChart}>
        {/* タスク一覧部分（左側） */}
        <TaskList
          ref={taskListRef}
          tickets={displayTickets}
          onScroll={handleTaskListScroll}
        />

        {/* タイムライン部分（右側） */}
        <Timeline
          ref={timelineRef}
          tickets={displayTickets}
          scale={scale}
          timelineRange={timelineRange}
          onScroll={handleTimelineScroll}
        />
      </div>
    </div>
  );
}
