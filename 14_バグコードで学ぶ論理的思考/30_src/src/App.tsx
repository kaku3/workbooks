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
import { HintSection } from './components/HintSection';
import { LearningStats } from './components/LearningStats';
import { SplashScreen } from './components/SplashScreen';

function App() {
  // カスタムフック
  const { problems, loading } = useProblems();
  const { learningLog, initProblemLog, updateLog, exportLog } = useLearningLog();
  const { output, results, syntaxHint, runCode, resetResults } = useCodeRunner();

  // ローカルステート
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [code, setCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level>('beginner');

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
      hintUsed: showHint,
      cleared: false,
      startTime: Date.now(),
      lastAttemptTime: Date.now()
    };

    const updatedLog = {
      ...currentLog,
      attempts: currentLog.attempts + 1,
      hintUsed: currentLog.hintUsed || showHint,
      lastAttemptTime: Date.now()
    };

    // コード実行
    runCode(code, problem, () => {
      // 全テストクリア時のコールバック
      updatedLog.cleared = true;
      if (!currentLog.cleared) {
        updatedLog.clearTime = Date.now();
        setShowExplanation(true); // 初クリア時は解説を自動表示
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
    setShowHint(false);
    setShowExplanation(false);
    initProblemLog(problems[index].id);
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

  if (loading) return <SplashScreen message="問題を読み込んでいます..." />;
  if (!currentProblem) return <SplashScreen message="問題が見つかりませんでした" />;

  return (
    <div className="app-container">
      <Header onExportLog={exportLog} />

      <div className="main-content">
        {/* 左ペイン: 問題記述とエディタ */}
        <div className="left-pane">
          <ProblemSelector
            problems={problems}
            currentProblemIndex={currentProblemIndex}
            selectedLevel={selectedLevel}
            learningLog={learningLog}
            onSelectLevel={handleSelectLevel}
            onSelectProblem={handleSelectProblem}
          />

          <h2 className="problem-header">
            {currentProblem.title}
          </h2>

          <ProblemDescription problem={currentProblem} />

          <CodeEditor value={code} onChange={setCode} />

          <div className="run-button-container">
            <button onClick={handleRun} data-run-button className="run-button">
              実行 & テスト
            </button>
          </div>

          <LearningStats log={learningLog[currentProblem.id]} />
        </div>

        {/* 右ペイン: 実行結果 */}
        <div className="right-pane">
          <h3 className="test-results-title">テスト結果</h3>
          <TestResults results={results} />

          <ExecutionLog output={output} />

          <HintSection
            problem={currentProblem}
            showHint={showHint}
            showExplanation={showExplanation}
            syntaxHint={syntaxHint}
            allTestsPassed={allTestsPassed}
            hasMoreProblems={currentProblemIndex < problems.length - 1}
            onToggleHint={() => setShowHint(!showHint)}
            onToggleExplanation={() => setShowExplanation(!showExplanation)}
            onNextProblem={goToNextProblem}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
