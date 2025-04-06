'use client';

import { useState, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useApplication } from '@/contexts/ApplicationContext';
import styles from './MainPage.module.css';
import TableView from './TableView/index';
import GanttView from './GanttView/index';
import TicketToolbar from './TicketToolbar';
import SlidePanel from '../common/SlidePanel';
import TicketForm from '../TicketForm';
import { useTableData } from './TableView/hooks/useTableData';

type ViewMode = 'gantt' | 'table';

export default function MainPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const { statuses } = useTableData();
  const { 
    preferencesStore: { preferences, updateTableViewPreferences, isLoadingPreferences },
    slidePanelStore: { isOpen: slidePanelOpen, mode: ticketFormMode, ticketId: selectedTicketId, handleClose: handleClosePanel }
  } = useApplication();

  // Restore selected filters from preferences when loaded
  useEffect(() => {
    if (!isLoadingPreferences && preferences.tableView) {
      if (preferences.tableView.selectedStatuses) {
        setSelectedStatuses(preferences.tableView.selectedStatuses);
      }
      if (preferences.tableView.selectedAssignees) {
        setSelectedAssignees(preferences.tableView.selectedAssignees);
      }
    }
  }, [preferences.tableView, isLoadingPreferences]);

  // Handle filter changes and save to preferences
  const handleStatusChange = (newStatuses: string[]) => {
    setSelectedStatuses(newStatuses);
    const currentPreferences = preferences.tableView || {
      sortColumn: null,
      sortDirection: null,
      selectedStatuses: [],
      selectedAssignees: []
    };
    updateTableViewPreferences({
      ...currentPreferences,
      selectedStatuses: newStatuses,
      selectedAssignees: currentPreferences.selectedAssignees
    });
  };

  const handleAssigneeChange = (newAssignees: string[]) => {
    setSelectedAssignees(newAssignees);
    const currentPreferences = preferences.tableView || {
      sortColumn: null,
      sortDirection: null,
      selectedStatuses: [],
      selectedAssignees: []
    };
    updateTableViewPreferences({
      ...currentPreferences,
      selectedStatuses: currentPreferences.selectedStatuses,
      selectedAssignees: newAssignees
    });
  };

  return (
    <div className={styles.container}>
      {/* コンパクトヘッダー */}
      <div className={styles.header}>
        <div className={styles.leftSection}>
          {/* ビュー切替タブ */}
          <button
            className={`${styles.viewTab} ${viewMode === 'table' ? styles.active : ''}`}
            onClick={() => setViewMode('table')}
          >
            <svg className={styles.viewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
            チケット一覧
          </button>
          <button
            className={`${styles.viewTab} ${viewMode === 'gantt' ? styles.active : ''}`}
            onClick={() => setViewMode('gantt')}
          >
            <svg className={styles.viewIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M7 8h8M7 12h12M7 16h6" />
            </svg>
            ガントチャート
          </button>
        </div>

        <div className={styles.rightSection}>
          {/* ユーザー情報とログアウト */}
          <div className={styles.userInfo}>
            {useSession()?.data?.user?.email}
          </div>
          <button 
            className={styles.logoutButton}
            onClick={() => signOut()}
          >
            ログアウト
          </button>
        </div>
      </div>


      {/* メインコンテンツエリア */}
      <div className={styles.content}>
        {/* チケットツールバー */}
        <TicketToolbar
          statuses={statuses}
          users={useTableData().users}
          selectedStatuses={selectedStatuses}
          selectedAssignees={selectedAssignees}
          onStatusChange={handleStatusChange}
          onAssigneeChange={handleAssigneeChange}
        />
        {viewMode === 'table' ? (
          <TableView 
            selectedStatuses={selectedStatuses}
            selectedAssignees={selectedAssignees}
          />
        ) : (
          <GanttView
            selectedStatuses={selectedStatuses}
            selectedAssignees={selectedAssignees}
          />
        )}
      </div>

      {/* チケット編集パネル */}
      <SlidePanel 
        isOpen={slidePanelOpen} 
        onClose={handleClosePanel}
      >
        <TicketForm
          mode={ticketFormMode}
          ticketId={selectedTicketId}
          onClose={handleClosePanel}
        />
      </SlidePanel>
    </div>
  );
}
