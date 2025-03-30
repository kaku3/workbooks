'use client';

import { useMemo, useState, useEffect } from 'react';
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

  const {
    ticketStore: { tickets, isLoadingTickets, ticketsError },
    projectStore: { project, isLoadingProject, projectError, fetchProject },
  } = useApplication();

  // フィルター適用済みのチケット一覧
  const displayTickets: TicketData[] = useMemo(() => {
    const statusFilteredTickets = filterTicketsByStatus(tickets, selectedStatuses);
    return filterTicketsByAssignee(statusFilteredTickets, selectedAssignees);
  }, [tickets, selectedStatuses, selectedAssignees]);

  // プロジェクト情報の取得
  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // タイムラインの日付範囲の計算
  const timelineRange = useMemo(() => {
    if (project) {
      return {
        start: new Date(project.beginDate),
        end: new Date(project.endDate)
      };
    }
    // プロジェクト情報がない場合はデフォルト値
    const now = new Date();
    return {
      start: new Date(now.setDate(now.getDate() - 7)),
      end: new Date(now.setDate(now.getDate() + 37))
    };
  }, [project]);


  if (isLoadingTickets || isLoadingProject) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (ticketsError || projectError) {
    return <div className={styles.container}>Error: {ticketsError || projectError}</div>;
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
          tickets={displayTickets}
        />

        {/* タイムライン部分（右側） */}
        <Timeline
          tickets={displayTickets}
          scale={scale}
          timelineRange={timelineRange}
        />
      </div>
    </div>
  );
}
