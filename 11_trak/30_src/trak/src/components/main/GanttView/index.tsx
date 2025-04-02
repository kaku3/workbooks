'use client';

import { useMemo, useState, useEffect } from 'react';
import { useApplication } from '@/contexts/ApplicationContext';
import { useTableData } from '../TableView/hooks/useTableData';
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
  const [editingCell, setEditingCell] = useState<{type: string; id: string} | null>(null);

  const {
    ticketStore: { tickets, isLoadingTickets, ticketsError, updateTicket },
    projectStore: { project, isLoadingProject, projectError, fetchProject }
  } = useApplication();

  const { statuses } = useTableData();

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

  // 外側クリック時に編集モードを解除
  const handleContainerClick = (e: React.MouseEvent) => {
    if (editingCell) {
      const target = e.target as HTMLElement;
      // ステータスセレクトまたはその子要素以外をクリックした場合
      if (!target.closest('select')) {
        setEditingCell(null);
      }
    }
  };

  return (
    <div className={styles.container} onClick={handleContainerClick}>
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
          statuses={statuses}
          editingCell={editingCell}
          setEditingCell={setEditingCell}
          onStatusUpdate={(ticketId, value) => {
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket) {
              updateTicket({ ...ticket, status: value });
            }
          }}
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
