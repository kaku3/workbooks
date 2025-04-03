'use client';

import { useMemo, useState, useEffect } from 'react';
import { useApplication } from '@/contexts/ApplicationContext';
import { useTableData } from '../TableView/hooks/useTableData';
import styles from './GanttView.module.css';
import { TicketData } from '@/types';
import { filterTicketsByStatus, filterTicketsByAssignee } from '../TableView/utils/tableUtils';
import TaskList from './components/TaskList';
import Timeline from './components/Timeline';

interface GanttViewProps {
  selectedStatuses: string[];
  selectedAssignees: string[];
}

export default function GanttView({
  selectedStatuses,
  selectedAssignees,
}: GanttViewProps) {
  // ズームレベルのState
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [editingCell, setEditingCell] = useState<{type: string; id: string} | null>(null);

  const {
    ticketStore: { tickets, isLoadingTickets, ticketsError, updateTicket },
    projectStore: { project, isLoadingProject, projectError, fetchProject }
  } = useApplication();

  const { users, statuses } = useTableData();

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
      // 編集中のセルまたはその子要素以外をクリックした場合
      if (!target.closest('select') && !target.closest('.' + styles.editingCell)) {
        setEditingCell(null);
      }
    }
  };

  return (
    <>
      <div className={styles.container} onClick={handleContainerClick}>
      {/* ズーム調整スライダー */}
      <div className={styles.zoomControl}>
        <input
          type="range"
          min="40"
          max="125"
          value={zoomLevel}
          onChange={(e) => setZoomLevel(Number(e.target.value))}
          className={styles.zoomSlider}
        />
        <span className={styles.zoomLevel}>{zoomLevel}%</span>
      </div>

      <div className={styles.ganttChart}>
        {/* タスク一覧部分（左側） */}
        <TaskList
          tickets={displayTickets}
          statuses={statuses}
          users={users}
          editingCell={editingCell}
          setEditingCell={setEditingCell}
          onStatusUpdate={(ticketId, value) => {
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket) {
              updateTicket({ ...ticket, status: value });
            }
          }}
          onEstimateUpdate={(ticketId, value) => {
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket) {
              updateTicket({ ...ticket, estimate: value });
            }
          }}
          onProgressUpdate={(ticketId, value) => {
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket) {
              updateTicket({ ...ticket, progress: value });
            }
          }}
        />

        {/* タイムライン部分（右側） */}
        <Timeline
          tickets={displayTickets}
          timelineRange={timelineRange}
          zoomLevel={zoomLevel}
          onUpdateTicket={(ticketId, updates) => {
            const ticket = tickets.find(t => t.id === ticketId);
            if (ticket) {
              updateTicket({
                ...ticket,
                ...updates,
              });
            }
          }}
        />
      </div>
      </div>
    </>
  );
}
