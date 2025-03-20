'use client';

import { useState } from 'react';
import styles from './TableView.module.css';

type SortDirection = 'asc' | 'desc' | null;
type ColumnKey = 'id' | 'title' | 'status' | 'assignee' | 'dueDate' | 'estimate';

interface Column {
  key: ColumnKey;
  label: string;
  visible: boolean;
}

export default function TableView() {
  const [sortColumn, setSortColumn] = useState<ColumnKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [columns, setColumns] = useState<Column[]>([
    { key: 'id', label: 'ID', visible: true },
    { key: 'title', label: 'タイトル', visible: true },
    { key: 'status', label: 'ステータス', visible: true },
    { key: 'assignee', label: '担当者', visible: true },
    { key: 'dueDate', label: '期限', visible: true },
    { key: 'estimate', label: '見積', visible: true },
  ]);

  // ソート処理
  const handleSort = (key: ColumnKey) => {
    if (sortColumn === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  // ソートアイコンの表示
  const getSortIcon = (key: ColumnKey) => {
    if (sortColumn !== key) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.container}>
      {/* 表示カラム設定 */}
      <div className={styles.columnSettings}>
        <select
          multiple
          value={columns.filter(col => col.visible).map(col => col.key)}
          onChange={(e) => {
            const selectedValues = Array.from(e.target.selectedOptions, option => option.value as ColumnKey);
            setColumns(columns.map(col => ({
              ...col,
              visible: selectedValues.includes(col.key)
            })));
          }}
        >
          {columns.map(col => (
            <option key={col.key} value={col.key}>
              {col.label}
            </option>
          ))}
        </select>
      </div>

      {/* テーブル */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns
                .filter(col => col.visible)
                .map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={styles.sortableHeader}
                  >
                    {col.label}
                    <span className={styles.sortIcon}>
                      {getSortIcon(col.key)}
                    </span>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {/* TODO: チケットデータの表示 */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
