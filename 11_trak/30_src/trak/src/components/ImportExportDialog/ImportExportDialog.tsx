import { useState } from 'react';
import styles from './ImportExportDialog.module.css';

interface ImportExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportExportDialog({ isOpen, onClose }: ImportExportDialogProps) {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
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
                <p>ファイルをドロップしてインポート</p>
                <p>または</p>
                <button className={styles.fileSelectButton}>
                  ファイルを選択
                </button>
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
