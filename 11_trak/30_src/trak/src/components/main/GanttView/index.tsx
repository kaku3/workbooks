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
    projectStore: { project, isLoadingProject, projectError, fetchProject },
    ticketSortStore: { sortOrders, fetchSortOrders, updateBatchOrders }
  } = useApplication();

  const { users, statuses } = useTableData();

  // データの初期取得
  useEffect(() => {
    fetchProject();
    fetchSortOrders();
  }, [fetchProject, fetchSortOrders]);

  // フィルター適用済みのチケット一覧
  const displayTickets: TicketData[] = useMemo(() => {
    const statusFilteredTickets = filterTicketsByStatus(tickets, selectedStatuses);
    const assigneeFilteredTickets = filterTicketsByAssignee(statusFilteredTickets, selectedAssignees);
    return assigneeFilteredTickets.sort((a, b) => {
      const orderA = sortOrders[a.id!] ?? 0;
      const orderB = sortOrders[b.id!] ?? 0;
      return orderA - orderB;
    });
  }, [tickets, selectedStatuses, selectedAssignees, sortOrders]);

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
    return <div className={styles.container}>読込中...</div>;
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
          onDragEnd={(sourceIndex, targetIndex) => {
            const updatedOrders = displayTickets.reduce<{ ticketId: string; order: number }[]>((acc, ticket, index) => {
              if (index === sourceIndex) return acc;
              
              if (sourceIndex < targetIndex) {
                if (index > sourceIndex && index < targetIndex) {
                  acc.push({ ticketId: ticket.id!, order: index - 1 });
                } else {
                  acc.push({ ticketId: ticket.id!, order: index });
                }
              } else {
                if (index >= targetIndex && index < sourceIndex) {
                  acc.push({ ticketId: ticket.id!, order: index + 1 });
                } else {
                  acc.push({ ticketId: ticket.id!, order: index });
                }
              }
              return acc;
            }, []);
            
            const movedTicket = displayTickets[sourceIndex];
            updatedOrders.push({ ticketId: movedTicket.id!, order: sourceIndex < targetIndex ? targetIndex - 1 : targetIndex });
            
            updateBatchOrders(updatedOrders);
          }}
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
