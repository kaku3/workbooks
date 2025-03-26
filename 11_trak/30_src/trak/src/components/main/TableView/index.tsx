'use client';

import tableStyles from './styles/TableView.module.css';
import dragStyles from './styles/DragDrop.module.css';
import SlidePanel from '../../common/SlidePanel';
import TicketForm from '../../Tickets/TicketForm';
import { useEffect, useState } from 'react';
import { TagsProvider } from '../TagsContext';
import SortHeader from './components/SortHeader';
import TableStateRow from './components/TableStateRow';
import StatusFilter from './components/StatusFilter';
import { TableCell } from './components/TableCell';
import { useTickets } from '@/hooks/useTickets';
import { useSlidePanel } from '@/hooks/useSlidePanel';
import { useTicketSort } from '@/hooks/useTicketSort';
import { useTableData } from './hooks/useTableData';
import { useTableState } from './hooks/useTableState';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { sortTickets, filterTicketsByStatus } from './utils/tableUtils';
import { TABLE_COLUMNS } from './constants/tableColumns';
import type { ColumnKey } from '@/types';

interface TableViewProps {
  initialTicketId?: string;
}

interface DragOverState {
  id: string | null;
  direction: 'top' | 'bottom' | null;
}

export default function TableView({ initialTicketId }: TableViewProps) {
  // State for drag target
  const [dragOverState, setDragOverState] = useState<DragOverState>({ id: null, direction: null });
  const [draggableId, setDraggableId] = useState<string | null>(null);

  const {
    tickets,
    isLoading,
    error: ticketsError,
    fetchTickets,
    updateTicket,
    deleteTicket,
  } = useTickets();

  const {
    sortOrders,
    isLoading: isLoadingSortOrders,
    fetchSortOrders,
    updateSortOrder,
    updateBatchOrders,
  } = useTicketSort();

  // ドラッグ&ドロップハンドラー
  const {
    activeId,
    handleDragStart,
    handleDragEnd,
  } = useDragAndDrop({
    tickets,
    onUpdateOrder: updateSortOrder,
    onUpdateBatchOrders: updateBatchOrders,
    sortOrders,
  });

  // Fetch tickets on mount
  useEffect(() => {
    fetchTickets();
    fetchSortOrders();
  }, [fetchTickets, fetchSortOrders]);

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
  } = useTableState();

  const handleTableClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'TABLE' || target.tagName === 'TBODY') {
      e.stopPropagation();  // イベントの伝搬を停止
      setEditingCell(null);
    }
  };

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
    sortDirection,
    sortOrders
  );

  const uiError = ticketsError || dataError;
  const isLoadingData = isLoading || isLoadingSortOrders;

  return (
    <TagsProvider>
      <div 
        className={tableStyles.container}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (!target.closest('table') && !target.closest('button')) {
            setEditingCell(null);
          }
        }}
      >
        <div className={tableStyles.toolbar}>
          <button className={tableStyles.createButton} onClick={openNewTicket}>
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
        <div className={tableStyles.tableContainer}>
          <table 
            className={tableStyles.table} 
            onMouseDown={(e) => {  // clickからonMouseDownに変更
              e.stopPropagation();
              handleTableClick(e);
            }}
          >
            <thead>
              <tr>
                {TABLE_COLUMNS.map(col => (
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
              {isLoadingData ? (
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
                    className={`${tableStyles.tableRow} ${activeId === ticket.id ? dragStyles.dragging : ''}`}
                    data-dragging={dragOverState.id === ticket.id ? dragOverState.direction : null}
                    draggable={draggableId === ticket.id}
                    onDragStart={() => handleDragStart(ticket.id!)}
                    onDragEnd={() => {
                      if (dragOverState.id && dragOverState.direction) {
                        handleDragEnd(ticket.id!, dragOverState.id, dragOverState.direction);
                      }
                      setDragOverState({ id: null, direction: null });
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (activeId && activeId !== ticket.id) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const mouseY = e.clientY;
                        const middleY = rect.top + rect.height / 2;

                        setDragOverState({
                          id: ticket.id!,
                          direction: mouseY < middleY ? 'top' : 'bottom'
                        });
                      }
                    }}
                    onDragLeave={() => {
                      if (dragOverState.id === ticket.id) {
                        setDragOverState({ id: null, direction: null });
                      }
                    }}
                  >
                    {TABLE_COLUMNS.map(col => (
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
