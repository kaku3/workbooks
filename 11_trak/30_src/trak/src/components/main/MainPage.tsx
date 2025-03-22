'use client';

import { useState } from 'react';
import styles from './MainPage.module.css';
import TableView from './TableView';
import GanttView from './GanttView';

type ViewMode = 'gantt' | 'table';

interface MainPageProps {
  initialTicketId?: string;
}

export default function MainPage({ initialTicketId }: MainPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  return (
    <div className={styles.container}>
      {/* ヘッダーツールバー */}
      <div className={styles.toolbar}>
        {/* ビュー切替タブ */}
        <div className={styles.viewTabs}>
          <button
            className={`${styles.viewTab} ${viewMode === 'table' ? styles.active : ''}`}
            onClick={() => setViewMode('table')}
          >
            テーブルビュー
          </button>
          <button
            className={`${styles.viewTab} ${viewMode === 'gantt' ? styles.active : ''}`}
            onClick={() => setViewMode('gantt')}
          >
            ガントチャート
          </button>
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className={styles.content}>
        {viewMode === 'table' ? (
          <TableView initialTicketId={initialTicketId} />
        ) : (
          <GanttView />
        )}
      </div>
    </div>
  );
}
