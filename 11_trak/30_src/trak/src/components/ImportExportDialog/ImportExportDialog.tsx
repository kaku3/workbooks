import { useState, useCallback } from 'react';
import styles from './ImportExportDialog.module.css';

interface ImportExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportExportDialog({ isOpen, onClose }: ImportExportDialogProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    updatedCount: number;
    createdCount: number;
    errors?: { row?: number; message: string; field?: string }[];
  } | null>(null);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'インポートに失敗しました');
      }

      setImportResult(result);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '不明なエラーが発生しました');
    } finally {
      setIsImporting(false);
    }
  }, []);

  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'import' ? styles.active : ''}`}
              onClick={() => setActiveTab('import')}
            >
              インポート
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'export' ? styles.active : ''}`}
              onClick={() => setActiveTab('export')}
            >
              エクスポート
            </button>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'import' ? (
            <div className={styles.importSection}>
              <div className={styles.dropzone}>
                <p>Excelファイルをインポート</p>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="file-input"
                />
                <button
                  className={styles.fileSelectButton}
                  onClick={() => document.getElementById('file-input')?.click()}
                  disabled={isImporting}
                >
                  {isImporting ? 'インポート中...' : 'ファイルを選択'}
                </button>

                {importError && (
                  <div className={styles.error}>
                    {importError}
                  </div>
                )}

                {importResult && (
                  <div className={styles.result}>
                    <h4>インポート結果</h4>
                    <p>更新されたチケット: {importResult.updatedCount}</p>
                    <p>新規作成されたチケット: {importResult.createdCount}</p>
                    {importResult.errors && importResult.errors.length > 0 && (
                      <div className={styles.errors}>
                        <h5>エラー</h5>
                        <ul>
                          {importResult.errors.map((error, index) => (
                            <li key={index}>
                              {error.row ? `行 ${error.row}: ` : ''}{error.message}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.exportSection}>
              <div className={styles.exportOptions}>
                <h3>エクスポート形式</h3>
                <div className={styles.formatOption}>
                  <button className={styles.exportButton}>
                    Excel形式でエクスポート
                  </button>
                </div>
                <div className={styles.formatOption}>
                  <button className={styles.exportButton}>
                    JSON形式でエクスポート
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
