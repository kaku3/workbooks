import { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import './App.css';

// 問題データの型定義
interface TestResult {
  passed: boolean;
  input: any[];
  expected: any;
  actual: any;
  error?: string;
}

interface TestCase {
  input: any[];
  expectedOutput: any;
  expectedConsoleOutput?: string; // console.log の期待値
  description?: string; // テストケースの説明
}

interface Problem {
  id: string;
  title: string;
  description: string;
  initialCode: string;
  testCases: TestCase[];
  hint: string;
  explanation: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

// 学習ログの型定義
interface ProblemLog {
  problemId: string;
  attempts: number;
  hintUsed: boolean;
  cleared: boolean;
  startTime: number;
  clearTime?: number;
  lastAttemptTime: number;
}

interface LearningLog {
  [problemId: string]: ProblemLog;
}

const SAMPLE_PROBLEMS = [
  // 初級
  'problems/syntax_error.json',
  'problems/comment_syntax.json',
  'problems/variable_typo.json',
  'problems/greeting_message.json',
  'problems/infinite_loop.json',
  'problems/off_by_one.json',
  'problems/comparison_operator.json',
  'problems/type_conversion.json',
  'problems/null_check.json',
  // 中級
  'problems/multiple_functions.json',
  'problems/callback_bug.json',
  'problems/array_method_bug.json',
  'problems/closure_bug.json',
  'problems/object_mutation.json',
  'problems/scope_bug.json',
  'problems/this_binding.json',
  // 上級
  'problems/chained_errors.json',
  'problems/event_handling.json',
  'problems/recursion_bug.json',
  'problems/wrong_diagnosis.json',
  'problems/overcomplicated_logic.json',
  'problems/misleading_names.json',
  'problems/copy_paste_bug.json',
  'problems/unnecessary_conversion.json',
  'problems/flag_hell.json'
];

const STORAGE_KEY = 'bug_platform_learning_log';

function App() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string>('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [learningLog, setLearningLog] = useState<LearningLog>({});
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [syntaxHint, setSyntaxHint] = useState<string>(''); // 構文エラーの詳細ヒント

  useEffect(() => {
    // 問題データの読み込み
    const fetchProblems = async () => {
      const loadedProblems = [];
      for (const path of SAMPLE_PROBLEMS) {
        try {
          const res = await fetch(path);
          if (res.ok) {
            const data = await res.json();
            loadedProblems.push(data);
          }
        } catch (e) {
          console.error('Failed to load problem:', path, e);
        }
      }
      setProblems(loadedProblems);
      if (loadedProblems.length > 0) {
        setCode(loadedProblems[0].initialCode);
        // 初期表示で自動実行
        setTimeout(() => {
          // handleRunを呼ぶためにダミーのボタンクリックをシミュレート
          document.querySelector<HTMLButtonElement>('[data-run-button]')?.click();
        }, 100);
      }
    };
    fetchProblems();

    // 学習ログの読み込み
    const savedLog = localStorage.getItem(STORAGE_KEY);
    if (savedLog) {
      try {
        setLearningLog(JSON.parse(savedLog));
      } catch (e) {
        console.error('Failed to parse learning log', e);
      }
    }
  }, []);

  // 学習ログを localStorage に保存
  useEffect(() => {
    if (Object.keys(learningLog).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(learningLog));
    }
  }, [learningLog]);

  // 問題の開始時刻を記録
  const initProblemLog = (problemId: string) => {
    if (!learningLog[problemId]) {
      setLearningLog(prev => ({
        ...prev,
        [problemId]: {
          problemId,
          attempts: 0,
          hintUsed: false,
          cleared: false,
          startTime: Date.now(),
          lastAttemptTime: Date.now()
        }
      }));
    }
  };

  const handleRun = () => {
    if (!problems[currentProblemIndex]) return;

    const problem = problems[currentProblemIndex];
    let testResults: TestResult[] = [];
    let logOutput = '';

    // console.logの出力を最初からキャプチャ開始
    const originalLog = console.log;
    console.log = (...args) => {
      logOutput += args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ') + '\n';
      originalLog(...args);  // ブラウザコンソールにも出力
    };

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

    try {
      // 構文ヒントをリセット
      setSyntaxHint('');
      
      // 簡易的な構文チェック（よくあるエラーを事前検出してヒントとして保存）
      const lines = code.split('\n');
      const syntaxIssues: string[] = [];
      
      lines.forEach((line, idx) => {
        const lineNum = idx + 1;
        const trimmed = line.trim();
        
        // if文での代入演算子チェック
        if (/if\s*\([^)]*[^=!<>]\s=\s[^=]/.test(line)) {
          syntaxIssues.push(`${lineNum}行目: if文で代入演算子(=)が使われています。比較には === を使ってください`);
        }
        
        // while文での代入演算子チェック
        if (/while\s*\([^)]*[^=!<>]\s=\s[^=]/.test(line)) {
          syntaxIssues.push(`${lineNum}行目: while文で代入演算子(=)が使われています。比較には === を使ってください`);
        }
        
        // for文の条件部での代入演算子チェック
        const forMatch = line.match(/for\s*\([^;]*;([^;]*);/);
        if (forMatch && /[^=!<>]\s=\s[^=]/.test(forMatch[1])) {
          syntaxIssues.push(`${lineNum}行目: for文の条件部で代入演算子(=)が使われています。比較には === を使ってください`);
        }
        
        // コメント記号の誤り
        if (/^\s*#/.test(trimmed) && !trimmed.startsWith('#!')) {
          syntaxIssues.push(`${lineNum}行目: # はJavaScriptのコメント記号ではありません。// を使ってください`);
        }
      });
      
      // 構文エラーの詳細をヒント用に保存（ただしエラーは投げない）
      if (syntaxIssues.length > 0) {
        const numberedCode = lines.map((line, idx) => `${idx + 1}: ${line}`).join('\n');
        setSyntaxHint(
          syntaxIssues.map(issue => `❌ ${issue}`).join('\n') +
          `\n\n【あなたのコード】\n${numberedCode}`
        );
      }
      
      // ユーザーコードから関数名を抽出
      const matches = code.matchAll(/function\s+([a-zA-Z0-9_]+)/g);
      const functionNames = Array.from(matches, m => m[1]);
      
      if (functionNames.length === 0) {
        throw new Error('関数が見つかりません。function キーワードで関数を定義してください。');
      }
      
      // メイン関数を決定：testで始まる関数 > 最初の関数（メイン処理は通常最初に定義される）
      let functionName = functionNames[0];  // デフォルトは最初の関数
      const testFunction = functionNames.find(name => /^test/i.test(name));
      if (testFunction) {
        functionName = testFunction;  // testXXX関数があればそれを優先
      }
      
      logOutput += `📌 実行する関数: ${functionName}\n\n`;

      // ユーザーコードを実行可能な関数に変換
      // 注意: Function コンストラクタはセキュリティリスクがあるため、本番環境ではWebWorker等でサンドボックス化が必要
      const userCodeWrapper = `
        ${code}
        return ${functionName};
      `;

      let userFunc;
      try {
        userFunc = new Function(userCodeWrapper)();
      } catch (syntaxError: any) {
        // 構文エラーの場合、詳細情報をヒント用に保存
        const numberedCode = lines.map((line, idx) => `${idx + 1}: ${line}`).join('\n');
        if (!syntaxHint) {
          // 既に検出済みのエラーがなければ、一般的なヒントを保存
          setSyntaxHint(
            `【あなたのコード】\n${numberedCode}\n\n` +
            `【よくある構文エラー】\n` +
            `- 代入演算子(=)と比較演算子(===)の間違い\n` +
            `- 括弧やクォートの閉じ忘れ\n` +
            `- セミコロンの欠落\n` +
            `- コメント記号の間違い`
          );
        }
        // 実際のエラーメッセージを投げる
        throw syntaxError;
      }

      if (typeof userFunc !== 'function') {
        throw new Error('関数の取得に失敗しました。');
      }

      // テストケース実行
      testResults = problem.testCases.map((testCase, idx) => {
        try {
          logOutput += `\n=== Test Case ${idx + 1} ===\n`;
          
          let actual;
          
          // inputが文字列の場合は即時実行関数として評価（特殊なテストケース用）
          if (typeof testCase.input === 'string') {
            const evalFunc = new Function(code + '\nreturn ' + testCase.input);
            actual = evalFunc();
          } else {
            // 配列の場合は通常の関数呼び出し
            actual = userFunc(...testCase.input);
          }
          
          // 戻り値の比較（expectedOutputがnullやundefinedでない場合のみ）
          let returnValuePassed = true;
          if (testCase.expectedOutput !== null && testCase.expectedOutput !== undefined) {
            returnValuePassed = JSON.stringify(actual) === JSON.stringify(testCase.expectedOutput);
          }
          
          // console.log出力の比較（期待値が設定されている場合）
          let consoleOutputPassed = true;
          if (testCase.expectedConsoleOutput !== undefined) {
            // TODO: 個別のテストケースごとのconsole出力比較は現在未対応
            consoleOutputPassed = true;
          }
          
          const passed = returnValuePassed && consoleOutputPassed;

          return {
            passed,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual,
          };
        } catch (e: any) {
          const errorMsg = e.message || e.toString();
          logOutput += `[Test Case ${idx + 1} - Error] ${errorMsg}\n`;
          return {
            passed: false,
            input: testCase.input,
            expected: testCase.expectedOutput,
            actual: null,
            error: errorMsg
          };
        }
      });

    } catch (e: any) {
      const errorMsg = e.message || e.toString();
      logOutput += `❌ ${errorMsg}\n`;
    } finally {
      // console.logを元に戻す
      console.log = originalLog;
      
      setOutput(logOutput);
      setResults(testResults);

      // 全テストクリアの場合は学習ログを更新
      if (testResults.length > 0 && testResults.every(r => r.passed)) {
        updatedLog.cleared = true;
        if (!currentLog.cleared) {
          updatedLog.clearTime = Date.now();
          setShowExplanation(true); // 初クリア時は解説を自動表示
        }
      }

      setLearningLog(prev => ({
        ...prev,
        [problem.id]: updatedLog
      }));
    }
  };

  const handleExportLog = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      learningLog
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning_log_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentProblem = problems[currentProblemIndex];

  if (!currentProblem) return <div>Loading...</div>;

  // 難易度ごとに問題をグループ化
  const problemsByLevel = {
    beginner: problems.filter(p => p.level === 'beginner'),
    intermediate: problems.filter(p => p.level === 'intermediate'),
    advanced: problems.filter(p => p.level === 'advanced')
  };

  const levelLabels = {
    beginner: '初級',
    intermediate: '中級',
    advanced: '上級' 
  };

  const allCleared = results.length > 0 && results.every(r => r.passed);

  const goToNextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      const nextIndex = currentProblemIndex + 1;
      setCurrentProblemIndex(nextIndex);
      setCode(problems[nextIndex].initialCode);
      setResults([]);
      setOutput('');
      setShowHint(false);
      setShowExplanation(false);
      setSyntaxHint('');
      initProblemLog(problems[nextIndex].id);
      setTimeout(() => {
        document.querySelector<HTMLButtonElement>('[data-run-button]')?.click();
      }, 50);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', background: '#ffffff' }}>
      <header style={{ padding: '8px 20px', background: '#2c3e50', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>ThinkLab</h1>
          <span style={{ fontSize: '13px', color: '#bdc3c7' }}>from Buggy Code</span>
        </div>
        <button onClick={handleExportLog} style={{ padding: '8px 16px', background: '#9C27B0', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '14px' }}>
          📥 学習ログをエクスポート
        </button>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左ペイン: 問題記述とエディタ */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #dee2e6', background: '#f8f9fa' }}>
          {/* 難易度タブと問題番号を横並び */}
          <div style={{ marginBottom: '10px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* 難易度タブ */}
            {Object.entries(levelLabels).map(([level, label]) => {
              const levelProblems = problemsByLevel[level as keyof typeof problemsByLevel];
              if (levelProblems.length === 0) return null;
              
              // 進捗率を計算
              const clearedCount = levelProblems.filter(p => learningLog[p.id]?.cleared).length;
              const totalCount = levelProblems.length;
              const progressRate = Math.round((clearedCount / totalCount) * 100);
              
              return (
                <button
                  key={level}
                  onClick={() => {
                    const newLevel = level as 'beginner' | 'intermediate' | 'advanced';
                    setSelectedLevel(newLevel);
                    
                    // 選択した難易度の未クリア問題の最初、または最初の問題に移動
                    const firstUnclearedProblem = levelProblems.find(p => !learningLog[p.id]?.cleared);
                    const targetProblem = firstUnclearedProblem || levelProblems[0];
                    
                    if (targetProblem) {
                      const globalIdx = problems.indexOf(targetProblem);
                      setCurrentProblemIndex(globalIdx);
                      setCode(targetProblem.initialCode);
                      setResults([]);
                      setOutput('');
                      setShowHint(false);
                      setShowExplanation(false);
                      setSyntaxHint('');
                      initProblemLog(targetProblem.id);
                      setTimeout(() => {
                        document.querySelector<HTMLButtonElement>('[data-run-button]')?.click();
                      }, 50);
                    }
                  }}
                  className={`level-tab ${selectedLevel === level ? 'active' : ''}`}
                >
                  {label} ({progressRate === 100 ? '★' : `${progressRate}%`})
                </button>
              );
            })}
            
            {/* 区切り線 */}
            <div style={{ width: '1px', height: '30px', background: '#ccc' }}></div>
            
            {/* 問題番号ボタン */}
            {problemsByLevel[selectedLevel].map((p, idx) => {
              const globalIdx = problems.indexOf(p);
              const isActive = globalIdx === currentProblemIndex;
              const isCleared = learningLog[p.id]?.cleared;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentProblemIndex(globalIdx);
                    setCode(p.initialCode);
                    setResults([]);
                    setOutput('');
                    setShowHint(false);
                    setShowExplanation(false);
                    setSyntaxHint('');
                    initProblemLog(p.id);
                    setTimeout(() => {
                      document.querySelector<HTMLButtonElement>('[data-run-button]')?.click();
                    }, 50);
                  }}
                  className={`problem-button ${isActive ? 'active' : ''} ${isCleared ? 'cleared' : ''}`}
                >
                  <span className="check-mark">{isCleared ? '✓' : ''}</span>
                  <span>{idx + 1}</span>
                </button>
              );
            })}
          </div>
          
          <h2 style={{ color: '#333', marginTop: 0, marginBottom: '10px' }}>{currentProblem.title}</h2>
          
          {/* 問題説明とテストケース */}
          <details open style={{ marginBottom: '10px', padding: '10px', background: '#fff', borderRadius: '4px', border: '1px solid #dee2e6' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#333' }}>📝 問題説明 / 📋 テストケース</summary>
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              {/* 問題説明 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>📝 問題説明</div>
                <div style={{ color: '#555', whiteSpace: 'pre-line', fontSize: '14px' }}>
                  {currentProblem.description}
                </div>
              </div>
              
              {/* 縦の区切り線 */}
              <div style={{ width: '1px', background: '#dee2e6', flexShrink: 0 }}></div>
              
              {/* テストケース */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', color: '#333', marginBottom: '8px' }}>📋 テストケース</div>
                <div>
                  {currentProblem.testCases.map((testCase, idx) => (
                    <div key={idx} style={{ marginBottom: '8px', fontSize: '13px', color: '#555' }}>
                      <strong>Case {idx + 1}:</strong>
                      {testCase.description && (
                        <div style={{ marginLeft: '10px', marginTop: '2px', color: '#666' }}>
                          {testCase.description}
                        </div>
                      )}
                      <div style={{ marginLeft: '10px', marginTop: '2px' }}>
                        <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '3px', fontSize: '12px' }}>
                          {typeof testCase.input === 'string' ? testCase.input : JSON.stringify(testCase.input)}
                        </code>
                        {testCase.expectedOutput !== null && testCase.expectedOutput !== undefined && (
                          <>
                            {' → '}
                            <code style={{ background: '#e8f5e9', padding: '2px 6px', borderRadius: '3px', fontSize: '12px' }}>
                              {JSON.stringify(testCase.expectedOutput)}
                            </code>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </details>

          <div style={{ 
            flex: 1, 
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            overflow: 'auto',
            background: '#ffffff'
          }}>
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
              padding={15}
              style={{
                fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                fontSize: 16,
                minHeight: '100%',
                background: '#ffffff',
              }}
              textareaClassName="code-editor-textarea"
            />
          </div>

          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <button onClick={handleRun} data-run-button style={{ padding: '10px 20px', fontSize: '16px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
              実行 & テスト
            </button>
          </div>

          {/* 学習ログ表示 */}
          {learningLog[currentProblem.id] && (
            <div style={{ marginTop: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '4px', fontSize: '14px', color: '#333', border: '1px solid #ddd' }}>
              <strong>📊 学習記録:</strong> 
              試行回数: {learningLog[currentProblem.id].attempts}回 | 
              ヒント使用: {learningLog[currentProblem.id].hintUsed ? 'あり' : 'なし'} | 
              状態: {learningLog[currentProblem.id].cleared ? '✓ クリア済み' : '未クリア'}
              {learningLog[currentProblem.id].clearTime && (
                <span> | クリア時間: {Math.floor((learningLog[currentProblem.id].clearTime! - learningLog[currentProblem.id].startTime) / 1000)}秒</span>
              )}
            </div>
          )}
        </div>

        {/* 右ペイン: 実行結果 */}
        <div className="right-pane" style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f8f9fa' }}>
          <h3 style={{ color: '#333' }}>テスト結果</h3>
          {results.length === 0 ? (
            <p style={{ color: '#555' }}>実行ボタンを押してテストしてください。</p>
          ) : (
            <div>
              {results.every(r => r.passed) && (
                <div style={{ padding: '10px', background: '#dff0d8', color: '#3c763d', marginBottom: '10px' }}>
                  <strong>🎉 全テストクリア！ お見事です！</strong>
                </div>
              )}
              {results.map((res, idx) => (
                <div key={idx} className="test-result-item" style={{
                  borderLeft: `5px solid ${res.passed ? '#4CAF50' : '#F44336'}`,
                  background: res.passed ? '#e8f5e9' : '#ffebee',
                  color: '#333'
                }}>
                  <div><strong>Case {idx + 1}:</strong> {res.passed ? 'PASS' : 'FAIL'}</div>
                  <div>Input: {JSON.stringify(res.input)}</div>
                  <div>Expected: {JSON.stringify(res.expected)}</div>
                  <div>Actual: {JSON.stringify(res.actual)}</div>
                  {res.error && <div style={{ color: 'red' }}>Error: {res.error}</div>}
                </div>
              ))}
            </div>
          )}

          <h3 style={{ color: '#333', marginTop: '20px' }}>📝 実行ログ（console.logの出力）</h3>
          {output ? (
            <pre style={{ 
              background: '#fffacd',
              color: '#333',
              padding: '15px',
              borderRadius: '4px',
              border: '2px solid #ffd700',
              overflow: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '14px',
              fontFamily: 'Consolas, Monaco, monospace'
            }}>
              {output}
            </pre>
          ) : (
            <div style={{
              background: '#f5f5f5',
              color: '#666',
              padding: '15px',
              borderRadius: '4px',
              border: '1px solid #dee2e6',
              fontSize: '14px'
            }}>
              💡 デバッグのヒント: コード内に <code style={{ background: '#e0e0e0', padding: '2px 6px', borderRadius: '3px' }}>console.log()</code> を追加すると、ここに出力されます。<br/>
              例: <code style={{ background: '#e0e0e0', padding: '2px 6px', borderRadius: '3px' }}>console.log('変数x:', x);</code>
            </div>
          )}

          {/* ヒント/解説ボタン + 次へボタン */}
          <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowHint(!showHint)} style={{ padding: '10px', background: '#FFC107', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                {showHint ? 'ヒントを隠す' : 'ヒントを見る'}
              </button>
              <button onClick={() => setShowExplanation(!showExplanation)} style={{ padding: '10px', background: '#2196F3', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                {showExplanation ? '解説を隠す' : '解説を見る'}
              </button>
            </div>
            {allCleared && currentProblemIndex < problems.length - 1 && (
              <button onClick={goToNextProblem} style={{ padding: '12px 24px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold' }}>
                次へ →
              </button>
            )}
          </div>

          {showHint && (
            <div style={{ marginTop: '15px', padding: '15px', background: '#FFF9C4', border: '2px solid #FFC107', borderRadius: '4px', whiteSpace: 'pre-line' }}>
              <strong>💡 ヒント:</strong> {currentProblem.hint}
              {syntaxHint && (
                <div style={{ marginTop: '15px', padding: '10px', background: '#fff', borderRadius: '4px', border: '1px solid #FFC107' }}>
                  <strong>🔍 構文エラーの詳細:</strong>
                  <pre style={{ marginTop: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '13px' }}>
                    {syntaxHint}
                  </pre>
                </div>
              )}
            </div>
          )}

          {showExplanation && (
            <div style={{ marginTop: '15px', padding: '15px', background: '#E3F2FD', border: '2px solid #2196F3', borderRadius: '4px', whiteSpace: 'pre-line' }}>
              <strong>📖 解説:</strong> {currentProblem.explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
