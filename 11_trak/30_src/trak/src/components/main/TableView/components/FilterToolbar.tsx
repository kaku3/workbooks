'use client';
import styles from '../styles/TableView.module.css';

import { useMemo } from 'react';
import StatusFilter from './StatusFilter';
import AssigneeFilter from './AssigneeFilter';
import { Status, User } from '@/types';
import { TicketData } from '@/types';

interface FilterToolbarProps {
  tickets: TicketData[];
  users: User[];
  statuses: Status[];
  selectedStatuses: string[];
  selectedAssignees: string[];
  onStatusChange: (selectedStatuses: string[]) => void;
  onAssigneeChange: (selectedAssignees: string[]) => void;
}

export default function FilterToolbar({
  tickets,
  users,
  statuses,
  selectedStatuses,
  selectedAssignees,
  onStatusChange,
  onAssigneeChange,
}: FilterToolbarProps) {
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

  return (
    <div className={styles.toolbar}>
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
        totalCount={tickets.length}
      />
    </div>
  );
}
