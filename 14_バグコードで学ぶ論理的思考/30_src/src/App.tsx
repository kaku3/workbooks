import { useState, useEffect } from 'react';

// Types
import type { Level } from './types';

// Hooks
import { useProblems } from './hooks/useProblems';
import { useLearningLog } from './hooks/useLearningLog';
import { useCodeRunner } from './hooks/useCodeRunner';

// Components
import { Header } from './components/Header';
import { ProblemSelector } from './components/ProblemSelector';
import { ProblemDescription } from './components/ProblemDescription';
import { CodeEditor } from './components/CodeEditor';
import { TestResults } from './components/TestResults';
import { ExecutionLog } from './components/ExecutionLog';
import { LearningStats } from './components/LearningStats';
import { SplashScreen } from './components/SplashScreen';
import { HowToPlay, useHowToPlay } from './components/HowToPlay';
import { Confetti } from './components/Confetti';
import { TypewriterText } from './components/TypewriterText';

function App() {
  // カスタムフック
  const { problems, loading } = useProblems();
  const { learningLog, initProblemLog, updateLog, exportLog } = useLearningLog();
  const { output, results, syntaxHint, runCode, resetResults } = useCodeRunner();
  const { isOpen: isHowToPlayOpen, open: openHowToPlay, close: closeHowToPlay } = useHowToPlay();

  // ローカルステート
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [isLoadingExiting, setIsLoadingExiting] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [code, setCode] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<Level>('beginner');
  const [activeCodeTab, setActiveCodeTab] = useState<'code' | 'hint' | 'explanation'>('code');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showConfetti, setShowConfetti] = useState(false);

  // 画面幅の監視
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ローディング終了時のフェードアウトアニメーション
  useEffect(() => {
    if (!loading && showSplash && problems.length > 0) {
      setIsLoadingExiting(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 800); // アニメーション時間と同期
      return () => clearTimeout(timer);
    }
  }, [loading, showSplash, problems.length]);

  // 初期表示で最初の問題を自動実行
  useEffect(() => {
    if (problems.length > 0 && !code) {
      setCode(problems[0].initialCode);
      setTimeout(() => {
        document.querySelector<HTMLButtonElement>('[data-run-button]')?.click();
      }, 100);
    }
  }, [problems, code]);

  // コード実行ハンドラー
  const handleRun = () => {
    const problem = problems[currentProblemIndex];
    if (!problem) return;

    // 学習ログを更新（試行回数カウント）
    const currentLog = learningLog[problem.id] || {
      problemId: problem.id,
      attempts: 0,
      hintUsed: false,
      cleared: false,
      startTime: Date.now(),
      lastAttemptTime: Date.now()
    };

    const updatedLog = {
      ...currentLog,
      attempts: currentLog.attempts + 1,
      lastAttemptTime: Date.now()
    };

    // コード実行
    runCode(code, problem, () => {
      // 全テストクリア時のコールバック
      updatedLog.cleared = true;
      if (!currentLog.cleared) {
        updatedLog.clearTime = Date.now();
        setActiveCodeTab('explanation'); // 初クリア時は解説タブを自動表示
      }
    });

    // 学習ログを更新
    updateLog(problem.id, updatedLog);
  };

  // 問題選択ハンドラー
  const handleSelectProblem = (index: number) => {
    setCurrentProblemIndex(index);
    setCode(problems[index].initialCode);
    resetResults();
    setActiveCodeTab('code');
    initProblemLog(problems[index].id);
    
    // 問題のレベルに合わせてアコーディオンを更新
    const problemLevel = problems[index].level;
    if (problemLevel !== selectedLevel) {
      setSelectedLevel(problemLevel);
    }
    
    setTimeout(() => {
      document.querySelector<HTMLButtonElement>('[data-run-button]')?.click();
    }, 50);
  };

  // 難易度選択ハンドラー
  const handleSelectLevel = (level: Level) => {
    setSelectedLevel(level);

    const levelProblems = problems.filter(p => p.level === level);
    const firstUnclearedProblem = levelProblems.find(p => !learningLog[p.id]?.cleared);
    const targetProblem = firstUnclearedProblem || levelProblems[0];

    if (targetProblem) {
      const globalIdx = problems.indexOf(targetProblem);
      handleSelectProblem(globalIdx);
    }
  };

  // 次の問題へ
  const goToNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      handleSelectProblem(currentProblemIndex + 1);
    }
  };

  const currentProblem = problems[currentProblemIndex];
  const allTestsPassed = results.length > 0 && results.every(r => r.passed);

  // 正解時の紙吹雪エフェクト
  useEffect(() => {
    if (allTestsPassed && results.length > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [allTestsPassed, results.length]);

  // 画面幅チェック（これだけは早期return）
  if (screenWidth < 1280) return <SplashScreen message="" />;

  // 問題が読み込まれていない場合はスプラッシュのみ表示
  if (!currentProblem) {
    return <SplashScreen message="Loading..." />;
  }

  return (
    <>
      <div className="app-container">
        <Header onExportLog={exportLog} />

        <div className="main-content">
          {/* 左サイドバー: 問題選択ツリービュー */}
          <div className="sidebar-pane">
            <ProblemSelector
              problems={problems}
              currentProblemIndex={currentProblemIndex}
              selectedLevel={selectedLevel}
              learningLog={learningLog}
            onSelectLevel={handleSelectLevel}
            onSelectProblem={handleSelectProblem}
          />

          {/* プレイ方法ボタン */}
          <button className="how-to-play-button" onClick={openHowToPlay}>
            ❓ プレイ方法
          </button>
        </div>

        {/* 中央ペイン: 問題記述とエディタ */}
        <div className="center-pane">
          {/* 上部ヘッダー: 問題タイトルと実行ボタン */}
          <div className="center-header">
            <h2 className="problem-header">
              {currentProblem.title}
            </h2>
            <div className="header-buttons">
              {!allTestsPassed && (
                <button onClick={handleRun} data-run-button className="run-button">
                  実行 & テスト
                </button>
              )}
              {allTestsPassed && currentProblemIndex < problems.length - 1 && (
                <button onClick={goToNextProblem} className="next-button next-button-highlighted">
                  次へ &gt;
                </button>
              )}
            </div>
          </div>

          <div className="center-divider"></div>

          <div className="center-split">
            {/* 左側: 問題説明/テストケース */}
            <div className="center-left">
              <ProblemDescription problem={currentProblem} />
            </div>

            {/* 右側: コードエディタ */}
            <div className="center-right">
              <div className="code-editor-wrapper">
                {/* タブヘッダー */}
                <div className="code-tabs">
                  <button
                    onClick={() => setActiveCodeTab('code')}
                    className={`code-tab ${activeCodeTab === 'code' ? 'active' : ''}`}
                  >
                    📝 コード
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('hint')}
                    className={`code-tab ${activeCodeTab === 'hint' ? 'active' : ''}`}
                  >
                    💡 ヒント
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('explanation')}
                    className={`code-tab ${activeCodeTab === 'explanation' ? 'active' : ''}`}
                  >
                    📖 解説
                  </button>
                </div>

                {/* タブコンテンツ */}
                <div className="code-tab-content">
                  {activeCodeTab === 'code' && (
                    <CodeEditor value={code} onChange={setCode} />
                  )}

                  {activeCodeTab === 'hint' && (
                    <div className="hint-content">
                      <strong>💡 ヒント:</strong>
                      <p>{currentProblem.hint}</p>
                      {syntaxHint && (
                        <div className="syntax-hint-detail">
                          <strong>🔍 構文エラーの詳細:</strong>
                          <pre className="syntax-hint-code">{syntaxHint}</pre>
                        </div>
                      )}
                    </div>
                  )}

                  {activeCodeTab === 'explanation' && (
                    <div className="explanation-content">
                      <strong>📖 解説:</strong>
                      <p>
                        <TypewriterText 
                          text={currentProblem.explanation}
                          key={`${currentProblem.id}-explanation`}
                        />
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <LearningStats log={learningLog[currentProblem.id]} />
        </div>

        {/* 右ペイン: 実行結果 */}
        <div className="right-pane">
          <h3 className="test-results-title">✅ テスト結果</h3>
          <TestResults results={results} />

          <ExecutionLog output={output} />
        </div>
      </div>

      {/* プレイ方法モーダル */}
      <HowToPlay isOpen={isHowToPlayOpen} onClose={closeHowToPlay} />

      {/* 紙吹雪エフェクト */}
      <Confetti active={showConfetti} />
    </div>

    {/* スプラッシュスクリーン（オーバーレイ） */}
    {(loading || showSplash) && (
      <SplashScreen 
        message="Loading..." 
        isExiting={isLoadingExiting} 
      />
    )}
  </>
  );
}

export default App;
