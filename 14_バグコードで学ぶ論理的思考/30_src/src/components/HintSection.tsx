import type { Problem } from '../types';

interface HintSectionProps {
  problem: Problem;
  showHint: boolean;
  showExplanation: boolean;
  syntaxHint: string;
  allTestsPassed: boolean;
  hasMoreProblems: boolean;
  onToggleHint: () => void;
  onToggleExplanation: () => void;
  onNextProblem: () => void;
}

export function HintSection({
  problem,
  showHint,
  showExplanation,
  syntaxHint,
  allTestsPassed,
  hasMoreProblems,
  onToggleHint,
  onToggleExplanation,
  onNextProblem
}: HintSectionProps) {
  return (
    <>
      {/* ヒント/解説ボタン + 次へボタン */}
      <div className="hint-controls">
        <div className="hint-buttons">
          <button onClick={onToggleHint} className="hint-button">
            {showHint ? 'ヒントを隠す' : 'ヒントを見る'}
          </button>
          <button onClick={onToggleExplanation} className="explanation-button">
            {showExplanation ? '解説を隠す' : '解説を見る'}
          </button>
        </div>
        {allTestsPassed && hasMoreProblems && (
          <button onClick={onNextProblem} className="next-button">
            次へ →
          </button>
        )}
      </div>

      {showHint && (
        <div className="hint-content">
          <strong>💡 ヒント:</strong> {problem.hint}
          {syntaxHint && (
            <div className="syntax-hint-detail">
              <strong>🔍 構文エラーの詳細:</strong>
              <pre className="syntax-hint-code">
                {syntaxHint}
              </pre>
            </div>
          )}
        </div>
      )}

      {showExplanation && (
        <div className="explanation-content">
          <strong>📖 解説:</strong> {problem.explanation}
        </div>
      )}
    </>
  );
}
