interface HeaderProps {
  onExportLog: () => void;
}

export function Header({ onExportLog }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-title">
        <h1>ThinkLab</h1>
        <span className="header-subtitle">from Buggy Code</span>
        <span className="header-main-title">バグコードで学ぶ論理的思考</span>
      </div>
      <button onClick={onExportLog} className="export-button">
        📥 学習ログをエクスポート
      </button>
    </header>
  );
}

