'use client';

import styles from './TicketToolbar.module.css';
import SlidePanel from '../../common/SlidePanel';
import TicketForm from '../../TicketForm';
import { Status, User } from '@/types';
import { useApplication } from '@/contexts/ApplicationContext';
import StatusFilter from './components/StatusFilter';
import AssigneeFilter from './components/AssigneeFilter';
import { useMemo } from 'react';

interface TicketToolbarProps {
  statuses: Status[];
  users: User[];
  selectedStatuses: string[];
  selectedAssignees: string[];
  onStatusChange: (selectedStatuses: string[]) => void;
  onAssigneeChange: (selectedAssignees: string[]) => void;
}

export default function TicketToolbar({
  statuses,
  users,
  selectedStatuses,
  selectedAssignees,
  onStatusChange,
  onAssigneeChange,
}: TicketToolbarProps) {
  const { tickets } = useApplication().ticketStore;

  // Calculate status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach(ticket => {
      counts[ticket.status] = (counts[ticket.status] || 0) + 1;
    });
    return counts;
  }, [tickets]);

  // Calculate assignee counts
  const assigneeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach(ticket => {
      if (!ticket.assignees || ticket.assignees.length === 0) {
        // Count unassigned tickets
        counts[''] = (counts[''] || 0) + 1;
      } else {
        ticket.assignees.forEach(assignee => {
          counts[assignee] = (counts[assignee] || 0) + 1;
        });
      }
    });
    return counts;
  }, [tickets]);

  // SlidePanel管理
  const {
    isOpen: slidePanelOpen,
    mode: ticketFormMode,
    ticketId: selectedTicketId,
    openNewTicket,
    handleClose: handleClosePanel,
  } = useApplication().slidePanelStore;

  return (
    <>
      <div className={styles.container}>
        <button className={styles.createButton} onClick={openNewTicket}>
          新規チケット
        </button>
        <div className={styles.filters}>
          <StatusFilter
            statuses={statuses}
            selectedStatuses={selectedStatuses}
            onStatusChange={onStatusChange}
            statusCounts={statusCounts}
            totalCount={tickets.length}
          />
          <AssigneeFilter
            users={users}
            selectedAssignees={selectedAssignees}
            onAssigneeChange={onAssigneeChange}
            assigneeCounts={assigneeCounts}
          />
        </div>
      </div>
      <SlidePanel 
        isOpen={slidePanelOpen} 
        onClose={handleClosePanel}
        title={ticketFormMode === 'new' ? 'チケット作成' : 'チケット編集'}
      >
        <TicketForm
          mode={ticketFormMode}
          ticketId={selectedTicketId}
          onClose={handleClosePanel}
        />
      </SlidePanel>
    </>
  );
}
