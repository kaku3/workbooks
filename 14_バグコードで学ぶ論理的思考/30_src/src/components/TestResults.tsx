import type { TestResult } from '../types';

interface TestResultsProps {
  results: TestResult[];
}

export function TestResults({ results }: TestResultsProps) {
  if (results.length === 0) {
    return <p className="test-results-empty">実行ボタンを押してテストしてください。</p>;
  }

  const allPassed = results.every(r => r.passed);

  return (
    <div>
      {allPassed && (
        <div className="test-results-success">
          <strong>🎉 全テストクリア！ お見事です！</strong>
        </div>
      )}
      {results.map((res, idx) => (
        <div
          key={idx}
          className={`test-result-item ${res.passed ? 'test-result-pass' : 'test-result-fail'}`}
          style={{
            borderLeft: `5px solid ${res.passed ? '#4CAF50' : '#F44336'}`,
            background: res.passed ? '#e8f5e9' : '#ffebee',
            color: '#333'
          }}
        >
          <div><strong>Case {idx + 1}:</strong> {res.passed ? 'PASS' : 'FAIL'}</div>
          <div>Input: {JSON.stringify(res.input)}</div>
          <div>Expected: {JSON.stringify(res.expected)}</div>
          <div>Actual: {JSON.stringify(res.actual)}</div>
          {res.error && <div style={{ color: 'red' }}>Error: {res.error}</div>}
        </div>
      ))}
    </div>
  );
}
