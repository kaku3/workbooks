import { useState } from 'react';
import type { Problem } from '../types';

interface ProblemDescriptionProps {
  problem: Problem;
}

export function ProblemDescription({ problem }: ProblemDescriptionProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'testcases'>('description');

  return (
    <div className="problem-details-tabbed">
      {/* タブヘッダー */}
      <div className="problem-tabs">
        <button
          onClick={() => setActiveTab('description')}
          className={`problem-tab ${activeTab === 'description' ? 'active' : ''}`}
        >
          📝 問題
        </button>
        <button
          onClick={() => setActiveTab('testcases')}
          className={`problem-tab ${activeTab === 'testcases' ? 'active' : ''}`}
        >
          📋 テストケース
        </button>
      </div>

      {/* タブコンテンツ */}
      <div className="problem-tab-content">
        {activeTab === 'description' && (
          <div className="problem-description">
            <div className="description-text">
              {problem.description}
            </div>
          </div>
        )}

        {activeTab === 'testcases' && (
          <div className="test-cases">
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
        )}
      </div>
    </div>
  );
}
