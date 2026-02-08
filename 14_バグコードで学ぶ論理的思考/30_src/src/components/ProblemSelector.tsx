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

  const currentLevelProblems = problemsByLevel[selectedLevel];

  return (
    <div className="problem-selector">
      {/* 難易度タブ */}
      {Object.entries(LEVEL_LABELS).map(([level, label]) => {
        const levelProblems = problemsByLevel[level as Level];
        if (levelProblems.length === 0) return null;

        // 進捗率を計算
        const clearedCount = levelProblems.filter(p => learningLog[p.id]?.cleared).length;
        const totalCount = levelProblems.length;
        const progressRate = Math.round((clearedCount / totalCount) * 100);

        return (
          <button
            key={level}
            onClick={() => onSelectLevel(level as Level)}
            className={`level-tab ${selectedLevel === level ? 'active' : ''}`}
          >
            {label} ({progressRate === 100 ? '★' : `${progressRate}%`})
          </button>
        );
      })}

      {/* 区切り線 */}
      <div className="selector-divider"></div>

      {/* 問題番号ボタン */}
      {currentLevelProblems.map((p, idx) => {
        const globalIdx = problems.indexOf(p);
        const isActive = globalIdx === currentProblemIndex;
        const isCleared = learningLog[p.id]?.cleared;
        return (
          <button
            key={p.id}
            onClick={() => onSelectProblem(globalIdx)}
            className={`problem-button ${isActive ? 'active' : ''} ${isCleared ? 'cleared' : ''}`}
          >
            <span className="check-mark">{isCleared ? '✓' : ''}</span>
            <span>{idx + 1}</span>
          </button>
        );
      })}
    </div>
  );
}
