'use client';

import styles from './TableView.module.css';
import SlidePanel from '../../common/SlidePanel';
import TicketForm from '../../Tickets/TicketForm';
import { useEffect, useState } from 'react';
import { TagsProvider } from '../TagsContext';
import SortHeader from './components/SortHeader';
import TableStateRow from './components/TableStateRow';
import StatusFilter from './components/StatusFilter';
import { TableCell } from './components/TableCell';
import { useTickets } from '@/hooks/useTickets';
import { useTableData } from './hooks/useTableData';
import { useTableState } from './hooks/useTableState';
import { useSlidePanel } from '@/hooks/useSlidePanel';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { sortTickets, filterTicketsByStatus } from './utils/tableUtils';
import { TABLE_COLUMNS } from './constants/tableColumns';
import type { ColumnKey } from '@/types';

interface TableViewProps {
  initialTicketId?: string;
}

export default function TableView({ initialTicketId }: TableViewProps) {
  // State for drag target
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [draggableId, setDraggableId] = useState<string | null>(null);

  const {
    tickets,
    isLoading,
    error: ticketsError,
    fetchTickets,
    updateTicket,
    deleteTicket,
  } = useTickets();

  // Drag and drop handlers
  const {
    activeId,
    handleDragStart,
    handleDragEnd,
  } = useDragAndDrop(tickets, updateTicket);

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
            statusCounts={tickets.reduce((counts, ticket) => {
              counts[ticket.status] = (counts[ticket.status] || 0) + 1;
              return counts;
            }, {} as Record<string, number>)}
            totalCount={tickets.length}
          />
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {TABLE_COLUMNS
                  .map(col => (
                    <SortHeader
                      key={col.key}
                      columnKey={col.key}
                      label={col.label}
                      sortColumn={sortColumn}
                      sortDirection={sortDirection}
                      onSort={col.sortable ? handleSort : undefined}
                    />
                  ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableStateRow
                  colSpan={TABLE_COLUMNS.length}
                  type="loading"
                />
              ) : uiError ? (
                <TableStateRow
                  colSpan={TABLE_COLUMNS.length}
                  type="error"
                  message={uiError}
                />
              ) : processedTickets.length === 0 ? (
                <TableStateRow
                  colSpan={TABLE_COLUMNS.length}
                  type="empty"
                />
              ) : (
                processedTickets.map(ticket => (
                  <tr 
                    key={ticket.id}
                    className={`${styles.tableRow} ${activeId === ticket.id ? styles.dragging : ''}`}
                    data-dragging={dragOverId === ticket.id}
                    draggable={draggableId === ticket.id}
                    onDragStart={() => handleDragStart(ticket.id!)}
                    onDragEnd={() => {
                      if (dragOverId) {
                        handleDragEnd(ticket.id!, dragOverId);
                      }
                      setDragOverId(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (activeId && activeId !== ticket.id) {
                        setDragOverId(ticket.id!);
                      }
                    }}
                    onDragLeave={() => {
                      if (dragOverId === ticket.id) {
                        setDragOverId(null);
                      }
                    }}
                  >
                    {TABLE_COLUMNS
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
                          onUpdate={async (updatedTicket) => {
                            const success = await updateTicket(updatedTicket);
                            if (success) {
                              setEditingCell(null);
                            }
                          }}
                          onEdit={key => setEditingCell({ id: ticket.id!, key })}
                          onEditTicket={openEditTicket}
                          onDelete={deleteTicket}
                          onEnableDrag={(enable) => {
                            if (ticket.id) {
                              setDraggableId(enable ? ticket.id : null);
                            }
                          }}
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
