'use client';

import { useMemo } from 'react';
import { useApplication } from '@/contexts/ApplicationContext';
import styles from './GanttView.module.css';
import { TicketData } from '@/types';
import { filterTicketsByStatus, filterTicketsByAssignee } from '../TableView/utils/tableUtils';

interface GanttViewProps {
  selectedStatuses: string[];
  selectedAssignees: string[];
}

export default function GanttView({
  selectedStatuses,
  selectedAssignees,
}: GanttViewProps) {
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

  if (isLoadingTickets) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (ticketsError) {
    return <div className={styles.container}>Error: {ticketsError}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.ganttChart}>
        {/* タスク一覧部分（左側） */}
        <div className={styles.taskList}>
          <div className={styles.taskHeader}>
            <div className={styles.headerCell}>タイトル</div>
            <div className={styles.headerCell}>ステータス</div>
            <div className={styles.headerCell}>担当者</div>
            <div className={styles.headerCell}>見積</div>
          </div>
          <div className={styles.taskRows}>
            {displayTickets.map(ticket => (
              <div key={ticket.id} className={styles.taskRow}>
                <div className={styles.cell}>{ticket.title}</div>
                <div className={styles.cell}>{ticket.status}</div>
                <div className={styles.cell}>
                  {ticket.assignees?.join(', ')}
                </div>
                <div className={styles.cell}>{ticket.estimate}</div>
              </div>
            ))}
          </div>
        </div>

        {/* タイムライン部分（右側） */}
        <div className={styles.timeline}>
          {/* TODO: タイムライン実装 */}
        </div>
      </div>
    </div>
  );
}
