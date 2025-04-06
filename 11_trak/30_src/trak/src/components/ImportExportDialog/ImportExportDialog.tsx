import { useState, useCallback, useEffect } from 'react';
import styles from './ImportExportDialog.module.css';
import { useApplication } from '@/contexts/ApplicationContext';

interface ImportExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportExportDialog({ isOpen, onClose }: ImportExportDialogProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const { fetchTickets } = useApplication().ticketStore;
  const [importResult, setImportResult] = useState<{
    success: boolean;
    updatedCount: number;
    createdCount: number;
    errors?: { row?: number; message: string; field?: string }[];
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setImportResult(null);
    }
  }, [isOpen]);

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
      // インポート成功時にチケット一覧を更新
      await fetchTickets();
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '不明なエラーが発生しました');
    } finally {
      setIsImporting(false);
      // ファイル入力をリセット
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }, []);

  if (!isOpen) return null;
  
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <h2>データのインポート・エクスポート</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
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
          <div className={styles.exportSection}>
              <div className={styles.exportOptions}>
                <h3>エクスポート</h3>
                <div className={styles.formatOption}>
                  <button 
                    className={styles.exportButton}
                    onClick={async () => {
                      setIsExporting(true);
                      try {
                        const response = await fetch('/api/export', {
                          method: 'GET',
                        });
                        
                        if (!response.ok) {
                          const error = await response.json();
                          throw new Error(error.error || 'エクスポートに失敗しました');
                        }

                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'trak_export.xlsx';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      } catch (error) {
                        alert(error instanceof Error ? error.message : '不明なエラーが発生しました');
                      } finally {
                        setIsExporting(false);
                      }
                    }}
                    disabled={isExporting}
                  >
                    {isExporting ? 'エクスポート中...' : 'Excel形式でダウンロード'}
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
