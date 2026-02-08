import type { ProblemLog } from '../types';

interface LearningStatsProps {
  log?: ProblemLog;
}

export function LearningStats({ log }: LearningStatsProps) {
  if (!log) return null;

  return (
    <div className="learning-stats">
      <strong>📊 学習記録:</strong>
      {' '}試行回数: {log.attempts}回 |
      {' '}ヒント使用: {log.hintUsed ? 'あり' : 'なし'} |
      {' '}状態: {log.cleared ? '✓ クリア済み' : '未クリア'}
      {log.clearTime && (
        <span> | クリア時間: {Math.floor((log.clearTime - log.startTime) / 1000)}秒</span>
      )}
    </div>
  );
}
