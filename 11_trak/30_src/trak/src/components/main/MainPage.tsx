'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './MainPage.module.css';
import TableView from './TableView';
import GanttView from './GanttView';

type ViewMode = 'gantt' | 'table';

export default function MainPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');

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

        {/* 検索バー */}
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* フィルター */}
        <div className={styles.filters}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">すべてのステータス</option>
            <option value="todo">未着手</option>
            <option value="in-progress">進行中</option>
            <option value="done">完了</option>
          </select>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
          >
            <option value="all">すべての担当者</option>
            {/* TODO: 担当者リストを動的に生成 */}
          </select>
        </div>

        {/* 新規チケットボタン */}
        <button 
          className={styles.newTicketButton}
          onClick={() => router.push('/tickets/new')}
        >
          新規チケット
        </button>
      </div>

      {/* メインコンテンツエリア */}
      <div className={styles.content}>
        {viewMode === 'table' ? (
          <TableView />
        ) : (
          <GanttView />
        )}
      </div>
    </div>
  );
}
