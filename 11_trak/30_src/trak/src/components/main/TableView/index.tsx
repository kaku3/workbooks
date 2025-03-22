'use client';

import styles from './TableView.module.css';
import SlidePanel from '../../common/SlidePanel';
import TicketForm from '../../Tickets/TicketForm';
import { useEffect } from 'react';
import { TagsProvider } from '../TagsContext';
import SortHeader from './components/SortHeader';
import TableStateRow from './components/TableStateRow';
import StatusFilter from './components/StatusFilter';
import { TableCell } from './components/TableCell';
import { useTickets } from '@/hooks/useTickets';
import { useTableData } from './hooks/useTableData';
import { useTableState } from './hooks/useTableState';
import { useSlidePanel } from '@/hooks/useSlidePanel';
import { sortTickets, filterTicketsByStatus } from './utils/tableUtils';
import { TABLE_COLUMNS } from './constants/tableColumns';
import type { ColumnKey } from '@/types';

interface TableViewProps {
  initialTicketId?: string;
}

export default function TableView({ initialTicketId }: TableViewProps) {
  const {
    tickets,
    isLoading,
    error: ticketsError,
    fetchTickets,
    updateTicket,
  } = useTickets();

  // Fetch tickets on mount
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const {
    users,
    statuses,
    error: dataError,
  } = useTableData();

  const {
    sortColumn,
    sortDirection,
    selectedStatuses,
    editingCell,
    handleSort,
    setSelectedStatuses,
    setEditingCell,
    handleContainerClick,
  } = useTableState();

  const {
    isOpen: slidePanelOpen,
    mode: ticketFormMode,
    ticketId: selectedTicketId,
    openNewTicket,
    openEditTicket,
    handleClose: handleClosePanel,
  } = useSlidePanel(initialTicketId);

  // Process tickets through sorting and filtering
  const processedTickets = sortTickets(
    filterTicketsByStatus(tickets, selectedStatuses),
    sortColumn,
    sortDirection
  );

  const uiError = ticketsError || dataError;

  return (
    <TagsProvider>
      <div className={styles.container} onClick={handleContainerClick}>
        <div className={styles.toolbar}>
          <button className={styles.createButton} onClick={openNewTicket}>
            新規チケット
          </button>
          <StatusFilter
            statuses={statuses}
            selectedStatuses={selectedStatuses}
            onStatusChange={setSelectedStatuses}
          />
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {TABLE_COLUMNS
                  .filter(col => col.visible)
                  .map(col => (
                    <SortHeader
                      key={col.key}
                      columnKey={col.key}
                      label={col.label}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                  ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableStateRow
                  colSpan={TABLE_COLUMNS.filter(col => col.visible).length}
                  type="loading"
                />
              ) : uiError ? (
                <TableStateRow
                  colSpan={TABLE_COLUMNS.filter(col => col.visible).length}
                  type="error"
                  message={uiError}
                />
              ) : processedTickets.length === 0 ? (
                <TableStateRow
                  colSpan={TABLE_COLUMNS.filter(col => col.visible).length}
                  type="empty"
                />
              ) : (
                processedTickets.map(ticket => (
                  <tr 
                    key={ticket.id}
                    className={styles.tableRow}
                  >
                    {TABLE_COLUMNS
                      .filter(col => col.visible)
                      .map(col => (
                        <TableCell
                          key={`${ticket.id}-${col.key}`}
                          columnKey={col.key as ColumnKey}
                          ticket={ticket}
                          users={users}
                          statuses={statuses}
                          isEditing={
                            editingCell?.id === ticket.id &&
                            editingCell?.key === col.key
                          }
                          onUpdate={updateTicket}
                          onEdit={key => setEditingCell({ id: ticket.id!, key })}
                          onEditTicket={openEditTicket}
                        />
                      ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
          onClose={() => {
            handleClosePanel();
            fetchTickets(); // Refresh tickets after form close
          }}
        />
      </SlidePanel>
    </TagsProvider>
  );
}
