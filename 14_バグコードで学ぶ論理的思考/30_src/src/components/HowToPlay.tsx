import { useEffect, useState } from 'react';

interface HowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlay({ isOpen, onClose }: HowToPlayProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <h2>ThinkLab from Buggy Code</h2>
            <span className="modal-header-subtitle">バグコードで学ぶ論理的思考</span>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-image">
          <img src="/og-image.png" alt="ThinkLab from Buggy Code" />
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <p className="intro-text">
              <strong>ThinkLab</strong> はバグのあるコードをデバッグすることで論理的思考を鍛えるアプリです。
            </p>
          </section>

          <section className="modal-section">
            <h3>💡 なぜバグコード解析で論理的思考が身につくのか</h3>
            <p>
              バグコードの解析は、論理的思考を鍛える最適なトレーニングです。
              以下のステップを通じて、問題解決能力が自然と向上します：
            </p>
            <div className="thinking-steps">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>問題を読む</strong>
                  <p>問題の要件を正確に理解し、期待される動作を把握します。</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>起きている現象を見る</strong>
                  <p>テスト結果から実際の動作を観察し、期待と現実のギャップを確認します。</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>問題を突き止める</strong>
                  <p>コードを読み解き、論理的に原因を特定して修正します。</p>
                </div>
              </div>
            </div>
            <p className="highlight-text">
              この繰り返しが、デバッグスキルと論理的思考力を同時に磨きます。
            </p>
          </section>

          <section className="modal-section">
            <h3>🎮 プレイ方法</h3>
            <ol className="how-to-list">
              <li>
                <strong>問題を選択</strong>
                <p>左サイドバーから初級・中級・上級の問題を選びます。</p>
              </li>
              <li>
                <strong>問題を理解</strong>
                <p>「問題」タブで要件を読み、「テストケース」タブで期待される動作を確認します。</p>
              </li>
              <li>
                <strong>コードを修正</strong>
                <p>「コード」タブでバグを見つけて修正し、「実行 & テスト」ボタンで確認します。</p>
              </li>
              <li>
                <strong>ヒント活用</strong>
                <p>行き詰まったら「ヒント」タブを見てみましょう。</p>
              </li>
              <li>
                <strong>解説で理解</strong>
                <p>全テストクリア後、「解説」タブで正解の考え方を学びます。</p>
              </li>
            </ol>
          </section>

          <section className="modal-section">
            <h3>📊 進捗管理</h3>
            <p>
              各問題の✓マークがクリア状況を示します。
              難易度ごとの達成率も確認できるので、自分のペースで学習を進めましょう。
            </p>
          </section>
        </div>

        <div className="modal-footer">
          <button className="modal-button-primary" onClick={onClose}>
            はじめる
          </button>
        </div>
      </div>
    </div>
  );
}

export function useHowToPlay() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 初回アクセスチェック
    const hasVisited = localStorage.getItem('thinklab-visited');
    if (!hasVisited) {
      setIsOpen(true);
      localStorage.setItem('thinklab-visited', 'true');
    }
  }, []);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return { isOpen, open, close };
}
