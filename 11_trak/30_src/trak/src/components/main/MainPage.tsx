'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import styles from './MainPage.module.css';
import TableView from './TableView/index';
import GanttView from './GanttView/index';
import TicketToolbar from './TicketToolbar';
import { useTableData } from './TableView/hooks/useTableData';

type ViewMode = 'gantt' | 'table';

interface MainPageProps {
  initialTicketId?: string;
}

export default function MainPage({ initialTicketId }: MainPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const { statuses } = useTableData();

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
            チケット一覧
          </button>
          <button
            className={`${styles.viewTab} ${viewMode === 'gantt' ? styles.active : ''}`}
            onClick={() => setViewMode('gantt')}
          >
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

      {/* チケットツールバー */}
      <TicketToolbar
        statuses={statuses}
        selectedStatuses={selectedStatuses}
        onStatusChange={setSelectedStatuses}
      />

      {/* メインコンテンツエリア */}
      <div className={styles.content}>
        {viewMode === 'table' ? (
          <TableView 
            initialTicketId={initialTicketId}
            selectedStatuses={selectedStatuses}
          />
        ) : (
          <GanttView
            selectedStatuses={selectedStatuses}
          />
        )}
      </div>
    </div>
  );
}
