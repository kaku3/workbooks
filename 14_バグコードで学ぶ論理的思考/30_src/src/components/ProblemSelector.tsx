import type { Problem, Level, LearningLog } from '../types';
import { LEVEL_LABELS } from '../constants';

interface ProblemSelectorProps {
  problems: Problem[];
  currentProblemIndex: number;
  selectedLevel: Level;
  learningLog: LearningLog;
  onSelectLevel: (level: Level) => void;
  onSelectProblem: (index: number) => void;
}

export function ProblemSelector({
  problems,
  currentProblemIndex,
  selectedLevel,
  learningLog,
  onSelectLevel,
  onSelectProblem
}: ProblemSelectorProps) {
  // 難易度ごとに問題をグループ化
  const problemsByLevel = {
    beginner: problems.filter(p => p.level === 'beginner'),
    intermediate: problems.filter(p => p.level === 'intermediate'),
    advanced: problems.filter(p => p.level === 'advanced')
  };

  return (
    <div className="problem-selector-tree">
      {/* ツリービュー: 難易度ごとにグループ化 */}
      {Object.entries(LEVEL_LABELS).map(([level, label]) => {
        const levelProblems = problemsByLevel[level as Level];
        if (levelProblems.length === 0) return null;

        // 進捗率を計算
        const clearedCount = levelProblems.filter(p => learningLog[p.id]?.cleared).length;
        const totalCount = levelProblems.length;
        const progressRate = Math.round((clearedCount / totalCount) * 100);
        const isLevelExpanded = selectedLevel === level;

        return (
          <div key={level} className="tree-level-group">
            {/* 難易度ヘッダー */}
            <button
              onClick={() => onSelectLevel(level as Level)}
              className={`tree-level-header ${isLevelExpanded ? 'expanded' : ''}`}
            >
              <span className="tree-expand-icon">{isLevelExpanded ? '˅' : '›'}</span>
              <span className="tree-level-label">{label}</span>
              <span className="tree-level-progress">
                {progressRate === 100 ? '★' : `${progressRate}%`}
              </span>
            </button>

            {/* 問題リスト（展開時のみ表示） */}
            {isLevelExpanded && (
              <div className="tree-problem-list">
                {levelProblems.map((p) => {
                  const globalIdx = problems.indexOf(p);
                  const isActive = globalIdx === currentProblemIndex;
                  const isCleared = learningLog[p.id]?.cleared;
                  return (
                    <button
                      key={p.id}
                      onClick={() => onSelectProblem(globalIdx)}
                      className={`tree-problem-item ${isActive ? 'active' : ''} ${isCleared ? 'cleared' : ''}`}
                      title={p.title}
                    >
                      <span className="tree-problem-check">{isCleared ? '✓' : '○'}</span>
                      <span className="tree-problem-title">{p.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
