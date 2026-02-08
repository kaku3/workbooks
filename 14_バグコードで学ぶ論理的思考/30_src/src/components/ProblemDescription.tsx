import type { Problem } from '../types';

interface ProblemDescriptionProps {
  problem: Problem;
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  return (
    <details open className="problem-details">
      <summary>
        📝 問題説明 / 📋 テストケース
      </summary>
      <div className="problem-content">
        {/* 問題説明 */}
        <div className="problem-description">
          <div className="section-title">📝 問題説明</div>
          <div className="description-text">
            {problem.description}
          </div>
        </div>

        {/* 縦の区切り線 */}
        <div className="content-divider"></div>

        {/* テストケース */}
        <div className="test-cases">
          <div className="section-title">📋 テストケース</div>
          <div>
            {problem.testCases.map((testCase, idx) => (
              <div key={idx} className="test-case-item">
                <strong>Case {idx + 1}:</strong>
                {testCase.description && (
                  <div className="test-case-description">
                    {testCase.description}
                  </div>
                )}
                <div className="test-case-code">
                  <code className="code-inline">
                    {typeof testCase.input === 'string' ? testCase.input : JSON.stringify(testCase.input)}
                  </code>
                  {testCase.expectedOutput !== null && testCase.expectedOutput !== undefined && (
                    <>
                      {' → '}
                      <code className="code-inline-expected">
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
  );
}
