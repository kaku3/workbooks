interface HeaderProps {
  onExportLog: () => void;
}

export function Header({ onExportLog }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-title">
        <h1>ThinkLab</h1>
        <span className="header-subtitle">from Buggy Code</span>
      </div>
      <button onClick={onExportLog} className="export-button">
        📥 学習ログをエクスポート
      </button>
    </header>
  );
}
