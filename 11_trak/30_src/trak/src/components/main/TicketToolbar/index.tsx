'use client';

import styles from './TicketToolbar.module.css';
import SlidePanel from '../../common/SlidePanel';
import TicketForm from '../../Tickets/TicketForm';
import { Status } from '@/types';
import { useApplication } from '@/contexts/ApplicationContext'; // useTicketsをuseApplicationに変更

interface TicketMenuProps {
  statuses: Status[];
  selectedStatuses: string[];
  onStatusChange: (selectedStatuses: string[]) => void;
}

export default function TicketToolbar({
  statuses,
  selectedStatuses,
  onStatusChange,
}: TicketMenuProps) {
  // useTicketsからuseApplicationに変更
  const { tickets } = useApplication();

  // SlidePanel管理
  const {
    isOpen: slidePanelOpen,
    mode: ticketFormMode,
    ticketId: selectedTicketId,
    openNewTicket,
    handleClose: handleClosePanel,
  } = useApplication().slidePanel;

  // チケット一覧のステータスごとの集計
  const statusCounts = tickets.reduce((counts, ticket) => {
    counts[ticket.status] = (counts[ticket.status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

  const handleStatusToggle = (statusId: string) => {
    const newSelectedStatuses = selectedStatuses.includes(statusId)
      ? selectedStatuses.filter(id => id !== statusId)
      : [...selectedStatuses, statusId];
    onStatusChange(newSelectedStatuses);
  };

  const handleToggleAll = () => {
    const isAllSelected = statuses.length === selectedStatuses.length;
    if (isAllSelected) {
      onStatusChange([]);
    } else {
      const allStatusIds = statuses.map(status => status.id);
      onStatusChange(allStatusIds);
    }
  };

  const isAllSelected = statuses.length === selectedStatuses.length;

  return (
    <>
      <div className={styles.container}>
        <button className={styles.createButton} onClick={openNewTicket}>
          新規チケット
        </button>
        <div className={styles.statusFilter}>
          <span className={styles.totalCount}>Total {tickets.length}</span>
          <div className={styles.filterHeader}>
            <label className={styles.statusCheckbox}>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleAll}
                aria-label="全て選択/選択解除"
              />
              <span className={styles.statusLabel} role="presentation">
                {isAllSelected ? "選択解除" : "全て選択"}
              </span>
            </label>
          </div>
          {statuses.map(status => (
            <label key={status.id} className={styles.statusCheckbox}>
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status.id)}
                onChange={() => handleStatusToggle(status.id)}
              />
              <span className={styles.statusLabel} style={{ backgroundColor: status.color }}>
                {status.name}
                {statusCounts[status.id] > 0 && (
                  <span className={styles.statusCount}>({statusCounts[status.id]})</span>
                )}
              </span>
            </label>
          ))}
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
